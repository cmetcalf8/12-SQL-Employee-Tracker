USE employees_db;

INSERT INTO department (name)
VALUES
('IT'),
('Finance & Accounting'),
('Sales & Marketing'),
('Operations');

INSERT INTO role (title, salary, department_id)
VALUES
('Full Stack Developer', 70000, 1),
('Financial Analyst', 120000, 2),
('Sales Manager', 150000, 3),
('Project Manager', 80000, 4);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
(1, 'Dennis', 'Reynolds', 3, 3),
(2, 'Dee', 'Reynolds', 4, 4),
(3, 'Ronald', 'MacDonald', 2, 2),
(4, 'Charlie', 'Kelly', 1, 1);