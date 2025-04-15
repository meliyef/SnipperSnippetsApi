// src/routes/userRouter.js
const express = require('express');
const { requiresAuth } = require('express-openid-connect'); // Import Auth0 middleware
const router = express.Router();  // Only declare router once

// Get user profile (protected route)
router.get('/', requiresAuth(), (req, res) => {
    res.json(req.oidc.user);  // Return the authenticated user's profile
});

module.exports = router;
