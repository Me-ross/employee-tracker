// import and require inquirer and console.table
const inquirer = require('inquirer');
// create connection to the db files
const db = require('./config/connection');
require('console.table');

// questions need to loop therefore we need to wrap the inquirer prompt in a function that is called everytime the question is asked until user choses Quit when they come out of the loop through the node exit method.
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

// need to check 8 diff posibilits therefore switch is used to evalutate the action property of the answer object and invoke a function depending on the returned valued
 .then(answer => {
  switch (answer.action) {
    case 'View all departments':
      viewAllDepts();
      break;
    case 'View all roles':
      viewAllRoles();
      break;
    case 'View all employees':
    viewAllEmps();
      break;
    case 'Add a department':
      addDept();
      break;
    case 'Add a role':
      getDepts();
      break;
    case 'Add an employee':
      addEmp();
      break;
    case 'Update an employee role':
      updateRole();
      break;
    // if choice is anything other than above then exit
    default:
      process.exit()
  }
 })
.catch(err => console.log(err));
}

// call init when you first load the app but it is also called everytime in the init loop until quit
init()


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

  function viewAllRoles() {
    const sql = `SELECT title AS 'Job Title', role.id, salary, name AS 'Department Name'
      FROM role
      JOIN department ON department.id = role.department_id`;
    db.promise()
      .query(sql)
      .then(([rows, _]) => {
        console.table(rows);
        init(); 
    })
    .catch(err => console.log(err));
  }

// Bec we have to join employee table to itself to get the manager name then we need to create an alias - 1st time around alias is emp for employee table 2nd time alias is mgr for employee table --- to get the manager first & last name we have to join wherever the employee id matches the manager id
function viewAllEmps() {
    const sql = `SELECT emp.id, emp.first_name, emp.last_name, title, salary, CONCAT(mgr.first_name, ' ', mgr.last_name) AS manager, name AS 'Department Name'
      FROM employee emp
      LEFT JOIN employee mgr ON mgr.id = emp.manager_id
      LEFT JOIN role ON emp.role_id = role.id
      LEFT JOIN department ON role.department_id = department.id`;
    db.promise()
      .query(sql)
      .then(([rows, _]) => {
        console.log('\n');
        console.table(rows);
        init(); 
    })
    .catch(err => console.log(err));
  }

function addDept() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'newDept',
        message: 'what is the name of the Department you wish to add?'
      }
    ])
    .then((answer) => {
      const sql = `INSERT INTO department (name)
      VALUES ('${answer.newDept}')`;
      db.promise()
      .query(sql)
      .then(() => {
        console.log(`New ${answer.newDept} Department Added`); 
        init();
    })
  })
  .catch(err => console.log(err));
}

let deptTable = {};

function getDepts() {
  const sql = 'SELECT * FROM department';
  db.promise()
    .query(sql)
    .then(([rows, _]) => {
      deptTable = rows;
      addRole(deptTable);
    })
    .catch(err => console.log(err));
}

function addRole(deptTable) {
  let depNames = [];
  deptTable.forEach((i) => depNames.push(i.name))
  inquirer.prompt([
    {
      type: 'input',
      name: 'newTitle',
      message: 'what is the job title of the role you wish to add?'
    },
    {
      type: 'input',
      name: 'newSalary',
      message: 'what is the salary for the role you wish to add?'
    },
    {
      type: 'list',
      name: 'dept',
      message: 'What deparment is the role in?',
      choices: depNames,
    },
  ])
    .then((answer) => {
      let newEmpDeptid;
      deptTable.forEach((i) => {
        if (i.name === answer.dept) {
            newEmpDeptid = i.id;
        }
      });
     
      const sql = `INSERT INTO role (title, salary, department_id)
        VALUES ('${answer.newTitle}', '${answer.newSalary}', '${newEmpDeptid}')`;
      db.promise()
        .query(sql)
        .then(() => {
          console.log(`New Role title ${answer.newTitle} with Salary ${answer.newSalary} added to ${answer.dept} department`);
          init();
        })
    })
    .catch(err => console.log(err));
}

