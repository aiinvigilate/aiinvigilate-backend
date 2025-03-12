/*
  Warnings:

  - You are about to drop the column `dueDate` on the `Test` table. All the data in the column will be lost.
  - Added the required column `scheduledFor` to the `Test` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "userAnswer" TEXT;

-- AlterTable
ALTER TABLE "Test" DROP COLUMN "dueDate",
ADD COLUMN     "scheduledFor" TIMESTAMP(3) NOT NULL;
