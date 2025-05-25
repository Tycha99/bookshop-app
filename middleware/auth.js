function requireRole(role) {
    return function (req, res, next) {
        if (req.session.user && req.session.user.role === role) {
            next();
        } else {
            res.status(403).send('Доступ запрещён');
        }
    }
}

function requireRoles(roles) {
    return function (req, res, next) {
        if (req.session.user && roles.includes(req.session.user.role)) {
            next();
        } else {
            res.status(403).send('Доступ запрещён');
        }
    }
}

function requireAuth(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

module.exports = { requireRole, requireRoles, requireAuth };
