const { makeJsonResponse } = require("../../utils/response");

const User = require('../models/User')

let responseData = {
    message : 'Some Error Occured',
    data:[],
    error:[],
    httpStatusCode: 500,
    status: false
}


module.exports = {

    insertDummyUser: async (req, res, next) => {
        try{
            let user = new User({
                name:'arjun',
                email:'arjun@ar.com',

            })
            user.save();
            responseData.data = user
            responseData.success = true;
            responseData.httpStatusCode = 200;
            responseData.message = 'Dummy user created successfuly.'
        }catch(error){
            console.log(error)
            responseData.error = error;
        }
        const response = makeJsonResponse(responseData.message,responseData.data,responseData.error,responseData.httpStatusCode,responseData.success);
        return res.status(responseData.httpStatusCode).json(response);
    },

}
