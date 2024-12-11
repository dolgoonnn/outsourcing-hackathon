/*
  Warnings:

  - You are about to drop the column `agentId` on the `Project` table. All the data in the column will be lost.
  - Added the required column `userType` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('USER_CLIENT', 'USER_PROVIDER', 'USER_ADMIN');

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_agentId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "agentId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userType" "UserType" NOT NULL;

-- CreateTable
CREATE TABLE "_AgentToProject" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AgentToProject_AB_unique" ON "_AgentToProject"("A", "B");

-- CreateIndex
CREATE INDEX "_AgentToProject_B_index" ON "_AgentToProject"("B");

-- AddForeignKey
ALTER TABLE "_AgentToProject" ADD CONSTRAINT "_AgentToProject_A_fkey" FOREIGN KEY ("A") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgentToProject" ADD CONSTRAINT "_AgentToProject_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
