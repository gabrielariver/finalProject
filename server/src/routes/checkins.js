import express from 'express';
import Checkin from '../models/Checkin.js';
import Habit from '../models/Habit.js';
import { requireClient, validateObjectId } from '../middleware/requireClient.js';
const router = express.Router();

router.post('/today', requireClient, async (req, res, next) => {
  try {
    const { habitId } = req.body || {};
    
    if (!habitId) {
      return res.status(400).json({ 
        error: 'Validation Error', 
        message: 'habitId is required' 
      });
    }
    
    // Validar formato de ObjectId
    if (!/^[0-9a-fA-F]{24}$/.test(habitId)) {
      return res.status(400).json({ 
        error: 'Validation Error', 
        message: 'habitId must be a valid MongoDB ObjectId' 
      });
    }
    
    // Verificar que el hábito existe y pertenece al usuario
    const habit = await Habit.findOne({ _id: habitId, clientId: req.clientId });
    if (!habit) {
      return res.status(404).json({ 
        error: 'Not Found', 
        message: 'Habit not found or does not belong to you' 
      });
    }
    
    const day = new Date().toISOString().slice(0, 10);
    const existing = await Checkin.findOne({ clientId: req.clientId, habitId, day });
    
    if (existing) { 
      await existing.deleteOne(); 
      return res.json({ 
        toggled: false, 
        message: 'Check-in removed',
        day,
        habitName: habit.name
      }); 
    }

    await Checkin.create({ clientId: req.clientId, habitId, day });
    res.json({ 
      toggled: true, 
      message: 'Check-in added',
      day,
      habitName: habit.name
    });
  } catch (error) {
    next(error);
  }
});

router.get('/today', requireClient, async (req, res, next) => {
  try {
    const day = new Date().toISOString().slice(0, 10);
    const checkins = await Checkin.find({ clientId: req.clientId, day })
      .populate('habitId', 'name emoji color')
      .sort({ createdAt: -1 });
    
    const habitIds = checkins.map(c => c.habitId._id.toString());
    const habitsWithDetails = checkins.map(c => ({
      habitId: c.habitId._id,
      habitName: c.habitId.name,
      habitEmoji: c.habitId.emoji,
      habitColor: c.habitId.color,
      checkedAt: c.createdAt
    }));
    
    res.json({ 
      habitIds, 
      day,
      habits: habitsWithDetails,
      total: checkins.length
    });
  } catch (error) {
    next(error);
  }
});

router.get('/habit/:habitId', requireClient, validateObjectId, async (req, res, next) => {
  try {
    const { habitId } = req.params;
    const { limit = 30, page = 1 } = req.query;
    
    // Verificar que el hábito existe y pertenece al usuario
    const habit = await Habit.findOne({ _id: habitId, clientId: req.clientId });
    if (!habit) {
      return res.status(404).json({ 
        error: 'Not Found', 
        message: 'Habit not found' 
      });
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const checkins = await Checkin.find({ 
      clientId: req.clientId, 
      habitId 
    })
    .sort({ day: -1 })
    .limit(parseInt(limit))
    .skip(skip);
    
    const total = await Checkin.countDocuments({ 
      clientId: req.clientId, 
      habitId 
    });
    
    res.json({
      checkins,
      habit: {
        id: habit._id,
        name: habit.name,
        emoji: habit.emoji,
        color: habit.color
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// Obtener estadísticas de check-ins por semana
router.get('/stats/weekly', requireClient, async (req, res, next) => {
  try {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Domingo
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sábado
    endOfWeek.setHours(23, 59, 59, 999);
    
    const startDay = startOfWeek.toISOString().slice(0, 10);
    const endDay = endOfWeek.toISOString().slice(0, 10);
    
    const checkins = await Checkin.find({
      clientId: req.clientId,
      day: { $gte: startDay, $lte: endDay }
    }).populate('habitId', 'name emoji color');
    
    // Agrupar por día
    const weeklyStats = {};
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    
    days.forEach((day, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      const dateStr = date.toISOString().slice(0, 10);
      
      weeklyStats[day] = {
        date: dateStr,
        checkins: checkins.filter(c => c.day === dateStr).length,
        habits: checkins.filter(c => c.day === dateStr).map(c => ({
          name: c.habitId.name,
          emoji: c.habitId.emoji,
          color: c.habitId.color
        }))
      };
    });
    
    res.json({
      weeklyStats,
      summary: {
        totalCheckins: checkins.length,
        startDate: startDay,
        endDate: endDay
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
