-- 2. Access specific patient future appointments.
SELECT * FROM BPSSamples.dbo.APPOINTMENTS
where APPOINTMENTDATE>CURRENT_TIMESTAMP and INTERNALID=(36)