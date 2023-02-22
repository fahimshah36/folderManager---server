const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
  id: {type: String, required: true},
  name: {type: String, required: true},
  parent: {type: String},
  children: {type: [String], default: []},
});

const Folder = mongoose.model("Folder", folderSchema);
module.exports = Folder;
