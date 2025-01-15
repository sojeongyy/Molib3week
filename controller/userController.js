const jwt = require("jsonwebtoken");
const UserProfile = require("../models/user_profile");
const mongoose = require("mongoose");

// ✅ 카카오 로그인 콜백 (JWT 토큰 발급 및 저장)
exports.kakaoCallback = (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // ✅ 쿠키 설정 (httpOnly, secure 적용)
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // ✅ 새로운 사용자라면 /signup 페이지로 이동
  if (req.authInfo && req.authInfo.redirectToSignup) {
    console.log("✅ 새로운 사용자, signup 페이지로 이동");
    return res.redirect("http://localhost:3000/signup");
  }

  console.log(`✅ 로그인 성공! 사용자: ${req.user.nickname}`);
  res.redirect("http://localhost:3000/");
};

// ✅ 사용자 프로필 조회 (JWT에서 추출한 ID 사용)
// ✅ 사용자 프로필 조회 (JWT에서 추출한 ID 사용)
exports.getUserProfile = async (req, res) => {
  console.log("✅ getUserProfile 라우트 호출됨");
  console.log("✅ 요청받은 사용자 ID:", req.user.id);

  let userProfile;
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    userProfile = await UserProfile.findOne({ userId }).populate("userId");
  } catch (error) {
    console.error("❌ DB 조회 중 오류 발생:", error);
    return res.status(500).json({ error: "DB 조회 오류" });
  }

  if (!userProfile) {
    console.log("❌ 프로필이 존재하지 않습니다.");
    return res.status(404).json({ message: "프로필을 찾을 수 없습니다." });
  }

  // 이제 userProfile의 값이 null이 아님이 확실해진 상태
  try {
    const responseData = {
      userId: userProfile.userId._id.toString(),
      username: userProfile.username,
      photo: userProfile.photo || "/default.png",
      status: userProfile.status,
      similarity: userProfile.similarity,
      intro: userProfile.intro,
      ideal: userProfile.ideal,
      rating: userProfile.rating,
    };
    //console.log("✅ responseData:", responseData);
    return res.status(200).json(responseData);
  } catch (error) {
    console.error("❌ responseData 생성 중 오류 발생:", error);
    return res.status(500).json({ error: "데이터 처리 오류" });
  }
};

exports.showUserProfile = async (req, res) => {
  console.log("✅ getUserProfile 라우트 호출됨");

  try {
    // ✅ 경로에서 userId 가져오기
    const userId = req.params.userId;
    console.log("✅ 요청받은 사용자 ID:", userId);

    // ✅ MongoDB에서 userId를 기준으로 검색
    const userProfile = await UserProfile.findOne({ userId: userId });

    if (!userProfile) {
      console.log("❌ 프로필이 존재하지 않습니다.");
      return res.status(404).json({ message: "프로필을 찾을 수 없습니다." });
    }

    res.status(200).json({
      username: userProfile.username,
      photo: userProfile.photo || "/default.png",
      status: userProfile.status,
      similarity: userProfile.similarity,
      intro: userProfile.intro,
      ideal: userProfile.ideal,
      rating: userProfile.rating,
    });
  } catch (error) {
    console.error("❌ 프로필 조회 중 오류 발생:", error);
    res.status(500).json({ error: "서버 오류 발생" });
  }
};

exports.showUserProfile = async (req, res) => {
  console.log("✅ getUserProfile 라우트 호출됨");

  try {
    // ✅ 경로에서 userId 가져오기
    const userId = req.params.userId;
    console.log("✅ 요청받은 사용자 ID:", userId);

    // ✅ MongoDB에서 userId를 기준으로 검색
    const userProfile = await UserProfile.findOne({ userId: userId });

    if (!userProfile) {
      console.log("❌ 프로필이 존재하지 않습니다.");
      return res.status(404).json({ message: "프로필을 찾을 수 없습니다." });
    }

    res.status(200).json({
      username: userProfile.username,
      photo: userProfile.photo || "/default.png",
      status: userProfile.status,
      similarity: userProfile.similarity,
      intro: userProfile.intro,
      ideal: userProfile.ideal,
      rating: userProfile.rating,
    });
  } catch (error) {
    console.error("❌ 프로필 조회 중 오류 발생:", error);
    res.status(500).json({ error: "서버 오류 발생" });
  }
};



// 모든 사용자 반환 함수
exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserProfile.find(); // DB에서 모든 사용자 가져오기
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching all users:", error.message);
    res
      .status(500)
      .json({ message: "사용자 정보를 가져오는 데 실패했습니다." });
  }
};
