// const { sendOtpEmail } = require('../Utils/emailUtilsPdf');
// const Product = require('../models/product');
// const User = require('../models/User');

// exports.createPDF = async (req, res) => {
//   try {
//     const products = await Product.find({ user: req.user._id });
//     const user = await User.findById(req.user._id);
//     const date = new Date().toLocaleDateString();
//     if (!user) {
//         return res.status(404).json({ message: "User not found" });
//     }

//     await sendOtpEmail(user.email, user, products,date);

//     return res.status(200).json({ message: 'An email has been sent to the provided email with further instructions.' });
// } catch (error) {
//     return res.status(500).json({ message: error.message });
// }
// };

const { generatePDF } = require('../Utils/pdfController');
const Product = require('../models/product');
const User = require('../models/User');

exports.createPDF = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id });
    const user = await User.findById(req.user._id);
    const date = new Date().toLocaleDateString();

    const pdf = await generatePDF(products, user, date);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
    res.send(pdf);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
