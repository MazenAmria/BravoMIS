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
            db.query(`SELECT I.item_name, I.item_id FROM item I`, (err, results) => {
                if(err){
                    console.log(err);
                }else{
                    res.render('sales', {
                        currentDate: new Date(),
                        items: results
                    });
                }
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

// Deleteing discounts route
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

// Route to get Item dicount conditions
router.get('/discounts-item/api', (req, res) => {
    const role = res.locals.role.toLowerCase();
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        if(role == 'manager'){
                db.query(`SELECT
                ID.discount_id,
                ID.discount_percentage,
                I.item_name,
                ID.minimum_quantity,
                DATE_FORMAT(ID.min_date, '%Y-%m-%d') AS min_date,
                DATE_FORMAT(ID.max_date, '%Y-%m-%d') AS max_date,
                ID.discount_status
                FROM item_discount ID, item I
                WHERE ID.item_id = I.item_id`, (err, results) => {
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

// Route to submit item discount condition
router.post('/submit-discount-item', reqAuth, (req, res) => {
    let role = res.locals.role.toLowerCase();
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        if(role == 'manager'){
            let discountItem = req.body.discountItem,
            discountPercentageItem = req.body.discountPercentageItem,
            discountMinQuantity = req.body.discountMinQuantity,
            start_date = req.body.start_date,
            end_date = req.body.end_date;
            db.query(`INSERT INTO item_discount (item_id, discount_percentage, minimum_quantity, min_date, max_date)
                      VALUE('${discountItem}', '${discountPercentageItem}', '${discountMinQuantity}', '${start_date}', '${end_date}')`, (err, results) => {
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

// Route to get all item discount conditions requested to edit
router.get('/discounts-item/edit/:id', (req, res) => {
    let role = res.locals.role.toLowerCase();
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        if(role == 'manager'){
            const discountId = req.params.id;
            db.query(`SELECT ID.discount_id, ID.discount_percentage, ID.discount_status, ID.minimum_quantity, ID.item_id,
                      DAY(ID.min_date) AS min_day,
                      MONTH(ID.min_date) AS min_month,
                      YEAR(ID.min_date) AS min_year,
                      DAY(ID.max_date) AS max_day,
                      MONTH(ID.max_date) AS max_month,
                      YEAR(ID.max_date) AS max_year
                      FROM item_discount ID
                      WHERE ID.discount_id = ${discountId}`, (err, results) => {
                if(err){
                    console.log(err);
                }else{
                    db.query(`SELECT I.item_id, I.item_name FROM item I`, (err, items) => {
                        if(err){
                            console.log(err);
                        }else{
                            res.render('editItemDiscounts', {
                                title: 'تعديل شروط الخصم على المنتجات',
                                discounts: results,
                                items: items,
                                currentDate: new Date()
                            });
                        }
                    });
                }
            });
        }else{
            res.status(404).send('Not Found');
        }
    }
});

//Submit edit item discount route
router.post('/submit-edit-item-discounts', reqAuth, (req, res) => {
    let role = res.locals.role.toLowerCase();
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        if(role == 'manager'){
            const discountItem = req.body.discountItem,
                discountId = req.body.discountId,
                discountPercentage = req.body.discountPercentage,
                discountMinQuantity = req.body.discountMinQuantity,
                start_date = req.body.start_date,
                end_date = req.body.end_date,
                discountStatus = req.body.discountStatus;
            db.query(`UPDATE item_discount ID SET 
                        ID.discount_percentage = '${discountPercentage}',
                        ID.minimum_quantity = '${discountMinQuantity}',
                        ID.min_date = '${start_date}',
                        ID.max_date = '${end_date}',
                        ID.discount_status = '${discountStatus}',
                        ID.item_id = '${discountItem}'
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

// Deleteing item discounts route
router.delete('/discounts-item/delete', reqAuth, (req, res) => {
    let role = res.locals.role.toLowerCase();
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        if(role == 'manager'){
            const deleteDiscounts = req.body.deleteDiscounts;
            const deleteDiscountsSQLArray = `('` + deleteDiscounts.join(`','`) + `')`;
            db.query(`DELETE FROM item_discount ID WHERE ID.discount_id IN ${deleteDiscountsSQLArray}`, (err) => {
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