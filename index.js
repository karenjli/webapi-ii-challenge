const express = require("express");
const server = express();
const db = require("./data/db");
const postRouter = require("./post");
server.use(express.json());
server.use("/api/posts", postRouter);

server.get("/", (req, res) => {
  res.send("It's Working");
});

// routing needed

const port = 5000;
server.listen(port, () => {
  console.log("API is listening");
});
