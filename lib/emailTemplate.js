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


export const passwordChangeTemplate = (resetLink) => `
  <html>
    <body>
      <h2>Password Change Request</h2>
      <p>You requested to change your password. Please click the link below to reset your password:</p>
      <a href="${resetLink}">Reset your password</a>
      <p>If you did not request a password change, please ignore this email.</p>
    </body>
  </html>
`;
