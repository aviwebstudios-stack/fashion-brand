CREATE UNIQUE INDEX "unique_active_slot" ON "Booking" ("serviceId", "date", "startTime")
WHERE status != 'CANCELLED';