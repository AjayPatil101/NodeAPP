const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri =
      "mongodb+srv://ajayupatil101:Ajay%402512@cluster0.t5yhima.mongodb.net/CURD";
    await mongoose.connect(uri);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

module.exports = connectDB;
