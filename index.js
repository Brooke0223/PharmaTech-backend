// Citation #1 for server code (entire module):
// Date: 11/08/2022
// Adapted from:
// Source URL: https://canvas.oregonstate.edu/courses/1890458/assignments/8930021?module_item_id=22339292

// Citation #2 for server code (entire module):
// Date: 11/09/2022
// Adapted from:
// Source URL: https://github.com/abkamand/cs340-react-test-app-v2/blob/master/Back-End/index.js
// Credit to Andrew Bassam Kamand



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
// const db = mysql.createConnection({
//     host: 'classmysql.engr.oregonstate.edu',
//     user: 'cs340_ryanbro',
//     password: '7442',
//     database: 'cs340_ryanbro',
// });

// const db = mysql.createConnection({
//     host: 'sql9.freesqldatabase.com',
//     user: 'sql9587275',
//     password: 'LTR9j9UjLt',
//     database: 'sql9587275',
// });

const db = mysql.createConnection({
    host: 'db4free.net',
    port: 3306,
    user: 'brooke0223',
    password: 'uRd4_LzZKCX!Sdp',
    database: 'sql5535',
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
        console.log(result);
        console.log(err);
        if (err){
            res.status(500).send(err);
        }
        else{
            res.send(result);
        }            
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
    const sql = `SELECT ContactID, Contact_Methods.PatientID, CONCAT(Patients.FirstName, ' ', Patients.LastName) as PatientName, Phone, PhoneType, PhoneOpt, Email, EmailOpt, AddressStreet, AddressCity, AddressState, AddressZip, MailOpt 
                FROM Contact_Methods
                JOIN Patients on Contact_Methods.PatientID = Patients.PatientID`;
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
        res.send(result)
    });
});

//GET all facilities in database
app.get('/ViewFacility', (req, res) => {
    const sql = "SELECT FacilityID, FacilityName, FacilityType, AddressStreet, AddressCity, AddressState, AddressZip FROM Facilities";
    db.query(sql, (err, result) => {
        res.send(result)
    });
});

//GET all providers in database
app.get('/ViewProvider', (req, res) => {
    const sql = "SELECT ProviderID, FirstName, LastName, NPI, Designation FROM Providers";
    db.query(sql, (err, result) => {
        res.send(result)
    });
});

//GET all providers associated with facilities
app.get('/ViewProviderFacility', (req, res) => {
    const sql = `SELECT ProvidersFacilitiesID, Providers.ProviderID, CONCAT(Providers.FirstName, ' ', Providers.LastName) as ProviderName, Facilities.FacilityID, Facilities.FacilityName 
                FROM Providers_Facilities
                JOIN Providers on Providers_Facilities.ProviderID = Providers.ProviderID
                JOIN Facilities on Providers_Facilities.FacilityID = Facilities.FacilityID`;
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
        res.send(result)
    });
});

//GET all products in database
app.get('/ViewProduct', (req, res) => {
    const sql = "SELECT ProductID, ProductType, NDC, Lot, Expiration, DoseVolume, DoseUnit FROM Products";
    db.query(sql, (err, result) => {
        res.send(result)
    });
});

//GET all products associated with facilities
app.get('/ViewProductFacility', (req, res) => {
    const sql = `SELECT ProductsFacilitiesID, Products_Facilities.ProductID, ProductType, Products_Facilities.FacilityID, Facilities.FacilityName, DoseQty, Products.Expiration
                FROM Products_Facilities
                JOIN Products on Products_Facilities.ProductID = Products.ProductID
                JOIN Facilities on Products_Facilities.FacilityID = Facilities.FacilityID`;
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
        res.send(result)
    });
});

//GET all events in database
app.get('/ViewEvent', (req, res) => {
    const sql = `SELECT EventID, PatientID, EventType, EventDate, SubmissionDate, ProductID, AdministrationSite, AdministrationRoute, ProviderID, FacilityID, Notes 
    FROM Events`;
    db.query(sql, (err, result) => {
        res.send(result)
    });
});


