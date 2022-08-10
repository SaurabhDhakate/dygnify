const express = require("express");
const cors = require("cors");
const path = require('path');
require('dotenv').config();

const app = express();
const { MongoClient } = require("mongodb");
const uri =
  `mongodb+srv://saurabh:${process.env.DB_PASS}@crud-db.xioplla.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {});

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use('/', express.static(path.join(__dirname, './client/build')))

app.get("/api/borrower", (req, res) => getAllFromCollection(req, res, "borrowers"));
app.post("/api/borrower", (req, res) => addInCollection(req, res, "borrowers"));

app.get("/api/loan", (req, res) => getAllFromCollection(req, res, "loan"));
app.post("/api/loan", (req, res) => addInCollection(req, res, "loan"));

app.get("/api/business", (req, res) => getAllFromCollection(req, res, "business"));
app.post("/api/business", (req, res) => addInCollection(req, res, "business"));

app.use(errorHandler)


function getAllFromCollection(req, res, collectionName) {
  client
    .connect()
    .then((client) => client.db("dygnify").collection(collectionName))
    .then((borrowers) => borrowers.find().toArray())
    .then((data) => res.json(data))
    .catch((error) => res.json(error))
    .finally(() => client.close());
}

function addInCollection(req, res, collectionName) {
  client
    .connect()
    .then((client) => client.db("dygnify").collection(collectionName))
    .then((borrowers) => borrowers.insertOne(req.body))
    .then((data) => res.json(data))
    .catch((error) => res.json(error))
    .finally(() => client.close());
}

function errorHandler (err, req, res, next) {
  res.status(500)
  res.render('error', { error: err })
}

app.listen(process.env.PORT || 8100, () => {
  console.log(`Example app listening on port`, process.env.PORT);
});
