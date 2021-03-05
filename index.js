const inquirer = require("inquirer");
const mysql = require("mysql");
const { printTable } = require("console-table-printer");
require("colors");

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
        "Add employee",
        "Update employee role",
        "Add role",
        "Add department",
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
          console.log(`Goodbye, please close terminal.`.green);
          break;
      }
      return;
    });
  return;
}

//=======================================================================
//Search functions
//=======================================================================

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
//Add employee function
//====================================================================

const addEmployee = () => {
  connection.query("select * from role", (err, response) => {
    if (err) throw err;
    const roles = response.map((role) => {
      return {
        value: role.id,
        name: role.title,
      };
    });

    connection.query("select * from employee", (err, response) => {
      if (err) throw err;
      const managers = response.map((employee) => {
        return {
          value: employee.id,
          name: employee.first_name + " " + employee.last_name,
        };
      });
      inquirer
        .prompt([
          {
            type: "input",
            name: "firstName",
            message: "Enter employee's first name.",
          },
          {
            type: "input",
            name: "lastName",
            message: "Enter employee's last name",
          },
          {
            type: "list",
            message: "Select employee's role.",
            name: "role",
            choices: roles,
          },
          {
            type: "list",
            message: "Select employee's manager",
            name: "manager",
            choices: managers,
          },
        ])
        .then((response) => {
          connection.query(
            "INSERT INTO employee SET ?",
            {
              first_name: response.firstName,
              last_name: response.lastName,
              role_id: response.role,
              manager_id: response.manager,
            },
            (err) => {
              if (err) throw err;
              startSearch();
              console.log(`\nNew employee has been added!\n`.green);
            }
          );
        });
    });
  });
};

//====================================================================
//Add role function
//====================================================================

const addRole = () => {
  connection.query("select * from department", (err, response) => {
    if (err) throw err;
    const departmentList = response.map((department) => {
      return {
        name: department.name,
        value: department.id,
      };
    });
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "Please enter role title",
        },
        {
          type: "list",
          name: "deptId",
          message: "Please select the role's department",
          choices: departmentList,
        },
        {
          type: "input",
          name: "salary",
          message: "Please enter role's base salary",
        },
      ])
      .then((response) => {
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: response.title,
            salary: response.salary,
            department_id: response.deptId,
          },
          (err) => {
            if (err) throw err;
            console.log(`\nNew role has been added!\n`.green);
            startSearch();
          }
        );
      });
  });
};

//====================================================================
//Add dept function
//====================================================================

const addDepartment = () => {
  connection.query("select * from department", (err) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          name: "addDepartment",
          message: "Please enter department name",
        },
      ])
      .then((response) => {
        connection.query(
          "INSERT INTO department SET ?",
          {
            name: response.addDepartment,
          },
          (err) => {
            if (err) throw err;
            console.log(`\nNew department has been added!\n`.green);
            startSearch();
          }
        );
      });
  });
};
