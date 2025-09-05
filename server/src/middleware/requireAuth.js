export const requireAuth = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ 
            error: 'Unauthorized',
            redirectTo: '/auth/github'
        });
    }
    next();
};