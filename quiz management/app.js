const express = require("express");

const app = express();
const port = 3000;
const mysql = require("./connection").con;

app.set("view engine", "hbs");
app.set("views", "./view");
app.use(express.static(__dirname + "/public"))

// app.use(express.urlencoded())
// app.use(express.json())
// Routing

app.get("/", (req, res)=>{
res.render("index");
});

app.get("/add", (req, res) => {
    res.render("add")

});
app.get("/search", (req, res) => {
    res.render("search")

});
app.get("/update", (req, res) => {
    res.render("update")

});

app.get("/delete", (req, res) => {
    res.render("delete")

});

app.get("/view", (req, res) => {
    let qry = "select * from test ";
    mysql.query(qry, (err, results) => {
        if (err) throw err
        else {
            res.render("view", { data: results });
        }

    });

});

app.get("/addstudent", (req, res) => {
    // fetching data from form
    const { name, phone, email,extra1,extra2,extra3,extra4,extra5,extra6,extra7,extra8,extra9,extra10,extra11,extra12,extra13,extra14, gender } = req.query

    // Sanitization XSS...
    let qry = "select * from test where quizid=? or quizname=?";
    mysql.query(qry, [email, name], (err, results) => {
        if (err)
            throw err
        else {

            if (results.length > 0) {
                res.render("add", { checkmesg: true })
            } else {

                // insert query
                let qry2 = "insert into test values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                mysql.query(qry2, [name, phone, email,extra1,extra2,extra3,extra4,extra5,extra6,extra7,extra8,extra9,extra10,extra11,extra12,extra13,extra14,gender], (err, results) => {
                    if (results.affectedRows > 0) {
                        res.render("add", { mesg: true })
                    }
                })
            }
        }
    })
});

app.get("/searchstudent", (req, res) => {
    // fetch data from the form


    const { email } = req.query;

    let qry = "select * from test where quizid=?";
    mysql.query(qry, [email], (err, results) => {
        if (err) throw err
        else {
            if (results.length > 0) {
                res.render("search", { mesg1: true, mesg2: false })
            } else {

                res.render("search", { mesg1: false, mesg2: true })

            }

        }
    });
})



app.get("/updatesearch", (req, res) => {

    const { email  } = req.query;

    let qry = "select * from test where quizid=?";
    mysql.query(qry, [email ], (err, results) => {
        if (err) throw err
        else {
            if (results.length > 0) {
                res.render("update", { mesg1: true, mesg2: false, data: results })
            } else {

                res.render("update", { mesg1: false, mesg2: true })

            }

        }
    });
})
// fetch data  quizname=?, description=?, q1=?, q1op1=?, q1op2=?, q1op3=?, q1crtopt=? , q2=? , q2op1 =? , q2op2=? ,q2op3 =?, q2crtopt =?,  q3TF=? , q3TFcrtopt =?, q4TF=? , q4TFcrtopt =?, level=?

app.get("/updatestudent", (req, res) => {
    
    const {name, phone, email,extra1,extra2,extra3,extra4,extra5,extra6,extra7,extra8,extra9,extra10,extra11,extra12,extra13,extra14,gender } = req.query;
    let qry = "update test set  quizname=?, description=?, q1=?, q1op1=?, q1op2=?, q1op3=?, q1crtopt=? , q2=? , q2op1 =? , q2op2=? ,q2op3 =?, q2crtopt =?,  q3TF=? , q3TFcrtopt =?, q4TF=? , q4TFcrtopt =?, level=? where  quizid =? ";

    mysql.query(qry, [name, phone, extra1,extra2,extra3,extra4,extra5,extra6,extra7,extra8,extra9,extra10,extra11,extra12,extra13,extra14,gender,email], (err, results) => {
        if (err) throw err
        else {
            if (results.affectedRows > 0) {
                res.render("update", { umesg: true })
            }
        }
    })

});

app.get("/removestudent", (req, res) => {

    // fetch data from the form


    const { email } = req.query;

    let qry = "delete from test where quizid=?";
    mysql.query(qry, [email], (err, results) => {
        if (err) throw err
        else {
            if (results.affectedRows > 0) {
                res.render("delete", { mesg1: true, mesg2: false })
            } else {

                res.render("delete", { mesg1: false, mesg2: true })

            }

        }
    });
});

app.listen(port , (err)=>{
    if(err)
        throw err;
    else 
        console.log("Server is running on %d", port);
})