const { Router } = require('express');
const router = Router();

const {
    getAllProcesses,
    getProcessesByManager,
    getProcessesByVendor,
    addProcess
} = require('../services/vendingProcessesService');

router.get('/vending-processes', (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else if (res.locals.role.toLowerCase().match(/vending manager/)) {
        res.render('vendingProcesses', {
            tabs: [
                {title: 'سجل الاستيراد', path: `api/vending-processes/${res.locals.username}`},
                {title: 'سجل الاستيراد العام', path: `api/vending-processes`},
                {title: 'توثيق عملية استيراد', path: `api/vending-processes/new`}
            ]
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

router.get('/api/vending-processes', (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else if (res.locals.role.toLowerCase().match(/vending manager/)) {
        getAllProcesses((err, data) => {
            if (err) res.status(502).send(err);
            else res.json(data);
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

router.get('/api/vending-processes/new', (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else if (res.locals.role.toLowerCase().match(/vending manager/)) {
        res.render('newVendingProcessTemplate');
    } else {
        res.status(404).send('Unauthorized');
    }
});

router.post('/api/vending-processes/new', (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else if (res.locals.role.toLowerCase().match(/vending manager/)) {
        addProcess({
            vending_date: new Date(),
            vendor_id: req.body.vendor_id,
            vending_manager_id: res.locals.username
        }, req.body.items, (err) => {
            if (err) res.status(502).send(err);
            else res.send();
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

router.get('/api/vending-processes/:username', (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else if (
        res.locals.role.toLowerCase().match(/vending manager/) &&
        res.locals.username === req.params.username
    ) {
        getProcessesByManager(res.locals.username, (err, data) => {
            if (err) res.status(502).send(err);
            else res.json(data);
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

router.get('/api/vending-processes/vendor/:vendorId', (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else if (res.locals.role.toLowerCase().match(/vending manager/)) {
        getProcessesByVendor(req.params.vendorId, (err, data) => {
            if (err) res.status(502).send(err);
            else res.json(data);
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

module.exports = router;
