const jwt = require('jsonwebtoken');
const tokenAge = 60 * 60;
const ignored = '/logout';

const createToken = (username, name, role) => {
    return jwt.sign({username, name, role}, 'sxe)h2Zqvg6@esVyVt-tIllq6D6gR^2@Q&%eXaHqA3!RV*H_+x', {
        expiresIn: tokenAge,
    });
}

// Authentication Middleware
const reqAuth = (req, res, next) => {
    if (req.path.match(ignored)) {
        res.status(440);
    } else {
        const token = req.cookies.jwt;

        // check the token is exists & verified
        if (token) {
            jwt.verify(token, 'sxe)h2Zqvg6@esVyVt-tIllq6D6gR^2@Q&%eXaHqA3!RV*H_+x', (err, decodedToken) => {
                if (err) {
                    res.locals.username = null;
                    res.status(440);
                } else {
                    const token = createToken(decodedToken.username, decodedToken.name, decodedToken.role);
                    res.cookie('jwt', token, {httpOnly: true, maxAge: tokenAge * 1000});
                    res.locals.username = decodedToken.username;
                    res.locals.name = decodedToken.name;
                    res.locals.role = decodedToken.role;
                }
            });
        } else {
            res.locals.username = null;
            res.status(440);
        }
    }
    next();
}

module.exports = {createToken, reqAuth};
