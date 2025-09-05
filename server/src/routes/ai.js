import express from 'express';
import { requireClient } from '../middleware/requireClient.js';
import { GeminiService } from '../services/geminiService.js';
import Habit from '../models/Habit.js';

const router = express.Router();
const geminiService = new GeminiService();

// Sugerir hábitos con IA
router.post('/suggest', requireClient, async (req, res) => {
  try {
    const { age, interests, goals } = req.body || {};
    
    // Obtener hábitos actuales del usuario
    const currentHabits = await Habit.find({ clientId: req.clientId });
    const currentHabitNames = currentHabits.map(h => h.name);
    
    const userProfile = {
      age,
      interests,
      goals,
      currentHabits: currentHabitNames
    };
    
    const suggestions = await geminiService.suggestHabits(userProfile);
    
    res.json({
      suggestions,
      message: 'Hábitos sugeridos por IA'
    });
  } catch (error) {
    console.error('Error in AI suggestions:', error);
    res.status(500).json({ 
      error: 'Error al generar sugerencias',
      message: error.message 
    });
  }
});

// Explicar un hábito específico
router.post('/explain', requireClient, async (req, res) => {
  try {
    const { habitName } = req.body || {};
    
    if (!habitName) {
      return res.status(400).json({ error: 'habitName is required' });
    }
    
    const explanation = await geminiService.explainHabit(habitName);
    
    res.json({
      habitName,
      explanation
    });
  } catch (error) {
    console.error('Error explaining habit:', error);
    res.status(500).json({ 
      error: 'Error al explicar el hábito',
      message: error.message 
    });
  }
});

export default router;
