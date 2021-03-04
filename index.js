const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

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

function startSearch = () => {
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      name: "initial",
      choices: [
        "View All Employees",
        "View All Employees by Department",
        "View All Employees by Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "exit",
      ],
    }).then((response) => {
      switch (response.initial) {
        case "View All Employees":
          employeeSearch();
          break;

        case "View All Employees by Department":
          deptSearch();
          break;

        case "View All Employees by Manager":
          managerSearch();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Remove Employee":
          removeEmployee();
          break;

        case "Update Employee Role":
          updateRole();
          break;

        case "Update Employee Manager":
          updateManager();
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