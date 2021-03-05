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
    "SELECT * FROM employee",

    (error, data) => {
      if (error) throw error;
      console.table(data);

      startSearch();
    }
  );
};

const deptSearch = () => {
  connection.query(
    "SELECT * FROM department",

    (error, data) => {
      if (error) throw error;
      console.table(data);

      startSearch();
    }
  );
};

const roleSearch = () => {
  connection.query(
    "SELECT * FROM role",

    (error, data) => {
      if (error) throw error;
      console.table(data);

      startSearch();
    }
  );
};

//Employee add inquirer

//first_name, last_name, role_id, manager_id)

function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Please enter employee's first name",
        name: "firstName",
      },

      {
        type: "input",
        message: "Please enter employee's last name",
        name: "lastName",
      },
      {
        type: "input",
        message: "Please enter employee's role ID number",
        name: "roleId",
      },
      {
        type: "input",
        message: "Please enter the employee's manager's ID number",
        name: "manId",
      },
    ])
    .then((response) => {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: response.firstName,
          last_name: response.lastName,
          role_id: response.roleId,
          manager_id: response.manId,
        },
        (err) => {
          if (err) throw err;
          console.log("\nNew employee has been added");
          startSearch();
        }
      );
    });
}
