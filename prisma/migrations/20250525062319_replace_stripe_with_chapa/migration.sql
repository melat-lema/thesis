/*
  Warnings:

  - You are about to drop the `StripeCustomer` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "hashedPassword" TEXT,
ADD COLUMN     "image" TEXT;

-- DropTable
DROP TABLE "StripeCustomer";

-- CreateTable
CREATE TABLE "ChapaTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tx_ref" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChapaTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChapaTransaction_userId_key" ON "ChapaTransaction"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ChapaTransaction_tx_ref_key" ON "ChapaTransaction"("tx_ref");

-- AddForeignKey
ALTER TABLE "ChapaTransaction" ADD CONSTRAINT "ChapaTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
