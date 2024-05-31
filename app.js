const express = require('express');
const app = express();


// Set up EJS for rendering views
app.set('view engine', 'ejs');

// Serve static files from the public directory
app.use(express.static('public'));

// Define a route for the home page
app.get('/', (req, res) => {
    // Render the index.ejs template
    res.render('index', {Title:"Retro Games"});
});

app.get('*', (req,res) => {
    res.render('404', {Title: '404'})
})

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

