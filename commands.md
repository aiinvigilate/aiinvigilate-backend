On student-dashboard
Fix the Picture Capture First Because sometimes it does not work. 

Ask student to take picture of Him/Her Self remove of the Enviroment. Picture must be Captured and previewed.


When User start the test make take picture of the face and send it to
http://localhost:8800/api/image/upload-first
along with 
testId : test-id-student-is-writing

Expected Response

{
    "message": "First image uploaded successfully.",
    "image": {
        "id": 3,
        "testId": 1,
        "userId": 8,
        "imageUrl": "https://res.cloudinary.com/dxq6q6ng5/image/upload/v1744717275/users/face/cptbwex45l5r4zuid4jq.jpg",
        "publicId": "users/face/cptbwex45l5r4zuid4jq",
        "createdAt": "2025-04-15T11:41:15.094Z"
    }
}

After 1 Minute It Must Ask User to take picture again and send it to 
http://localhost:8800/api/image/compare
along with 
testId : test-id-student-is-writing

Expected Response
{
    "message": "Comparison complete",
    "isMatch": false
}

If is "isMatch": false means student is not the who suppose to continue with the test. Give warning (Can be a popup message at the write corner)

IF "isMatch": true meaning everything okay you can alert that continue writing.

Again it must ask after 3 minutes to take picture and after 7 minutes and When user is about to submit the test.

The Whole Process Must Not Interrupt the Student it must be done in background.


When student/user submit it must send all Asnwers to http://localhost:8800/api/take/exam/students-answers

The Tables in Backend is like this



model TestResult {
  id        Int      @id @default(autoincrement())
  score     Float
  submittedAt DateTime @default(now())
  testId    Int
  test      Test     @relation(fields: [testId], references: [id])
  studentId Int
  student   User     @relation(fields: [studentId], references: [id])
  TestResultQuestion TestResultQuestion[]
}

model TestResultQuestion {
  id          Int      @id @default(autoincrement())
  testResultId Int
  questionId  Int
  isCorrect   Boolean
  testResult  TestResult @relation(fields: [testResultId], references: [id])
  question    Question @relation(fields: [questionId], references: [id])
}

model Question {
  id           Int      @id @default(autoincrement())
  text         String
  type         String   @default("multiple-choice") //  multiple-choice, true-false
  options      Json     // Store options in JSON format for flexibility
  correctAnswer Int? 
  userAnswer    String?   
  points       Int      @default(1)                  
  testId       Int
  test         Test     @relation(fields: [testId], references: [id])
  TestResultQuestion TestResultQuestion[]
}