// import and require mysql2
const mysql = require('mysql2')

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: '',
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
  );



// exporting module to where ever it may be required
  module.exports = db;