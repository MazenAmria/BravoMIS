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

            res.render('categories', {
                title: 'الأصناف',
                role: res.locals.role
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

module.exports = router;