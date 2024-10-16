// Import required modules
const express = require('express');                // Express for building web server
const path = require('path');                      // Path module for directory path operations
const mysql = require('mysql');                    // MySQL for database connections
const methodOverride = require('method-override'); // without using override i got error, Method Override for handling DELETE requests 
const getRandomGreeting = require('./greeting');   // Custom module to generate random greetings

// Initialize the Express application
const app = express(); 

// Set up MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',           // MySQL server host
    user: 'root',                // MySQL username
    password: 'Cprg212user',     // MySQL password
    database: 'CPRG212'          // Database name
});

// Connect to MySQL
db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...'); // Logs connection success
});

// Set view engine to EJS (for rendering dynamic HTML)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the views directory

// Middleware to parse URL-encoded data (form submissions)
app.use(express.urlencoded({ extended: true }));

// Use Method Override to handle DELETE requests in the forms
app.use(methodOverride('_method'));

// Serve static files (CSS, images) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// =====================================
// ROUTES
// =====================================

// Home Page Route
app.get('/', (req, res) => {
    const greeting = getRandomGreeting(); // Generate a random greeting using the custom module
    res.render('index', { greeting });    // Render the index.ejs file and pass the greeting 
});

// About Page Route
app.get('/about', (req, res) => {
    res.render('about'); // Render the about.ejs template
});

// Contact Page Route (Form)
app.get('/contact', (req, res) => {
    res.render('contact'); // Render the contact.ejs template
});

// Handling Contact Form Submission
app.post('/contact', (req, res) => {
    const { firstName, lastName, email, phone, city, province, postalCode, feedbackMessage } = req.body;
    
    // SQL query to insert the contact form data into the MySQL database
    const sql = 'INSERT INTO contacts (first_name, last_name, email, phone, city, province, postal_code, feedback_message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    
    // Execute the query with the data from the form
    db.query(sql, [firstName, lastName, email, phone, city, province, postalCode, feedbackMessage], (err, result) => {
        if (err) throw err;
        // Redirect to the thank-you page and pass the user's name and email in the query string
        res.redirect(`/thank-you?name=${firstName}&email=${email}`);
    });
});

// Thank You Page Route
app.get('/thank-you', (req, res) => {
    const { name, email } = req.query; // Get name and email from the query string
    res.render('thank-you', { name, email }); // Render the thank-you.ejs template and pass the variables
});

// Display Contact Entries (For Admin/Viewing Purposes)
app.get('/contacts', (req, res) => {
    const sql = 'SELECT * FROM contacts'; // SQL query to fetch all contact entries
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.render('contacts', { contacts: results }); // Render contacts.ejs and pass the contact data
    });
});

// DELETE Contact Entry (Using Method Override for DELETE request)
// app.post('/contacts/delete/:id', (req, res) => {
//     const contactId = req.params.id; // Get the ID of the contact to delete from the URL
//     const sql = 'DELETE FROM contacts WHERE id = ?'; // SQL query to delete the contact with the given ID
    
//     db.query(sql, [contactId], (err, result) => {
//         if (err) throw err;
//         res.redirect('/contacts'); // Redirect back to the contacts page after deletion
//     });
// });
app.delete('/contacts/delete/:id', (req, res) => {
    console.log('DELETE request received for contact ID:', req.params.id); // This should log when delete is triggered
    
    const contactId = req.params.id;
    const sql = 'DELETE FROM contacts WHERE id = ?';
    db.query(sql, [contactId], (err, result) => {
        if (err) throw err;
        res.redirect('/contacts');
    });
});

// 404 Error Handling (For invalid routes)
app.use((req, res) => {
    res.status(404).render('404', { invalidUrl: req.originalUrl }); // Render the 404.ejs template with the incorrect URL
});

// =====================================
// SERVER LISTENING
// =====================================

// Listen on port 3000 for incoming requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`); // Logs the server starting with the assigned port
});
