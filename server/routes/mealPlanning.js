const express = require('express');
const router = express.Router();
const MealPlan = require('../models/MealPlan'); // Assuming MealPlan is a Mongoose model
const { body, validationResult } = require('express-validator');

// Create a new meal plan
router.post('/meal-plans', 
  body('userId').isMongoId(),
  body('meals').isArray(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, meals } = req.body;

    try {
      const mealPlan = new MealPlan({ userId, meals });
      await mealPlan.save();
      res.status(201).json(mealPlan);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
});

// Get meal plans for a user
router.get('/meal-plans/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const mealPlans = await MealPlan.find({ userId });
    res.status(200).json(mealPlans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a meal plan
router.put('/meal-plans/:id', 
  body('meals').isArray(),
  async (req, res) => {
    const { id } = req.params;
    const { meals } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const mealPlan = await MealPlan.findByIdAndUpdate(id, { meals }, { new: true });
      if (!mealPlan) {
        return res.status(404).json({ message: 'Meal plan not found' });
      }
      res.status(200).json(mealPlan);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
});

// Delete a meal plan
router.delete('/meal-plans/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const mealPlan = await MealPlan.findByIdAndDelete(id);
    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;