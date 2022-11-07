// import and require inquirer and console.table
const inquirer = require('inquirer');
// create connection to the db files
const db = require('./config/connection');
require('console.table');

// questions need to loop therefore we need to wrap the inquirer prompt in a function that is called everytime the question is asked until user chooes Quit when they come out of the loop through the node exit method.
function init() {
// start prompting user
 inquirer.prompt([
  {
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      'View all departments', 
      'View all roles', 
      'View all employees', 
      'Add a department', 
      'Add a role', 
      'Add an employee', 
      'Update an employee role', 
      'Quit']
  }
 ])
// Check EACH STEP - it's a promise therefore we can attach a then to return the answer. console.log(answer) you see that answer is an object { action: 'whatever we chose'} -- if you just want to only see the value of action then you can console.log(answer.action)
// *** .then(answer => console.log(answer)).catch(err => console.log(err));


// need to check 8 diff posibilits therefore switch is used to evalutate the action property of the answer object and invoke a function depending on the returned valued
 .then(answer => {
  switch (answer.action) {
    case 'View all departments':
      viewAllDepts();
      break;
    case 'View all roles':
      console.log('you want to View all roles');
      init();
      break;
    case 'View all employees':
    viewAllEmps();
      init();
      break;
    case 'Add a department':
      console.log('you want to Add a department');
      init();
      break;
    case 'Add a role':
      console.log('you want to Add a role');
      init();
      break;
    case 'Add an employee':
      console.log('you want to Add an employee');
      init();
      break;
    case 'Update an employee role':
      console.log('you want to Update an employee role');
      init();
      break;
    // if choice is anything other than above then exit through this method that is accessible to node
    default:
      process.exit()
  }
 })
.catch(err => console.log(err));
}

// call init when you first load the app but it is also called everytime in the init loop until quit
init()


// choice: view all departments ==> show a table with dept names ande dept ids.
// function viewAllDepts() {
//   const sql = 'SELECT * FROM department';
// //   using the query method available from the db. but first need to make sure db folder is imported - activity 21 and 22
//   db.query(sql, (err, result) => {
//     if (err) return console.log(err);
//     console.log(result)
//     console.table(result);
//     init(); 
//   })
// }

// use db querry as a promise you can use .then to see results
function viewAllDepts() {
    const sql = 'SELECT * FROM department';
// consolelogging the result shows that the promise return an array with 2 elements. first element has the data we need and the 2nd element has some metadata. We can call the 1st element rows and use 'underscore" for the 2nd element meaning that we don't need it.
    db.promise()
      .query(sql)
      .then(([rows, _]) => {
        console.table(rows);
        init(); 
    })
    .catch(err => console.log(err));
  }

// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

// Bec we have to join employee table to itself to get the manager name then we need to create an alias - 1st time around alias is emp for employee table 2nd time alias is mgr for employee table --- to get the manager first & last name we have to join wherever the employee id matches the manager id
function viewAllEmps() {
    const sql = `SELECT emp.id, emp.first_name, emp.last_name, title, salary, CONCAT(mgr.first_name, ' ', mgr.last_name) AS manager, name
                 FROM employee emp
                 LEFT JOIN employee mgr ON mgr.id = emp.manager_id
                 LEFT JOIN role ON emp.role_id = role.id
                 LEFT JOIN department ON role.department_id = department.id`;
    db.promise()
      .query(sql)
      .then(([rows, _]) => {
        console.table(rows);
        init(); 
    })
    .catch(err => console.log(err));
  }