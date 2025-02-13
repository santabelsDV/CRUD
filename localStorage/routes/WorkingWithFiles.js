const express = require('express');
const router = express.Router();
const {upload} = require("../servise/WritingFile");
const {writingFiles} = require("../controllers/WorkingWithFiles/WritingFiles");
const {readFile} = require("../controllers/WorkingWithFiles/ReadingFile");
const {deleteFile} = require("../controllers/WorkingWithFiles/DeleteFile");
const {PutFile,PutUpload} = require("../controllers/WorkingWithFiles/PutFile");

router.post("/upload", upload.single("image"), writingFiles);

router.get('/getFile/:filename', readFile);

router.delete('/deleteFile/:filename',deleteFile);

router.put("/putFile/:filename", PutUpload.single("file"), PutFile);

module.exports = {router}