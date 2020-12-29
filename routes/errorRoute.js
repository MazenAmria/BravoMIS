const { Router } = require('express');
const router = Router();
const { managerMenu, vendingManagerMenu, cashierMenu, guestMenu } = require('../assets/js/defaultMenues');

router.get("*", (req, res) => {
    res.render('error404', {
        name: res.locals.name,
        role: res.locals.role
    });
});

module.exports = router;
