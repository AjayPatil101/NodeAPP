const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {
        type: String,
        trim: true,
        default: "",
    },
    username: {
        type: String,
        trim: true,
        default: "",
    },
    email: {
        type: String,
        index: {
            unique: true,
            sparse: true,
        },
        lowercase: true,
        trim: true,
        verified: false,
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 20,
    },
    otp: {
        type: String
    },
    otpExpires: {
        type: Date,
    },
    salt: {
        type: String,
    },
});

module.exports = mongoose.model("User", UserSchema, "user");
