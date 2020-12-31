const { Router } = require('express');
const db = require('../dbConnection');
const router = Router();
const { managerMenu, vendingManagerMenu, cashierMenu, guestMenu } = require('../assets/js/defaultMenues');
const {reqAuth} = require('../middlewares/authMiddleware');

router.get('/categories', (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        let role = res.locals.role.toLowerCase();
        
        if(role == 'manager'){
            db.query(`SELECT C.category_name, C.category_id FROM category C`, (err, results) => {
                if(err){
                    console.log(err);
                }else{
                    res.render('categories', {
                        title: 'الأصناف',
                        role: res.locals.role,
                        categories: results
                    });
                }
            });

        
        } else{
            res.status(404).send('Not Found');
        }
    }
});
router.get('/categories/api', (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        let role = res.locals.role.toLowerCase();
        
        if(role == 'manager'){
            db.query(`SELECT * FROM category`, (err, results) => {
                if(err){
                    console.log(err);
                }else{
                    res.json(results);
                }
            });
        }

    }
});
router.post('/add-category', reqAuth, (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        let role = res.locals.role.toLowerCase();
        if(role == 'manager'){
            let categoryName = req.body.categoryName,
                categoryId = req.body.categoryId;

            db.query(`INSERT INTO category VALUE('${categoryId}','${categoryName}')`, (err) => {
                if(err){
                    res.status(409).send('Duplicate');
                }else{
                    res.status(200).send('Success');
                }
            });
        }
    }

});

router.get('/items/api', (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        let role = res.locals.role.toLowerCase();
        
        if(role == 'manager'){
            let update = req.query;
            let query = ``;
            if(Object.keys(update).length == 0){
                query = `SELECT I.item_id, I.item_name, I.selling_price, I.remaining_quantity, C.category_name
                FROM item I, category c
                WHERE I.category_id = C.category_id`;
            }else{
                query = `SELECT I.item_id, I.item_name, I.selling_price, I.remaining_quantity, C.category_name
                FROM item I, category c
                WHERE I.category_id = C.category_id AND C.category_id = '${update.categoryId}'`;
            }
            db.query(query, (err, results) => {
                if(err){
                    console.log(err);
                }else{
                    res.json(results);
                }
            });
        }

    }
});

router.post('/add-item', reqAuth, (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        let role = res.locals.role.toLowerCase();
        if(role == 'manager'){
            let itemName = req.body.itemName,
                itemId = req.body.itemId,
                itemPrice = req.body.itemPrice,
                categoryId = req.body.categoryId;
            db.query(`INSERT INTO item VALUE('${itemId}','${itemName}',${itemPrice},0 ,'${categoryId}')`, (err) => {
                if(err){
                    console.log(err);
                    res.status(409).send('Duplicate');
                }else{
                    res.status(200).send('Success');
                }
            });
        }
    }

});

router.get('/items/edit', (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        let role = res.locals.role.toLowerCase();
        
        if(role == 'manager'){
            let itemsToEdit = Object.values(req.query);
            let itemsArray = `('` + itemsToEdit.join(`','`) + `')`;
            let query = `SELECT I.item_id, I.item_name, I.selling_price, I.remaining_quantity, C.category_name
            FROM item I, category C
            WHERE C.category_id = I.category_id AND I.item_id IN ${itemsArray}`;
            db.query(query, (err, results) => {
                if(err){
                    console.log(err);
                }else{
                    res.render('editItems', {
                        items: results
                    });
                }
            });

        }
    }
});

// Submit edit items route
router.post('/submit-edit-items', reqAuth, (req, res) => {
    let role = res.locals.role.toLowerCase();
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        if(role == 'manager'){
            const itemsToEdit = req.body.itemsToEdit; 
                for(key in itemsToEdit){
                    const itemNameEdit = itemsToEdit[key].itemNameEdit,
                    itemIdEdit = itemsToEdit[key].itemIdEdit,
                    itemPriceEdit = itemsToEdit[key].itemPriceEdit;
                    db.query(`UPDATE item I SET I.item_name = '${itemNameEdit}', I.selling_price = '${itemPriceEdit}' WHERE I.item_id = '${itemIdEdit}'`, (err) => {
                        if(err){
                            res.status(409).send("Failed");
                        }
                    });
                }
                res.status(200).send("Success");

        }
    }
});
//delete 
router.delete('/items/delete', reqAuth, (req, res) => {
    let role = res.locals.role.toLowerCase();
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        if(role == 'manager'){
            const deleteItems = req.body.deleteItems;
            const deleteItemsSQLArray = `('` + deleteItems.join(`','`) + `')`;
            db.query(`DELETE FROM item I WHERE I.item_id IN ${deleteItemsSQLArray}`, (err) => {
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