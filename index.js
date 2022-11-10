// Reference: https://www.youtube.com/watch?v=T8mqZZ0r-RA
// Utilized and adapted code from this tutorial video, credit to PedroTech



/* SETUP */


// Express
const express = require('express');
const app = express();
PORT = 44265;

// Dependencies
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

//GET all patients in database
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


//GET a specific patient in database
app.get('/FindPatient/:id', (req, res) => {
    const { id } = req.params

    const sql = `SELECT * FROM Patients WHERE PatientID = '${id}'`
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
        res.send(result)
    });
});



//modify (PUT) a patient in the database
app.put('/EditPatient/:id', (req, res) => {
    const { id } = req.params

    const firstName = req.body.FirstName;
    const middleName = req.body.MiddleName;
    const lastName = req.body.LastName;
    const DOB = req.body.DOB;
    const sex = req.body.Sex;
    const activeStatus = req.body.ActiveStatus;
    const race = req.body.Race;
    const ethnicity = req.body.Ethnicity;


    const sql = `UPDATE Patients SET FirstName='${firstName}', MiddleName='${middleName}', LastName='${lastName}', DOB='${DOB}', Sex='${sex}', ActiveStatus='${activeStatus}', Race='${race}', Ethnicity='${ethnicity}' WHERE PatientID='${id}'`
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
        res.send(result)
    });
});



// ADD new patient to the database
app.post("/AddPatient", (req, res) => {

    const firstName = req.body.FirstName;
    const middleName = req.body.MiddleName;
    const lastName = req.body.LastName;
    const DOB = req.body.DOB;
    const sex = req.body.Sex;
    const activeStatus = req.body.ActiveStatus;
    const race = req.body.Race;
    const ethnicity = req.body.Ethnicity;

    const sql = `INSERT INTO Patients (FirstName, MiddleName, LastName, DOB, Sex, Race, Ethnicity, ActiveStatus) VALUES ('${firstName}', '${middleName}', '${lastName}', '${DOB}', '${sex}', '${activeStatus}', '${race}', '${ethnicity}')`
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
    });
});


// DELETE patient from database
app.delete("/DeletePatient/:id", (req, res) => {

    const { id } = req.params

    const sql = `DELETE FROM Patients WHERE PatientID = '${id}'`
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
    });
});



/* LISTENER */
app.listen(PORT, function(){ 
    console.log('listening on port ' + PORT)
});