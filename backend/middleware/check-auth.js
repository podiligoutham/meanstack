const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, 'secret_this_should_be_longer');
    req.userData = {email: decodedToken.email, userId: decodedToken.userId}
    next();
    } catch (err) {
        res.status(404).json({
            message: 'Authentication failed in check-auth'
        });
    }

};
