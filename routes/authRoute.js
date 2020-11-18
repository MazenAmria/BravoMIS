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
        console.log(res.locals);
        res.render('home', {title: 'لوحة التحكم', name: res.locals.name, role: res.locals.role, location: 'home'});
    }
});

router.get('/logout', (req, res) => {
    res.cookie('jwt', '', {maxAge: 0});
    res.redirect('/login');
});

router.post('/login', (req, res) => {
    let invalidState = (req.body == null || req.body.username == null || req.body.password == null);
    let fobiddenText = new RegExp("'|#|--");
    if (invalidState) {
        res.status(401).send('invalid');
    } else if (fobiddenText.test(req.body.username) || fobiddenText.test(req.body.password)) {
        res.status(401).send('forbidden');
    } else {
        db.query(`select emp_password, emp_name, emp_role from employees where emp_id = '${req.body.username}'`, (err, results) => {
            if (results.length !== 1) {
                res.status(401).send('wrong');
            } else {
                if (bcrypt.compareSync(req.body.password, results[0].emp_password)) {
                    const token = createToken(req.body.username, results[0].emp_name, results[0].emp_role);
                    res.cookie('jwt', token, {httpOnly: true, maxAge: 5 * 1000});
                    res.status(200).json({username:req.body.username});
                }else{
                    res.status(401).send('wrong');
                }
            }
        });
    }
});

module.exports = router;
