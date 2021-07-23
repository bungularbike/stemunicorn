const express = require("express");
const path = require("path");
const request = require("request");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("stemunicorn-firebase-adminsdk-h5l99-4e7a3349e3.json");
const PORT = process.env.PORT || 5000;
const FieldValue = require("firebase-admin").firestore.FieldValue;
var app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();

app.use(express.json());
app.use(cors());

app.get("/", function(req, res) {
  res.send("STEM Unicorn");
});