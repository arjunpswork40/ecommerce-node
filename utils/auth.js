const bcrypt = require('bcrypt');
require('dotenv').config();
const { makeJsonResponse } = require('./response');

const generateRandomString = async(length) => {
    const charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomString = '';
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        randomString += charset[randomIndex];
    }
    
    return randomString;
}
module.exports = {
    hashPassword: async (password) => {

        console.log('utility reached ==> ');
        console.log(`hhh=> ${password}`)
        const saltValueFromEnv = process.env.PASSWORD_HASH_SALT || 10;
        console.log(saltValueFromEnv)
        try {
            const salt = await new Promise((resolve, reject) => {
                bcrypt.genSalt(Number(saltValueFromEnv), (err, salt) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(salt);
                    }
                });
            });
            console.log('7777777')
            const hash = await new Promise((resolve, reject) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(hash);
                    }
                });
            });
            console.log('------')
            console.log(hash)

            return makeJsonResponse('Password hashed successfully', { hashedValue: hash }, {}, 200, true);
        } catch (error) {
            return makeJsonResponse('Some Error Occured', {}, error, 500, false);
        }



    },
    createStorableToken: async(token) => {
        const startString = await generateRandomString(12)
        const endString = await generateRandomString(34)

        const modifiedToken = startString+token+endString
        return modifiedToken;

    },
    
}