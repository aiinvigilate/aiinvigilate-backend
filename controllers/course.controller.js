import bcrypt from "bcrypt";
import crypto from 'crypto';
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { $Enums } from "@prisma/client";



export const getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany();
    res
      .status(201)
      .json({
        courses: courses,
        message: "Courses fetched successfully",
      });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "  " });
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
  const { token } = req.query;
  try {
    const user = await prisma.user.findUnique({
      where: {
        verificationToken: token,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    const updatedUser = await prisma.user.update({
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

// Request Password Reset
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "User not found!" });

    // Check if a reset token already exists and delete it
    await prisma.resetPasswordToken.deleteMany({ where: { userId: user.id } });

    // Generate a new token
    const resetToken =  crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 15 min expiry

    // Save to DB
    await prisma.resetPasswordToken.create({
      data: { userId: user.id, token: resetToken, expiresAt },
    });

    // Email content
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // This will be replace by sending email
    console.log(`Link to reset your password : ${resetLink}`);

    res.json({ resetTokenLink: resetLink , message: "Password reset link sent to email!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error requesting password reset!" });
  }
};


export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const resetEntry = await prisma.resetPasswordToken.findUnique({ where: { token } });

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

      res.status(200).json({
        success: true,
        token: `Bearer ${token}`,
        user: userInfo
      });


  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to login!" });
  }
}


