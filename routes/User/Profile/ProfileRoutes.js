const express = require("express");
const router = express.Router();
const {
    getProfileDetails
} = require('../../../app/controllers/User/Profile/ProfileController')

const { tokenVerifier } = require('../../../app/middlewares/auth/tokenVerifier')

/* GET users listing. */

router.get("/get-profile-details",tokenVerifier,getProfileDetails)


module.exports = router;