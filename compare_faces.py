import face_recognition
import sys

def compare_faces(profile_image_path, uploaded_image_path):
    # 이미지 로딩
    profile_image = face_recognition.load_image_file(profile_image_path)
    uploaded_image = face_recognition.load_image_file(uploaded_image_path)

    # 얼굴 인코딩
    profile_encoding = face_recognition.face_encodings(profile_image)[0]
    uploaded_encoding = face_recognition.face_encodings(uploaded_image)[0]

    # 얼굴 거리 계산 (유사도 1에 가까울수록 다름)
    results = face_recognition.face_distance([profile_encoding], uploaded_encoding)
    similarity_score = 1 - results[0]  # 1 = 완벽히 동일, 0 = 전혀 다름
    print(similarity_score)

if __name__ == "__main__":
    compare_faces(sys.argv[1], sys.argv[2])
