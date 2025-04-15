// routes/profileRouter.js
const express = require('express');
const { requiresAuth } = require('express-openid-connect');
const router = express.Router();

// Public route
router.get('/', (req, res) => {
    res.json({ message: 'This is a public route, no authentication required.' });
});

// Protected route
router.get('/protected', requiresAuth(), (req, res) => {
    res.json({ 
        message: 'This is a protected route, only accessible to authenticated users.',
        user: req.oidc.user
    });
});

module.exports = router;
