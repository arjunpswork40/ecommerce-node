const { makeJsonResponse } = require("../../../../utils/response");
const User = require("../../../models/User");

module.exports = {
  // list all users
  listUsers: async (req, res) => {
    try {
      const users = await User.find({},{ firstName:1,lastName:1,mobileNumber: 1, email: 1 });
      const response = makeJsonResponse("Users fetched successfully", users, [], 200, true);
      res.status(200).json(response);
    } catch (error) {
      const response = makeJsonResponse("Failed to fetch users", {}, [error.message], 500, false);
      res.status(500).json(response);
    }
  },

  // add a new user
  addNewUser: async (req, res) => {
    const { firstName, lastName, email, mobileNumber, password } = req.body;
    console.log('addNewUser==>',req.body)
    try {
      const existingUser = await User.findOne({ mobileNumber: mobileNumber });
      if (existingUser) {
        return res
          .status(400)
          .json(
            makeJsonResponse("User already exist", { userAlreadyExistStatus: true }, {}, 400, false)
          );
      } else {
        const user = new User({
          firstName: firstName,
          lastName: lastName,
          email: email,
          mobileNumber: mobileNumber,
          password: password,
        });
        await user.save();
        const userData = user.toObject();
        userData.userAlreadyExistStatus = false;
        delete userData.password;
        return res
          .status(200)
          .json(makeJsonResponse("User registered successfuly.", userData, {}, 200, true));
      }
    } catch (error) {
      res
        .status(500)
        .json(makeJsonResponse("Failed to create user", {}, [error.message], 500, false));
    }
  },

  // get a user
  getAUser: async (req, res) => {
    const userId=req.params.id
    try {
      const user = await User.findById(userId,{ password: 0 });
      if (!user) {
        return res.status(404).json(makeJsonResponse("User not found", {}, {}, 404, false));
      }
      res.status(200).json(makeJsonResponse("User retrieved successfully", user, {}, 200, true));
    } catch (error) {
      res
        .status(500)
        .json(makeJsonResponse("Failed to retrieve user", {}, [error.message], 500, false));
    }
  },

  //update user details
  updateUser: async (req, res) => {
    const userId = req.params.id;
    const dataToUpdate = req.body;
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, dataToUpdate, { new: true });
      if (!updatedUser) {
        return res.status(404).json(makeJsonResponse("User not found", {}, {}, 404, false));
      }
      delete updatedUser.password
      res
        .status(200)
        .json(makeJsonResponse("User updated successfully", updatedUser, {}, 200, true));
    } catch (error) {
      res
        .status(400)
        .json(makeJsonResponse("Failed to update user", {}, [error.message], 400, false));
    }
  },

  // delete a user
  deleteUser: async (req, res) => {
    const userId = req.params.id;
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json(makeJsonResponse("User not found", {}, {}, 404, false));
      }
      res.status(200).json(makeJsonResponse("User deleted successfully", {}, {}, 200, true));
    } catch (error) {
      res
        .status(500)
        .json(makeJsonResponse("Failed to delete user", {}, [error.message], 500, false));
    }
  },

  //change blocked status
  blockOrUnblock : async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Find the user 
      const user = await User.findById(userId);
  
      if (!user) {
        const response = makeJsonResponse('User not found', {}, ['User not found'], 404, false);
        return res.status(404).json(response);
      }
  
      // change blocked status
      user.blocked = !user.blocked;
  
      // Save the updated user
      const updatedUser = await user.save();
  
      //success response
      const message = `User ${updatedUser.blocked ? 'blocked' : 'unblocked'} successfully`;
      const data = { user: updatedUser };
      const response = makeJsonResponse(message, data, [], 200, true);
  
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      const response = makeJsonResponse('Failed to change block status', {}, [error.message], 500, false);
      res.status(500).json(response);
    }
  }
};
