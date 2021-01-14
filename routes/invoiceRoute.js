const { Router } = require('express');
const db = require('../dbConnection');
const router = Router();
const { managerMenu, vendingManagerMenu, cashierMenu, guestMenu } = require('../assets/js/defaultMenues');
const {reqAuth} = require('../middlewares/authMiddleware');
const { customers } = require('../assets/js/menuItems');

router.get('/invoices', (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        let role = res.locals.role.toLowerCase();
        
        if(role == 'cashier'){
            db.query(`SELECT C.customer_id, C.customer_name FROM customer C`, (err, customers) => {
                if(err){
                    console.log(err);
                }else{
                    db.query(`SELECT C.category_id, C.category_name FROM category C`, (err, categories) => {
                        if(err){
                            console.log(err);
                        }else{
                            db.query(`SELECT I.item_id, I.item_name, I.remaining_quantity FROM item I`, (err, items) => {
                                if(err){
                                    console.log(err);
                                }else{
                                    res.render('invoice', {
                                        customers:customers,
                                        categories:categories,
                                        items:items
                                    });
                                }
                            });
                        }
                    });
                }
            });

        
        } else{
            res.status(404).send('Not Found');
        }
    }
});

router.get('/items/api/:id', (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {

        const categoryId = req.params.id;
        console.log(categoryId);
        db.query(`SELECT I.item_id as id, I.item_name as text FROM item I WHERE I.category_id = '${categoryId}'`, (err, items) => {
            if(err){
                console.log(err);
            }else{
                res.json(items);
            }
        });
    }
});
router.get('/invoice/getItemPrice/:id', (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        const itemId = req.params.id;
        db.query(`SELECT I.selling_price FROM item I WHERE I.item_id = '${itemId}'`, (err, price) => {
            if(err){
                console.log(err);
            }else{
                res.send(price);
            }
        });
    }
});
router.get('/invoice/getItemDiscount/:id/:quantity', (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        const itemId = req.params.id;
        const quantity = req.params.quantity;
        db.query(`SELECT MAX(ID.discount_percentage) AS discount_percentage, ID.discount_id
                  FROM item_discount ID
                  WHERE ID.item_id = '${itemId}' AND
                  ${quantity} >= ID.minimum_quantity AND
                  ID.discount_status = 'فعال' AND
                  ID.min_date <= (SELECT CURDATE()) AND
                  ID.max_date >= (SELECT CURDATE())
        `, (err, discount) => {
            if(err){
                console.log(err);
            }else{
                res.send(discount);
            }
        });
    }
});

router.post('/invoice/insert', reqAuth, (req, res) => {
    let customerId = req.body.customerId,
        cashierId = req.body.cashierId;
    if(customerId != 'null'){
        customerId = `'${customerId}'`;
    }
    db.query(`INSERT INTO invoice(invoice_time, customer_id, cashier_id) value(NOW(), ${customerId}, '${cashierId}')`, (err, result) => {
       if(err)
        console.log(err);
       else
        console.log(result)
    });
});

module.exports = router;