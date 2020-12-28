const { Router } = require('express');
const router = Router();
const { adminMenu, vendingManagerMenu, cashierMenu, guestMenu } = require('../assets/js/defaultMenues');



router.get("*", (req, res) => {
    let menu;
    let role = res.locals.role.toLowerCase();
    switch (true) {
        case /.*cashier.*/.test(role):
            menu = cashierMenu;
            break;
        case /.*vending manager.*/.test(role):
            menu = vendingManagerMenu;
            break;
        case /.*manager.*/.test(role):
            menu = adminMenu;
            break;
        default:
            menu = guestMenu;
    }
    res.render('error404', {
        title: 'الصفحة غير موجودة!',
        name: res.locals.name,
        role: res.locals.role,
        menu: menu,
        location: '404'
    });
});




module.exports = router;
