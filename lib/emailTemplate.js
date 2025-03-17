export const welcomeTemplate = (verificationLink) => `
  <html>
    <body>
      <h2>Welcome to Our Service!</h2>
      <p>Thank you for registering with us. Please verify your email address to activate your account.</p>
      <a href="${verificationLink}">Click here to verify your email</a>
      <p>If you did not sign up for this account, please ignore this email.</p>
    </body>
  </html>
`;


export const passwordChangeTemplate = (code) => `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          padding: 20px;
        }
        .container {
          max-width: 500px;
          margin: 0 auto;
          background: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        h2 {
          color: #333;
        }
        .code {
          font-size: 20px;
          font-weight: bold;
          color: #d9534f;
          background: #f8d7da;
          padding: 10px;
          border-radius: 5px;
          display: inline-block;
          margin: 10px 0;
        }
        p {
          color: #555;
          font-size: 16px;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Password Reset Request</h2>
        <p>You requested to change your password.</p>
        <p>Use the following code to reset your password:</p>
        <div class="code">${code}</div>
        <p>If you did not request a password change, please ignore this email.</p>
        <p class="footer">For security reasons, do not share this code with anyone.</p>
      </div>
    </body>
  </html>
`;
