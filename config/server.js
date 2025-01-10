/* server.js */

const express = require("express");
const app = express();
const { mongoDB } = require("./config/mongo-db");

// mongoDB
mongoDB();