//GET specific patient(s) in database
app.post('/SearchPatient', (req, res) => {
    
    const patientID = req.body.PatientID;
    const firstName = req.body.FirstName;
    const middleName = req.body.MiddleName;
    const lastName = req.body.LastName;
    const DOB = req.body.DOB;
    const status = req.body.Status;

    const address = req.body.Address;
    const city = req.body.City;
    const state = req.body.State;
    const zip = req.body.Zip;
    const email = req.body.Email;
    const phone = req.body.Phone;
    // const email = (req.body.Email !== '') ? req.body.Email : null;


    //Define SUBQUERY (i.e. search any Patient parameters that are being passed, ignoring empty values)
    const subquery = 
        `(SELECT Patients.PatientID, FirstName, MiddleName, LastName, DOB, Sex, Race, Ethnicity, ActiveStatus, AddressStreet, AddressCity, AddressState, AddressZip, Phone, Email
        FROM Patients 
        LEFT JOIN Contact_Methods ON Patients.PatientID = Contact_Methods.PatientID
        WHERE (
            Patients.PatientID = IFNULL(${ (patientID !== '') ? `'${patientID}'` : null}, Patients.PatientID) 
            AND FirstName = IFNULL(${ (firstName !== '') ? `'${firstName}'` : null}, FirstName)
            AND MiddleName = IFNULL(${ (middleName !== '') ? `'${middleName}'` : null}, MiddleName)
            AND LastName = IFNULL(${ (lastName !== '') ? `'${lastName}'` : null}, LastName)
            AND DOB = IFNULL(${ (DOB !== '') ? `'${DOB}'` : null}, DOB)
            AND ActiveStatus = IFNULL(${ (status !== '') ? `'${status}'` : null}, ActiveStatus)
        )) subquery`
    
    

    //Define WHERE clauses (i.e. search any Contact_Methods parameters that are being passed, ignoring empty values)
    var listOfWhereClauses = []

    if(address !== ''){
        listOfWhereClauses.push(`AND AddressStreet='${address}'`)
    }
    if(city !== ''){
        listOfWhereClauses.push(`AND AddressCity='${city}'`)
    }
    if(state !== ''){
        listOfWhereClauses.push(`AND AddressState='${state}'`)
    }
    if(zip !== ''){
        listOfWhereClauses.push(`AND AddressZip='${zip}'`)
    }
    if(email !== ''){
        listOfWhereClauses.push(`AND Email='${email}'`)
    }
    if(phone !== ''){
        listOfWhereClauses.push(`AND Phone='${phone}'`)
    }
    
    //Only the first "WHERE" clause should be preceeded by 'AND' keyword
    if(listOfWhereClauses.length >0){
    listOfWhereClauses[0] = listOfWhereClauses[0].replace('AND ','')
    }

    //Convert listofWhereClauses to string
    const whereClause = listOfWhereClauses.length > 0 ? `WHERE (${listOfWhereClauses.join(' ')})` : ''
        

    const sql = `Select DISTINCT PatientID, FirstName, MiddleName, LastName, DOB, Sex, Race, Ethnicity, ActiveStatus
                FROM ${subquery}
                ${whereClause}`

    
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
        res.send(result)
    });
});



//GET specific facilities in database
app.post('/SearchFacility', (req, res) => {
    const facilityName = req.body.FacilityName;
    const facilityType = req.body.FacilityType;
    const city = req.body.City;
    const state = req.body.State;
    const providerFirstName = req.body.ProviderFirstName;
    const providerLastName = req.body.ProviderLastName;
    const productType = req.body.ProductType;
    const productNDC = req.body.NDC;

    const subquery = 
    `(SELECT Facilities.FacilityID, FacilityName, FacilityType, AddressStreet, AddressCity, AddressState, AddressZip, Products.ProductType, Products.NDC
        FROM Facilities
        LEFT JOIN Products_Facilities ON Facilities.FacilityID = Products_Facilities.FacilityID
        LEFT JOIN Products ON Products_Facilities.ProductID = Products.ProductID
    )subquery`


    //Define WHERE clauses (i.e. search any parameters that are being passed, ignoring empty values)
    var listOfWhereClauses = []

    if(facilityName !== ''){
        listOfWhereClauses.push(`AND subquery.FacilityName ='${facilityName}'`)
    }
    if(facilityType !== ''){
        listOfWhereClauses.push(`AND subquery.FacilityType ='${facilityType}'`)
    }
    if(city !== ''){
        listOfWhereClauses.push(`AND subquery.AddressCity ='${city}'`)
    }
    if(state !== ''){
        listOfWhereClauses.push(`AND subquery.AddressState ='${state}'`)
    }
    if(providerFirstName !== ''){
        listOfWhereClauses.push(`AND Providers.FirstName ='${providerFirstName}'`)
    }
    if(providerLastName !== ''){
        listOfWhereClauses.push(`AND Providers.LastName ='${providerLastName}'`)
    }
    if(productType !== ''){
        listOfWhereClauses.push(`AND subquery.ProductType ='${productType}'`)
    }
    if(productNDC !== ''){
        listOfWhereClauses.push(`AND subquery.NDC ='${productNDC}'`)
    }

    //Only the first "WHERE" clause should be preceeded by 'AND' keyword
    if(listOfWhereClauses.length >0){
        listOfWhereClauses[0] = listOfWhereClauses[0].replace('AND ','')
        }
    
    //Convert listofWhereClauses to string
    const whereClause = listOfWhereClauses.length > 0 ? `WHERE (${listOfWhereClauses.join(' ')})` : ''

    const sql = `SELECT DISTINCT subquery.FacilityID, FacilityName, FacilityType, AddressStreet, AddressCity, AddressState, AddressZip
    FROM ${subquery}
    LEFT JOIN Providers_Facilities ON subquery.FacilityID = Providers_Facilities.FacilityID
    LEFT JOIN Providers ON Providers_Facilities.ProviderID = Providers.ProviderID
    ${whereClause}`

    
    db.query(sql, (err, result) => {
    console.log(result);
    console.log(err);
    res.send(result)
    });
})



