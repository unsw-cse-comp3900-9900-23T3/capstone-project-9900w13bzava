CREATE TABLE appointmentTypes (
    appointmentTypeID SERIAL PRIMARY KEY,
    appointmentTypeName VARCHAR(255)
);

INSERT INTO appointmentTypes (appointmentTypeName)
VALUES
    ('Standard appt.'),
    ('Long appt.'),
    ('Short appt.'),
    ('New patient'),
    ('Excision'),
    ('Procedure'),
    ('Immunisation'),
    ('Insurance medical'),
    ('DVA medical'),
    ('Diving medical'),
    ('Meeting'),
    ('Operation'),
    ('Assist'),
    ('Home visit'),
    ('Hospital visit'),
    ('Nursing home (RACF) visit'),
    ('Teleconference'),
    ('Drug rep.'),
    ('Antenatal visit'),
    ('Acupuncture'),
    ('Health Assessment'),
    ('Care Plan'),
    ('Other'),
    ('Cervical screening'),
    ('Recall'),
    ('Internet'),
    ('Workers Comp.'),
    ('Telehealth Consult'),
    ('Telephone Consult'),
    ('Best Health Connect (Telehealth)');