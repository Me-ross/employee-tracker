INSERT INTO department (name)
VALUES  ('Finance'),
        ('Engineering'),
        ('Legal'),
        ('Human Resources'),
        ('Sales');

INSERT INTO role (title, salary, department_id)
VALUES  ('CFO', 950000.00, 1),
        ('Analyst', 120000.00, 1),
        ('Software Engineer', 125000.00, 2),
        ('Coder', 65000.00, 2),
        ('Senior Counsel', 175000.00, 3),
        ('Auditor', 65000.00, 3),
        ('Recruiter', 85000.00, 4),
        ('Researcher', 50000.00, 4),
        ('Senior Rep', 75000.00, 5),
        ('Inside Rep', 45000.00, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Kelly', 'Parker', 1, NULL),
        ('Sandy', 'Cane', 2, 1),
        ('Mandy', 'Gordon', 3, NULL),
        ('Carlos', 'Ramirez', 4, 3),
        ('Shervin', 'Salesman', 5, 2),
        ('Julia', 'Sanchez', 6, 4),
        ('Lili', 'Hopeful', 7, 5);