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
        let dbquery;
        if(categoryId == 'all'){
            dbquery = `SELECT I.item_id as id, I.item_name as text FROM item I`;
        }else{
            dbquery = `SELECT I.item_id as id, I.item_name as text FROM item I WHERE I.category_id = '${categoryId}'`;
        }
        db.query(dbquery, (err, items) => {
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
router.get('/invoice/getinvoiceDiscount/:totalPrice', (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        const totalPrice = req.params.totalPrice;
        db.query(`SELECT MAX(ID.discount_percentage) AS discount_percentage, ID.discount_id
                  FROM invoice_discount ID
                  WHERE ${totalPrice} >= ID.total_price AND
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
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        let customerId = req.body.customerId,
            cashierId = req.body.cashierId;
        if(customerId != 'null'){
            customerId = `'${customerId}'`;
        }
        db.query(`INSERT INTO invoice(invoice_time, customer_id, cashier_id) value(NOW(), ${customerId}, '${cashierId}')`, (err, result) => {
        if(err)
            console.log(err);
        else
            res.send(`${result.insertId}`);
        });
    }
});

router.post('/invoice/insert/discount', reqAuth, (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        let discount_id = req.body.discount_id,
            invoice_id = req.body.invoice_id;
        db.query(`UPDATE invoice SET discount_id = ${discount_id} WHERE invoice_id = ${invoice_id}`, (err, result) => {
        if(err)
            console.log(err);
        });
    }
});

router.post('/invoice/insert/items', reqAuth, (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        let invoice_items = req.body.invoice_items,
            values = ``;
            
        for(key in invoice_items){
            let invoiceId = invoice_items[key].invoiceId,
                itemId = invoice_items[key].itemId,
                quantity = invoice_items[key].quantity,
                price_per_unit = invoice_items[key].price_per_unit,
                discountId = invoice_items[key].discountId;
            if(discountId == '')
                discountId = 'null';
            values += `(${quantity}, ${price_per_unit}, '${itemId}', ${invoiceId}, ${discountId})`;
            if(key != invoice_items.length - 1)
                values += `,`;
        }
        db.query(`INSERT INTO invoice_includes_item(quantity, price_per_unit, item_id, invoice_id, discount_id)
                                                    VALUES${values}`, (err) => {
            if(err)
                console.log(err);
                else
                res.status(200).send("success");
        })
    }
});

router.post('/invoice/update/item', reqAuth, (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        let itemId = req.body.itemId,
            quantity = req.body.quantity;
        
        db.query(`UPDATE item SET remaining_quantity = remaining_quantity - ${quantity} WHERE item_id = '${itemId}'`);
    }
});

module.exports = router;