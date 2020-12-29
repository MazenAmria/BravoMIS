const { Router } = require('express');
const router = Router();
const { getAllRequests } = require('../services/requestsService');
const { managerMenu, vendingManagerMenu } = require('../assets/js/defaultMenues')

router.get('/requests', (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else if (res.locals.role.toLowerCase().match(/.*vending manager.*/)) {
        res.render('vendingManagerRequests', {
            name: res.locals.name,
            role: res.locals.role
        });
    } else if (res.locals.role.toLowerCase().match(/.*manager.*/)) {
        res.render('managerRequests', {
            name: res.locals.name,
            role: res.locals.role
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

router.get('/requests/api', (req, res) =>{
    if (res.status === 440) {
        res.redirect('/login');
    } else {
        getAllRequests((err, data) => {
            res.json(data);
        });
    }
});

module.exports = router;
