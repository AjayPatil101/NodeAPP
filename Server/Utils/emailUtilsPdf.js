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
    const html =  ` <!DOCTYPE html>
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
    
    *{@import url('https://fonts.googleapis.com/css2?family=Lato:wght@100;400;900&display=swap');
    
    :root {
      --primary: #0000ff;
      --secondary: #3d3d3d; 
      --white: #fff;
    }
    
    *{
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Lato', sans-serif;
    }
    
    body{
      background: var(--secondary);
      padding: 50px;
      color: var(--secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }
    
    .bold{
      font-weight: 900;
    }
    
    .light{
      font-weight: 100;
    }
    
    .wrapper{
      background: var(--white);
      padding: 30px;
    }
    
    .invoice_wrapper{
      border: 3px solid var(--primary);
      width: 700px;
      max-width: 100%;
    }
    
    .invoice_wrapper .header .logo_invoice_wrap,
    .invoice_wrapper .header .bill_total_wrap{
      display: flex;
      justify-content: space-between;
      padding: 30px;
    }
    
    .invoice_wrapper .header .logo_sec{
      display: flex;
      align-items: center;
    }
    
    .invoice_wrapper .header .logo_sec .title_wrap{
      margin-left: 5px;
    }
    
    .invoice_wrapper .header .logo_sec .title_wrap .title{
      text-transform: uppercase;
      font-size: 18px;
      color: var(--primary);
    }
    
    .invoice_wrapper .header .logo_sec .title_wrap .sub_title{
      font-size: 12px;
    }
    
    .invoice_wrapper .header .invoice_sec,
    .invoice_wrapper .header .bill_total_wrap .total_wrap{
      text-align: right;
    }
    
    .invoice_wrapper .header .invoice_sec .invoice{
      font-size: 28px;
      color: var(--primary);
    }
    
    .invoice_wrapper .header .invoice_sec .invoice_no,
    .invoice_wrapper .header .invoice_sec .date{
      display: flex;
      width: 100%;
    }
    
    .invoice_wrapper .header .invoice_sec .invoice_no span:first-child,
    .invoice_wrapper .header .invoice_sec .date span:first-child{
      width: 70px;
      text-align: left;
    }
    
    .invoice_wrapper .header .invoice_sec .invoice_no span:last-child,
    .invoice_wrapper .header .invoice_sec .date span:last-child{
      width: calc(100% - 70px);
    }
    
    .invoice_wrapper .header .bill_total_wrap .total_wrap .price,
    .invoice_wrapper .header .bill_total_wrap .bill_sec .name{
      color: var(--primary);
      font-size: 20px;
    }
    
    .invoice_wrapper .body .main_table .table_header{
      background: var(--primary);
    }
    
    .invoice_wrapper .body .main_table .table_header .row{
      color: var(--white);
      font-size: 18px;
      border-bottom: 0px;	
    }
    
    .invoice_wrapper .body .main_table .row{
      display: flex;
      border-bottom: 1px solid var(--secondary);
    }
    
    .invoice_wrapper .body .main_table .row .col{
      padding: 10px;
    }
    .invoice_wrapper .body .main_table .row .col_des{width: 45%; text-align: center;}
    .invoice_wrapper .body .main_table .row .col_price{width: 20%; text-align: center;}
    .invoice_wrapper .body .main_table .row .col_qty{width: 10%; text-align: center;}
    .invoice_wrapper .body .main_table .row .col_total{width: 20%; text-align: center;padding-right: 10px;}
    
    .invoice_wrapper .body .paymethod_grandtotal_wrap{
      display: flex;
      justify-content: space-between;
      padding: 5px 0 30px;
      align-items: flex-end;
    }
    
    .invoice_wrapper .body .paymethod_grandtotal_wrap .paymethod_sec{
      padding-left: 30px;
    }
    
    .invoice_wrapper .body .paymethod_grandtotal_wrap .grandtotal_sec{
      width: 30%;
    }
    
    .invoice_wrapper .body .paymethod_grandtotal_wrap .grandtotal_sec p{
      display: flex;
      width: 100%;
      padding-bottom: 5px;
    }
    
    .invoice_wrapper .body .paymethod_grandtotal_wrap .grandtotal_sec p span{
      padding: 0 10px;
    }
    
    .invoice_wrapper .body .paymethod_grandtotal_wrap .grandtotal_sec p span:first-child{
      width: 60%;
    }
    
    .invoice_wrapper .body .paymethod_grandtotal_wrap .grandtotal_sec p span:last-child{
      width: 40%;
      text-align: right;
    }
    
    .invoice_wrapper .body .paymethod_grandtotal_wrap .grandtotal_sec p:last-child span{
      background: var(--primary);
      padding: 10px;
      color: #fff;
    }
    
    .invoice_wrapper .footer{
      padding: 30px;
    }
    
    .invoice_wrapper .footer > p{
      color: var(--primary);
      text-decoration: underline;
      font-size: 18px;
      padding-bottom: 5px;
    }
    
    .invoice_wrapper .footer .terms .tc{
      font-size: 16px;
    }
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Lato', sans-serif;
    }
    
    body{
      background: var(--secondary);
      padding: 50px;
      color: var(--secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }
    
    .bold{
      font-weight: 900;
    }
    
    .light{
      font-weight: 100;
    }
    
    .wrapper{
      background: var(--white);
      padding: 30px;
    }
    
    .invoice_wrapper{
      border: 3px solid var(--primary);
      width: 700px;
      max-width: 100%;
    }
    
    .invoice_wrapper .header .logo_invoice_wrap,
    .invoice_wrapper .header .bill_total_wrap{
      display: flex;
      justify-content: space-between;
      padding: 30px;
    }
    
    .invoice_wrapper .header .logo_sec{
      display: flex;
      align-items: center;
    }
    
    .invoice_wrapper .header .logo_sec .title_wrap{
      margin-left: 5px;
    }
    
    .invoice_wrapper .header .logo_sec .title_wrap .title{
      text-transform: uppercase;
      font-size: 18px;
      color: var(--primary);
    }
    
    .invoice_wrapper .header .logo_sec .title_wrap .sub_title{
      font-size: 12px;
    }
    
    .invoice_wrapper .header .invoice_sec,
    .invoice_wrapper .header .bill_total_wrap .total_wrap{
      text-align: right;
    }
    
    .invoice_wrapper .header .invoice_sec .invoice{
      font-size: 28px;
      color: var(--primary);
    }
    
    .invoice_wrapper .header .invoice_sec .invoice_no,
    .invoice_wrapper .header .invoice_sec .date{
      display: flex;
      width: 100%;
    }
    
    .invoice_wrapper .header .invoice_sec .invoice_no span:first-child,
    .invoice_wrapper .header .invoice_sec .date span:first-child{
      width: 70px;
      text-align: left;
    }
    
    .invoice_wrapper .header .invoice_sec .invoice_no span:last-child,
    .invoice_wrapper .header .invoice_sec .date span:last-child{
      width: calc(100% - 70px);
    }
    
    .invoice_wrapper .header .bill_total_wrap .total_wrap .price,
    .invoice_wrapper .header .bill_total_wrap .bill_sec .name{
      color: var(--primary);
      font-size: 20px;
    }
    
    .invoice_wrapper .body .main_table .table_header{
      background: var(--primary);
    }
    
    .invoice_wrapper .body .main_table .table_header .row{
      color: var(--white);
      font-size: 18px;
      border-bottom: 0px;	
    }
    
    .invoice_wrapper .body .main_table .row{
      display: flex;
      border-bottom: 1px solid var(--secondary);
    }
    
    .invoice_wrapper .body .main_table .row .col{
      padding: 10px;
    }
    .invoice_wrapper .body .main_table .row .col_no{width: 5%;}
    .invoice_wrapper .body .main_table .row .col_des{width: 45%; text-align: center;}
    .invoice_wrapper .body .main_table .row .col_price{width: 20%; text-align: center;}
    .invoice_wrapper .body .main_table .row .col_qty{width: 10%; text-align: center;}
    .invoice_wrapper .body .main_table .row .col_total{width: 20%; text-align: center;}
    
    .invoice_wrapper .body .paymethod_grandtotal_wrap{
      display: flex;
      justify-content: space-between;
      padding: 5px 0 30px;
      align-items: flex-end;
    }
    
    .invoice_wrapper .body .paymethod_grandtotal_wrap .paymethod_sec{
      padding-left: 30px;
    }
    
    .invoice_wrapper .body .paymethod_grandtotal_wrap .grandtotal_sec{
      width: 30%;
    }
    
    .invoice_wrapper .body .paymethod_grandtotal_wrap .grandtotal_sec p{
      display: flex;
      width: 100%;
      padding-bottom: 5px;
    }
    
    .invoice_wrapper .body .paymethod_grandtotal_wrap .grandtotal_sec p span{
      padding: 0 10px;
    }
    
    .invoice_wrapper .body .paymethod_grandtotal_wrap .grandtotal_sec p span:first-child{
      width: 60%;
    }
    
    .invoice_wrapper .body .paymethod_grandtotal_wrap .grandtotal_sec p span:last-child{
      width: 40%;
      text-align: right;
    }
    
    .invoice_wrapper .body .paymethod_grandtotal_wrap .grandtotal_sec p:last-child span{
      background: var(--primary);
      padding: 10px;
      color: #fff;
    }
    
    .invoice_wrapper .footer{
      padding: 30px;
    }
    
    .invoice_wrapper .footer > p{
      color: var(--primary);
      text-decoration: underline;
      font-size: 18px;
      padding-bottom: 5px;
    }
    
    .invoice_wrapper .footer .terms .tc{
      font-size: 16px;
    }
        </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="invoice_wrapper">
          <div class="header">
            <div class="logo_invoice_wrap">
              <div class="logo_sec">
                <div class="title_wrap">
                  <p class="title bold">Levitation</p>
                  <p class="sub_title">Privite Limited</p>
                </div>
              </div>
              
          </div>
          <div class="body">
            <div class="main_table">
              <div class="table_header">
                <div class="row">
                  <div class="col col_des">ITEM DESCRIPTION</div>
                  <div class="col col_price">PRICE</div>
                  <div class="col col_qty">QTY</div>
                  <div class="col col_total">TOTAL</div>
                </div>
              </div>
              <% products.forEach(product => { %>
                <div class="table_body">
                  <div class="row">
                    <div class="col col_des"><%= product.name %></div>
                    <div class="col col_price"><%= product.rate %></div>
                    <div class="col col_qty"><%= product.qty %></div>
                    <div class="col col_total"><%= product.qty * product.rate %></div>
                  </div>
                </div>
              <% }); %>
            </div>
            <div class="paymethod_grandtotal_wrap">
              <div class="paymethod_sec">
                <p class="bold">Payment Method</p>
                <p>Visa, master Card and We accept Cheque</p>
              </div>
              <div class="grandtotal_sec">
                <p>
                  <span>Sub Total</span>
                  <span><%= calculateTotal(products) %></span>
                </p>
                <p>
                  <span>Discount 18%</span>
                  <span><%= (calculateTotal(products) * 0.18).toFixed(2) %></span>
                </p>
                <p class="bold">
                  <span>Grand Total</span>
                  <span><%= (calculateTotal(products) - calculateTotal(products) * 0.18).toFixed(2) %></span>
                </p>
              </div>
            </div>
          </div>
          <div class="footer">
            <p>Thank you and Best Wishes</p>
            <div class="terms">
              <p class="tc bold">Terms & Conditions</p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit non
                praesentium doloribus. Quaerat vero iure itaque odio numquam,
                debitis illo quasi consequuntur velit, explicabo esse nesciunt
                error aliquid quis eius!
              </p>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;
    return exports.sendEmail(to, subject, html);
};
