const express = require("express");
const router = express.Router();

const { registerUserRequestValidator } = require("../../../app/middlewares/validator/auth/registerUserRequestValidator")
const { validateUserId }= require("../../../app/middlewares/validator/auth/validateObjectId")
const { tokenVerifierAdmin } = require("../../../app/middlewares/auth/tokenVerifier")
const {
   listUsers,
   addNewUser,
   getAUser,
   updateUser,
   deleteUser,
   blockOrUnblock
} = require('../../../app/controllers/Admin/user-CRUD/userCrudController')

//list all users
router.get('/listUsers',tokenVerifierAdmin,listUsers)

// add a new user
router.post('/addNewUser',tokenVerifierAdmin,registerUserRequestValidator,addNewUser)

// get a user
router.get('/getuser/:id',tokenVerifierAdmin,validateUserId,getAUser)

// update user details
router.put('/updateUser/:id',tokenVerifierAdmin,validateUserId,registerUserRequestValidator,updateUser)

//delete a user
router.delete('/deleteUser/:id',tokenVerifierAdmin,validateUserId,deleteUser)

// block a user
router.put('/changeBlockStatus/:userId',tokenVerifierAdmin,blockOrUnblock)

module.exports = router;