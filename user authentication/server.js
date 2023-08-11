const express = require('express');
const mysql = require('mysql2');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

/*
const express = require('express');

const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

*/

app.use(bodyParser.json());

// Create a connection pool
const pool = mysql.createPool({
    host: "localhost",
    user: 'root',
    password: 'St@r1234',
    database:'quizdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
/*
 CREATE TABLE IF NOT EXISTS users (
        username VARCHAR(255) NOT NULL ,
        password VARCHAR(255) NOT NULL,
		emailid VARCHAR(255) NOT NULL ,
        role VARCHAR(255) NOT NULL
            );

*/
// Create users table
const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        userType ENUM('admin', 'user') NOT NULL
    );
`;

pool.query(createUsersTableQuery, (err, results) => {
    if (err) {
        console.error('Error creating users table:', err);
    } else {
        console.log('Users table created successfully');

    }

    pool.query(createUsersTableQuery, (err, results) => {
        if (err) {
            console.error('Error creating users table:', err);
        } else {
            console.log('Users table created successfully');
    
            // Check if there are existing users
            const checkExistingUsersQuery = 'SELECT COUNT(*) AS count FROM users';
            pool.query(checkExistingUsersQuery, (err, result) => {
                if (err) {
                    console.error('Error checking existing users:', err);
                } else {
                    const existingUsersCount = result[0].count;
    
                    if (existingUsersCount === 0) {
                        // Insert default admin and user credentials
                        const insertAdminQuery = `
                            INSERT INTO users (username, password, emailid, role) VALUES ('admin', 'adminpassword','a@gmail.com', 'admin');
                        `;
    
                        const insertUserQuery = `
                            INSERT INTO users (username, password, emailid, role) VALUES ('user', 'userpassword','u@gmail.com' ,'user');
                        `;
    
                        pool.query(insertAdminQuery, (err, result) => {
                            if (err) {
                                console.error('Error inserting admin:', err);
                            } else {
                                console.log('Default admin added successfully');
                            }
                        });
    
                        pool.query(insertUserQuery, (err, result) => {
                            if (err) {
                                console.error('Error inserting user:', err);
                            } else {
                                console.log('Default user added successfully');
                            }
                        });
                    } else {
                        console.log('Existing users found, skipping default credentials creation.');
                    }
                }
            });
        }
    });
    

});
/*
// Check if classes table exists
const checkClassesTableQuery = 'SHOW TABLES LIKE "classes"';
pool.query(checkClassesTableQuery, (err, result) => {
    if (err) {
        console.error('Error checking classes table:', err);
    } else if (result.length === 0) {
        // Create classes table
        // Create classes table
const createClassesTableQuery = `
CREATE TABLE IF NOT EXISTS classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    className VARCHAR(255) NOT NULL
);
`;
        pool.query(createClassesTableQuery, (err, results) => {
            if (err) {
                console.error('Error creating classes table:', err);
            } else {
                console.log('Classes table created successfully');
            }
        });
    }
});

*/



app.use(express.static(path.join(__dirname, 'public')));

// ... (previous code)

app.get('/authenticate', (req, res) => {
    const username = req.query.username;
    const password = req.query.password;

    const authenticateUserQuery = `
        SELECT * FROM users WHERE username = ? AND password = ?
    `;

    pool.query(authenticateUserQuery, [username, password], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        if (results.length === 1) {
            const userType = results[0].userType;

            res.json({ userType });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

app.use('/admin', express.static(__dirname + '/admin_dashbord'));
/*
app.use('/admin', express.static(__dirname + 'admin_dashbord'));
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/public/admin_dashbord/admin_dashboard.html');
});
*/
// Create tables if they don't exist /admin_dashbord/admin_dashboard.html
/*function createTables() {
    const createQuizzesTableQuery = `
        CREATE TABLE IF NOT EXISTS quizzes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            quizId VARCHAR(255) NOT NULL UNIQUE,
            quizName VARCHAR(255) NOT NULL
        );
    `;

    const createQuestionsTableQuery = `
        CREATE TABLE IF NOT EXISTS questions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            quizId INT,
            questionText TEXT NOT NULL,
            options JSON NOT NULL,
            correctAnswers JSON NOT NULL,
            FOREIGN KEY (quizId) REFERENCES quizzes(id) ON DELETE CASCADE
        );
    `;

    pool.query(createQuizzesTableQuery, (err, result) => {
        if (err) {
            console.error('Error creating quizzes table:', err);
        } else {
            console.log('Quizzes table created successfully');
        }
    });

    pool.query(createQuestionsTableQuery, (err, result) => {
        if (err) {
            console.error('Error creating questions table:', err);
        } else {
            console.log('Questions table created successfully');
        }
    });
}

// Ensure tables are created when the server starts
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to database');
        createTables();
        connection.release();
    }
});
/*
app.use('/admin', express.static(__dirname + '/admin_dashbord'));
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/admin_dashbord/admin-dashboard.html');
});

app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/admin/admin-dashboard.html');
});


app.use('/admin/create-quiz', express.static(__dirname + '/create_quiz'));

/*
app.use('/admin/create-quiz', express.static(__dirname + '/admin_dashbord'));
app.get('/admin/create-quiz', (req, res) => {
    res.sendFile(__dirname + '/public/admin_dashbord/create_quiz/create_quiz.html');
});

app.post('/admin/create-quiz', (req, res) => {
    const { quizId, quizName } = req.body;

    const createQuizQuery = `
        INSERT INTO quizzes (quizId, quizName) VALUES (?, ?);
    `;

    pool.query(createQuizQuery, [quizId, quizName], (err, result) => {
        if (err) {
            console.error('Error creating quiz:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            console.log(`Quiz ${quizId} created successfully`);
            res.json({ message: 'Quiz created successfully' });
        }
    });
});


// ... (previous code)

app.use('/admin/add-questions', express.static(__dirname + '/create_quiz'));

/*
app.use('/admin/add-questions', express.static(__dirname + '/admin_dashbord/create_quiz/add-questions'));
app.get('/admin/add-questions', (req, res) => {
    const quizId = req.query.quizId;
    res.sendFile(__dirname + '/public/admin_dashbord/create_quiz/add_questions.html');
});

app.post('/admin/add-question', (req, res) => {
    const { quizId, questionText, options, correctAnswers } = req.body;

    const addQuestionQuery = `
        INSERT INTO questions (quizId, questionText, options, correctAnswers)
        VALUES (?, ?, ?, ?);
    `;

    pool.query(addQuestionQuery, [quizId, questionText, JSON.stringify(options), JSON.stringify(correctAnswers)], (err, result) => {
        if (err) {
            console.error('Error adding question:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            console.log(`Question added to quiz ${quizId}`);
            res.json({ message: 'Question added successfully' });
        }
    });
});
*/

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
