const addUserToRequest = (req, res, next) => {
    // Assuming user information is stored in req.user
    if (req.user && req.user.email) {
        res.locals.userEmail = req.user.email;
    } else {
        res.locals.userEmail = null;
    }
    next();
}
module.exports = addUserToRequest;
