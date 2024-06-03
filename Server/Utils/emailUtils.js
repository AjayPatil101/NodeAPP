const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };
    return transporter.sendMail(mailOptions);
};

exports.sendOtpEmail = async (to, name, otp) => {
    const subject = 'Password Reset OTP';
    const text = `Hello ${name},\n\nYour OTP for password reset is: ${otp}\n\nRegards,\nYour Team`;
    return exports.sendEmail(to, subject, text);
};
