/*
  Warnings:

  - A unique constraint covering the columns `[serviceId,date,startTime]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "measurementsDetail" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_serviceId_date_startTime_key" ON "Booking"("serviceId", "date", "startTime");
