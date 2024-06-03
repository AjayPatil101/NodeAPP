const nodemailer = require('nodemailer');
const calculateTotal = (products) => {
  return products.reduce((total, product) => {
    return total + product.qty * product.rate;
  }, 0);
};


const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendEmail = async (to, subject, html) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
    };
    return transporter.sendMail(mailOptions);
};

exports.sendOtpEmail = async (to, user, products,date) => {
    const subject = 'invoice';
    const html =  `   <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Lato:wght@100;400;900&display=swap');
    
            :root {
                --primary: #0000ff;
                --secondary: #3d3d3d; 
                --white: #fff;
            }
    
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Lato', sans-serif;
            }
    
            body {
                background: var(--secondary);
                padding: 50px;
                color: var(--secondary);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
            }
    
            .bold {
                font-weight: 900;
            }
    
            .light {
                font-weight: 100;
            }
    
            .wrapper {
                background: var(--white);
                padding: 30px;
            }
    
            .invoice_wrapper {
                border: 3px solid var(--primary);
                width: 700px;
                max-width: 100%;
            }
    
            /* Add the rest of your CSS styles here */
        </style>
    </head>
    <body> <div className="wrapper">
    <div className="invoice_wrapper">
      <div className="header">
        <div className="logo_invoice_wrap">
          <div className="logo_sec">
            <div className="title_wrap">
              <p className="title bold">Levitation</p>
              <p className="sub_title">Privite Limited</p>
            </div>
          </div>
          <div className="invoice_sec">
            <div className="invoice_no">
              <span>Invoice No:</span>
              <span>INV-${Math.floor(Math.random() * 10000)}</span>
            </div>
            <div className="date">
              <span>Date:</span>
              <span>${date}</span>
            </div>
          </div>
        </div>
        <div className="bill_total_wrap">
          <div className="bill_sec">
            <div className="name">${user.name}</div>
            <div className="email">${user.email}</div>
          </div>
          <div className="total_wrap">
            <div className="name">Total:</div>
            <div className="price">${calculateTotal(products)}</div>
          </div>
        </div>
      </div>
      <div className="body">
        <div className="main_table">
          <div className="table_header">
            <div className="row">
              <div className="col col_des">ITEM DESCRIPTION</div>
              <div className="col col_price">PRICE</div>
              <div className="col col_qty">QTY</div>
              <div className="col col_total">TOTAL</div>
            </div>
          </div>
          ${products.map(product => `
            <div className="table_body">
              <div className="row">
                <div className="col col_des">${product.name}</div>
                <div className="col col_price">${product.rate}</div>
                <div className="col col_qty">${product.qty}</div>
                <div className="col col_total">${product.qty * product.rate}</div>
              </div>
            </div>
          `).join('')}
        </div>
        <div className="paymethod_grandtotal_wrap">
          <div className="paymethod_sec">
            <p className="bold">Payment Method</p>
            <p>Visa, master Card and We accept Cheque</p>
          </div>
          <div className="grandtotal_sec">
            <p>
              <span>Sub Total</span>
              <span>${calculateTotal(products)}</span>
            </p>
            <p>
              <span>Discount 18%</span>
              <span>${(calculateTotal(products) * 0.18).toFixed(2)}</span>
            </p>
            <p className="bold">
              <span>Grand Total</span>
              <span>${(calculateTotal(products) - calculateTotal(products) * 0.18).toFixed(2)}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="footer">
        <p>Thank you and Best Wishes</p>
        <div className="terms">
          <p className="tc bold">Terms & Coditions</p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit non
            praesentium doloribus. Quaerat vero iure itaque odio numquam,
            debitis illo quasi consequuntur velit, explicabo esse nesciunt
            error aliquid quis eius!
          </p>
        </div>
      </div>
    </div>
  </div></body>
  </html>`;
    return exports.sendEmail(to, subject, html);
};
