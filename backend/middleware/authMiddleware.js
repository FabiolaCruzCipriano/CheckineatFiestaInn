// backend/middleware/authMiddleware.js
const authenticateSession = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } else {
        res.status(401).json({ error: 'No autenticado' });
    }
};

module.exports = { authenticateSession };
