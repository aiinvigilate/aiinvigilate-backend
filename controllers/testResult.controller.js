import prisma from "../lib/prisma.js";
import { OpenAI } from 'openai';

// Set up the OpenAI client (Use your API Key from OpenAI)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to grade short-answer questions using OpenAI
const gradeShortAnswer = async (studentAnswer, correctAnswer) => {
  try {
    // Use ChatGPT to evaluate if the student's answer is correct
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant who evaluates short answers based on correctness.',
        },
        {
          role: 'user',
          content: `Does the following student answer match the correct answer?\nStudent Answer: "${studentAnswer}"\nCorrect Answer: "${correctAnswer}"`,
        },
      ],
      model: 'gpt-4', // You can adjust the model if needed
    });

    // If the response from ChatGPT indicates correctness, return true; otherwise, false

    console.log(response.choices[0].message.content.toLowerCase().includes("correct"));
    

    return response.choices[0].message.content.toLowerCase().includes("correct");
  } catch (error) {
    console.error("Error grading short answer:", error);
    return false; // Assume incorrect answer if there is an error
  }
};

export const createTestResult = async (req, res) => {
    const { testId, studentId, questionResults } = req.body;
  
    let totalScore = 0; // Initialize total score for this test result
  
    try {
      // Create the test result in the database
      const newTestResult = await prisma.testResult.create({
        data: {
          score: totalScore, // Start with a default score of 0
          testId,
          studentId,
          TestResultQuestion: {
            create: await Promise.all(questionResults.map(async (result) => {
              const { questionId, studentAnswer } = result;
              const question = await prisma.question.findUnique({
                where: { id: questionId },
              });
  
              // Check if question exists
              if (!question) {
                console.error(`Question with ID ${questionId} not found.`);
                return {
                  questionId,
                  isCorrect: false,
                  points: 0,
                };
              }
  
              let correctedIsCorrect = false; // Default to false (incorrect)
              let points = 0; // Default points for incorrect answers
  
              if (question.type === "short-answer") {
                // Use ChatGPT to grade short-answer questions
                correctedIsCorrect = await gradeShortAnswer(studentAnswer, question.correctAnswer);
              } else {
                // For other question types, assume the client has sent the correct result
                correctedIsCorrect = result.isCorrect;
              }
  
              if (correctedIsCorrect) {
                points = question.points; // Award points based on the question's assigned points
                totalScore += points; // Increment total score by the points of the question
              }
  
              return {
                questionId,
                isCorrect: correctedIsCorrect,
                points, // Include the points in the result for reference
              };
            })), 
          },
        },
      });
  
      // Update the total score for the test result
      await prisma.testResult.update({
        where: { id: newTestResult.id },
        data: { score: totalScore }, // Update the score after grading
      });
  
      res.status(201).json({
        message: 'Test result created successfully',
        testResult: newTestResult,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Error creating test result',
        error: error.message,
      });
    }
  };
  
  
