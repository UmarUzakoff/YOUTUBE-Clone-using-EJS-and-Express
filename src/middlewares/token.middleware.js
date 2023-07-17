const jwt = require('../utils/jwt');

exports.tokenMiddleware = (req,res,next) => {
    try {
        const {token} = req.cookies;
        if (!token) {
            return res.redirect("/auth/login");
        }
        const verifiedUser = jwt.verify(token);
        req.verifiedUser = verifiedUser.id;
        next();
    } catch (error) {
        res.redirect("/auth/login");
    }
};