//GET specific provider(s) in database
app.post('/SearchProvider', (req, res) => {
    
    const firstName = req.body.FirstName;
    const lastName = req.body.LastName;
    const NPI = req.body.NPI;
    const designation = req.body.Designation;

    const facilityName = req.body.FacilityName;
    const city = req.body.City;
    const state = req.body.State;
 
    //Define SUBQUERY (i.e. search any Provider parameters that are being passed, ignoring empty values)
    const subquery = 
        `(SELECT Providers.ProviderID, FirstName, LastName, NPI, Designation, FacilityName, AddressCity, AddressState
        FROM Providers
        LEFT JOIN Providers_Facilities ON Providers.ProviderID = Providers_Facilities.ProviderID
        LEFT JOIN Facilities ON Providers_Facilities.FacilityID = Facilities.FacilityID
        WHERE (
            FirstName = IFNULL(${ (firstName !== '') ? `'${firstName}'` : null}, FirstName)
            AND LastName = IFNULL(${ (lastName !== '') ? `'${lastName}'` : null}, LastName)
            AND NPI = IFNULL(${ (NPI !== '') ? `'${NPI}'` : null}, NPI)
            AND Designation = IFNULL(${ (designation !== '') ? `'${designation}'` : null}, Designation)
        )) subquery`
    
    

    //Define WHERE clauses (i.e. search any Facility parameters that are being passed, ignoring empty values)
    var listOfWhereClauses = []

    if(facilityName !== ''){
        listOfWhereClauses.push(`AND FacilityName='${facilityName}'`)
    }
    if(city !== ''){
        listOfWhereClauses.push(`AND AddressCity='${city}'`)
    }
    if(state !== ''){
        listOfWhereClauses.push(`AND AddressState='${state}'`)
    }
    
    
    //Only the first "WHERE" clause should be preceeded by 'AND' keyword
    if(listOfWhereClauses.length >0){
    listOfWhereClauses[0] = listOfWhereClauses[0].replace('AND ','')
    }

    //Convert listofWhereClauses to string
    const whereClause = listOfWhereClauses.length > 0 ? `WHERE (${listOfWhereClauses.join(' ')})` : ''
        

    const sql = `Select DISTINCT subquery.ProviderID, FirstName, LastName, NPI, Designation
                FROM ${subquery}
                ${whereClause}`
    
    console.log("myquery",sql);

    
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
        res.send(result)
    });
});


