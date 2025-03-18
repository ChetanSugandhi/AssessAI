const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Content = require("../Models/Content");
const Topic = require("../Models/topic");
const auth = require("../middleware/auth")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedExt = /\.(mp4|mov|mp3|wav)$/i;
    const allowedMime = /^(video\/(mp4|quicktime)|audio\/(mpeg|wav)|application\/octet-stream)$/;
    const extname = allowedExt.test(path.extname(file.originalname));
    const mimetype = allowedMime.test(file.mimetype);

    console.log("File:", file.originalname, "MIME:", file.mimetype); // Debug

    // Allow if extension is valid, even if MIME is generic
    if (extname && (mimetype || file.mimetype === "application/octet-stream")) {
      return cb(null, true);
    }
    cb(new Error("Only video (mp4, mov) and audio (mp3, wav) files are allowed"));
  },
});

router.post("/upload", auth, upload.single("file"), async (req, res) => {
  const { topicTitle, topicDescription, classroomId, fileType } = req.body;
  const file = req.file;
  const uploadedBy = req.user.id;

  console.log("Request Body:", req.body);
  console.log("File:", file);

  if (!topicTitle || !topicDescription || !classroomId || !fileType || !file) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (!["video", "audio"].includes(fileType)) {
    return res.status(400).json({ error: "Invalid file type" });
  }

  try {
    let topic = await Topic.findOne({ classroomId, title: topicTitle });
    if (!topic) {
      topic = new Topic({
        classroomId,
        title: topicTitle,
        description: topicDescription,
      });
      await topic.save();
    }

    const content = new Content({
      classroomId,
      topicId: topic._id,
      fileName: file.originalname,
      filePath: `/uploads/${file.filename}`,
      fileType,
      uploadedBy,
    });
    await content.save();

    res.json({ message: "File uploaded successfully", content, topic });
  } catch (error) {
    console.error("Error uploading file:", error.message);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

module.exports = router;
