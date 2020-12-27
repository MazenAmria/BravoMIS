const { Router } = require('express');
const db = require('../dbConnection');
const bcrypt = require('bcrypt');
const router = Router();
const { adminMenu, supplierMenu, cashierMenu, guestMenu } = require('../assets/js/defaultMenues');

router.get('/employees', (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        let menu;
        let role = res.locals.role.toLowerCase();
        switch (true) {
            case /.*cashier.*/.test(role):
                menu = cashierMenu;
                break;
            case /.*supplier.*/.test(role):
                menu = supplierMenu;
                break;
            case /.*manager.*/.test(role):
                menu = adminMenu;
                break;
            default:
                menu = guestMenu;
        }
        if(role == 'manager'){
            res.render('employees', {
                title: 'الموظفين',
                name: res.locals.name,
                role: res.locals.role,
                menu: menu,
                location: 'employees'
            });
        }else{
            res.status(404).send('Not Found');
        }
    }
});










module.exports = router;