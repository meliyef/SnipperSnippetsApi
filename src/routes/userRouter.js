const express = require('express');
const { hashPassword, comparePassword } = require('../../encryption');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Temporary in-memory "database" for users
let users = [{
    "id": 1,  // Add an id field for each user
    "email": "user@example.com",
    "password": "mysecretpassword"
}];

// User Registration
router.post('/users', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if the user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password before saving
    const hashedPassword = await hashPassword(password);
    const newUser = { id: users.length + 1, email, password: hashedPassword }; // Assign an ID to the new user
    users.push(newUser);

    res.status(201).json({ message: "User created successfully" });
});

// User Login (Verification)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const user = users.find(u => u.email === email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatching = await comparePassword(password, user.password);
    if (!isMatching) return res.status(401).json({ message: "Invalid credentials" });

    // Create a JWT payload with user ID and email
    const payload = {
        userId: user.id,
        email: user.email
    };

    // Sign the JWT with a secret key and set an expiration time (24 hours)
    const token = jwt.sign(payload, 'your-secret-key', { expiresIn: '24h' });

    res.json({ token });  // Send the token to the user
});

// Authentication Middleware (JWT verification)
async function authenticate(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];  // Expecting "Bearer <token>"

    if (!token) {
        return res.status(400).json({ message: "Token is required" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, 'your-secret-key');
        req.user = decoded; // Store the decoded user info in the request object
        next();  // Proceed to the next handler
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
}

// Protected route for fetching the user data (without password)
router.get('/user', authenticate, (req, res) => {
    const { password, ...userWithoutPassword } = req.user;  // Remove password from response
    res.json(userWithoutPassword);  // Send the user data without the password
});

module.exports = router;
