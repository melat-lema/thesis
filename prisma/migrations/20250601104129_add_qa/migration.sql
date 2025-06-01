-- CreateTable
CREATE TABLE "AIGeneratedQA" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "studyMaterialId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIGeneratedQA_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AIGeneratedQA_studyMaterialId_idx" ON "AIGeneratedQA"("studyMaterialId");

-- CreateIndex
CREATE INDEX "AIGeneratedQA_topic_idx" ON "AIGeneratedQA"("topic");
