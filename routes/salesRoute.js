const { Router } = require('express');
const db = require('../dbConnection');
const bcrypt = require('bcrypt');
const router = Router();
const {reqAuth} = require('../middlewares/authMiddleware');

// Route to render customers
router.get('/sales', (req, res) => {
    const role = res.locals.role.toLowerCase();
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        if(role == 'manager'){
            res.render('sales', {
                currentDate: new Date()
            });

        }else{
            res.status(404).send('Not Found');
        }
    }
});

// Add new discount condition route
router.post('/submit-discount', reqAuth, (req, res) => {

    let role = res.locals.role.toLowerCase();
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        if(role == 'manager'){
            let discountPercentage = req.body.discountPercentage,
            discountMinPrice = req.body.discountMinPrice,
            start_date = req.body.start_date,
            end_date = req.body.end_date;
            db.query(`INSERT INTO invoice_discount (discount_percentage, total_price, min_date, max_date)
                      VALUE('${discountPercentage}', '${discountMinPrice}', '${start_date}', '${end_date}')`, (err, results) => {
                if(err){
                    console.log(err);
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

// Route to render Discount Conditions table
router.get('/discounts/api', (req, res) => {
    const role = res.locals.role.toLowerCase();
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        if(role == 'manager'){
                db.query(`SELECT IC.discount_id, IC.discount_percentage, IC.total_price, DATE_FORMAT(IC.min_date, '%Y-%m-%d') AS min_date, DATE_FORMAT(IC.max_date, '%Y-%m-%d') AS max_date, IC.discount_status FROM invoice_discount IC`, (err, results) => {
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


// Route to get all discount conditions requested to edit
router.get('/discounts/edit/:id', (req, res) => {
    let role = res.locals.role.toLowerCase();
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        if(role == 'manager'){
            const discountId = req.params.id;
            console.log(discountId);
            db.query(`SELECT ID.discount_id, ID.discount_percentage, ID.discount_status, ID.total_price,
                      DAY(ID.min_date) AS min_day,
                      MONTH(ID.min_date) AS min_month,
                      YEAR(ID.min_date) AS min_year,
                      DAY(ID.max_date) AS max_day,
                      MONTH(ID.max_date) AS max_month,
                      YEAR(ID.max_date) AS max_year
                      FROM invoice_discount ID
                      WHERE ID.discount_id = ${discountId}`, (err, results) => {
                if(err){
                    console.log(err);
                }else{
                    console.log(results);
                    res.render('editDiscounts', {
                        title: 'تعديل شروط الخصم',
                        discounts: results,
                        currentDate: new Date()
                    });
                }
            });
        }else{
            res.status(404).send('Not Found');
        }
    }
});
//Submit edit discount route
router.post('/submit-edit-discounts', reqAuth, (req, res) => {
    let role = res.locals.role.toLowerCase();
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        if(role == 'manager'){
            const discountId = req.body.discountId,
                discountPercentage = req.body.discountPercentage,
                discountMinPrice = req.body.discountMinPrice,
                start_date = req.body.start_date,
                end_date = req.body.end_date,
                discountStatus = req.body.discountStatus;
            db.query(`UPDATE invoice_discount ID SET 
                        ID.discount_percentage = '${discountPercentage}',
                        ID.total_price = '${discountMinPrice}',
                        ID.min_date = '${start_date}',
                        ID.max_date = '${end_date}',
                        ID.discount_status = '${discountStatus}'
                        WHERE
                        ID.discount_id = ${discountId}`, (err) => {
                if(err){
                    if(err.code == 'ER_TRUNCATED_WRONG_VALUE'){
                        res.status(422).send('wrong date');
                    }
                }else{
                    res.status(200).send("Success");
                }
            });
                
        }
    }
});
// Deleteing customers route
router.delete('/discounts/delete', reqAuth, (req, res) => {
    let role = res.locals.role.toLowerCase();
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        if(role == 'manager'){
            const deleteDiscounts = req.body.deleteDiscounts;
            const deleteDiscountsSQLArray = `('` + deleteDiscounts.join(`','`) + `')`;
            db.query(`DELETE FROM invoice_discount ID WHERE ID.discount_id IN ${deleteDiscountsSQLArray}`, (err) => {
                if(err){
                    res.status(405).send('Failed');
                }else{
                    res.status(200).send('Success');
                }
            });
        }
    }
});






module.exports = router;