//GET specific product(s) in database
app.post('/SearchProduct', (req, res) => {
    
    const productType = req.body.Type;
    const NDC = req.body.NDC;
    const lot = req.body.Lot;
    const expiration = req.body.Expiration;

    const facilityName = req.body.FacilityName;
    const city = req.body.City;
    const state = req.body.State;
    const zip = req.body.Zip;
 
    //Define SUBQUERY (i.e. search any Product parameters that are being passed, ignoring empty values)
    const subquery = 
        `(SELECT Products.ProductID, ProductType, NDC, Lot, Products.Expiration, DoseVolume, DoseUnit, FacilityName, AddressCity, AddressState, AddressZip
        FROM Products
        LEFT JOIN Products_Facilities ON Products.ProductID = Products_Facilities.ProductID
        LEFT JOIN Facilities ON Products_Facilities.FacilityID = Facilities.FacilityID
        WHERE (
            ProductType = IFNULL(${ (productType !== '') ? `'${productType}'` : null}, ProductType)
            AND NDC = IFNULL(${ (NDC !== '') ? `'${NDC}'` : null}, NDC)
            AND Lot = IFNULL(${ (lot !== '') ? `'${lot}'` : null}, Lot)
            AND Products.Expiration = IFNULL(${ (expiration !== '') ? `'${expiration}'` : null}, Products.Expiration)
        )) subquery`
    
    

    //Define WHERE clauses (i.e. search any Facility parameters that are being passed, ignoring empty values)
    var listOfWhereClauses = []

    if(facilityName !== ''){
        listOfWhereClauses.push(`AND FacilityName='${facilityName}'`)
    }
    if(city !== ''){
        listOfWhereClauses.push(`AND AddressCity='${city}'`)
    }
    if(state !== ''){
        listOfWhereClauses.push(`AND AddressState='${state}'`)
    }
    if(zip !== ''){
        listOfWhereClauses.push(`AND AddressZip='${zip}'`)
    }
    
    
    //Only the first "WHERE" clause should be preceeded by 'AND' keyword
    if(listOfWhereClauses.length >0){
    listOfWhereClauses[0] = listOfWhereClauses[0].replace('AND ','')
    }

    //Convert listofWhereClauses to string
    const whereClause = listOfWhereClauses.length > 0 ? `WHERE (${listOfWhereClauses.join(' ')})` : ''
        

    const sql = `Select DISTINCT subquery.ProductID, ProductType, NDC, Lot, Expiration, DoseVolume, DoseUnit
                FROM ${subquery}
                ${whereClause}`
    
    console.log("myquery",sql);

    
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
        res.send(result)
    });
});



//GET specific event(s) in database
app.post('/SearchEvent', (req, res) => {
    
    const firstName = req.body.FirstName;
    const middleName = req.body.MiddleName;
    const lastName = req.body.LastName;
    const DOB = req.body.DOB;
    const patientID = req.body.PatientID;
    const status = req.body.Status;

    const facilityName = req.body.FacilityName;
    const city = req.body.FacilityCity;
    const state = req.body.FacilityState;
    const zip = req.body.FacilityZip;
    console.log(req.body);
 
    const sql = `
    SELECT EventID, Events.PatientID, EventType, EventDate, SubmissionDate, ProductID, AdministrationSite, AdministrationRoute, ProviderID, Events.FacilityID, Notes FROM Events 
    JOIN Patients ON Events.PatientID = Patients.PatientID
    WHERE (
        FirstName = IFNULL(${ (firstName !== '') ? `'${firstName}'` : null}, FirstName)
        AND LastName = IFNULL(${ (lastName !== '') ? `'${lastName}'` : null}, LastName)
        AND DOB = IFNULL(${ (DOB !== '') ? `'${DOB}'` : null}, DOB)
        AND IFNULL(MiddleName, '') = IFNULL(${ (middleName !== '') ? `'${middleName}'` : null}, IFNULL(MiddleName, ''))
        AND Patients.PatientID = IFNULL(${ (patientID !== '') ? `'${patientID}'` : null}, Patients.PatientID)
        AND ActiveStatus = IFNULL(${ (status !== '') ? `'${status}'` : null}, ActiveStatus)
    ) 
    AND Events.EventID IN (
        SELECT Events.EventID FROM Events
        LEFT JOIN Facilities ON Events.FacilityID = Facilities.FacilityID 
        WHERE (
            FacilityName = IFNULL(${ (facilityName !== '') ? `'${facilityName}'` : null}, FacilityName)
            AND AddressCity = IFNULL(${ (city !== '') ? `'${city}'` : null}, AddressCity)
            AND AddressState = IFNULL(${ (state !== '') ? `'${state}'` : null}, AddressState)
            AND AddressZip = IFNULL(${ (zip !== '') ? `'${zip}'` : null}, AddressZip)            
        )
    )`
    
    console.log("myquery",sql);

    
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
        res.send(result)
    });
});



//GET a specific patient in database matching patientID in the query parameter
app.get('/FindPatient/:id', (req, res) => {
    const { id } = req.params

    const sql = `SELECT PatientID, FirstName, MiddleName, LastName, DOB, Sex, Race, Ethnicity, ActiveStatus FROM Patients WHERE PatientID = '${id}'`
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
        res.send(result)
    });
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

    const sql = `SELECT FacilityID, FacilityName, FacilityType, AddressStreet, AddressCity, AddressState, AddressZip FROM Facilities WHERE FacilityID = '${id}'`
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
        res.send(result)
    });
});


