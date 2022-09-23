import express from 'express'; // ES6 import'

// Routes import
import userRoutes from './routes/auth/userRoutes.js';



const app = express(); // Create an express app
const port = 3000;

// Routing
app.use('/', userRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});