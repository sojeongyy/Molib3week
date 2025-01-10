// 몽고디비 구성 파일 생성성

/* config/mongo-db.js */

const mongoose = require("mongoose");

exports.mongoDB = () => {
  mongoose
  .connect("mongodb+srv://cindy0325:dHJDfcnnEaisd0UX@madweek3.ncvs6.mongodb.net/")
  .then(() => console.log("connected"))
  .catch(() => console.log("mongodb connection failed"));  
}