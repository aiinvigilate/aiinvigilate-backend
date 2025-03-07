import prisma from "../lib/prisma.js";

// Create a new module
export const createModule = async (req, res) => {
  const { code, name, credits, courseId } = req.body;

  try {
    const module = await prisma.module.create({
      data: { code, name, credits, courseId },
    });
    res.status(201).json({ module, message: "Module created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create module" });
  }
};

// Get all modules
export const getAllModules = async (req, res) => {
  try {
    const modules = await prisma.module.findMany({
      include: {
        course: true,
        tests: true,
      },
    });
    res.status(200).json(modules);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch modules" });
  }
};

// Get a single module by ID
export const getSingleModule = async (req, res) => {
  const { id } = req.params;

  try {
    const module = await prisma.module.findUnique({
      where: { id: parseInt(id) },
      include: {
        course: true,
        tests: true,
      },
    });

    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    res.status(200).json({ module, message: "Module fetched successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch module" });
  }
};

export const updateModule = async (req, res) => {
    const { id } = req.params;
    const { code, name, credits, completionStatus, grade } = req.body;
  
    const dataToUpdate = {};
  
    if (code) dataToUpdate.code = code;
    if (name) dataToUpdate.name = name;
    if (credits) dataToUpdate.credits = credits;
    if (completionStatus) dataToUpdate.completionStatus = completionStatus;
    if (grade) dataToUpdate.grade = grade;
  
    try {
      const module = await prisma.module.update({
        where: { id: parseInt(id) },
        data: dataToUpdate, 
      });
      res.status(200).json({ module, message: "Module updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update module" });
    }
  };
  

// Delete a module
export const deleteModule = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.module.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "Module deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete module" });
  }
};


// 📌 Get Modules for Logged-in User's Course
export const getUserModules = async (req, res) => {
    const userId = req.user.id; // Assuming user ID is in the token payload
  
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          course: {
            include: { modules: true },
          },
        },
      });
  
      if (!user || !user.course) {
        return res.status(404).json({ message: "No course found for this user!" });
      }
  
      res.status(200).json({
        modules: user.course.modules,
        message: "Modules fetched successfully!",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch modules!" });
    }
  };
  