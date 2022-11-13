const mysql = require("mysql2");

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
    multipleStatements: true,
    host: 'localhost',
    user: 'root',
    database: 'bravo_supermarket',
    password: 'root',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


module.exports = pool;
