// express
import express from 'express'; // ES6 import'

// third
import csrf from 'csurf'; //
import cookieParser from 'cookie-parser'; //

// db
import db from './config/db.js'; 

// rutas
import userRoutes from './routes/auth/userRoutes.js';
import propertiesRoutes from './routes/auth/propertiesRoutes.js';

// app
const app = express(); // Create an express app
const port = process.env.PORT || 3000;

// Connect to the database
try {
    await db.authenticate()
    db.sync()
    console.log('Connection has been established successfully.')
} catch (e) {
    console.log(e);
}

// allow to read data from the body
app.use(express.urlencoded({ extended: true }));

// allow cookie parser
app.use(cookieParser())

// allow csrf
app.use(csrf({cookie: true}))

// Configuration
app.set('view engine', 'pug'); // Set the view engine to pug
app.set('views', './views'); // Set the views folder


// Routing
app.use('/auth', userRoutes);
app.use('/', propertiesRoutes);

// public
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});