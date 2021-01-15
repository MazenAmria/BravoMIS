const { Router } = require('express');
const router = Router();
const {
    getOpenTenders,
    getClosedTenders,
    getResolvedTenders,
    createNewTender,
    getOffersSubmissionUrls
} = require('../services/tendersService');

router.get('/tenders', (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else if (res.locals.role.toLowerCase().match(/vending manager/)) {
        res.render('tenders', {
            name: res.locals.name,
            role: res.locals.role,
            tabs: [
                {title: 'المناقصات الجارية', path: `api/tenders/open/${res.locals.username}`},
                {title: 'المناقصات المغلقة', path: `api/tenders/closed/${res.locals.username}`},
                {title: 'أرشيف المناقصات', path: `api/tenders/resolved`}
            ]
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

router.get('/api/tenders/open/:username', (req, res) => {
    if (res.status === 440) {
        res.redirect('/login');
    } else if (
        res.locals.username === req.params.username &&
        res.locals.role.toLowerCase().match(/vending manager/)
    ) {
        getOpenTenders(req.params.username, (err, data) => {
            if (err) res.status(502).send(err);
            res.json(data);
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

router.get('/api/tenders/closed/:username', (req, res) => {
    if (res.status === 440) {
        res.redirect('/login');
    } else if (
        res.locals.username === req.params.username &&
        res.locals.role.toLowerCase().match(/vending manager/)
    ) {
        getClosedTenders(req.params.username, (err, data) => {
            if (err) res.status(502).send(err);
            res.json(data);
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

router.get('/api/tenders/resolved', (req, res) => {
    if (res.status === 440) {
        res.redirect('/login');
    } else if (
        res.locals.role.toLowerCase().match(/vending manager/)
    ) {
        getResolvedTenders((err, data) => {
            if (err) res.status(502).send(err);
            res.json(data);
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

router.get('/api/tenders/new', (req, res) => {
    if (res.status === 440) {
        res.redirect('/login');
    } else if (
        res.locals.role.toLowerCase().match(/vending manager/)
    ) {
        res.render('newTenderTemplate', {
            requestId: req.query.requestId,
            vendingManagerId: res.locals.username
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

router.post('/api/tenders/new', (req, res) => {
    if (res.status === 440) {
        res.redirect('/login');
    } else if (
        res.locals.role.toLowerCase().match(/vending manager/)
    ) {
        req.body.tender.creation_time = new Date();
        createNewTender(req.body.tender, (err) => {
            if (err) res.status(502).send(err);
            else getOffersSubmissionUrls(req.body.tender.request_id, (err, data) => {
                    if (err) res.status(502).send(err);
                    else res.json(data);
                });
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

module.exports = router;
