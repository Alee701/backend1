const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
const mongoDB = require("./Config/db");
const user = require("./models/User");
const LoanForm = require("./models/LoanForm")
const multer = require("multer");

mongoDB();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.post("/email-send", async (req, res) => {
  const userData = req.body;

  // Check if email is provided
  if (!userData.email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // Generate random password
  const generatePassword = () => {
    const characters =
      "12345678910";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return password;
  };

  const randomPassword = generatePassword();

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userData.email,
    subject: "Your New Password",
    text: `Hello! 👋 Your generated password is: ${randomPassword} 🔑. This is a temporary password, valid for a short time ⏳. Please use it as soon as possible to access your account.
    Best regards, 
    Mudassir Hussain 👨‍💻
`,
  };

  try {
    await transporter.sendMail(mailOptions);
    const newUser = user.create({
      name: userData.name,
      email: userData.email,
      cnic: userData.cnic,
      password: randomPassword,
    });
    if (newUser) {
      return res.status(201).json({message: "User created"})
    } else {
      return res.status(500).json({ message: "Failed to create user" });
    }
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email service provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  port: 587,
});

function generatePassword() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  return password;
}





app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const userverify = await user.findOne({ email });
      if (!userverify) {
        return res.status(400).json({ message: 'Invalid login credentials' });
      }

      if (userverify.password === password) {
        return res.json({ message: 'Login successful', Credentials: true });
      } else {
        return res.status(400).json({ message: 'Invalid login credentials' });
      }
  
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });



// loan form Data 
app.post('/loan-request', async (req, res) => {
  try {
    const { loanDetails, guarantors, documents } = req.body;

      console.log(loanDetails)
      console.log(guarantors)
      console.log(documents)
    // Create a new LoanRequest document
    const newLoanRequest = new LoanForm({
      loanDetails,
      guarantors,
      documents,
    });

    // Save the loan request to the database
    await newLoanRequest.save();

    res.status(201).json({ message: 'Loan request submitted successfully!' });
  } catch (error) {
    console.error('Error saving loan request:', error);
    res.status(500).json({ message: 'Something went wrong, please try again.' });
  }
});


app.listen(process.env.PORT || 5000, () => {
  console.log(`Backend is Running on the port of ${process.env.PORT}`);
});
