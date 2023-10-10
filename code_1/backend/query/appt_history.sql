-- 2. Access specific patient appointment histories.
SELECT * FROM BPSSamples.dbo.APPOINTMENTS
where APPOINTMENTDATE<CURRENT_TIMESTAMP and INTERNALID=(36)