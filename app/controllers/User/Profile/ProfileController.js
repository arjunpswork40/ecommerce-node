const { makeJsonResponse } = require("../../../../utils/response");

const User = require('../../../models/User')

const twilio = require('../../../../utils/twilio/twilio')
const bcrypt = require('bcrypt')
const twilioVerify = require("../../../../utils/twilio/twilioVerify")
const jwt = require('jsonwebtoken')
const secretKey =  process.env.SECRET_KEY_JWT || '$123EA$456$9633972298$';
const { default: mongoose } = require("mongoose");

let responseData = {
    message : 'Some Error Occured',
    data:[],
    error:[],
    httpStatusCode: 500,
    status: false
}


module.exports = {

    getProfileDetails: async (req, res, next) => {

        responseData.data = {user: req.userData};
        responseData.message = 'User profile details'
        responseData.httpStatusCode = 200;
        console.log('resp=>',responseData)
        const response = makeJsonResponse(responseData.message,responseData.data,responseData.error,responseData.httpStatusCode,responseData.success);
        return res.status(responseData.httpStatusCode).json(response);
    },

}
