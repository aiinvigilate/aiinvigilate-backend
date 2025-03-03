import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // You can choose other services like 'SendGrid' or 'SMTP'
  auth: {
    user: process.env.EMAIL_USER, // Your email address (e.g., 'youremail@gmail.com')
    pass: process.env.EMAIL_PASS, // Your email password or app password (if using Gmail)
  },
});

export const sendMail = async (to, subject, text, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to, // Recipient address
    subject, // Subject line
    text, // Plain text body
    html, // HTML body (template)
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Error sending email:', err);
    throw new Error('Failed to send email');
  }
};
