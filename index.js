const express = require('express'); //шmport the Express framework by requiring the 'express' module
const app = express();
const bodyParser = require('body-parser'); //imports the 'body-parser' module
app.use(bodyParser.urlencoded({ extended: true })); //add the 'body-parser' middleware to the Express application using the 'app.use()' method

//Set view engine
app.set("view engine", "ejs")

//Import authentication module
const auth = require('./auth.js');

// Create two user accounts
auth.createUser("karolina@gmail.com", "secret123");
auth.createUser("alice@gmail.com", "pas456");

// Authenticate users
console.log(auth.authenticateUser("karolina@gmail.com", "secret123"));
console.log(auth.authenticateUser("John", "Secret546"));

//Connect to database:
const mysql = require('mysql');

//Create a connection to the MySQL database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'g00425700'
});


// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ', err); // if we have any problems with connection we'll get a message about it
    } else {
        console.log('Connected to database!'); // if it's ok, we/ll get a message about successful connection
    }
});


// Handle login form submission
app.post("/login", function (req, res) {
    // Get the username and password from the login form
    const username = req.body.username;
    const password = req.body.password;

    // Check if the user is authenticated
    const authenticated = auth.authenticateUser(username, password);
    console.log(authenticated); //see information in console

    if (authenticated) {
        console.log("Authentication was successful!");// see successful result in console
        res.render("home"); // get page home.ejs
    } else {
        console.log("Authentication was NOT successful!"); // see message in console that it's ptoblem
        res.render("failed"); // get page failed.ejs
    }
})

// Retrieve product information based on ID by Get route
app.get("/shop", function (req, res) {
    const id = req.query.rec; // Get the ID parameter from the request query
    // select information from database based on id of the product
    connection.query("SELECT * FROM fruits WHERE id = ?", [id], function (err, rows, fields) {
        if (err) {
            console.error("Error retrieving data from database:", err); // if we get error, we'll get error message
            res.status(500).send("Error retreiving data from database");
        }
        else if (rows.length === 0) { // if user didn't choose any products, we/ll get message: "no product found for ID"
            console.error(`No rows found for ID ${id}`);
            res.status(404).send(`No product found for ID ${id}`);

        }
        else {
            console.log("Data retrieved from the Database!"); // if user chossed some products we'll get information about them
            console.log(rows[0].name); // get name in the console 
            console.log(rows[0].description); // get description of the product in the console 
            console.log(rows[0].price);// get price in the console 
            console.log(rows[0].stock);// get stock in the console 
            const fruitName = rows[0].name; // Extract the product name from the retrieved row
            const fruitDescription = rows[0].description; // Extract the product description
            const image = rows[0].image; // Extract the product image
            const price = rows[0].price; // Extract the product price
            // Render the "test.ejs" template with the retrieved product data, passing it as an object to be accessed in the template
            res.render("test.ejs", { myMessage: fruitName, description: fruitDescription, myImage: image, myPrice: price })
        }
    });

});



// Use Post route to retrieve product information 
// the same comments as in Get route
app.post("/shop", function (req, res) {
    const id = req.body.rec2;
    // select information from database based on id of the product
    connection.query("SELECT * FROM fruits WHERE id = ?", [id], function (err, rows, fields) {
        if (err) {
            console.error("Error retrieving data from database:", err);
            res.status(500).send("Error retreiving data from database");
        }
        else if (rows.length === 0) {
            console.error(`No rows found for ID ${id}`);
            res.status(404).send(`No product found for ID ${id}`);

        }
        else {
            console.log("Data retrieved from the Database!");
            console.log(rows[0].name);
            console.log(rows[0].description);
            console.log(rows[0].price);
            console.log(rows[0].stock);
            const fruitName = rows[0].name;
            const fruitDescription = rows[0].description;
            // Render the "test.ejs" template with the retrieved product data, passing it as an object to be accessed in the template
            res.render("test.ejs", { myMessage: fruitName, description: fruitDescription })
        }
    });

});



// Serve static files from the public directory
app.use(express.static('home'));

//GET route for "/home" URL, the server responds by rendering the "home.ejs" template and sending it as a response
app.get("/home", function (rec, res) {
    res.render("home.ejs");
})


// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server started on port 3000');
});