const { makeJsonResponse } = require("../../../../utils/response");

const User = require('../../../models/User')

const twilio = require('../../../../utils/twilio/twilio')
const bcrypt = require('bcrypt')
const twilioVerify = require("../../../../utils/twilio/twilioVerify")
const jwt = require('jsonwebtoken')
const secretKey = 'my-secret-key'

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

        const { UserName, email, phoneNumber, password } = req.body;
        const existingUser = await userModel.findOne({ email: email })

        if (existingUser) {

            await res.status(400).json({ error: "User already exist.please login" })

        } else {

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new userModel({
                UserName: UserName,
                email: email,
                phoneNumber: phoneNumber,
                password: hashedPassword
            })
            await user.save()
            res.status(200).json({ message: "user logged" }
            )


        }

    },
    verify: async (req, res) => {

        const phoneNumber = req.body.phoneNumber;
        const phone = await userModel.findOne({ phoneNumber: phoneNumber })
        if (phone) {

            twilio(phoneNumber).then(() => {
                res.status(200).json({ otpsend: true, message: "data saved successfully" })
            }).catch(() => {
                res.status(400).json({ otpsend: false, error: "OTP send failed.please enter a valid number" })
            })

        } else {
            await res.status(400).json({ error: "enter a valid number" })
        }



        // console.log(req.body);
        // Your OTP verification logic goes here

    },

    verifyOtp: async (req, res) => {
        const { otp, phoneNumber } = req.body;
        try {
            const existingUser = await userModel.findOne({ phoneNumber: phoneNumber });
            if (!existingUser) {
                return res.status(401).json({ error: "Please enter an existing number" });
            }
    
            const concatedOtp = parseInt(otp.join(""));
            console.log(concatedOtp);
            if (concatedOtp && phoneNumber) {
                const verificationChecks = await twilioVerify(phoneNumber, concatedOtp);
                console.log(verificationChecks.status);
                if (verificationChecks.status !== "approved") {
                    res.status(401).json({ error: "OTP is not valid" });
                } else {
                    res.status(200).json({ message: "OTP validation completed" });
                }
            }
        } catch (error) {
            console.error("Error during OTP verification ", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },
    



    
       
    
    loginData: async (req, res) => {
        const { phoneNumber, password } = req.body;
        try {
            const existingUser = await userModel.findOne({ phoneNumber: phoneNumber });
            if (!existingUser) {
                return res.status(404).json({ error: "User not found" });
            }
    
            const isPasswordValid = await bcrypt.compare(password, existingUser.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: "Invalid password" });
            }
    
            // If user is an admin, return userType as 'admin', else return 'user'
            const userType = existingUser.role === 'admin' ? 'admin' : 'user';
    
            // Generate JWT token
            const token = jwt.sign({ userId: existingUser._id }, secretKey, { expiresIn: '1h' });
    
            // Send the response with token and userType
            res.status(200).json({ token, message: "login successful", userType });
    
        } catch (error) {
            console.error("Error during login ", error);
            res.status(500).json({ error: "Internal server error" });
        }
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
