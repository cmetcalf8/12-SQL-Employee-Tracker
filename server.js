const inquirer = require('inquirer');

const options = () => {
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
    .then((answers) => {
        const { choices } = answers; 
  
        if (choices === "View all departments") {
          showDepartments();
        }

        if (choices === "View all roles") {
            showRoles();
        }
})
}

// Function to show all departments
showDepartments = () => {
    console.log('Showing all departments.../n');
    const sql = 'SELECT department.id AS id, department.name AS department FROM department';

    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        options();
    });
};