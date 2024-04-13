const express = require("express");
const router = express.Router();

const { registerUserRequestValidator } = require("../../../app/middlewares/validator/auth/registerUserRequestValidator")
const { validateUserId }= require("../../../app/middlewares/validator/auth/validateObjectId")
const { tokenVerifierFromDB } = require("../../../app/middlewares/auth/tokenVerifier")
const {
   listUsers,
   addNewUser,
   getAUser,
   updateUser,
   deleteUser,
   blockOrUnblock
} = require('../../../app/controllers/Admin/user-CRUD/userCrudController')

//list all users
router.get('/listUsers',tokenVerifierFromDB,listUsers)

// add a new user
router.post('/addNewUser',tokenVerifierFromDB,registerUserRequestValidator,addNewUser)

// get a user
router.get('/getuser/:id',tokenVerifierFromDB,validateUserId,getAUser)

// update user details
router.put('/updateUser/:id',tokenVerifierFromDB,validateUserId,registerUserRequestValidator,updateUser)

//delete a user
router.delete('/deleteUser/:id',tokenVerifierFromDB,validateUserId,deleteUser)

// block a user
router.put('/changeBlockStatus/:userId',tokenVerifierFromDB,blockOrUnblock)

module.exports = router;