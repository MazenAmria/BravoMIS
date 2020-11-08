const jwt = require('jsonwebtoken');

// Authentication Middleware
const reqAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // check the token is exists & verified
    if(token){
        jwt.verify(token, 'sxe)h2Zqvg6@esVyVt-tIllq6D6gR^2@Q&%eXaHqA3!RV*H_+x', (err, decodedToken) => {
            if(err){
                res.locals.username = null;
                res.redirect('/login');
            }else{
                res.locals.username = decodedToken.username;
                next();
            }
        });
    }
    else{
        res.locals.username = null;
        res.redirect('/login');
    }
}

// Check User Middleware
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    // check the token is exists & verified
    if(token){
        jwt.verify(token, 'sxe)h2Zqvg6@esVyVt-tIllq6D6gR^2@Q&%eXaHqA3!RV*H_+x', (err, decodedToken) => {
            if(err){
                res.locals.username = null;
                next();
            }else{
                res.locals.username = decodedToken.username;
                next();
            }
        });
    }
    else{
        res.locals.username = null;
        next();
    }
}

module.exports = {reqAuth, checkUser};