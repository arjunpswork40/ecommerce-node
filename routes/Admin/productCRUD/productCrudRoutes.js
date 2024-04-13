const express = require("express");
const router = express.Router();
const upload = require("../../../utils/s3/s3multer");

const {
  productValidator,
} = require("../../../app/middlewares/validator/auth/productInputValidator");
const { validateProductId } = require("../../../app/middlewares/validator/auth/validateProductIds");
const { tokenVerifierFromDB } = require("../../../app/middlewares/auth/tokenVerifier");
const {
  listProducts,
  addProduct,
  viewProduct,
  updateProduct,
  deleteProduct,
} = require("../../../app/controllers/Admin/product-CRUD/productCrudController");

//list all products
router.get("/listProducts", tokenVerifierFromDB, listProducts);

// add a new product
router.post(
  "/addNewProduct",
  tokenVerifierFromDB,
  productValidator,
  upload.array("images", 10),
  addProduct
);

// get a product
router.get("/getProduct/:productId", tokenVerifierFromDB, validateProductId, viewProduct);

// update product details
router.put(
  "/updateProduct/:productId",
  tokenVerifierFromDB,
  validateProductId,
  productValidator,
  upload.array("images", 10),
  updateProduct
);

//delete a product
router.delete("/deleteProduct/:productId", tokenVerifierFromDB, validateProductId, deleteProduct);

module.exports = router;
