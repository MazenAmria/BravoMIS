const { Router } = require('express');
const router = Router();
const {
    getAllUnresolvedRequests,
    getOwnUnresolvedRequests,
    getOwnResolvedRequests,
    getAssignedRequests,
    getResolvedRequests
} = require('../services/requestsService');

router.get('/requests', (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else if (res.locals.role.toLowerCase().match(/vending manager/)) {
        res.render('requests', {
            name: res.locals.name,
            role: res.locals.role,
            tabs: [
                {title: 'الطلبات الموكلة إليّ', path: `api/requests/assigned/${res.locals.username}`, method: 'GET'},
                {title: 'كافة الطلبات', path: 'api/requests/requested', method: 'GET'},
                {title: 'أرشيف الطلبات', path: `api/requests/resolved-by/${res.locals.username}`, method: 'GET'},
            ]
        });
    } else if (res.locals.role.toLowerCase().match(/manager/)) {
        res.render('requests', {
            name: res.locals.name,
            role: res.locals.role,
            tabs: [
                {title: 'طلباتي الحالية', path: `api/requests/requested/${res.locals.username}`, method: 'GET'},
                {title: 'كافة الطلبات', path: 'api/requests/requested', method: 'GET'},
                {title: 'أرشيف الطلبات', path: `api/requests/resolved-for/${res.locals.username}`, method: 'GET'},
                {title: 'إنشاء طلب جديد', path: 'api/requests/new', method: 'POST'}
            ]
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

router.get('/api/requests/requested', (req, res) => {
    if (res.status === 440) {
        res.redirect('/login');
    } else if (
        res.locals.role.toLowerCase().match(/manager/) ||
        res.locals.role.toLowerCase().match(/vending manager/)
    ) {
        getAllUnresolvedRequests((err, data) => {
            if (err) res.status(502).send(err);
            res.json(data);
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

router.get('/api/requests/requested/:username', (req, res) => {
    if (res.status === 440) {
        res.redirect('/login');
    } else if (
        res.locals.username === req.params.username &&
        res.locals.role.toLowerCase().match(/manager/)
    ) {
        getOwnUnresolvedRequests(req.params.username, (err, data) => {
            if (err) res.status(502).send(err);
            res.json(data);
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

router.get('/api/requests/resolved-for/:username', (req, res) => {
    if (res.status === 440) {
        res.redirect('/login');
    } else if (
        res.locals.username === req.params.username &&
        res.locals.role.toLowerCase().match(/manager/)
    ) {
        getOwnResolvedRequests(req.params.username, (err, data) => {
            if (err) res.status(502).send(err);
            res.json(data);
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

router.get('/api/requests/assigned/:username', (req, res) => {
    if (res.status === 440) {
        res.redirect('/login');
    } else if (
        res.locals.username === req.params.username &&
        res.locals.role.toLowerCase().match(/vending manager/)
    ) {
        getAssignedRequests(req.params.username, (err, data) => {
            if (err) res.status(502).send(err);
            res.json(data);
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

router.get('/api/requests/resolved-by/:username', (req, res) => {
    if (res.status === 440) {
        res.redirect('/login');
    } else if (
        res.locals.username === req.params.username &&
        res.locals.role.toLowerCase().match(/vending manager/)
    ) {
        getResolvedRequests(req.params.username, (err, data) => {
            if (err) res.status(502).send(err);
            res.json(data);
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

router.post('/api/requests/new', (req, res) => {
    res.json('Hello');
});

module.exports = router;
