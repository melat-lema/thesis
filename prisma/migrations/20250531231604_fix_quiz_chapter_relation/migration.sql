/*
  Warnings:

  - You are about to drop the column `answer` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `options` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `topic` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the `CourseQuestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuestionResponse` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `correctAnswer` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chapterId` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CourseQuestion" DROP CONSTRAINT "CourseQuestion_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CourseQuestion" DROP CONSTRAINT "CourseQuestion_userId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_quizId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionResponse" DROP CONSTRAINT "QuestionResponse_courseQuestionId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionResponse" DROP CONSTRAINT "QuestionResponse_userId_fkey";

-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_courseId_fkey";

-- DropIndex
DROP INDEX "Quiz_courseId_idx";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "answer",
DROP COLUMN "options",
DROP COLUMN "question",
ADD COLUMN     "correctAnswer" TEXT NOT NULL,
ADD COLUMN     "explanation" TEXT,
ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "questionType" TEXT NOT NULL DEFAULT 'multiple_choice',
ADD COLUMN     "text" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "courseId",
DROP COLUMN "topic",
ADD COLUMN     "chapterId" TEXT NOT NULL,
ADD COLUMN     "description" TEXT,
ALTER COLUMN "title" SET DEFAULT 'Chapter Quiz';

-- DropTable
DROP TABLE "CourseQuestion";

-- DropTable
DROP TABLE "QuestionResponse";

-- CreateTable
CREATE TABLE "Option" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIGeneratedQuiz" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT[],
    "answer" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "studyMaterialId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIGeneratedQuiz_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Option_questionId_idx" ON "Option"("questionId");

-- CreateIndex
CREATE INDEX "AIGeneratedQuiz_studyMaterialId_idx" ON "AIGeneratedQuiz"("studyMaterialId");

-- CreateIndex
CREATE INDEX "Question_quizId_idx" ON "Question"("quizId");

-- CreateIndex
CREATE INDEX "Question_position_idx" ON "Question"("position");

-- CreateIndex
CREATE INDEX "Quiz_chapterId_idx" ON "Quiz"("chapterId");

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
