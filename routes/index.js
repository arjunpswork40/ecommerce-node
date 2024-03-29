var express = require("express");
var router = express.Router();
const { generateToken, uploadFile, getUser, uploadFiles } = require("../app/controllers");
const { validateRequest } = require("../requests/generateToken");
const { isFileExist, isFilesExist } = require("../app/middlewares/fileChecker");
//single fileUploader
const { uploadSingleFile, uploadMultipleFiles } = require("../utils/fileUploader");
const singleFileUploader = uploadSingleFile(
  "file1",
  1,
  ["image/png", "application/x-httpd-php"],
  "uploads"
);
const multipleFileUploader = uploadMultipleFiles(
  "",
  ["image/png", "image/jpeg", "image/jpg"],
  "uploads"
);
/* GET home page. */
router.get("/", function (req, res, next) {
  const csrfToken = req.csrfToken();

  res.render("index", { title: "Express", csrfToken: csrfToken });
});

router.post("/generate-token", generateToken);
router.post("/upload-file", [singleFileUploader.single("image"), isFileExist], uploadFile);
router.post("/upload-files", [multipleFileUploader.array("images"), isFilesExist], uploadFiles);
router.get("/get-user", getUser);
module.exports = router;
