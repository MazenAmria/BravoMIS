const express = require("express");
const authRoutes = require("./routes/authRoute");
const cookieParser = require('cookie-parser');
const {reqAuth} = require('./middlewares/authMiddleware');


// express app
const app = express();

// register view engine
app.set('view engine', 'ejs');

// listen for request
app.listen(3000);

// Middleware & Static Files
app.use(express.static('assets'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

// User Authentication
app.get("*", reqAuth);
app.use(authRoutes);
