const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employees_db'
})

connection.connect(function(err){
    if (err) throw err;
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
            switch (answer.choices) {
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
                case 'Exit':
                    exitApp();
                    break;
                default:
                    break;
            }
        })
};

// Function to show all departments
viewDepartments = () => {
    console.log('Showing all departments.../n');
    const sql = 'SELECT department.id AS id, department.name AS department FROM department';

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        mainMenu();
    });
};

// Function to show all rows
viewRoles = () => {
    console.log('Showing all roles.../n');
    const sql = 'SELECT role.id, role.title, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id';

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        mainMenu();
    });
};

// Function to show all employees
viewEmployees = () => {
    console.log('Showing all employees.../n');
    const sql = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id';

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        mainMenu();
    });
};

// Function to add an employee
addEmployee = () => {
    connection.query('SELECT * FROM role', function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'first_name',
                    type: 'input',
                    message: "What is the employee's first name?"
                },
                {
                    name: 'last_name',
                    type: 'input',
                    message: "What is the employee's last name?"
                },
                {
                    name: 'manager_id',
                    type: 'input',
                    message: "What is the employee's manager's ID?"
                },
                {
                    name: 'role',
                    type: 'list',
                    choices: function() {
                        var roleArray = [];
                        for (let i = 0; i < res.length; i++) {
                            roleArray.push(res[i].title);
                        }
                        return roleArray;
                    },
                    message: "What is this employee's role?"
                }
            ]).then(function (answer) {
                let role_id;
                for (let a = 0; a < res.length; a++) {
                    if (res[a].title == answer.role) {
                        role_id = res[a].id;
                        console.log(role_id)
                    }
                }
                connection.query(
                    'INSERT INTO employee SET ?',
                    {
                        first_name: answer.first_name,
                        last_name: answer.last_name,
                        manager_id: answer.manager_id,
                        role_id: role_id,
                    },
                    function (err) {
                        if (err) throw err;
                        console.log('Your employee has been added!');
                        mainMenu();
                    })
            })
    })
};

// Function to add a department
 const addDepartment = () => {
    inquirer
        .prompt([
            {
                name: 'newDepartment', 
                type: 'input', 
                message: 'Which department would you like to add?'
            }
            ]).then(function (answer) {
                connection.query(
                    'INSERT INTO department SET ?',
                    {
                        name: answer.newDepartment
                    });
                var query = 'SELECT * FROM department';
                connection.query(query, function(err, res) {
                if(err)throw err;
                console.log('Your department has been added!');
                console.table('All Departments:', res);
                mainMenu();
                })
            })
};

// Function to add a role
addRole = () => {
    connection.query('SELECT * FROM department', function(err, res) {
        if (err) throw err;
        inquirer
        .prompt([
            {
                name: 'new_role',
                type: 'input',
                message: "What new role would you like to add?"
            },
            {
                name: 'salary',
                type: 'input',
                message: "What is the salary of this role? (Just enter a number)"
            },
            {
                name: 'Department',
                type: 'list',
                choices: function() {
                    var deptArray = [];
                    for (let i =0; i <res.length; i++) {
                        deptArray.push(res[i].name);
                    }
                    return deptArray;
                },
            }
        ]).then(function (answer) {
            let department_id;
            for (let a = 0; a < res.length; a++) {
                if (res[a].name == answer.Department) {
                    department_id = res[a].id;
                }
            }
            connection.query(
                'INSERT INTO role SET?',
                {
                    title: answer.new_role,
                    salary: answer.salary,
                    department_id: department_id
                },
                function (err, res) {
                    if(err) throw err;
                    console.log('Your new role has been added.');
                    var query = 'SELECT * FROM role';
                    connection.query(query, function(err, res) {
                    if(err)throw err;
                    // console.log('Your new role has been added!');
                    console.table('All Roles:', res);
                    mainMenu();
                    })
                    // console.table('All Roles:', res);
                    // console.log(res);
                })
        })
    })
};

function updateRole() {

};

function exitApp() {
    connection.end();
};

mainMenu();