const express = require("express");
const cors = require('cors');
const session = require('express-session');
const expbs = require('express-handlebars');
const path = require("path");
const thesisCollection = require("./thesisdb");
const RCDCollection = require("./rcd");

// routers
const profileRoute = require('../routes/profile');
const uploadRoute = require('../routes/upload');
const userRoute = require('../routes/user');
const userViewRoute = require('../routes/userview');
const adminViewRoute = require('../routes/adminview');
const thesisRoute = require('../routes/theses');
const deleteRoute = require('../routes/delete');
const editRoute = require('../routes/edit');
const logsRoute = require('../routes/logs');
const adlogsRoute = require('../routes/adlogs');
const recoverRoute = require('../routes/recover');

const app = express();

// Environment variables
require("dotenv").config();

// Template engine setup (Handlebars)
app.set("views", path.join(__dirname, '../templates'));
app.set('view engine', 'hbs');
app.engine('handlebars', expbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'templates/layouts')
}));

// for session storing
const MongoStore = require('connect-mongo');

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'THUBCKS',
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL,  // Replace with your MongoDB URI
        collectionName: 'sessions',  // The collection to store sessions
        ttl: 14 * 24 * 60 * 60 // 14 days (optional, sets TTL for sessions)
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',  // Cookies only sent over HTTPS in production
        httpOnly: true,  // Helps prevent XSS attacks
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',  // Set 'None' for production, 'Lax' for non-production
        maxAge: 24 * 60 * 60 * 1000,  // Session expiration (1 day)
    },
}));


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS AND ALLOWED ORIGIN
const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? ['https://www.yourproductiondomain.com'] 
    : ['http://localhost:3000'];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true  // Allow cookies to be sent
}));


// Static files
app.use(express.static('public'));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));
// to read pdf files
app.use('/files', express.static(path.join(__dirname, 'files')));

// Routes
app.use(profileRoute);
app.use(uploadRoute);
app.use(userRoute);
app.use(userViewRoute);
app.use(adminViewRoute);
app.use(thesisRoute);
app.use(deleteRoute);
app.use(editRoute);
app.use(logsRoute);
app.use(adlogsRoute);
app.use(recoverRoute);

// Page routes
app.get('/index', (req, res) => {
    res.render('index', { title: 'Index' });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

app.get("/", (req, res) => {
    res.render("landingPage");
});


app.get('/search/:key', async (req, res) => {
    console.log(req.params.key);
    try {
        const data = await thesisCollection.find({
            "$or": [
                { filename: { $regex: req.params.key, $options: 'i' } },
                { brand: { $regex: req.params.key, $options: 'i' } },
                { category: { $regex: req.params.key, $options: 'i' } },
            ]
        });
        res.send(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
