    // requirements
    function requireLogin(req, res, next) {
        if (req.session && req.session.email) {
            return next();
        } else {
            res.redirect("/login");
        }
    }


module.exports = requireLogin;