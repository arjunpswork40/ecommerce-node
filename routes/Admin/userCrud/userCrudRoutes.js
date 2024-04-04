const express = require("express");
const router = express.Router();

const { registerUserRequestValidator } = require("../../../app/middlewares/validator/auth/registerUserRequestValidator")
const { validateUserId }= require("../../../app/middlewares/validator/auth/validateObjectId")
const {
   listUsers,
   addNewUser,
   getAUser,
   updateUser,
   deleteUser
} = require('../../../app/controllers/Admin/user-CRUD/userCrudController')

//list all users
router.get('/listUsers',listUsers)

// add a new user
router.post('/addNewUser',registerUserRequestValidator,addNewUser)

// get a user
router.get('/getuser/:id',validateUserId,getAUser)

// update user details
router.put('/updateUser/:id',validateUserId,registerUserRequestValidator,updateUser)

//delete a user
router.delete('/deleteUser/:id',validateUserId,deleteUser)

module.exports = router;