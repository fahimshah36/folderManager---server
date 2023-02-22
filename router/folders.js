const router = require("express").Router();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Folder = require("../models/folders");

router.post("/", async (req, res, next) => {
  try {
    const {name, parent} = req.body;

    // Generate a new ID for the folder
    const id = mongoose.Types.ObjectId().toString();

    // Create the new folder in the database
    const folder = new Folder({id, name, parent});
    await folder.save();

    // Add the new folder to the parent's children array, if applicable
    if (parent) {
      const parentFolder = await Folder.findOne({id: parent});
      if (parentFolder) {
        parentFolder.children.push(id);
        await parentFolder.save();
      }
    }

    res.json(folder);
  } catch (error) {
    next(error);
  }
});

//get all folders
router.get("/", async (req, res) => {
  const allFolders = await Folder.find();
  return {data: res.status(200).json(allFolders)};
});

//delete folder
router.delete("/:id", async (req, res, next) => {
  try {
    const {id} = req.params;

    // Find the folder to delete
    const folder = await Folder.findOne({id});
    if (!folder) {
      return res.status(404).json({message: "Folder not found"});
    }
    console.log(folder.parent);
    // Remove the folder from its parent's children array, if applicable
    if (folder.parent) {
      const parentFolder = await Folder.findOne({id: folder.parent});
      if (parentFolder) {
        parentFolder.children = parentFolder.children.filter(
          (childId) => childId !== id
        );
        await parentFolder.save();
      }
    } else {
      return res.status(404).json({message: "Root Folder cannot be deleted"});
    }

    // Delete the folder
    await folder.delete();

    res.json({message: "Folder deleted"});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
