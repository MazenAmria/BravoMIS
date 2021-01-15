const { Router } = require('express');
const router = Router();

const {
    getAllVendors,
    addVendor
} = require('../services/vendorsService');

router.get('/vendors', (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else if (res.locals.role.toLowerCase().match(/vending manager/)) {
        res.render('vendors', {
            tabs: [
                {title: 'الموردون', path: `api/vendors`},
                {title: 'إضافة مورّد', path: `api/vendors/new`}
            ]
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

router.get('/api/vendors/new', (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else if (
        res.locals.role.toLowerCase().match(/vending manager/)
    ) {
        res.render('newVendorTemplate');
    } else {
        res.status(404).send('Unauthorized');
    }
});

router.post('/api/vendors/new', (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else if (
        res.locals.role.toLowerCase().match(/vending manager/)
    ) {
        addVendor(req.body.vendor, (err) => {
            if (err) {
                console.log(err)
                res.status(502).send(err);
            }
            else res.send();
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

router.get('/api/vendors', (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else if (
        res.locals.role.toLowerCase().match(/vending manager/)
    ) {
        getAllVendors((err, data) => {
            if (err) res.status(502).send(err);
            else res.json(data);
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});


module.exports = router;
