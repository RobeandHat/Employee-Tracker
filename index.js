const inquirer = require("inquirer");
const mysql = require("mysql");
require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  // Your port, if not 3306
  port: 3306,
  // Your username
  user: "root",
  // Be sure to update with your own MySQL password!
  password: "rootqwer",
  database: "employees_DB",
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  startSearch();
});

function startSearch() {
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      name: "initial",
      choices: [
        "View all employees",
        "View all departments",
        "View all roles",
        "Add department",
        "Add role",
        "Add employee",
        "Update employee role",
        "exit",
      ],
    })
    .then((response) => {
      switch (response.initial) {
        case "View all employees":
          employeeSearch();
          break;

        case "View all departments":
          deptSearch();
          break;

        case "View all roles":
          roleSearch();
          break;

        case "Add employee":
          addEmployee();
          break;

        case "Add role":
          addRole();
          break;

        case "Add department":
          addDepartment();
          break;

        case "Update employee role":
          updateRole();
          break;

        case "Exit":
          connection.end();
          break;

        default:
          console.log(`Invalid action`);
          break;
      }
      return;
    });
  return;
}

//Search functions

const employeeSearch = () => {
  connection.query(
    `SELECT employee.id, employee.first_name, employee.last_name, role.title, CONCAT(manager.first_name, " ", manager.last_name) manager
        FROM employee 
        LEFT JOIN role
        ON employee.role_id=role.id
        LEFT JOIN employee manager
        ON manager.id=employee.manager_id;`,

    (err, data) => {
      if (err) throw err;
      console.table(data);

      startSearch();
    }
  );
};

const deptSearch = () => {
  connection.query(
    "SELECT * FROM department",

    (err, data) => {
      if (err) throw err;
      console.table(data);

      startSearch();
    }
  );
};

const roleSearch = () => {
  connection.query(
    `SELECT role.id, role.title, role.salary, (department.name) department
    FROM role 
    LEFT JOIN department
    ON role.department_id = department.id;`,

    (err, data) => {
      if (err) throw err;
      console.table(data);

      startSearch();
    }
  );
};

//====================================================================
//Add functions
//=================================================================
