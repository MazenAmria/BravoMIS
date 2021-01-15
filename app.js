const express = require("express");
const authRoutes = require("./routes/authRoute");
const requestsRoute = require("./routes/reuqestsRoute");
const tendersRoute = require("./routes/tendersRoute");
const vendorsRoute = require("./routes/vendorsRoute");
const offersRoute = require("./routes/offersRoute");
const vendingProcessesRoute = require("./routes/vendingProcessesRoute");
const vendingProcessItemsRoute = require("./routes/vendingProcessItemsRoute");
const employeesRoute = require("./routes/employeesRoute");
const errorRoute = require("./routes/errorRoute");
const categoriesRoute = require("./routes/categoriesRoute");
const managerCustomersRoute = require("./routes/managerCustomersRoute");
const salesRoute = require("./routes/salesRoute");
const invoiceRoute = require("./routes/invoiceRoute");
const reportsRoute = require("./routes/reportsRoute");
const cookieParser = require('cookie-parser');
const {reqAuth} = require('./middlewares/authMiddleware');
const db = require('./dbConnectionMulti');

// express app
const app = express();

// register view engine
app.set('view engine', 'ejs');

// listen for request
app.listen(3000);

// Middleware & Static Files
app.use(express.static('assets'));
app.use(express.static('node_modules/ejs'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

// User Authentication
app.get("*", reqAuth);
app.post("*", reqAuth);
app.put("*", reqAuth);
app.delete("*", reqAuth);
app.use(authRoutes);
app.use(requestsRoute);
app.use(tendersRoute);
app.use(vendorsRoute);
app.use(offersRoute);
app.use(vendingProcessesRoute);
app.use(vendingProcessItemsRoute);
app.use(employeesRoute);
app.use(categoriesRoute);
app.use(managerCustomersRoute);
app.use(salesRoute);
app.use(invoiceRoute);
app.use(reportsRoute);
app.use(errorRoute);

// Check the deadlines every 3 minutes
const schedule = require('node-schedule');


const check = schedule.scheduleJob('*/3 * * * *', function () {
    db.query(`
    
        UPDATE tender
        SET status = 'closed'
        WHERE deadline < NOW();
    
    `);
});
