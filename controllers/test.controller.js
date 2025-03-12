// Create a test
import prisma from "../lib/prisma.js";


export const createTest = async (req, res) => {
    const { title, description, duration , scheduledFor, moduleId } = req.body;
  
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User is not authenticated' });
    }
  
    try {
      const test = await prisma.test.create({
        data: {
          title,
          description,
          duration : parseInt(duration),  // Ensure duration is an integer
          scheduledFor: new Date(scheduledFor),  // Convert to Date object
          moduleId: parseInt(moduleId),           // Ensure moduleId is an integer
          creatorId: req.user.id,  // Creator ID is retrieved from the authenticated user
        },
      });
  
      res.status(201).json({ test, message: 'Test created successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to create test' });
    }
  };


export const updateTest = async (req, res) => {
    const { id } = req.params;  
    const { title, description, duration, dueDate, status } = req.body; 

    console.log(req.body);
    
  
    try {
      const existingTestResults = await prisma.testResult.findMany({
        where: { testId: parseInt(id) },
      });
  
      if (existingTestResults.length > 0) {
        return res.status(400).json({ message: 'Cannot update the test as it has already been written.' });
      }
  
      const updateData = {};
  
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (duration) updateData.duration = parseInt(duration);
      if (dueDate) updateData.dueDate = dueDate;
      if (status) updateData.status = status;
  
      const updatedTest = await prisma.test.update({
        where: { id: parseInt(id) },
        data: updateData,
      });
      res.status(200).json({ updatedTest, message: 'Test updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to update the test' });
    }
};



export const getTest = async (req, res) => {
    const { id } = req.params;
  
    try {
      const test = await prisma.test.findUnique({
        where: { id: parseInt(id) },
        include: {
          module: true, 
          creator: true, 
          questions: true, 
        },
      });
  
      if (!test) {
        return res.status(404).json({ message: 'Test not found' });
      }
  
      res.status(200).json(test);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch test' });
    }
  };
  

  export const getTests = async (req, res) => {
    try {
      const tests = await prisma.test.findMany({
        include: {
          module: true,
          creator: true,
        },
      });
  
      res.status(200).json(tests);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch tests' });
    }
  };
  
  
export const getTestsByModule = async (req, res) => {
    const { moduleId } = req.params;
  
    try {
      // Get tests associated with the provided moduleId
      const tests = await prisma.test.findMany({
        where: {
          moduleId: parseInt(moduleId),
        },
        include: {
          module: true, // Include the related module data
          questions: true, // Include the related questions for each test
        },
      });
  
      // If no tests found, send a message indicating so
      if (tests.length === 0) {
        return res.status(404).json({
          message: 'No tests found for this module.',
        });
      }
  
      // Return the tests associated with the module
      res.status(200).json(tests);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: 'Failed to fetch tests for this module.',
      });
    }
  };
  

  export const getTestsByUser = async (req, res) => {
    const userId = req.user.id;  
  
    try {
      const tests = await prisma.test.findMany({
        where: {
        },
        include: {
          testResults: {
            where: {
              studentId: userId,  // Only include the results for this user
            },
          },
          module: true,  // Include the associated module data
        },
      });
  
      // If no tests are found
      if (tests.length === 0) {
        return res.status(404).json({
          message: 'No tests found for this user.',
        });
      }

      res.status(200).json(tests);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: 'Failed to fetch tests for the user.',
      });
    }
};


export const getTestsByUserAndModule = async (req, res) => {
    const userId = req.user.id;  
    const { moduleId } = req.params; 
  
    try {

      const tests = await prisma.test.findMany({
        where: {
          moduleId: parseInt(moduleId), 
        },
        include: {
          testResults: {
            where: {
              studentId: userId,  
            },
          },
          module: true,  
        },
      });
  
      if (tests.length === 0) {
        return res.status(404).json({
          message: `No tests found for this user in module with ID ${moduleId}.`,
        });
      }
  
      res.status(200).json(tests);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: 'Failed to fetch tests for the user and module.',
      });
    }
};

  