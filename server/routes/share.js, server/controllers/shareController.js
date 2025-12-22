// server/routes/share.js
const express = require('express');
const router = express.Router();
const shareController = require('../controllers/shareController');

// Route to share a recipe
router.post('/share', shareController.shareRecipe);

module.exports = router;

// server/controllers/shareController.js
const Recipe = require('../models/Recipe'); // Assuming a Recipe model exists
const { v4: uuidv4 } = require('uuid');

exports.shareRecipe = async (req, res) => {
    const { recipeId } = req.body;

    if (!recipeId) {
        return res.status(400).json({ message: 'Recipe ID is required' });
    }

    try {
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        const uniqueLink = `${req.protocol}://${req.get('host')}/recipes/${uuidv4()}`;
        // Here you would save the unique link to the database or send it via email, etc.

        return res.status(200).json({ message: 'Recipe shared successfully', link: uniqueLink });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};