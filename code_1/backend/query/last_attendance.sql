-- 3. Identify, for "Phone consultation" appointments, the date of the patient's last physical attendance at the Practice and highlight it if it occurred more than 12 months ago.
-- only get the last physical attendance
SELECT TOP 1 * FROM BPSSamples.dbo.APPOINTMENTS
where LOCATIONID=1 and INTERNALID=(2)
order by APPOINTMENTDATE desc