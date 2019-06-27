import sgMail from '@sendgrid/mail';
import Mailgen from 'mailgen';
import { config } from 'dotenv';

config();

const url = process.env.BASE_URL || 'localhost:3000';
const projectName = process.env.PROJECT_NAME || 'Author\'s Haven';
const projectEmail = process.env.PROJECT_EMAIL || 'authorshaven@gmail.com';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Configure the mail gen
const mailGenerator = new Mailgen({
  theme: 'cerberus',
  product: {
    name: projectName,
    link: url
  }
});

const sendMail = ({ to, subject, message }) => {
  const mailOptions = {
    from: `${projectName} <${projectEmail}>`,
    to,
    subject,
    html: message
  };

  sgMail.send(mailOptions);
};

const sendForgotPasswordMail = (token, email, name) => {
  const link = `${url}/auth/reset_password?email=${email}&token=${token}`;
  const emailBody = {
    body: {
      name,
      intro: 'You are receiving this email because a password reset request for your account was received.',
      action: {
        instructions: 'Tap the button below to reset your customer account password. If you didn\'t request a new password, you can safely delete this email.',
        button: {
          color: '#1a82e2',
          text: 'Reset Your Password',
          link
        }
      },
      outro: `If that doesn't work, copy and paste the following link in your browser:\n\n${link}`
    }
  };
  // Generate an HTML email with the provided contents
  const message = mailGenerator.generate(emailBody);

  return sendMail({
    to: email,
    subject: `${projectName}: Forgot Password`,
    message
  });
};

const sendResetSuccessMail = (email, name) => {
  const emailBody = {
    body: {
      name,
      intro: 'You are receiving this email because a password reset request for your account was received.',
      action: {
        instructions: `Your password has been successfully reset. Please login to ${projectName} by clicking the button below`,
        button: {
          color: 'green',
          text: 'Login',
          link: `${url}/login`
        }
      }
    }
  };
  // Generate an HTML email with the provided contents
  const message = mailGenerator.generate(emailBody);

  return sendMail({
    to: email,
    subject: `${projectName}: Reset Success`,
    message
  });
};

export { sendForgotPasswordMail, sendResetSuccessMail };
