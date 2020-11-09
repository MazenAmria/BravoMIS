const {Router} = require('express');
const db = require('../dbConnection');
const bcrypt = require('bcrypt');
const {createToken} = require('../middlewares/authMiddleware');
const router = Router();

router.get('/login', (req, res) => {
    if (res.statusCode === 440) {
        res.render('login', {title: 'تسجيل الدخول'});
    } else {
        res.redirect('/');
    }
});

router.get('/', (req, res) => {
    if (res.statusCode === 440) {
        res.redirect('/login');
    } else {
        res.render('home', {title: 'الرئيسية'});
    }
});

router.get('/logout', (req, res) => {
    res.cookie('jwt', '', {maxAge: 0});
    res.redirect('/login');
});

router.post('/login', async (req, res) => {
    let invalidState = (req.body == null || req.body.username == null || req.body.password == null);
    if (invalidState) {
        res.status(401).send('invalid');
    } else if (req.body.username.includes("'") || req.body.username.includes("#") || req.body.password.includes("'") || req.body.password.includes("#")) {
        res.status(401).send('suspicious');
    } else {
        db.query(`select * from employees where emp_id = '${req.body.username}'`, (err, results) => {
            if (results.length != 1) {
                res.status(401).send('wrong');
            } else {
                if (bcrypt.compareSync(req.body.password, results[0].emp_password)) {
                    const token = createToken(results[0].emp_id);
                    res.cookie('jwt', token, {httpOnly: true, maxAge: 5 * 1000});
                    res.status(200).json({username:results[0].emp_id});
                }else{
                    res.status(401).send('wrong');
                }
            }
        });
    }
});

module.exports = router;
