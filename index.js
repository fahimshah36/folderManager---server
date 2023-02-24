const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const folderRoutes = require("./router/folders");

const app = express();
app.use(bodyParser.json());

//database connection
const db =
  "mongodb+srv://admin:adminstart@cluster0.xdutrah.mongodb.net/?retryWrites=true&w=majority";

// async function connect() {
//   try {
//     await mongoose.connect(db);
//     console.log("Connected to MongoDB");
//   } catch (error) {
//     console.error(error);
//   }
// }

// connect();

//middlewares
app.use(cors());

//routes
app.use("/", (req, res) => {
  res.json;
  ({message: "Hello!!"});
});
app.use("/api/folder", folderRoutes);

//connection
app.listen(4000, () => {
  console.log("listening to port 4000");
});
