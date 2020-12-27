const { Router } = require('express');
const router = Router();
const { adminMenu, supplierMenu, cashierMenu, guestMenu } = require('../assets/js/defaultMenues');



router.get("*", (req, res) => {
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
    res.render('error404', {
        title: 'الصفحة غير موجودة!',
        name: res.locals.name,
        role: res.locals.role,
        menu: menu,
        location: '404'
    });
});




module.exports = router;