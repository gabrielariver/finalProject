import Checkin from '../models/Checkin.js';

export class StatsService {
  static async getHabitStats(clientId, habitId) {
    const checkins = await Checkin.find({ 
      clientId, 
      habitId 
    }).sort({ day: 1 });

    if (checkins.length === 0) {
      return {
        currentStreak: 0,
        bestStreak: 0,
        completionRate: 0,
        totalDays: 0,
        completedDays: checkins.length
      };
    }

    const today = new Date().toISOString().slice(0, 10);
    const firstCheckin = new Date(checkins[0].day);
    const totalDays = Math.ceil((new Date(today) - firstCheckin) / (1000 * 60 * 60 * 24)) + 1;

    // Calcular racha actual
    const currentStreak = this.calculateCurrentStreak(checkins, today);
    
    // Calcular mejor racha
    const bestStreak = this.calculateBestStreak(checkins);
    
    // Calcular porcentaje de cumplimiento
    const completionRate = Math.round((checkins.length / totalDays) * 100);

    return {
      currentStreak,
      bestStreak,
      completionRate: isNaN(completionRate) ? 0 : completionRate,
      totalDays,
      completedDays: checkins.length
    };
  }

  static calculateCurrentStreak(checkins, today) {
    if (checkins.length === 0) return 0;

    const checkinDays = checkins.map(c => c.day).sort();
    let streak = 0;
    let currentDate = new Date(today);

    // Verificar si hay checkin hoy o ayer para comenzar la racha
    const todayStr = today;
    const yesterdayStr = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    
    let startFromToday = checkinDays.includes(todayStr);
    if (!startFromToday && checkinDays.includes(yesterdayStr)) {
      currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
      startFromToday = true;
    }

    if (!startFromToday) return 0;

    // Contar días consecutivos hacia atrás
    while (true) {
      const dateStr = currentDate.toISOString().slice(0, 10);
      if (checkinDays.includes(dateStr)) {
        streak++;
        currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
      } else {
        break;
      }
    }

    return streak;
  }

  static calculateBestStreak(checkins) {
    if (checkins.length === 0) return 0;

    const checkinDays = checkins.map(c => c.day).sort();
    let bestStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < checkinDays.length; i++) {
      const prevDate = new Date(checkinDays[i - 1]);
      const currDate = new Date(checkinDays[i]);
      const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return bestStreak;
  }

  static async getAllHabitsStats(clientId, habits) {
    const stats = await Promise.all(
      habits.map(async (habit) => {
        const habitStats = await this.getHabitStats(clientId, habit._id);
        return {
          habitId: habit._id,
          habitName: habit.name,
          ...habitStats
        };
      })
    );

    // Estadísticas generales
    const totalHabits = habits.length;
    const totalStreaks = stats.reduce((sum, s) => sum + s.currentStreak, 0);
    const avgCompletionRate = totalHabits > 0 
      ? Math.round(stats.reduce((sum, s) => sum + s.completionRate, 0) / totalHabits)
      : 0;

    return {
      general: {
        totalHabits,
        totalActiveStreaks: stats.filter(s => s.currentStreak > 0).length,
        avgCompletionRate,
        totalStreaks
      },
      habits: stats
    };
  }
}
