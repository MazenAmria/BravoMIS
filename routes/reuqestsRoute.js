const { Router } = require('express');
const router = Router();
const { getAllRequests } = require('../services/requestsService');
const { managerMenu, vendingManagerMenu } = require('../assets/js/defaultMenues')

router.get('/requests', (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else if (res.locals.role.toLowerCase().match(/.*vending manager.*/)) {
        getAllRequests((err, requests) => {
            if (err) res.redirect('/');
            else {
                res.render('vendingManagerRequests', {
                    title: 'requests',
                    name: res.locals.name,
                    role: res.locals.role,
                    menu: vendingManagerMenu,
                    location: 'requests',
                    requests: requests
                });
            }
        });
    } else if (res.locals.role.toLowerCase().match(/.*manager.*/)) {
        getAllRequests((err, requests) => {
            if (err) res.redirect('/');
            else {
                res.render('managerRequests', {
                    title: 'requests',
                    name: res.locals.name,
                    role: res.locals.role,
                    menu: managerMenu,
                    location: 'requests',
                    requests: requests
                });
            }
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

router.post('/requests', (req, res) =>{
    if (res.status === 440) {
        res.redirect('/login');
    } else {
        res.json([
            {Test1: 'Test', Test2: 'Test', Test3: 'Test', Test4: 'Test'},
            {Test1: 'Test', Test2: 'Test', Test3: 'Test', Test4: 'Test'},
            {Test1: 'Test', Test2: 'Test', Test3: 'Test', Test4: 'Test'},
            {Test1: 'Test', Test2: 'Test', Test3: 'Test', Test4: 'Test'},
            {Test1: 'Test', Test2: 'Test', Test3: 'Test', Test4: 'Test'},
            {Test1: 'Test', Test2: 'Test', Test3: 'Test', Test4: 'Test'},
            {Test1: 'Test', Test2: 'Test', Test3: 'Test', Test4: 'Test'}
        ]);
    }
});

module.exports = router;