function addEmp() {
  let titleTable = {};
  let roleTitles = [];
  const sql1 = 'SELECT * FROM role';
  db.promise()
    .query(sql1)
    .then(([rows, _]) => {
      titleTable = rows;
      titleTable.forEach((i) => roleTitles.push(i.title))
  })
  let empTable = {};
  let empNames = [];
  const sql2 = 'SELECT * FROM employee';
  db.promise()
    .query(sql2)
    .then(([rows, _]) => {
      empTable = rows;
      empTable.forEach((i) => empNames.push(`${i.first_name} ${i.last_name}`));
  })
  inquirer.prompt([
    {
      type: 'input',
      name: 'newFirstName',
      message: 'what is the first name of the new employee?'
    },
    {
      type: 'input',
      name: 'newLastName',
      message: 'what is the last name of the new employee?'
    },
    {
      type: 'list',
      name: 'titles',
      message: 'what is the title of the new employee?',
      choices: roleTitles,
    },
    {
      type: 'list',
      name: 'manager',
      message: 'who is the manager of the new employee?',
      choices: empNames,
    },
  ])
    .then((answer) => {
      let newid;
      titleTable.forEach((i) => {
        if (i.title === answer.titles) {
            newid = i.id;
        }
      });
      let mngrid;
      empTable.forEach((i) => {
        if (`${i.first_name} ${i.last_name}` === answer.manager){
            mngrid = i.id;
        }
      })
     
      const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES ('${answer.newFirstName}', '${answer.newLastName}', '${newid}', '${mngrid}')`;
      db.promise()
      .query(sql)
      .then(() => {
        console.log(`${answer.newFirstName} ${answer.newLastName} with title ${answer.titles} added as a New Employee to Manager ${answer.manager}'s team`);
        init();
      })
    })
    .catch(err => console.log(err));
}

// timing issue, inquirer does not display array if we add an exta input question first this gives a little extra time allowing the promise to retrieve all employees to complete before inquirer needed to list all employees. This issue gets resolved by adding an async/await.
async function updateRole() {
	let empTable;
	const sql1 = 'SELECT * FROM employee';
	let empList = await db
		.promise()
		.query(sql1)
		.then(([rows, _]) => {
			empTable = rows;
			return empTable.map((i) => `${i.first_name} ${i.last_name}`);
		});

	let titleTable;
	const sql2 = 'SELECT * FROM role';
	let roleTitles = await db
		.promise()
		.query(sql2)
		.then(([rows, _]) => {
			titleTable = rows;
			return titleTable.map((i) => i.title);
		});

	inquirer
		.prompt([
			{
				type: 'list',
				name: 'updtEmpl',
				message: 'which Employee do you want to update?',
				choices: empList,
			},
			{
				type: 'list',
				name: 'newEmpTitle',
				message: 'what is the title of the new employee?',
				choices: roleTitles,
			},
		])
		.then((answer) => {
			let empRow;
			empTable.forEach((i) => {
				if (`${i.first_name} ${i.last_name}` === answer.updtEmpl) {
					empRow = i;
				}
			});
			let currentTitle;
			titleTable.forEach((i) => {
				if (i.id === empRow.role_id) {
					currentTitle = i.title;
				}
			});
			let newTitleId;
			titleTable.forEach((i) => {
				if (i.title === answer.newEmpTitle) {
					newTitleId = i.id;
				}
			});

			const sql = `UPDATE employee
                SET role_id = '${newTitleId}'
                WHERE first_name = '${empRow.first_name}' AND last_name = '${empRow.last_name}'`;
			db.promise()
				.query(sql)
				.then(() => {
					console.log(
						`${answer.updtEmpl} had a current title of ${currentTitle} that was updated to ${answer.newEmpTitle}`
					);
					init();
				});
		})
		.catch((err) => console.log(err));
}
