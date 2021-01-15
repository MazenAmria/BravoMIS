const { Router } = require('express');
const router = Router();
const {
    getAllUnassignedRequests,
    getOwnUnassignedRequests,
    getUnresolvedRequests,
    getOwnUnresolvedRequests,
    getResolvedRequests,
    getOwnResolvedRequests,
    getRequestItems,
    addRequest
} = require('../services/requestsService');

const {
    getAllItems,
    getItemByID
} = require('../services/itemsService');

router.get('/requests', (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else if (res.locals.role.toLowerCase().match(/vending manager/)) {
        res.render('requests', {
            name: res.locals.name,
            role: res.locals.role,
            tabs: [
                {title: 'الطلبات الموكلة إليّ', path: `api/requests/assigned/vm/${res.locals.username}`, method: 'GET'},
                {title: 'كافة الطلبات', path: 'api/requests/requested/vm', method: 'GET'},
                {title: 'أرشيف الطلبات', path: `api/requests/resolved/vm/${res.locals.username}`, method: 'GET'},
            ]
        });
    } else if (res.locals.role.toLowerCase().match(/manager/)) {
        res.render('requests', {
            name: res.locals.name,
            role: res.locals.role,
            tabs: [
                {title: 'الطلبات المقدمة', path: `api/requests/requested/m/${res.locals.username}`, method: 'GET'},
                {title: 'الطلبات الجارية', path: `api/requests/assigned/m/${res.locals.username}`, method: 'GET'},
                {title: 'أرشيف الطلبات', path: `api/requests/resolved/m/${res.locals.username}`, method: 'GET'},
                {title: 'إنشاء طلب جديد', path: 'api/requests/new', method: 'GET'}
            ]
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

router.get('/api/requests/new', (req, res) => {
    if (res.status === 440) {
        res.redirect('/login');
    } else if (
        res.locals.role.toLowerCase().match(/manager/)
    ) {
        res.render('newRequestTemplate');
    } else {
        res.status(404).send('Unauthorized');
    }
});

router.post('/api/requests/new', (req, res) => {
    if (res.status === 440) {
        res.redirect('/login');
    } else if (
        res.locals.role.toLowerCase().match(/manager/)
    ) {
        addRequest({
            before_date: req.body.beforeDate,
            request_time: new Date(),
            manager_id: res.locals.username
        }, req.body.items, (err) => {
            if (err) res.status(502).send(err);
            else res.status(200).send();
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

router.get('/api/requests/:requestID', (req, res) => {
    if (res.status === 440) {
        res.redirect('/login');
    } else if (
        res.locals.role.toLowerCase().match(/manager/) ||
        res.locals.role.toLowerCase().match(/vending manager/)
    ) {
        getRequestItems(req.params.requestID, (err, data) => {
            if (err) res.status(502).send(err);
            else res.json(data);
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

router.get('/api/requests/requested/vm', (req, res) => {
    if (res.status === 440) {
        res.redirect('/login');
    } else if (res.locals.role.toLowerCase().match(/vending manager/)) {
        getAllUnassignedRequests((err, data) => {
            if (err) res.status(502).send(err);
            else res.json(data);
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

router.get('/api/requests/assigned/vm/:username', (req, res) => {
    if (res.status === 440) {
        res.redirect('/login');
    } else if (
        res.locals.username === req.params.username &&
        res.locals.role.toLowerCase().match(/vending manager/)
    ) {
        getUnresolvedRequests(req.params.username, (err, data) => {
            if (err) res.status(502).send(err);
            else res.json(data);
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

router.get('/api/requests/resolved/vm/:username', (req, res) => {
    if (res.status === 440) {
        res.redirect('/login');
    } else if (
        res.locals.username === req.params.username &&
        res.locals.role.toLowerCase().match(/vending manager/)
    ) {
        getResolvedRequests(req.params.username, (err, data) => {
            if (err) res.status(502).send(err);
            else res.json(data);
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

router.get('/api/requests/requested/m/:username', (req, res) => {
    if (res.status === 440) {
        res.redirect('/login');
    } else if (
        res.locals.username === req.params.username &&
        res.locals.role.toLowerCase().match(/manager/)
    ) {
        getOwnUnassignedRequests(req.params.username, (err, data) => {
            if (err) res.status(502).send(err);
            else res.json(data);
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

router.get('/api/requests/assigned/m/:username', (req, res) => {
    if (res.status === 440) {
        res.redirect('/login');
    } else if (
        res.locals.username === req.params.username &&
        res.locals.role.toLowerCase().match(/manager/)
    ) {
        getOwnUnresolvedRequests(req.params.username, (err, data) => {
            if (err) res.status(502).send(err);
            else res.json(data);
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

router.get('/api/requests/resolved/m/:username', (req, res) => {
    if (res.status === 440) {
        res.redirect('/login');
    } else if (
        res.locals.username === req.params.username &&
        res.locals.role.toLowerCase().match(/manager/)
    ) {
        getOwnResolvedRequests(req.params.username, (err, data) => {
            if (err) res.status(502).send(err);
            else res.json(data);
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

router.get('/api/items', (req, res) => {
    if (res.status === 440) {
        res.redirect('/login');
    } else if (
        res.locals.role.toLowerCase().match(/manager/)
    ) {
        getAllItems((err, data) => {
            if (err) res.status(502).send(err);
            else res.json(data);
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

router.get('/api/items/:itemId', (req, res) => {
    if (res.status === 440) {
        res.redirect('/login');
    } else if (
        res.locals.role.toLowerCase().match(/manager/)
    ) {
        getItemByID(req.params.itemId, (err, data) => {
            if (err) res.status(502).send(err);
            else res.json(data);
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

module.exports = router;
