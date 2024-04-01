const User = require("../../../models/User");
const { makeJsonResponse } = require("../../../../utils/response");
const Product = require("../../../models/Product")

let responseData = {
  message: "Some Error Occured",
  data: [],
  error: [],
  httpStatusCode: 500,
  status: false,
};

module.exports ={
    // Add to wishlist

    addToWishlist : async(req,res) =>{
        try{
            const userId = req.user;
      const  productId  = req.body;

      // Fetch the user
      const user = await User.findById(userId);
      if (!user) {
        responseData.success = false;
        responseData.httpStatusCode = 404;
        responseData.message = "User not found";
      
        }
        const index = user.wish_list_products.indexOf(productId);
        if (index !== -1) {
            // If the product already exists, remove it from the wishlist
            user.wish_list_products.splice(index, 1);
            await user.save();

            responseData.message = "item removed from wishlist"

        }else {
            // If the product doesn't exist, add it to the wishlist
            user.wish_list_products.push(productId);
            await user.save();

           responseData.message = "item added to wishlist"  
        }
        responseData.success = true;
        responseData.httpStatusCode = 200;
    }
        
    catch (error) {
        console.error(error);
        responseData.error = error;
        responseData.message = "The product can't add to wishlist";
      }
      const response = makeJsonResponse(
        responseData.message,
        responseData.data,
        responseData.error,
        responseData.httpStatusCode,
        responseData.success
      );
      return res.status(responseData.httpStatusCode).json(response);


},
//get wishListItems items
getWishlstItem: async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId).populate("wish_list_products.product_id");

    if (!user) {
      responseData.success = false;
      responseData.httpStatusCode = 404;
      responseData.message = "User not found";
      throw new Error("User not found");
    }

    const wishListItems = user.wish_list_products.map((item) => ({
      productId: item.product_id._id,
      productName: item.product_id.name
    }));

    responseData.success = true;
    responseData.httpStatusCode = 200;
    responseData.data = wishListItems;
    responseData.message = "wishlist item listed successfully";
  } catch (error) {
    console.error(error);
    responseData.error.push(error.message);
  }

  const response = makeJsonResponse(
    responseData.message,
    responseData.data,
    responseData.error,
    responseData.httpStatusCode,
    responseData.success
  );

  return res.status(responseData.httpStatusCode).json(response);
},



 //clear wishlist
 clearWishlist: async (req, res) => {
  try {
    const userId = req.user;

    // Fetch the user
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      responseData.httpStatusCode = 404;
      responseData.message = "User not found";
      throw new Error("User not found");
    }

    // Clear the wishlist products array
    user.wish_list_products = [];

    // Save the updated user document
    await user.save();

    // Set success response data
    responseData.httpStatusCode = 200;
    responseData.message = "wishlist cleared successfully";
    responseData.status = true;
  } catch (error) {
    console.error(error);
    responseData.error.push(error.message);
  }

  const response = makeJsonResponse(
    responseData.message,
    responseData.data,
    responseData.error,
    responseData.httpStatusCode,
    responseData.status
  );
  return res.status(responseData.httpStatusCode).json(response);
},



// fetch product from wishlist

fetchProduct: async (req,res)=>{
  try {
    //  fetch the product from the wishlist
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    
    if (product) {
        return res.status(200).json(makeJsonResponse("product Details fetched",{product},{},200,true));
    } else {
        return res.status(404).json(makeJsonResponse( "Product not found in wishlist",{},{},404,false ));
    }
} catch (error) {
    console.error('Error fetching product from wishlist:', error);
    res.status(500).json(makeJsonResponse( "Internal server error",{},[error.message],404,false ));
}
},

}











