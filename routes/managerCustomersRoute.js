const { Router } = require('express');
const db = require('../dbConnection');
const bcrypt = require('bcrypt');
const router = Router();
const {reqAuth} = require('../middlewares/authMiddleware');

// Route to render customers
router.get('/customers', (req, res) => {
    const role = res.locals.role.toLowerCase();
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        if(role == 'manager'){
            res.render('managerCustomers', {
                currentDate: new Date()
            });

        }else{
            res.status(404).send('Not Found');
        }
    }
});

// Add new customer route
router.post('/submit-customer', reqAuth, (req, res) => {

    let role = res.locals.role.toLowerCase();
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        if(role == 'manager'){
            let customerName = req.body.customerName,
            customerId = req.body.customerId,
            customerBirthDate = req.body.customerBirthDate;
            db.query(`INSERT INTO customer VALUE('${customerId}', '${customerName}', '${customerBirthDate}')`, (err, results) => {
                if(err){
                    if(err.code == 'ER_DUP_ENTRY'){
                        res.status(409).send('Duplicate');
                    }else if(err.code == 'ER_TRUNCATED_WRONG_VALUE'){
                        res.status(422).send('wrong date');
                    }
                    
                }else{
                    res.status(200).send('Success');
                }
            });
        }
    }
});


// Route to render customers table
router.get('/customers/api', (req, res) => {
    const role = res.locals.role.toLowerCase();
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        if(role == 'manager'){
                db.query(`SELECT C.customer_id, C.customer_name, DATE_FORMAT(C.date_of_birth, '%Y-%m-%d') AS date_of_birth FROM customer C`, (err, results) => {
                    if(err){
                        console.log(err);
                    }else{
                        res.json(results);
                    }
                });
        }else{
            res.status(404).send('Not Found');
        }
    }
});

// Route to get all cusomters requested to edit
router.get('/customers/edit/:id', (req, res) => {
    let role = res.locals.role.toLowerCase();
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        if(role == 'manager'){
            const customerId = req.params.id;
            db.query(`SELECT C.customer_id, C.customer_name, DAY(C.date_of_birth) AS date_day, MONTH(C.date_of_birth) AS date_month, YEAR(C.date_of_birth) AS date_year FROM customer C WHERE C.customer_id = ${customerId}`, (err, results) => {
                if(err){
                    console.log(err);
                }else{
                    console.log(results);
                    res.render('editCustomers', {
                        title: 'تعديل الزبائن',
                        customers: results,
                        currentDate: new Date()
                    });
                }
            });
        }else{
            res.status(404).send('Not Found');
        }
    }
});
// Submit edit customer route
router.post('/submit-edit-customers', reqAuth, (req, res) => {
    let role = res.locals.role.toLowerCase();
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        if(role == 'manager'){
            const customerName = req.body.customerName,
                customerId = req.body.customerId,
                customerBirthDate = req.body.customerBirthDateString;
            db.query(`UPDATE customer C SET C.customer_name = '${customerName}', C.date_of_birth = '${customerBirthDate}' WHERE C.customer_id = '${customerId}'`, (err) => {
                if(err){
                    res.status(409).send("Failed");
                }else{
                    res.status(200).send("Success");
                }
            });
        }
    }
});
// Deleteing customers route
router.delete('/customers/delete', reqAuth, (req, res) => {
    let role = res.locals.role.toLowerCase();
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        if(role == 'manager'){
            const deleteCustomers = req.body.deleteCustomers;
            const deleteCustomersSQLArray = `('` + deleteCustomers.join(`','`) + `')`;
            db.query(`DELETE FROM customer C WHERE C.customer_id IN ${deleteCustomersSQLArray}`, (err) => {
                if(err){
                    console.log(err);
                    res.status(405).send('Failed');
                }else{
                    res.status(200).send('Success');
                }
            });
        }
    }
});






module.exports = router;