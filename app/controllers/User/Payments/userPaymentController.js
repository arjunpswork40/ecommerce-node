const { makeJsonResponse } = require("../../../../utils/response");
const stripe = require("stripe")(process.env.STRIPE_SECRET)

const User = require('../../../models/User')

let responseData = {
    message : 'Some Error Occured',
    data:[],
    error:[],
    httpStatusCode: 500,
    status: false
}


module.exports = {

    createCheckoutSession: async(req,res,next) => {
        const {products} = req.body;
       
        const lineItems = products.map((product) => ({
            
            price_data:{
                currency:"AED",
                product_data:{
                    name:product.name,
                    images:Object.fromEntries(
                        Object.entries(product.image).map(([key, value]) => [
                          key,
                          value.replace("/assets", `${process.env.REACT_BASE_URL}/assets`)
                        ])
                      )
                },
                unit_amount:Math.round(product.price * 100)
            },
            quantity: product.quantity
        }))


        const session = await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            line_items:lineItems,
            mode:"payment",
            success_url:`${process.env.REACT_BASE_URL}/payment-success`,
            cancel_url:`${process.env.REACT_BASE_URL}/cancel-payment`,

        })

        res.json({id:session.id})
    }
   

}
