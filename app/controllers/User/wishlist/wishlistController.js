const User = require("../../../models/User");
const { makeJsonResponse } = require("../../../../utils/response");

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


}
}