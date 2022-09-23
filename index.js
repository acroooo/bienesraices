import express from 'express'; // ES6 import'

// Routes import
import userRoutes from './routes/auth/userRoutes.js';



const app = express(); // Create an express app
const port = 3000;

// Configuration
app.set('view engine', 'pug'); // Set the view engine to pug
app.set('views', './views'); // Set the views folder


// Routing
app.use('/auth', userRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});