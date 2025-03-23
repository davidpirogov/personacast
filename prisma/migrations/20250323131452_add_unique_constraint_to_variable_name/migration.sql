/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `variables` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "variables_name_key" ON "variables"("name");
