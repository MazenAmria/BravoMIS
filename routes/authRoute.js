const { Router } = require('express');
const db = require('../dbConnection');
const jwt = require('jsonwebtoken');
const {reqAuth, checkUser} = require('../middlewares/authMiddleware');
const router = Router();

const createToken = (username) => {
    return jwt.sign({username}, 'sxe)h2Zqvg6@esVyVt-tIllq6D6gR^2@Q&%eXaHqA3!RV*H_+x', {
        expiresIn: 60 * 60 * 24
    });
}
router.get('/login', (req, res) => {
    if(res.locals.username == null)
        res.render('login', {title: 'تسجيل الدخول'});
    else
        res.redirect('/');
});

router.get('/', reqAuth, (req, res) => {
    res.render('home', {title: 'الرئيسية'});
});

router.get('/logout', (req, res) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/login');
});

router.post('/login', (req, res) => {
    console.log(req.body);
    db.query(`select * from employees where emp_id = '${req.body.username}'`, (err, results) => {
        console.log(results);
        if(results.length == 0 || req.body.password !== results[0].emp_password){
            res.status(401).send('wrong');
        }else{
            const token = createToken(req.body.username);
            res.cookie('jwt', token, {httpOnly: true, maxAge: 60 * 60 * 24 * 1000});
            res.status(200).json({username:req.body.username});
        }
    });
});

module.exports = router;