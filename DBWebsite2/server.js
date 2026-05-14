// server.js
const express = require("express"); // express is a popular web framework for Node.js that simplifies the process of building web applications and APIs. It provides a robust set of features for handling HTTP requests, routing, middleware, and more.
const sqlite3 = require("sqlite3").verbose(); // sqlite3 is a library that allows you to interact with SQLite databases from Node.js. The verbose() method enables detailed error messages and debugging information, which can be helpful during development.

const app = express(); // create an instance of the Express application
const PORT = 3000;  // define the port number that the server will listen on
const DBFILE = "data/college.db"; // define the name of the SQLite database file that will be used to store application data

// -- Middleware ---
app.use(express.urlencoded({ extended: true })); // needed to extract form data sent (posted) by the client
app.use(express.json());         // need this to parse JSON bodies sent by the client
app.use(express.static(__dirname));   // serve HTML, CSS, images, etc.

// note req and res are the request and response objects that Express provides to handle incoming requests and send responses back to the client
// returning our "home page" when the user visits the root URL
app.get('/',(req, res) =>{
    res.sendFile(__dirname + '/index.html');
});


// -- Initialize / open the database ---
const db = new sqlite3.Database(DBFILE, err => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Successfully opened database');
    }
});

//Create the applications table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    applicantName TEXT,
    email TEXT,
    courseName TEXT,
    level TEXT,
    appliedAt TEXT
)`, 
    err => {
    if (err) {
        console.error('Error creating applications table:', err);
    }
    else {
        console.log('Applications table is ready');
    }
});




app.get("/currentDateTime", (req, res) => {
    const currentDateTime = getCurrentDateTime();
    res.send(`<h1>Current Date and Time</h1><p>${currentDateTime}</p>`);
});

// Example of a dynamic route that takes a user name as a parameter
app.get("/greeting/:firstName/:lastName", (req, res) => {
    const firstName = req.params.firstName; // extract the firstName parameter from the URL
    const lastName = req.params.lastName; // extract the lastName parameter from the URL
    res.send(`<h1>${firstName} ${lastName} has joined our course!</h1>
        <h2>We are glad to have you here ${firstName}.</h2>`);
});

app.post("/apply", (req, res) => {
    const reqBody = req.body; 
    let applicant = reqBody.applicantName;
    let email = reqBody.applicantEmail;
    let course = reqBody.selectedCourse;
    let courseLevel = reqBody.courseLevel;
    let appliedAt = getCurrentDateTime();  // date and time thta application was received by the server (i.e. when the user submitted the form)

    // Log the received data to the console for debugging purposes
    console.log('Received application at ' + appliedAt + ' from ' + req.ip);
    console.log (`${appliedAt} Applicant:  ${applicant}:`);
    console.log(`Course: ${course}`);
    console.log(`Email: ${email}`);
    console.log(`Level: ${courseLevel}`);

    // Insert the application data into the database
    // insert a new record

db.run(`INSERT INTO applications
        (applicantName, email, courseName, level, appliedAt)
        VALUES (?, ?, ?, ?, ?)`,
        [applicant, email, course, courseLevel, appliedAt],
        function(err) {
                if (err) {
                    console.error('Error inserting application data:', err);
                } else {

                    console.log(`Application data inserted successfully into record id = ${this.lastID}`);
                }
        }
    );

    // fromat an acknowledgement message to send back to the client
    const ackMessage = `<h1>Thank you, ${applicant}!</h1>
        <p>Your application for the ${course} course has been received.</p>
        <p>We will contact you at ${email} with further details.</p>
        <p><a href="/">Go back to the home page</a></p>`;
    res.send(ackMessage);
});


// Example of an endpoint that returns JSON data about a student
app.get("/api/student", (req, res) => {
    // callback thta return error (null if OK) and record (if found) from the database query
    let email = req.query.email; // extract the email query parameter from the URL    
  
    if (!email) {
         db.get(`SELECT * FROM applications LIMIT 1`, (err,record) => {
                if (err) {
                    console.error('Error retrieving student data:', err);
                    res.status(500).json({ error: 'Internal Server Error' });
                }
                if (record){
                    res.json(record);
                }
        
                })

    }
    else{
        db.get(`SELECT * FROM applications WHERE email LIKE ?`, [email], 
            (err,record) => {
                if (err) {
                    console.error('Error retrieving student data:', err);
                    res.status(500).json({ error: 'Internal Server Error' });
                }
                if (record){
                    res.json(record);
                }
        
                })

    }
    

});



app.get("/api/students", (req, res) => {
    // db.all returns an array of all matching records
    db.all(`SELECT * FROM applications`, [], (err, records) => {
        if (err) {
            console.error('Error retrieving student data:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        // If no records are found, records will be an empty array []
        console.log(`Fetched ${records.length} student records.`);
        res.json(records);
    });
});

// Helper functions
function getCurrentDateTime() {
     const now = new Date();
            
            const currentDateTime = 
            String(now.getFullYear())  + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0')        + ' ' +
            String(now.getHours()).padStart(2, '0')       + ':' +
            String(now.getMinutes()).padStart(2, '0')     + ':' +
            String(now.getSeconds()).padStart(2, '0');
            return currentDateTime;
}

//  Start the server
// recommend using node --watch server.js to automatically restart the server when you make changes to the code
app.listen(PORT, () => {
    console.log(`User has started the server. Server running: http://localhost:${PORT}/`);
});