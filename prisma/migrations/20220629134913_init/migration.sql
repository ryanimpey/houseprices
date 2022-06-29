/*
  Warnings:

  - The primary key for the `prices` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `places` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "prices" DROP CONSTRAINT "prices_pkey",
ADD CONSTRAINT "prices_pkey" PRIMARY KEY ("Region_Name", "Date");

-- DropTable
DROP TABLE "places";
