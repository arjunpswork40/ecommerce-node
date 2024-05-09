const express = require("express");
const router = express.Router();
const upload = require("../../../utils/s3/s3multer");

const {
  productValidator,
} = require("../../../app/middlewares/validator/product/productInputValidator");

const {
    productUpdateValidator,
  } = require("../../../app/middlewares/validator/product/productUpdateInputValidator");
const { validateProductId } = require("../../../app/middlewares/validator/auth/validateProductIds");
const { tokenVerifierAdmin,tokenVerifier } = require("../../../app/middlewares/auth/tokenVerifier");
const {
  listProducts,
  addProduct,
  viewProduct,
  updateProduct,
  deleteProduct,
} = require("../../../app/controllers/Admin/product-CRUD/productCrudController");
const { docUpload } = require('../../../utils/fileUploader')
const { MulterError } = require("multer");
const { makeJsonResponse } = require("../../../utils/response");

const handleMulterError = (err, req, res, next) => {
  let response;
  console.log(err)

  if (err instanceof MulterError) {
      console.log(err)
      switch (err.code) {
          case "LIMIT_FILE_SIZE":
              response = makeJsonResponse(`File size limit exceeded (max 25MB)`, {}, { file: 'File size limit exceeded (max 25MB)' }, 403, false);
              break;
          case "LIMIT_FILE_COUNT":
              response = makeJsonResponse(`Too many files`, {}, { file: 'Too many files' }, 403, false);
              break;
          case "LIMIT_PART_COUNT":
              response = makeJsonResponse(`Too many parts`, {}, { file: 'Too many parts' }, 403, false);
              break;
          case "FILE_TYPE":
              response = makeJsonResponse(`Only image and video files are allowed`, {}, { file: 'Only image and video files are allowed' }, 403, false);
              break;
          case "LIMIT_FILE_TYPES":
              response = makeJsonResponse(`Only image and video files are allowed`, {}, { file: 'Only image and video files are allowed' }, 403, false);
              break;
          default:
              response = makeJsonResponse(`Something went wrong`, {}, { file: 'Something went wrong' }, 403, false);
      }
      res.status(403).json(response);

  } else {
      console.log(err)
      switch (err.code) {
          case "LIMIT_FILE_SIZE":
              response = makeJsonResponse(`File size limit exceeded (max 25MB)`, {}, { file: 'File size limit exceeded (max 25MB)' }, 403, false);
              res.status(403).json(response);
              break;
          case "LIMIT_FILE_COUNT":
              response = makeJsonResponse(`Too many files`, {}, { file: 'Too many files' }, 403, false);
              res.status(403).json(response);
              break;
          case "LIMIT_PART_COUNT":
              response = makeJsonResponse(`Too many parts`, {}, { file: 'Too many parts' }, 403, false);
              res.status(403).json(response);
              break;
          case "FILE_TYPE":
              response = makeJsonResponse(`Only image and video files are allowed`, {}, { file: 'Only image and video files are allowed' }, 403, false);
              res.status(403).json(response);
              break;
          case "LIMIT_FILE_TYPES":
              response = makeJsonResponse(`Only image and video files are allowed`, {}, { file: 'Only image and video files are allowed' }, 403, false);
              res.status(403).json(response);
              break;
          default:
              response = makeJsonResponse(`Something went wrong`, {}, { file: 'Something went wrong' }, 403, false);
              res.status(403).json(response);
      }
      next(err);
  }
};

//list all products
router.get("/listProducts", tokenVerifierAdmin, listProducts);

// add a new product
router.post(
  "/addNewProduct",
  tokenVerifierAdmin,
  [docUpload.fields([
      { name: 'mainImage',maxCount:1},
      { name: 'otherImages',maxCount:10},
  ])],
  handleMulterError,
  productValidator,
  addProduct
);

// get a product
router.get("/getProduct/:productId", tokenVerifierAdmin, validateProductId, viewProduct);

// update product details
router.put(
    "/updateProduct/:productId",
    tokenVerifierAdmin,
    validateProductId,
    [docUpload.fields([
        { name: 'mainImage',maxCount:1},
        { name: 'otherImages',maxCount:10},
    ])],
    handleMulterError,
    productUpdateValidator,
    updateProduct
);

//delete a product
router.delete("/deleteProduct/:productId", tokenVerifierAdmin, validateProductId, deleteProduct);

module.exports = router;
