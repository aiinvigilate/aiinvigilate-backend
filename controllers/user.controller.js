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
    const { userId } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
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
      const userId = req.user.id; // Get userId from the authenticated user
      const { name, surname, email, password, phoneNumber, address } = req.body;


      console.log(req.body);
      
  
      let updatedData = { name, surname, email, phoneNumber, address };
  
      if (password) {
        const saltRounds = 10;
        updatedData.password = await bcrypt.hash(password, saltRounds);
      }
  
      const user = await prisma.user.update({
        where: { id: parseInt(userId) },
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


// Block and Unblock User

// Block or unblock a user
export const toggleUserBlock = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // First check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Toggle the isUserBlock status
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        isUserBlock: !user.isUserBlock
      },
    });

    const action = updatedUser.isUserBlock ? 'blocked' : 'unblocked';
    
    res.status(200).json({
      message: `User successfully ${action}`,
      status: "success",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        surname: updatedUser.surname,
        isUserBlock: updatedUser.isUserBlock
      }
    });

  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      status: "error"
    });
  }
};