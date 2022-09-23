const express = require('express');

const app = express(); // Create an express app

// Define a port to run the server on
const port = 3000;

// routing
app.get('/', (req, res) => {
    res.send('Express!')
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});