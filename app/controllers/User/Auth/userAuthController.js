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
    verifyToken: async(req,res) => {
        let { token } = req.body;
        try{
          if(token){
            let apiAuthKey = process.env.SECRET_KEY_JWT || '$123EA$456$9633972298$';
            token = token.replace(/\s/g, '')

            let valuesFromToken = false;
            try{
                // const tokenToCheck = apiAuthKeyFromRequest.slice(12,-34)
                valuesFromToken = jwt.verify(token, apiAuthKey, { algorithm: 'HS256' });
            } catch (error) {
                console.error('Error verifying token:', error.message);
                console.error('Token:', token);
                responseData.httpStatusCode = 401
                responseData.message = 'Unauthenticated API request';
            }

            if (valuesFromToken) {
                const currentTime = Math.floor(Date.now() / 1000);
                console.log(currentTime < valuesFromToken.exp)
                if(currentTime < valuesFromToken.exp) {
                    const ObjectId = mongoose.Types.ObjectId;
                    const userId = new ObjectId(valuesFromToken.userId);
                    const userDetails = await User.findById(valuesFromToken.userId)
                    if(userDetails){
                        responseData.success = true;
                        responseData.message = 'Authenticated API'
                        responseData.httpStatusCode = 200;
                        responseData.data = {user: userDetails}
                    } else {
                        responseData.message = 'Unauthenticated API request';
                        responseData.httpStatusCode = 401;
                    }
                    
                } else {
                    responseData.message = 'Unauthenticated API request';
                        responseData.httpStatusCode = 401;
                }
            } else {
                responseData.message = 'Unauthenticated API request';
                responseData.httpStatusCode = 401;
            }
            
          } else {
            responseData.httpStatusCode = 401;
            responseData.message = 'Token not verified';
          }
        }catch(error){
            console.log(error)
            responseData.error = error;
        }
        const response = makeJsonResponse(responseData.message,responseData.data,responseData.error,responseData.httpStatusCode,responseData.success);
        return res.status(responseData.httpStatusCode).json(response);
    },
    postSignup: async (req, res) => {

        const { firstName, lastName, email, mobileNumber, password } = req.body;

        try{
            const existingUser = await User.findOne({ mobileNumber: mobileNumber })
            if (existingUser) {
                responseData.data = {userAlreadyExistStatus:true}
                responseData.httpStatusCode = 400;
                responseData.message = "User already exist.please login"

            } else {
    
                const user = new User({
                    first_name: firstName,
                    last_name: lastName,
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
            twilio(mobileNumber).then(() => {
                responseData.httpStatusCode = 200;
                responseData.success = true;
                responseData.message = "User registered successfuly and User verification otp sended successfuly."
            }).catch(() => {
                responseData.httpStatusCode = 400;
                responseData.message = "OTP send failed.please enter a valid number"
            })    
        } catch(error) {
            responseData.httpStatusCode = 500;
            responseData.error = error;
            responseData.message = "User registeration failed."
            console.log('error==>',error)
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
        console.log('fff')
        const { otp, mobileNumber } = req.body;
        console.log(otp,mobileNumber)
        try {
            const existingUser = await User.findOne({ mobileNumber: mobileNumber });
            if (!existingUser) {
                responseData.httpStatusCode = 401;
                responseData.message = "Please enter an existing number"
            }
    
            const concatedOtp = parseInt(otp);
            if (concatedOtp && mobileNumber) {
                try{
                    const verificationChecks = await twilioVerify(mobileNumber, concatedOtp);
                    if (verificationChecks.status !== "approved") {
                        responseData.httpStatusCode = 401;
                        responseData.message = "OTP is not valid"
                    } else {
                        let updatedUserData = await User.findOneAndUpdate({ mobileNumber: mobileNumber },{verified: true},{ returnDocument: 'after' })
                        const token = jwt.sign({ userId: existingUser._id }, secretKey, { expiresIn: '1h' });
                        responseData.token = token
                        responseData.httpStatusCode = 200;
                        responseData.data = updatedUserData;
                        responseData.success = true;
                        responseData.message =  "OTP validation completed";
                    }
                } catch(error){
                    if(error.status === 429) {
                        responseData.httpStatusCode = 401;
                        responseData.message = "Maximum attemptes reached.Try with new otp"
                    }
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
        const { mobileNumber, password } = req.body;
        try {
            const existingUser = await User.findOne({ mobileNumber: mobileNumber });
            if (!existingUser) {
                responseData.httpStatusCode = 404;
                responseData.message = "User not found";
            } else {
                if(existingUser.verified){
                    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
                    if (!isPasswordValid) {
                        responseData.httpStatusCode = 401;
                        responseData.message = "Invalid password or mobile number"
                        responseData.verificationStatus = false;
                    } else {
                        // Generate JWT token
                        const token = jwt.sign({ userId: existingUser._id }, secretKey, { expiresIn: '1h' });
                                    
                        responseData.success = true;
                        responseData.httpStatusCode = 200;
                        responseData.message = "login successful"
                        responseData.data = {token : token, user: existingUser }
                        responseData.verificationStatus = true;

                    }
                } else {
                    responseData.httpStatusCode = 401;
                    responseData.message = "Please verify your mobile number for login.";
                    responseData.verificationStatus = false;
                    responseData.data = {user: existingUser }
                }
                
            }
        } catch (error) {
            responseData.message = "Internal server error" 
            console.error("Error during login ", error);
        }
        const response = makeJsonResponse(
            responseData.message,
            responseData.data,
            responseData.error,
            responseData.httpStatusCode,
            responseData.success,
            responseData.verificationStatus
        );
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
