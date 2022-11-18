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
    const select = "SELECT PatientID, FirstName, MiddleName, LastName, DOB, Sex, Race, Ethnicity, ActiveStatus FROM Patients";
    db.query(select, (err, result) => {
        res.send(result)
    });
});

app.get('/', (req, res) => {
    const select = "SELECT PatientID, FirstName, MiddleName, LastName, DOB, Sex, Race, Ethnicity, ActiveStatus FROM Patients";
    db.query(select, (err, result) => {
        res.send(result)
    });
});


//GET all contacts in database
app.get('/ViewContact', (req, res) => {
    const sql = "SELECT * FROM Contact_Methods";
    db.query(sql, (err, result) => {
        res.send(result)
    });
});

//GET all facilities in database
app.get('/ViewFacility', (req, res) => {
    const sql = "SELECT * FROM Facilities";
    db.query(sql, (err, result) => {
        res.send(result)
    });
});





//GET a specific patient in database matching patientID in the query parameter
app.get('/FindPatient/:id', (req, res) => {
    const { id } = req.params

    const sql = `SELECT * FROM Patients WHERE PatientID = '${id}'`
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
        res.send(result)
    });
});


//GET specific patient(s) in database matching req parameters
app.post('/SearchPatient', (req, res) => {
    
    const patientID = req.body.PatientID;
    const firstName = req.body.FirstName;
    const middleName = req.body.MiddleName;
    const lastName = req.body.LastName;
    const DOB = req.body.DOB;
    const address = req.body.Address;
    const city = req.body.City;
    const state = req.body.State;
    const zip = req.body.Zip;
    const email = req.body.Email;
    // const email = (req.body.Email !== '') ? req.body.Email : null;


    const sql = `SELECT Patients.PatientID, FirstName, MiddleName, LastName, DOB, Sex, Race, Ethnicity, ActiveStatus FROM Patients 
        JOIN Contact_Methods ON Patients.PatientID = Contact_Methods.PatientID
        WHERE (
        Patients.PatientID = IFNULL('${patientID}', Patients.PatientID) 
        AND FirstName = IFNULL('${firstName}', FirstName)
        AND MiddleName = IFNULL(middleName, '') = IFNULL('${middleName}', IFNULL(MiddleName, ''))
        AND LastName = IFNULL('${lastName}', LastName)
        AND DOB = IFNULL('${DOB}', DOB)
        AND AddressStreet = IFNULL(addressStreet, '') = IFNULL('${addressStreet}', IFNULL(AddressStreet, ''))
        AND AddressCity = IFNULL(addressCity, '') = IFNULL('${addressCity}', IFNULL(AddressCity, ''))
        AND AddressState = IFNULL(addressState, '') = IFNULL('${addressState}', IFNULL(AddressState, ''))
        AND AddressZip = IFNULL(addressZip, '') = IFNULL('${addressZip}', IFNULL(AddressZip, ''))
        AND Email = IFNULL(email, '') = IFNULL('${email}', IFNULL(Email, ''))
        )`

        console.log(sql)
    // db.query(sql, (err, result) => {
    //     console.log(result);
    //     console.log(err);
    //     res.send(result)
    // });
});


//GET a specific contact in database
app.get('/FindContact/:id', (req, res) => {
    const { id } = req.params

    const sql = `SELECT * FROM Contact_Methods WHERE ContactID = '${id}'`
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
        res.send(result)
    });
});


//GET a specific facility in database
app.get('/FindFacility/:id', (req, res) => {
    const { id } = req.params

    const sql = `SELECT * FROM Facilities WHERE FacilityID = '${id}'`
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
        res.send(result)
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

// DELETE contact from database
app.delete("/DeleteContact/:id", (req, res) => {

    const { id } = req.params

    const sql = `DELETE FROM Contact_Methods WHERE ContactID = '${id}'`
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
    });
});


// DELETE facility from database
app.delete("/DeleteFacility/:id", (req, res) => {

    const { id } = req.params

    const sql = `DELETE FROM Facilities WHERE FacilityID = '${id}'`
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
        if(err){
            res.sendStatus(500)
        }
    });
});





//modify (PUT) an existing patient in the database
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

//modify (PUT) an existing contact in the database
app.put('/EditContact/:id', (req, res) => {
    const { id } = req.params

    const address = req.body.Address;
    const city = req.body.City;
    const state = req.body.State;
    const zip = req.body.Zip;
    const phone = req.body.Phone;
    const phoneType = req.body.PhoneType;
    const email = req.body.Email;
    const emailOpt = req.body.EmailOpt;
    const phoneOpt = req.body.PhoneOpt;
    const mailOpt = req.body.MailOpt;

    const sql = `UPDATE Contact_Methods SET Phone='${phone}', PhoneType='${phoneType}', PhoneOpt='${phoneOpt}', Email='${email}', EmailOpt='${emailOpt}', AddressStreet='${address}', AddressCity='${city}', AddressState='${state}', AddressZip='${zip}', MailOpt='${mailOpt}' WHERE ContactID='${id}'`
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
        res.send(result)
    });
});


//modify (PUT) an existing facility in the database
app.put('/EditFacility/:id', (req, res) => {
    const { id } = req.params

    const name = req.body.Name;
    const type = req.body.Type;
    const address = req.body.Address;
    const city = req.body.City;
    const state = req.body.State;
    const zip = req.body.Zip;

    const sql = `UPDATE Facilities SET FacilityName='${name}', FacilityType='${type}', AddressStreet='${address}', AddressCity='${city}', AddressState='${state}', AddressZip='${zip}' WHERE FacilityID='${id}'`
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

    const sql = `INSERT INTO Patients (FirstName, MiddleName, LastName, DOB, Sex, Race, Ethnicity, ActiveStatus) VALUES ('${firstName}', '${middleName}', '${lastName}', '${DOB}', '${sex}', '${race}', '${ethnicity}', '${activeStatus}')`
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
    });
});


// ADD new contact to the database
app.post("/AddContact", (req, res) => {

    const patientID = req.body.PatientID;
    const address = req.body.Address;
    const city = req.body.City;
    const state = req.body.State;
    const zip = req.body.Zip;
    const phone = req.body.Phone;
    const phoneType = req.body.PhoneType;
    const email = req.body.Email;
    const emailOpt = req.body.EmailOpt;
    const phoneOpt = req.body.PhoneOpt;
    const mailOpt = req.body.MailOpt;

    const sql = `INSERT INTO Contact_Methods (PatientID, Phone, PhoneType, PhoneOpt, Email, EmailOpt, AddressStreet, AddressCity, AddressState, AddressZip, MailOpt) VALUES ('${patientID}', '${phone}', '${phoneType}', '${phoneOpt}', '${email}', '${emailOpt}', '${address}', '${city}', '${state}', '${zip}', '${mailOpt}')`
    console.log(sql)
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
    });
});


// ADD new facility to the database
app.post("/AddFacility", (req, res) => {

    const name = req.body.Name;
    const type = req.body.Type;
    const address = req.body.Address;
    const city = req.body.City;
    const state = req.body.State;
    const zip = req.body.Zip;

    const sql = `INSERT INTO Facilities (FacilityName, FacilityType, AddressStreet, AddressCity, AddressState, AddressZip) VALUES ('${name}', '${type}', '${address}', '${city}', '${state}', '${zip}')`
    console.log(sql)
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
    });
});




/* LISTENER */
app.listen(PORT, function(){ 
    console.log('listening on port ' + PORT)
});
