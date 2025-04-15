const seedData = require('../../data/seedData.json');
const express = require('express');
const { requiresAuth } = require('express-openid-connect'); // Import Auth0 middleware
const router = express.Router();

const snippets = seedData;

// Protected route: Get all snippets
router.get('/', requiresAuth(), (req, res) => {
    res.json(snippets);
});

// Protected route: Add a new snippet
router.post('/', requiresAuth(), (req, res) => {
    const { language, code } = req.body;
    const newSnippet = { id: snippets.length + 1, language, code };
    snippets.push(newSnippet);
    res.status(201).json(newSnippet);
});

// Protected route: Get a snippet by ID
router.get('/:id', requiresAuth(), (req, res) => {
    const snippet = snippets.find(s => s.id === parseInt(req.params.id));
    if (!snippet) {
        return res.status(404).send('Snippet not found');
    }
    res.json(snippet);
});

module.exports = router;