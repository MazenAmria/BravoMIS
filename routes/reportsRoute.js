const { Router } = require('express');
const db = require('../dbConnection');
const router = Router();
const { managerMenu, vendingManagerMenu, cashierMenu, guestMenu } = require('../assets/js/defaultMenues');
const {reqAuth} = require('../middlewares/authMiddleware');
const { customers } = require('../assets/js/menuItems');

router.get('/reports', (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        let role = res.locals.role.toLowerCase();
        
        if(role == 'manager'){
            res.render('reports');
        }
    }
});
router.get('/reports/total-invoices/:date_min/:date_max', (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        let role = res.locals.role.toLowerCase();
        if(role == 'manager'){
            let date_min = req.params.date_min;
            let date_max = req.params.date_max;

            if(date_min == 'now'){
                date_min = 'CURDATE()';
            }else{
                date_min = `'${date_min}'`;
            }
            if(date_max == 'now'){
                date_max = 'CURDATE()';
            }else{
                date_max = `'${date_max}'`;
            }
            db.query(`SELECT COUNT(I.invoice_id) AS total
            FROM invoice I
            WHERE DATE_FORMAT(I.invoice_time, '%Y-%M-%D') >= DATE_FORMAT(${date_min}, '%Y-%M-%D') AND
            DATE_FORMAT(I.invoice_time, '%Y-%M-%D') <= DATE_FORMAT(${date_max}, '%Y-%M-%D');`, (err, result) => {
                if(err)
                    console.log(err);
                else
                    res.send(result);
            });
        }
    }
});
router.get('/reports/total-sales/:date_min/:date_max', (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        let role = res.locals.role.toLowerCase();
        if(role == 'manager'){
            let date_min = req.params.date_min;
            let date_max = req.params.date_max;

            if(date_min == 'now'){
                date_min = 'CURDATE()';
            }else{
                date_min = `'${date_min}'`;
            }
            if(date_max == 'now'){
                date_max = 'CURDATE()';
            }else{
                date_max = `'${date_max}'`;
            }
            db.query(`SELECT SUM(IM.quantity) AS total
            FROM invoice_includes_item IM, invoice I
            WHERE IM.invoice_id = I.invoice_id AND
            DATE_FORMAT(I.invoice_time, '%Y-%M-%D') >= DATE_FORMAT(${date_min}, '%Y-%M-%D') AND
            DATE_FORMAT(I.invoice_time, '%Y-%M-%D') <= DATE_FORMAT(${date_max}, '%Y-%M-%D');`, (err, result) => {
                if(err)
                    console.log(err);
                else
                    res.send(result);
            });
        }
    }
});
router.get('/reports/total-rev/:date_min/:date_max', (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        let role = res.locals.role.toLowerCase();
        if(role == 'manager'){
            let date_min = req.params.date_min;
            let date_max = req.params.date_max;

            if(date_min == 'now'){
                date_min = 'CURDATE()';
            }else{
                date_min = `'${date_min}'`;
            }
            if(date_max == 'now'){
                date_max = 'CURDATE()';
            }else{
                date_max = `'${date_max}'`;
            }
            db.query(`SELECT SUM(IM.quantity * IM.price_per_unit) - (SELECT SUM(IM2.quantity * IM2.price_per_unit * ID.discount_percentage / 100)
            FROM invoice_includes_item IM2, item_discount ID
            WHERE ID.discount_id = IM2.discount_id) AS total
            FROM invoice_includes_item IM, invoice I
            WHERE I.invoice_id = IM.invoice_id AND
            DATE_FORMAT(I.invoice_time, '%Y-%M-%D') >= DATE_FORMAT(${date_min}, '%Y-%M-%D') AND
            DATE_FORMAT(I.invoice_time, '%Y-%M-%D') <= DATE_FORMAT(${date_max}, '%Y-%M-%D');`, (err, result) => {
                if(err)
                    console.log(err);
                else
                    res.send(result);
            });
        }
    }
});

module.exports = router;