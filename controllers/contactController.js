const { sendEmail } = require('../utils/sendEmail');

// Controller for handling contact form submission
const sendContactForm = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Send an email notification (e.g., to your admin email address)
    await sendEmail({
      to: process.env.ADMIN_EMAIL, // Email address to receive the contact form submission
      subject: 'New Contact Form Submission',
      text: `You have a new contact form submission:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    res.status(200).json({ message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('Error sending contact form email:', error);
    res.status(500).json({ message: 'Failed to send your message. Please try again later.' });
  }
};

module.exports = { sendContactForm };