//GET a specific provider in database
app.get('/FindProvider/:id', (req, res) => {
    const { id } = req.params

    const sql = `SELECT ProviderID, FirstName, LastName, NPI, Designation FROM Providers WHERE ProviderID = '${id}'`
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
        res.send(result)
    });
});


//GET a specific product in database
app.get('/FindProduct/:id', (req, res) => {
    const { id } = req.params

    const sql = `SELECT ProductID, ProductType, NDC, Lot, Expiration, DoseVolume, DoseUnit FROM Products WHERE ProductID = '${id}'`
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
        res.send(result)
    });
});


//GET a specific product at a facility in database
app.get('/FindProductFacility/:id', (req, res) => {
    const { id } = req.params

    const sql = `SELECT Products.ProductID, ProductType, Facilities.FacilityID, FacilityName, DoseQty, Products.Expiration FROM Products_Facilities 
    JOIN Products ON Products_Facilities.ProductID = Products.ProductID
    JOIN Facilities ON Products_Facilities.FacilityID = Facilities.FacilityID
    WHERE ProductsFacilitiesID = '${id}'`
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
        res.send(result)
    });
});

//GET a specific event in database
app.get('/FindEvent/:id', (req, res) => {
    const { id } = req.params

    const sql = `SELECT EventID, PatientID, EventType, EventDate, SubmissionDate, ProductID, AdministrationSite, AdministrationRoute, ProviderID, FacilityID, Notes FROM Events WHERE EventID = '${id}'`
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
        if (err){
            res.status(500).send(err);
        }
        else{
            res.send(result);
        }       
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
        if (err){
            res.status(500).send(err);
        }
        else{
            res.send(result);
        }       
    });
});


// DELETE provider from database
app.delete("/DeleteProvider/:id", (req, res) => {

    const { id } = req.params

    const sql = `DELETE FROM Providers WHERE ProviderID = '${id}'`
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
        if (err){
            res.status(500).send(err);
        }
        else{
            res.send(result);
        }       
    });
});


// DELETE a facility/provider relationship 
app.delete("/DeleteProviderFacility/:id", (req, res) => {

    const { id } = req.params

    const sql = `DELETE FROM Providers_Facilities WHERE ProvidersFacilitiesID = '${id}'`
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
    });
});

// DELETE a product from database
app.delete("/DeleteProduct/:id", (req, res) => {

    const { id } = req.params

    const sql = `DELETE FROM Products WHERE ProductID = '${id}'`
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
        if (err){
            res.status(500).send(err);
        }
        else{
            res.send(result);
        }       
    });
});

// DELETE a product from a facility
app.delete("/DeleteProductFacility/:id", (req, res) => {

    const { id } = req.params

    const sql = `DELETE FROM Products_Facilities WHERE ProductsFacilitiesID = '${id}'`
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
    });
});


// DELETE an event from database
app.delete("/DeleteEvent/:id", (req, res) => {

    const { id } = req.params

    const sql = `DELETE FROM Events WHERE EventID = '${id}'`
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
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


// modify (PUT) an exisitng provider in the database
app.put('/EditProvider/:id', (req, res) => {
    const { id } = req.params

    const firstName = req.body.FirstName;
    const lastName = req.body.LastName;
    const NPI = req.body.NPI;
    const designation = req.body.Designation;

    const sql = `UPDATE Providers SET FirstName = '${firstName}', LastName = '${lastName}', NPI = '${NPI}', Designation = '${designation}' WHERE ProviderID = '${id}'`
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
        res.send(result)
    });
});


// modify (PUT) an exisitng product in the database
app.put('/EditProduct/:id', (req, res) => {
    const { id } = req.params

    const productType = req.body.ProductType;
    const NDC = req.body.NDC;
    const lot = req.body.Lot;
    const expiration = req.body.Expiration;
    const doseVolume = req.body.DoseVolume;
    const doseUnit = req.body.DoseUnit; 

    const sql = `UPDATE Products SET ProductType = '${productType}', NDC = '${NDC}', Lot = '${lot}', Expiration = '${expiration}', DoseVolume = '${doseVolume}', DoseUnit = '${doseUnit}' WHERE ProductID = '${id}'`
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
        res.send(result)
    });
});


