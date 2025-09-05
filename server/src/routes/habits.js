import express from 'express';
import Habit from '../models/Habit.js';
import Checkin from '../models/Checkin.js';
import { requireClient, validateObjectId } from '../middleware/requireClient.js';
import { StatsService } from '../services/statsService.js';
const router = express.Router();

// Validación de datos de hábito
const validateHabitData = (req, res, next) => {
  const { name, color, emoji } = req.body || {};
  
  if (!name?.trim()) {
    return res.status(400).json({ 
      error: 'Validation Error', 
      message: 'Name is required and cannot be empty' 
    });
  }
  
  if (name.trim().length > 100) {
    return res.status(400).json({ 
      error: 'Validation Error', 
      message: 'Name cannot exceed 100 characters' 
    });
  }
  
  if (color && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
    return res.status(400).json({ 
      error: 'Validation Error', 
      message: 'Color must be a valid hex color code' 
    });
  }
  
  if (emoji && emoji.length > 2) {
    return res.status(400).json({ 
      error: 'Validation Error', 
      message: 'Emoji cannot exceed 2 characters' 
    });
  }
  
  next();
};

router.get('/', requireClient, async (req, res, next) => {
  try {
    const habits = await Habit.find({ clientId: req.clientId })
      .sort({ createdAt: -1 })
      .limit(50); // Limitar a 50 hábitos máximo
    
    // Agregar estadísticas a cada hábito
    const habitsWithStats = await Promise.all(
      habits.map(async (habit) => {
        const stats = await StatsService.getHabitStats(req.clientId, habit._id);
        return {
          ...habit.toObject(),
          stats
        };
      })
    );

    res.json(habitsWithStats);
  } catch (error) {
    next(error);
  }
});

router.post('/', requireClient, validateHabitData, async (req, res, next) => {
  try {
    const { name, color, emoji } = req.body;
    
    // Verificar que no haya demasiados hábitos
    const habitCount = await Habit.countDocuments({ clientId: req.clientId });
    if (habitCount >= 50) {
      return res.status(400).json({ 
        error: 'Limit Exceeded', 
        message: 'Maximum of 50 habits allowed per user' 
      });
    }
    
    const habit = await Habit.create({
      clientId: req.clientId,
      name: name.trim(),
      color: color || '#7c3aed',
      emoji: emoji || '🔥'
    });
    
    // Agregar estadísticas iniciales
    const stats = await StatsService.getHabitStats(req.clientId, habit._id);
    res.status(201).json({ ...habit.toObject(), stats });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', requireClient, validateObjectId, validateHabitData, async (req, res, next) => {
  try {
    const { name, color, emoji } = req.body;
    
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, clientId: req.clientId },
      { 
        name: name.trim(),
        ...(color && { color }),
        ...(emoji && { emoji })
      },
      { new: true, runValidators: true }
    );
    
    if (!habit) {
      return res.status(404).json({ 
        error: 'Not Found', 
        message: 'Habit not found' 
      });
    }
    
    const stats = await StatsService.getHabitStats(req.clientId, habit._id);
    res.json({ ...habit.toObject(), stats });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireClient, validateObjectId, async (req, res, next) => {
  try {
    const habit = await Habit.findOneAndDelete({ 
      _id: req.params.id, 
      clientId: req.clientId 
    });
    
    if (!habit) {
      return res.status(404).json({ 
        error: 'Not Found', 
        message: 'Habit not found' 
      });
    }
    
    // Eliminar todos los check-ins asociados
    await Checkin.deleteMany({ 
      clientId: req.clientId, 
      habitId: req.params.id 
    });
    
    res.json({ 
      message: 'Habit deleted successfully',
      deletedHabit: habit.name
    });
  } catch (error) {
    next(error);
  }
});

router.get('/stats', requireClient, async (req, res, next) => {
  try {
    const habits = await Habit.find({ clientId: req.clientId });
    const stats = await StatsService.getAllHabitsStats(req.clientId, habits);
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

export default router;
