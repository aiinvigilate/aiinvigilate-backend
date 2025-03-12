import prisma from "../lib/prisma.js";

export const createQuestion = async (req, res) => {
  const { text, type, options, correctAnswer = 100 , testId } = req.body;


  try {
    const newQuestion = await prisma.question.create({
      data: {
        text,
        type,
        options,
        testId : parseInt(testId),
        correctAnswer
      }
    });

    res.status(201).json({
      message: 'Question created successfully',
      question: newQuestion
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error creating question',
      error: error.message
    });
  }
};

// READ all questions for a specific test
export const getQuestionsByTest = async (req, res) => {
  const { testId } = req.params;

  try {
    const questions = await prisma.test.findMany({
      where: {
        id : parseInt(testId, 10)
      },
      include: {
        questions: true,
      }
    });

    if (questions.length === 0) {
      return res.status(404).json({ message: 'No questions found for this test' });
    }

    res.status(200).json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error fetching questions',
      error: error.message
    });
  }
};

// READ a single question by ID
export const getQuestionById = async (req, res) => {
  const { id } = req.params;

  try {
    const question = await prisma.question.findUnique({
      where: {
        id: parseInt(id, 10)
      }
    });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(200).json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error fetching question',
      error: error.message
    });
  }
};

// UPDATE a question
export const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { text, type, options, answer, testId } = req.body;

  try {
    const updatedQuestion = await prisma.question.update({
      where: {
        id: parseInt(id, 10)
      },
      data: {
        text,
        type,
        options,
        answer,
        testId
      }
    });

    res.status(200).json({
      message: 'Question updated successfully',
      question: updatedQuestion
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error updating question',
      error: error.message
    });
  }
};

// DELETE a question
export const deleteQuestion = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedQuestion = await prisma.question.delete({
      where: {
        id: parseInt(id, 10)
      }
    });

    res.status(200).json({
      message: 'Question deleted successfully',
      question: deletedQuestion
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error deleting question',
      error: error.message
    });
  }
};


