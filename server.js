const inquirer = require('inquirer');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3001,
    user: 'root',
    password: 'password',
    database: 'employees_db'
})

connection.connect(function(err){
    if (err) throw err;
    options();
})

// Initial prompt to show viewing and adding options
const mainMenu = () => {
    inquirer.prompt([
        {
            type: "list",
            name: "choices",
            message: "What would you like to do?",
            choices: ["View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update an employee role"]
        }
    ])
        .then(function (answer) {
            switch (answer.action) {
                case 'View all departments':
                    viewDepartments();
                    break;
                case 'View all roles':
                    viewRoles();
                    break;
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    updateRole();
                    break;
            }
        })
};

// Function to show all departments
viewDepartments = () => {
    console.log('Showing all departments.../n');
    const sql = 'SELECT department.id AS id, department.name AS department FROM department';

    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        mainMenu();
    });
};

// Function to show all rows
viewRoles = () => {
    console.log('Showing all roles.../n');
    const sql = 'SELECT role.id, role.title, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id';

    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        mainMenu();
    });
};

// Function to show all employees
viewEmployees = () => {
    console.log('Showing all employees.../n');
    const sql = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary FROM employee';

    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        mainMenu();
    });
};

// Function