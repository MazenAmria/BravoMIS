const { Router } = require('express');
const router = Router();
const {
    getOffersByRequestId
} = require('../services/offersService');

router.get('/api/offers/:id', (req, res) => {
    if (res.status === 440) {
        res.redirect('/login');
    } else if (
        res.locals.role.toLowerCase().match(/vending manager/)
    ) {
        getOffersByRequestId(req.params.id, (err, data) => {
            if (err) res.status(502).send(err);
            res.json(data);
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

module.exports = router;
