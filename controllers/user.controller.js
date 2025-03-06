import prisma from "../lib/prisma.js";
import bcrypt from 'bcrypt';

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { name, surname, gender, email, idNumber, password, role, courseId } = req.body;

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        name,
        surname,
        gender,
        email,
        idNumber,
        password: hashedPassword,
        role,
        courseId: courseId || null,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        course: true,
        tests: true,
        testResults: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        course: true,
        tests: true,
        testResults: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, surname, email, password, phoneNumber, address } = req.body;
  
      let updatedData = { name, surname, email, phoneNumber, address };
  
      if (password) {
        const saltRounds = 10;
        updatedData.password = await bcrypt.hash(password, saltRounds);
      }
  
      const user = await prisma.user.update({
        where: { id: parseInt(id) },
        data: updatedData,
      });
  
      res.status(201).json({
        message: "User updated successfully",
        status: "success",
        user: user
      });



    } catch (error) {

        console.log(error);
        

      res.status(500).json({ error: error.message });
    }
  };

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};