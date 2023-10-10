-- 4. Highlight patients without Medicare cards.
select * from BPSSamples.dbo.PATIENTS
where MEDICARENO IS NULL