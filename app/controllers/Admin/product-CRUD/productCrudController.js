const Product = require("../../../models/Product");
const { makeJsonResponse } = require("../../../../utils/response");

module.exports = {
  addProduct: async (req, res) => {
    const images = req.files;
    console.log('images=>',images['mainImage'])
    try {
      const {
        name,
        tag_line,
        description,
        price_by_ml,
        category_ids,
        related_item_ids,
        tags,
        fragrance,
        bottle_color,
        items_in_the_box,
        offer_deduction_percentage,
        offers,
      } = req.body;

      const mainImageFromRequest = images['mainImage'][0]

      const mainImage = process.env.BASE_URL + mainImageFromRequest.destination + mainImageFromRequest.filename

      let otherImages = images['otherImages'].map(item => {
        return process.env.BASE_URL + item.destination + item.filename
      })
      // Create a new Product instance
      const product = new Product({
        name,
        otherImages,
        mainImage,
        tag_line,
        description,
        price_by_ml,
        category_ids,
        related_item_ids,
        tags,
        fragrance,
        bottle_color,
        images,
        items_in_the_box,
        offer_deduction_percentage,
        offers,
      });

      // Save the product to the database
      await product.save();

      // Prepare success response
      const response = makeJsonResponse("Product added successfully", { product }, [], 200, true);
      res.status(200).json(response);
    } catch (error) {
      // Handle errors
      console.error("Error adding product:", error);
      const response = makeJsonResponse("Failed to add product", {}, [error.message], 500, false);
      res.status(500).json(response);
    }
  },

  updateProduct: async (req, res) => {
    try {
      const productId = req.params.productId;
      const {
        name,
        tag_line,
        description,
        price_by_ml,
        category_ids,
        related_item_ids,
        tags,
        fragrance,
        bottle_color,
        items_in_the_box,
        offer_deduction_percentage,
        offers,
      } = req.body;

      // Fetch the product by ID
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json(makeJsonResponse("Product not found", [], [], 404, false));
      }

      // Update the product with new value
      product.name = name || product.name;
      product.tag_line = tag_line || product.tag_line;
      product.description = description || product.description;
      product.price_by_ml = price_by_ml || product.price_by_ml;
      product.category_ids = category_ids || product.category_ids;
      product.related_item_ids = related_item_ids || product.related_item_ids;
      product.tags = tags || product.tags;
      product.fragrance = fragrance || product.fragrance;
      product.bottle_color = bottle_color || product.bottle_color;
      product.images = req.files.map((file) => file.location) || product.images;
      product.items_in_the_box = items_in_the_box || product.items_in_the_box;
      product.offer_deduction_percentage =
        offer_deduction_percentage || product.offer_deduction_percentage;
      product.offers = offers || product.offers;

      // Save the updated product
      const updatedProduct = await product.save();

      // Send a success response with the updated product
      res
        .status(200)
        .json(makeJsonResponse("Product updated successfully", updatedProduct, [], 200, true));
    } catch (error) {
      // Handle any errors that occur during the update process
      console.error(error);
      res
        .status(500)
        .json(makeJsonResponse("Failed to update product", [], error.message, 500, false));
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const productId = req.params.productId;

      // Fetch the product by ID and delete it
      const product = await Product.findByIdAndDelete(productId);

      if (!product) {
        return res.status(404).json(makeJsonResponse("Product not found", [], [], 404, false));
      }

      // Send a success response
      res.status(200).json(makeJsonResponse("Product deleted successfully", [], [], 200, true));
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json(makeJsonResponse("Failed to delete product", [], error.message, 500, false));
    }
  },

  viewProduct: async (req, res) => {
    try {
      const productId = req.params.productId;

      // Fetch the product by ID
      const product = await Product.findById(productId)
        .populate("category_ids related_item_ids offers", "name")
        .populate({
          path: "review.user_id",
          select: "name",
        });
      if (!product) {
        return res.status(404).json(makeJsonResponse("Product not found", [], [], 404, false));
      }

      // Send a success response with the product
      res.status(200).json(makeJsonResponse("Product found", product, [], 200, true));
    } catch (error) {
      // Handle any errors that occur during the view process
      console.error(error);
      res
        .status(500)
        .json(makeJsonResponse("Failed to view product", [], error.message, 500, false));
    }
  },

  listProducts: async (req, res) => {
    try {
      // Fetch all products from the database
      const products = await Product.find(
        {},
        "name price_by_ml rating offer_deduction_percentage images"
      );

      const response = makeJsonResponse("Products fetched successfully", products, [], 200, true);

      // Send response
      res.status(200).json(response);
    } catch (error) {

      console.log(error)
      const response = makeJsonResponse(
        "Failed to fetch products",
        {},
        [error.message],
        500,
        false
      );
      res.status(500).json(response);
    }
  },
};
