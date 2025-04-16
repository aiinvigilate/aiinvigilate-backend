CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  surname VARCHAR NOT NULL,
  gender gender NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  "idNumber" VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  "phoneNumber" VARCHAR,
  address VARCHAR,
  role role NOT NULL,
  "courseId" INT,
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now(),
  "verificationToken" VARCHAR UNIQUE,
  verified BOOLEAN DEFAULT FALSE,

  CONSTRAINT fk_course FOREIGN KEY ("courseId") REFERENCES courses(id)
);

CREATE TABLE reset_password_tokens (
  id SERIAL PRIMARY KEY,
  "userId" INT UNIQUE NOT NULL,
  token VARCHAR UNIQUE NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP DEFAULT now(),

  CONSTRAINT fk_user_reset FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  code VARCHAR UNIQUE NOT NULL,
  description TEXT
);

CREATE TABLE modules (
  id SERIAL PRIMARY KEY,
  code VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  credits INT NOT NULL,
  "completionStatus" VARCHAR DEFAULT 'upcoming',
  grade VARCHAR,
  description TEXT,
  "courseId" INT NOT NULL,

  CONSTRAINT fk_course_module FOREIGN KEY ("courseId") REFERENCES courses(id)
);

CREATE TABLE tests (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  duration INT NOT NULL,
  "scheduledFor" TIMESTAMP NOT NULL,
  status VARCHAR DEFAULT 'upcoming',
  "moduleId" INT NOT NULL,
  "creatorId" INT NOT NULL,

  CONSTRAINT fk_module_test FOREIGN KEY ("moduleId") REFERENCES modules(id),
  CONSTRAINT fk_creator_test FOREIGN KEY ("creatorId") REFERENCES users(id)
);

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  type VARCHAR DEFAULT 'multiple-choice',
  options JSON NOT NULL,
  "correctAnswer" INT,
  "userAnswer" VARCHAR,
  points INT DEFAULT 1,
  "testId" INT NOT NULL,

  CONSTRAINT fk_test_question FOREIGN KEY ("testId") REFERENCES tests(id)
);

CREATE TABLE test_results (
  id SERIAL PRIMARY KEY,
  score FLOAT NOT NULL,
  "submittedAt" TIMESTAMP DEFAULT now(),
  "testId" INT NOT NULL,
  "studentId" INT NOT NULL,

  CONSTRAINT fk_test_result FOREIGN KEY ("testId") REFERENCES tests(id),
  CONSTRAINT fk_student_result FOREIGN KEY ("studentId") REFERENCES users(id)
);

CREATE TABLE test_result_questions (
  id SERIAL PRIMARY KEY,
  "testResultId" INT NOT NULL,
  "questionId" INT NOT NULL,
  "isCorrect" BOOLEAN NOT NULL,

  CONSTRAINT fk_test_result_q FOREIGN KEY ("testResultId") REFERENCES test_results(id),
  CONSTRAINT fk_question_result FOREIGN KEY ("questionId") REFERENCES questions(id)
);

CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  "testId" INT NOT NULL,
  "userId" INT NOT NULL,
  "imageUrl" VARCHAR NOT NULL,
  "publicId" VARCHAR NOT NULL,
  "createdAt" TIMESTAMP DEFAULT now(),

  CONSTRAINT fk_image_test FOREIGN KEY ("testId") REFERENCES tests(id),
  CONSTRAINT fk_image_user FOREIGN KEY ("userId") REFERENCES users(id)
);




Notes on Relationships
--------------------------------------------------
    User to Course: Many users can be linked to one course via courseId.

    User to ResetPasswordToken: One-to-one.

    User to Test (as creator): One-to-many (via "TestCreator" relation).

    User to TestResult (as student): One-to-many.

    Course to Module: One-to-many.

    Module to Test: One-to-many.

    Test to Question: One-to-many.

    Test to Image: One-to-many.

    Test to TestResult: One-to-many.

    Question to TestResultQuestion: One-to-many.

    TestResult to TestResultQuestion: One-to-many.