// modify (PUT) an exisitng product at a facility in the database
app.put('/EditProductFacility/:id', (req, res) => {
    const { id } = req.params

    const doseQty = req.body.DoseQty;
    const expiration = req.body.Expiration;

    const sql = `UPDATE Products_Facilities SET DoseQty = '${doseQty}', Expiration = '${expiration}' WHERE ProductsFacilitiesID = '${id}'`
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
        res.send(result)
    });
});

// modify (PUT) an existing event in the database 
app.put('/EditEvent/:id', (req, res) => {
    const { id } = req.params

    const patientID = req.body.PatientID;
    const eventType = req.body.EventType;
    const eventDate = req.body.EventDate;
    const productID = req.body.ProductID;
    const administrationSite = req.body.AdministrationSite;
    const administrationRoute = req.body.AdministrationRoute;
    const providerID = req.body.ProviderID;
    const facilityID = req.body.FacilityID;
    const notes = req.body.Notes;

    const sql = `UPDATE Events SET PatientID = '${patientID}', EventType = '${eventType}', EventDate = '${eventDate}', ProductID = '${productID}', AdministrationSite = '${administrationSite}', 
            AdministrationRoute = '${administrationRoute}', ProviderID = '${providerID}', FacilityID = '${facilityID}', Notes = '${notes}' WHERE EventID = '${id}'`
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


// ADD new provider to the database 
app.post("/AddProvider", (req, res) => {

    const firstName = req.body.FirstName;
    const lastName = req.body.LastName;
    const NPI = req.body.NPI;
    const designation = req.body.Designation;

    const sql = `INSERT INTO Providers (FirstName, LastName, NPI, Designation) VALUES ('${firstName}', '${lastName}', '${NPI}', '${designation}')`
    console.log(sql)
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
    });
});


// ADD a provider to a specific facility
app.post("/AddProviderFacility", (req, res) => {

    const providerID = req.body.ProviderID;
    const facilityID = req.body.FacilityID;

    const sql = `INSERT INTO Providers_Facilities (ProviderID, FacilityID) VALUES ('${providerID}', '${facilityID}')`
    console.log(sql)
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
        if (err){
            res.status(500).send(err);
        }
        else{
            res.send(result);
        }        
    });
});


// ADD new product to the database 
app.post("/AddProduct", (req, res) => {

    const productType = req.body.ProductType;
    const NDC = req.body.NDC;
    const lot = req.body.Lot;
    const expiration = req.body.Expiration;
    const doseVolume = req.body.DoseVolume;
    const doseUnit = req.body.DoseUnit;

    const sql = `INSERT INTO Products (ProductType, NDC, Lot, Expiration, DoseVolume, DoseUnit) VALUES ('${productType}', '${NDC}', '${lot}', '${expiration}', '${doseVolume}', '${doseUnit}')`
    console.log(sql)
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
    });
});

// ADD a product to a specific facility
app.post("/AddProductFacility", (req, res) => {

    const productID = req.body.ProductID;
    const facilityID = req.body.FacilityID;
    const doseQty = req.body.DoseQty;
    const expiration = req.body.Expiration;

    const sql = `INSERT INTO Products_Facilities (ProductID, FacilityID, DoseQty, Expiration) VALUES ('${productID}', '${facilityID}', '${doseQty}', '${expiration}')`
    console.log(sql)
    db.query(sql, (err, result) => {
        console.log(result);
        console.log(err);
        if (err){
            res.status(500).send(err);
        }
        else{
            res.send(result);
        }        
    });
});

// ADD new event to the database 
app.post("/AddEvent", (req, res) => {

    const patientID = req.body.PatientID;
    const eventType = req.body.EventType;
    const eventDate = req.body.EventDate;
    const submissionDate = req.body.SubmissionDate;
    const productID = req.body.ProductID;
    const administrationSite = req.body.AdministrationSite;
    const administrationRoute = req.body.AdministrationRoute;
    const providerID = req.body.ProviderID;
    const facilityID = req.body.FacilityID;
    const notes = req.body.Notes;

    const sql = `INSERT INTO Events (PatientID, EventType, EventDate, SubmissionDate, ProductID, AdministrationSite, AdministrationRoute, ProviderID, FacilityID, Notes) 
    VALUES ('${patientID}', '${eventType}', '${eventDate}', '${submissionDate}', '${productID}', '${administrationSite}', '${administrationRoute}', ${ (providerID !== '') ? `'${providerID}'` : null},  ${ (facilityID !== '') ? `'${facilityID}'` : null}, '${notes}')`
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
