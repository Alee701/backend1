const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send Email Function
const sendEmail = async ({ to, subject, text, html, attachments }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Saylani Microfinance" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html, // Supports rich HTML content
      attachments, // Optional attachments
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to} with message ID: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error('Failed to send email:', err);
    throw new Error('Email sending failed. Please try again later.');
  }
};

module.exports = { sendEmail };
