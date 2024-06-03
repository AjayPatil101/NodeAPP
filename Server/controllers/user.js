require('dotenv').config();
const User = require('../models/User');
const passwordUtils = require('../Utils/passwordUtils');
const jwtUtils = require('../Utils/jwtUtils');
const { sendOtpEmail } = require('../Utils/emailUtils');

exports.postUser = async (req, res) => {
    try {
        const regex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(req.body.email)) {
            return res.status(409).jsonp({ data: false, message: "Enter valid Email" });
        }
        const existingUserByEmail = await User.findOne({ email: req.body.email });
        if (existingUserByEmail) {
            return res.status(409).jsonp({ data: false, message: "User already exists" });
        }
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            username: req.body.email,
            password: await passwordUtils.hashPassword(req.body.password),
        });

        await newUser.save();

        return res.status(201).jsonp({ data: true, message: "New User has been added." });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyValue) {
            return res.status(409).jsonp({ data: false, message: "Email already exists" });
        }
        console.error(error);
        return res
            .status(500)
            .jsonp({ data: false, message: "An error occurred while adding a new User." });
    }
};

exports.Singin = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (user && await passwordUtils.verifyPassword(req.body.password, user.password)) {
        const token = jwtUtils.generateToken(user.toObject());
        const response = {
            token: token,
            expiresIn: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        };
        return res.status(200).send(response);
    } else {
        return res.status(400).jsonp({ data: false, message: "You have entered a wrong email or password!" });
    }
};

// Update user by id
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;
    try {
        const updateData = { name, email };
        if (password) {
            updateData.password = await passwordUtils.hashPassword(password);
        }
        const user = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).jsonp({ data: false, message: "User not found" });
        }
        return res.status(200).jsonp({ data: true, message: "User updated successfully", user });
    } catch (error) {
        return res.status(400).jsonp({ data: false, message: error.message });
    }
};

// Delete user by id
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).jsonp({ data: false, message: "User not found" });
        }
        return res.status(200).jsonp({ data: true, message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).jsonp({ data: false, message: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let generateOtp = Math.floor(100000 + Math.random() * 9000);
        user.otp = generateOtp;
        user.otpExpires = Date.now() + 3600000; // 1 hour

        await user.save();
        await sendOtpEmail(email, user.name, user.otp);

        return res.status(200).json({ message: 'An email has been sent to the provided email with further instructions.' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { otp, newPassword, reEnterPassword } = req.body;
        var user = await User.findOne({
            otp,
            otpExpires: {
                $gt: Date.now(),
            },
        });
        if (!user) {
            res.json({
                data: false,
                message: 'Password reset OTP is invalid or has expired.'
            });
        }
        if (newPassword === reEnterPassword) {
            user.password = newPassword;
            await user.save();
            res.json({
                data: true,
                message: 'Password updated successfully'
            });
        } else {
            res.json({
                data: false,
                message: 'Passwords do not match'
            });
            // throw new errors.InvalidData();
        }
    } catch (e) {
        res.jsonp({ data: false, message: e.message });
    }
};