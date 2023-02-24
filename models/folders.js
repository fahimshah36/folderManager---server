const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
  id: {type: String, required: true},
  name: {type: String, required: true},
  parent: {type: String},
  children: [{id: {type: String}, name: {type: String}}],
});

const Folder = mongoose.model("Folder", folderSchema);
module.exports = Folder;
