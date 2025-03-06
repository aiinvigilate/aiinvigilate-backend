/*
  Warnings:

  - You are about to drop the column `answer` on the `Question` table. All the data in the column will be lost.
  - Changed the type of `options` on the `Question` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "answer",
ADD COLUMN     "correctAnswer" INTEGER,
ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 1,
DROP COLUMN "options",
ADD COLUMN     "options" JSONB NOT NULL;
