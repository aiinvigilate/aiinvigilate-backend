import prisma from "../lib/prisma.js";

export const createCourse = async (req, res) => {
  const { name , code } = req.body;

  try {
    const course = await prisma.course.create({
      data: { name , code},
    });
    res.status(201).json({ course, message: "Course created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create course" });
  }
};

// Get All Courses with Modules and Users
export const getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        modules: true,
        User: true,
      },
    });

    res.status(200).json({
      courses,
      message: "Courses fetched successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch courses!" });
  }
};


// Get a single course by ID
export const getSingleCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
      include: {
        modules: true,
        User: true,
      },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ course, message: "Course fetched successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch course" });
  }
};

// Update a course
export const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { name , code } = req.body;

  console.log(req.body);
  

  try {
    const course = await prisma.course.update({
      where: { id: parseInt(id) },
      data: { name , code},
    });
    res.status(200).json({ course, message: "Course updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update course" });
  }
};

// Delete a course
export const deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.course.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete course" });
  }
};
