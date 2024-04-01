const { makeJsonResponse } = require("../../../../utils/response");

const User = require('../../../models/User')

const twilio = require('../../../../utils/twilio/twilio')
const bcrypt = require('bcrypt')
const twilioVerify = require("../../../../utils/twilio/twilioVerify")
const jwt = require('jsonwebtoken')
const secretKey =  process.env.SECRET_KEY_JWT || '$123EA$456$9633972298$';

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
    postSignup: async (req, res) => {

        const { first_name, last_name, email, mobileNumber, password } = req.body;

        try{
            const existingUser = await User.findOne({ mobileNumber: mobileNumber })
            if (existingUser) {
                responseData.data = {userAlreadyExistStatus:true}
                responseData.httpStatusCode = 400;
                responseData.message = "User already exist.please login"

            } else {
    
                const user = new User({
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    mobileNumber: mobileNumber,
                    password: password
                })
                await user.save()
                const userData = user.toObject();
                userData.userAlreadyExistStatus = false
                delete userData.password;
                responseData.httpStatusCode = 200;
                responseData.data = userData;
                responseData.success = true;
                responseData.message = "User registered successfuly."

            }
        } catch(error) {
            responseData.httpStatusCode = 500;
            responseData.error = error;
            responseData.message = "User registeration failed."
        }

        const response = makeJsonResponse(
                                responseData.message,
                                responseData.data,
                                responseData.error,
                                responseData.httpStatusCode,
                                responseData.success);
        return res.status(responseData.httpStatusCode).json(response);
    },
    verify: async (req, res) => {

        const mobileNumber = req.body.mobileNumber;
        try{
            const user = await User.findOne({ mobileNumber: mobileNumber })

            if (user && !user.verified) {
    
                twilio(mobileNumber).then(() => {
                    responseData.httpStatusCode = 200;
                    responseData.data = user;
                    responseData.success = true;
                    responseData.message = "User verification otp sended successfuly."
                }).catch(() => {
                    responseData.httpStatusCode = 400;
                    responseData.message = "OTP send failed.please enter a valid number"
                })    
            } else {

                responseData.httpStatusCode = 400;
                responseData.message = "enter a valid number"
            }
        }catch(error){

            responseData.httpStatusCode = 500;
            responseData.error = error;
            responseData.message = "Something went wrong."
        }

        const response = makeJsonResponse(
            responseData.message,
            responseData.data,
            responseData.error,
            responseData.httpStatusCode,
            responseData.success);

        return res.status(responseData.httpStatusCode).json(response);

    },

    verifyOtp: async (req, res) => {
        const { otp, phoneNumber } = req.body;
        try {
            const existingUser = await User.findOne({ phoneNumber: phoneNumber });
            if (!existingUser) {
                responseData.httpStatusCode = 401;
                responseData.message = "Please enter an existing number"
            }
    
            const concatedOtp = parseInt(otp.join(""));
            console.log(concatedOtp);
            if (concatedOtp && phoneNumber) {
                const verificationChecks = await twilioVerify(phoneNumber, concatedOtp);
                console.log(verificationChecks.status);
                if (verificationChecks.status !== "approved") {
                    responseData.httpStatusCode = 401;
                    responseData.message = "OTP is not valid"
                } else {
                    responseData.httpStatusCode = 200;
                    responseData.data = existingUser;
                    responseData.success = true;
                    responseData.message =  "OTP validation completed";
                }
            }
        } catch (error) {
            responseData.httpStatusCode = 500;
            responseData.error = error;
            responseData.message =  "Internal server error";
            console.error("Error during OTP verification ", error);
        }

        const response = makeJsonResponse(
            responseData.message,
            responseData.data,
            responseData.error,
            responseData.httpStatusCode,
            responseData.success);
        return res.status(responseData.httpStatusCode).json(response);
    },
    
    loginData: async (req, res) => {
        const { phoneNumber, password } = req.body;
        try {
            const existingUser = await User.findOne({ phoneNumber: phoneNumber });
            if (!existingUser) {
                responseData.httpStatusCode = 404;
                responseData.message = "User not found"
            }
    
            const isPasswordValid = await bcrypt.compare(password, existingUser.password);
            if (!isPasswordValid) {
                responseData.httpStatusCode = 401;
                responseData.message = "Invalid password"
            }
    
    
            // Generate JWT token
            const token = jwt.sign({ userId: existingUser._id }, secretKey, { expiresIn: '1h' });
            
            responseData.success = true;
            responseData.httpStatusCode = 200;
            responseData.message = "login successful"
            responseData.data = {token : token }
        } catch (error) {
            responseData.message = "Internal server error" 
            console.error("Error during login ", error);
        }
        const response = makeJsonResponse(
            responseData.message,
            responseData.data,
            responseData.error,
            responseData.httpStatusCode,
            responseData.success);
        return res.status(responseData.httpStatusCode).json(response);
    },

    
    

    forgetPass: async (req, res) => {
        const { newPassword, confirmPassword ,} = req.body;
        try {
            if (newPassword == confirmPassword) {
                res.status(200).json({ message: "password reset successfully" });
                
            }
        } catch (error) {
            console.error("Error :", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

}
