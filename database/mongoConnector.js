require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);

const connectDb = async () => {
  const connectionString = process.env.MONGO_URL

  try {
    let connection = await mongoose
    .connect(connectionString, {
      family: 4,
    })
    .then((conn) => {
      console.log("connection OK");
      return conn;
    })
    .catch((error) => {
      console.log("connection FAILED", error);
      return false;
    });
  
  } catch (error) {
    //someting went wrong
    console.log("Cant connect to db", error);
  }
};

module.exports = { connectDb };
