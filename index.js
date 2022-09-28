import express from 'express'; // ES6 import'
import db from './config/db.js'; 
// Routes import
import userRoutes from './routes/auth/userRoutes.js';

const app = express(); // Create an express app
const port = 3000;

// Connect to the database
try {
    await db.authenticate()
    console.log('Connection has been established successfully.')
} catch (e) {
    console.log(e);
}

// Configuration
app.set('view engine', 'pug'); // Set the view engine to pug
app.set('views', './views'); // Set the views folder


// Routing
app.use('/auth', userRoutes);

// public
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});