const router = require("express").Router();
const mongoose = require("mongoose");
const Folder = require("../models/folders");

router.post("/", async (req, res, next) => {
  try {
    const {name, parent} = req.body;

    // Generate a new ID for the folder
    const id = mongoose.Types.ObjectId().toString();

    // Create the new folder in the database
    const folder = new Folder({id, name, parent, children: []});
    await folder.save();

    // Add the new folder to the parent's children array, if applicable
    if (parent) {
      const parentFolder = await Folder.findOne({id: parent});
      if (parentFolder) {
        parentFolder.children.push({id, name, parent});
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
  return res.json({
    title: "Express Testing",
    message: "The app is working properly!",
  });
});

//get folder by id
router.get("/:id", async (req, res, next) => {
  try {
    const {id} = req.params;

    // Find the folder by ID
    const folder = await Folder.findOne({id});
    if (!folder) {
      return res.status(404).json({error: "Folder not found"});
    }
    console.log(folder);

    // If the folder has children, populate their names from the database
    // if (folder.children.length > 0) {
    //   const children = await Folder.find({id: {$in: folder.children}}).select(
    //     "-_id id name"
    //   );
    //   folder.children = children;
    // }

    return res.json({data: folder});
  } catch (error) {
    next(error);
  }
});

//get root folder
router.get("/root", async (req, res) => {
  try {
    const folder = await Folder.findById("63f783d658967d2030d7ba97");
    return res.json({data: folder});
  } catch (err) {
    res.status(404).json({message: "Folders not found"});
  }
});

//delete folder
router.delete("/:id", async (req, res, next) => {
  try {
    const {id} = req.params;
    console.log(id);
    // Find the folder to delete
    const folderToDelete = await Folder.findOne({id});

    // If folder not found, return 404
    if (!folderToDelete) {
      return res.status(404).json({message: "Folder not found"});
    }

    // If the folder has a parent, remove the folder's ID from its parent's children array
    if (folderToDelete.parent) {
      const parentFolder = await Folder.findOne({id: folderToDelete.parent});
      if (parentFolder) {
        console.log({
          array: parentFolder.children.pop(),
          id: id,
        });
        parentFolder.children = parentFolder.children.filter(
          (childId) => childId.id !== id
        );

        await parentFolder.save();
      }
    } else {
      return res.status(404).json({message: "Cannot delete root folder"});
    }

    // Delete the folder
    await folderToDelete.delete();

    res.json({message: "Folder deleted"});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
