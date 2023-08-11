const mysql = require("mysql2")
const con = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "St@r1234",
    database: "updateresumedb",
    
});

con.connect((err) => {
    if (err) throw err;
    console.log("Connection created..!!");
});

module.exports.con = con;