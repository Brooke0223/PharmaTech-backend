// Reference: https://www.youtube.com/watch?v=T8mqZZ0r-RA
// Utilized and adapted code from this tutorial video, credit to PedroTech


/* SETUP */

// Express
const express = require('express');
const app = express();
PORT = 64265;

const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');


// Database Connection
const db = mysql.createConnection({
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_ryanbro',
    password: '7442',
    database: 'cs340_ryanbro',
});

// Test Database Connection
db.connect(err => {
    if (!err) {
        console.log("Successfully connected to mysql");
    } else {
        console.log("Failed to connect to mysql");
    }
});


// Activate Middleware
app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use(bodyParser.urlencoded({ extended: true }));




/* ROUTES */

// get bsg_people data from the database for table display
// app.get('/', (req, res) => {
//     const select = "SELECT * FROM Patients";
//     db.query(select, (err, result) => {
//         res.send(result)
//     });
// });

app.get('/ViewPatient', (req, res) => {
    const select = "SELECT * FROM Patients";
    db.query(select, (err, result) => {
        res.send(result)
    });
});


app.get('/', (req, res) => {
    const select = "SELECT * FROM Patients";
    db.query(select, (err, result) => {
        res.send(result)
    });
});
// app.get('/', (req, res) => {
//     res.send('hello world')
// });



// post user input values to insert a new person into the database
app.post("/AddPatient", (req, res) => {

    const firstName = req.body.FirstName;
    const middleName = req.body.MiddleName;
    const lastName = req.body.LastName;
    const DOB = req.body.DOB;
    const sex = req.body.Sex;
    const activeStatus = req.body.ActiveStatus;
    const race = req.body.Race;
    const ethnicity = req.body.Ethnicity;

    const insert = "INSERT INTO patients (FirstName, MiddleName, LastName, DOB, Sex, Race, Ethnicity, ActiveStatus VALUES (?,?,?,?,?,?,?,?)"
    db.query(insert, [firstName, middleName, lastName, DOB, sex, activeStatus, race, ethnicity], (err, result) => {
        console.log(result);
    });
});


/* ROUTES */
// app.get('/', function(req, res)
//     {
//         // Define our queries
//         query1 = 'DROP TABLE IF EXISTS diagnostic;';
//         query2 = 'CREATE TABLE diagnostic(id INT PRIMARY KEY AUTO_INCREMENT, text VARCHAR(255) NOT NULL);';
//         query3 = 'INSERT INTO diagnostic (text) VALUES ("MySQL is working!")';
//         query4 = 'SELECT * FROM diagnostic;';

//         // Execute every query in an asynchronous manner, we want each query to finish before the next one starts

//         // DROP TABLE...
//         db.pool.query(query1, function (err, results, fields){

//             // CREATE TABLE...
//             db.pool.query(query2, function(err, results, fields){

//                 // INSERT INTO...
//                 db.pool.query(query3, function(err, results, fields){

//                     // SELECT *...
//                     db.pool.query(query4, function(err, results, fields){

//                         // Send the results to the browser
//                         let base = "<h1>MySQL Results:</h1>"
//                         res.send(base + JSON.stringify(results));
//                     });
//                 });
//             });
//         });
//     });




/* LISTENER */
app.listen(PORT, function(){ 
    console.log('listening on port ' + PORT)
});