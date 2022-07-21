// require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { crc32 } = require("crc");
const { MongoClient } = require("mongodb");
const { URL } = require("url");

const dbName = "absoluteUrls";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

let collection = null;

let main = async () => {
  let url = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@clusterdata.mptpf.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`;
  if (!process.env.USER || !process.env.PASSWORD || !process.env.DATABASE) {
    url = "mongodb://localhost:27017";
    const client = new MongoClient(url);
    await client.connect();
    const db = client.db(dbName);
    collection = db.collection("urls");
    const deleteResult = await collection.deleteMany({});
  } else {
    const client = new MongoClient(url);
    let handler = await client.connect();
    let db = handler.db("urls");
    collection = db.collection("urls");
    const deleteResult = await collection.deleteMany({});
    console.log(deleteResult);
  }
};

main();

app.get("/s/:shortUrl", async (req, res) => {
  let { shortUrl } = req.params;
  let result = await findUrl(shortUrl);
  if (result.length > 0) return res.redirect(result[0]?.url);
  else res.json({ 404: "no URL found" });
});

app.post("/shrink", async (req, res) => {
  let { url } = req.body;
  if (!verifyUrl(url)) return res.json({ error: "Please provide a valid url" });
  let shortenedUrl = createUrl(url);
  let result = await findUrl(shortenedUrl);
  if (result.length >= 1) return res.json({ shortenedUrl });
  let status = await addUrl(url, shortenedUrl);
  if (status?.acknowledged) return res.json({ shortenedUrl });
  else return res.json({ error: true });
});

app.use("/", (req, res) => {
  res.status(404).json({ 404: "No path found" });
});

let verifyUrl = (url) => {
  if (typeof url !== "string") return false;
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};

let createUrl = (url) => {
  let shortenedUrl = crc32(url).toString(16);
  return shortenedUrl;
};

let findUrl = async (shortenedUrl) => {
  const findResult = await collection.find({ shortenedUrl }).toArray();
  return findResult;
};

let addUrl = async (url, shortenedUrl) => {
  const insertResult = await collection.insertOne({ shortenedUrl, url });
  return insertResult;
};

app.listen(process.env.PORT || 3030);
