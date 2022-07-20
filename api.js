const express = require("express");
const { crc32 } = require("crc");
const { MongoClient } = require("mongodb");
const { URL } = require("url");

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

const dbName = "absoluteUrls";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let collection = null;

let main = async () => {
  await client.connect();
  const db = client.db(dbName);
  collection = db.collection("urls");
  const deleteResult = await collection.deleteMany({});
};

main();

app.get("/stretch/:shortUrl", async (req, res) => {
  let { shortUrl } = req.params;
  let result = await findUrl(shortUrl);
  if (result.length > 0) return res.json({ url: result[0]?.url });
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
