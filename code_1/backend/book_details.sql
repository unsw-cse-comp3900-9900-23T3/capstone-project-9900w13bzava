-- 1. View a GP's own appointment book details.
SELECT * FROM BPSSamples.dbo.APPOINTMENTS
where USERID=(1) and APPOINTMENTDATE=('2006-02-24 00:00:00.000')