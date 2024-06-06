const fs = require("fs");
const path = require("path");
const util = require("util");
const puppeteer = require("puppeteer");
const hb = require("handlebars");
const readFile = util.promisify(fs.readFile);
const Product = require("../models/product");
const User = require('../models/User');

// Register Handlebars helpers
hb.registerHelper('multiply', function(a, b) {
  return (a * b).toFixed(2);
});

hb.registerHelper('subtract', function(a, b) {
  return (a - b).toFixed(2);
});

exports.generate = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id }).lean();

    if (products.length) {
      throw new Error('products not found');
    }
    // Generate the PDF and send it as a response
    const pdfBuffer = await generatePdf(products);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
};

async function generatePdf(products) {
  try {
    console.log("Loading template file in memory");
    const invoicePath = path.resolve(__dirname, 'invoice.hbs');
    const templateHtml = await readFile(invoicePath, "utf8");

    console.log("Compiling the template with Handlebars");
    const template = hb.compile(templateHtml, { strict: true });

    console.log("Generating data");
    const data = {
      products: products,
      calculateTotal: (products) => products.reduce((total, product) => total + product.rate * product.qty, 0)
    };
    const html = template(data);

    console.log("Generating PDF");
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' }); // Ensure all resources are loaded

    const pdfBuffer = await page.pdf({ format: "A4", timeout: 60000 });

    await browser.close();
    return pdfBuffer;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}
