const { Router } = require('express');
const router = Router();

router.get('/tenders', (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else if (res.locals.role.toLowerCase().match(/vending manager/)) {
        res.render('tenders', {
            name: res.locals.name,
            role: res.locals.role,
            tabs: [
                {title: 'المناقصات الجارية', path: `api/requests/assigned/${res.locals.username}`, method: 'GET'},
                {title: 'المناقصات المغلقة', path: 'api/requests/requested', method: 'GET'},
                {title: 'أرشيف المناقصات', path: `api/requests/resolved-by/${res.locals.username}`, method: 'GET'},
            ]
        });
    } else {
        res.status(404).send('Unauthorized');
    }
});

module.exports = router;
