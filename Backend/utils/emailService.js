const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

exports.sendResetEmail = async (email, resetToken) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    html: `<h2>Password Reset Request</h2><p><a href="${resetLink}">Click here to reset</a></p>`
  };

  return transporter.sendMail(mailOptions);
};

exports.sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to University Management',
    html: `<h2>Welcome ${name}!</h2><p>Your account has been created.</p>`
  };

  return transporter.sendMail(mailOptions);
};