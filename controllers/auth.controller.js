import bcrypt from "bcrypt";
import crypto from 'crypto';
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { $Enums } from "@prisma/client";
import {sendMail} from "../lib/nodemailer.js";
import { passwordChangeTemplate, welcomeTemplate } from "../lib/emailTemplate.js";


// create logout function
export const logout = async (req, res) => {
  res.clearCookie("token").json({ message: "Logged out!" });
};


// Get Current User
export const getCurrentUser = async (req, res) => {
  const authHeader = req.headers.authorization;

  console.log(authHeader);
  

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[2];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decoded);
    
    // Find user by ID
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        role: true,
      },
    });


    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};



export const register = async (req, res) => {
  const {
    name,
    surname,
    gender,
    email,
    password,
    idNumber,
    role,
    courseId, 
  } = req.body;

  try {
    // Validate mandatory fields
    if (!name || !surname || !gender || !email || !password || !idNumber || !role) {
      return res.status(400).json({
        message: "Name, surname, gender, email, password, ID number, and role are required!",
      });
    }

    // Check if email is already taken
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser && existingUser.verified) {
      return res.status(400).json({
        message: "A user with this email already exists!",
      });
    }

    if (existingUser && !existingUser.verified) {
      // If user exists but is unverified, delete and re-register
      await prisma.user.delete({
        where: {
          email: email,
        },
      });
    }

    // Check if South African ID number is already taken
    const existingUserByIdNumber = await prisma.user.findUnique({
      where: {
        idNumber: idNumber,
      },
    });

    if (existingUserByIdNumber && existingUserByIdNumber.verified) {
      return res.status(400).json({
        message: "A user with this ID number already exists!",
      });
    }

    if (existingUserByIdNumber && !existingUserByIdNumber.verified) {
      // If user exists but is unverified, delete and re-register
      await prisma.user.delete({
        where: {
          idNumber: idNumber,
        },
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationCode = generateSixDigitCode().toString();

    // Send welcome email with verification link
    const emailHtml = welcomeTemplate(verificationCode);
    await sendMail(email, 'Welcome to Our Service - Please Verify Your Email', '', emailHtml);

    // Create new user in the database
    const newUser = await prisma.user.create({
      data: {
        name,
        surname,
        gender,
        email,
        password: hashedPassword,
        idNumber,
        role,
        courseId, // Connect the user to the course
        verificationToken : verificationCode
      },
    });

    // Respond with success
    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create user!" });
  }
};


export const registerOfficer = async (req, res) => {
  const {
    email,
    southAfricanId,
    fullName,
    province,
    township,
  } = req.body;

  try {
    if (!southAfricanId || !email) {
      return res
        .status(400)
        .json({
          message: "South African ID and email are required!",
        });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "A officer with this email already exists!" });
    }
    const existingUserBySAID = await prisma.user.findUnique({
      where: {
        southAfricanId: southAfricanId,
      },
    });

    if (existingUserBySAID) {
      return res
        .status(400)
        .json({ message: "A officer with this South African ID already exists!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        southAfricanId,
        fullName,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        province,
        township,
        profilePicture,
        verificationToken,
        verified: true,
        role: $Enums.Role.OFFICER
      },
    });

    res
      .status(201)
      .json({
        message: "Officer created successfully",
        user: newUser,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create user!" });
  }
};


export const verifyEmail = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token is required." });
  }

  console.log(token);
  

  try {
    const user = await prisma.user.findUnique({
      where: { verificationToken: token.toString() },
    });

    console.log(user);
    

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verified: true,
        verificationToken: null,
      },
    });

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to verify email." });
  }
};

function generateSixDigitCode() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Request Password Reset
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "User not found!" });

     // CHECK IF THE USER IS BLOCKED
    if (user.isUserBlock) {
      return res.status(403).json({ 
        message: "Your account has been blocked. Please contact the administrator." 
      });
    }

    // Check if a reset token already exists and delete it
    await prisma.resetPasswordToken.deleteMany({ where: { userId: user.id } });

    // Generate a new token
    const resetToken =   generateSixDigitCode().toString();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 15 min expiry

    // Save to DB
    await prisma.resetPasswordToken.create({
      data: { userId: user.id, token: resetToken, expiresAt },
    });

    
    // Send welcome email with verification link
    const emailHtml = passwordChangeTemplate(resetToken);
    await sendMail(email, 'Password change request - Change your password', '', emailHtml);

    res.json({ resetTokenCode: resetToken , message: "Password reset link sent to email!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error requesting password reset!" });
  }
};


export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  console.log(req.body);
  

  try {
    const resetEntry = await prisma.resetPasswordToken.findUnique({ where: { token } });


    console.log(resetEntry);
    

    if (!resetEntry || resetEntry.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired token!" });
    }

    const user = await prisma.user.findUnique({ where: { id: resetEntry.userId } });

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and delete the reset token
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await prisma.resetPasswordToken.delete({ where: { token } });

    res.json({ message: "Password reset successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error resetting password!" });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // CHECK IF THE USER EXISTS
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return res.status(400).json({ message: "Invalid Credentials!" });

    // CHECK IF THE USER IS BLOCKED
    if (user.isUserBlock) {
      return res.status(403).json({ 
        message: "Your account has been blocked. Please contact the administrator." 
      });
    }


    // CHECK IF THE USER IS VERIFIED
    if (!user.verified) {
      return res
        .status(400)
        .json({ message: "Please verify your email before logging in!" });
    }

    // CHECK IF THE PASSWORD IS CORRECT
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid Credentials!" });

    // GENERATE COOKIE TOKEN AND SEND TO THE USER
    const age = 1000 * 60 * 60 * 24 * 7; // 1 week in milliseconds

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role, // Include the user's role in the JWT payload
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    const { password: userPassword, verificationToken, ...userInfo } = user;
    console.log("token", token);
    
    userInfo.token = token;
    res.status(200).json({
      success: true,
      token: token, // Remove "Bearer " prefix here
      user: userInfo
    });
    

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to login!" });
  }
}


