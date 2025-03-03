/*
  Warnings:

  - You are about to drop the column `lecturerCourseId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `studentCourseId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_LecturerCourse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_StudentCourse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_LecturerCourse" DROP CONSTRAINT "_LecturerCourse_A_fkey";

-- DropForeignKey
ALTER TABLE "_LecturerCourse" DROP CONSTRAINT "_LecturerCourse_B_fkey";

-- DropForeignKey
ALTER TABLE "_StudentCourse" DROP CONSTRAINT "_StudentCourse_A_fkey";

-- DropForeignKey
ALTER TABLE "_StudentCourse" DROP CONSTRAINT "_StudentCourse_B_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "lecturerCourseId",
DROP COLUMN "studentCourseId",
ADD COLUMN     "courseId" INTEGER;

-- DropTable
DROP TABLE "_LecturerCourse";

-- DropTable
DROP TABLE "_StudentCourse";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
