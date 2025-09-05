import Navbar from '../components/Navbar.jsx'
import AddHabitModal from '../components/AddHabitModal.jsx'
import AISuggestionsModal from '../components/AISuggestionsModal.jsx'
import HabitCard from '../components/HabitCard.jsx'
import { useHabits } from '../hooks/useHabits.js'
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({ user, onLogout }){
  const { 
    habits, 
    loading, 
    addHabit, 
    updateHabit, 
    deleteHabit, 
    toggleCheckin, 
    todayDone, 
    generalStats 
  } = useHabits()

  const { user: authUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
      if (!authLoading && !authUser) {
          navigate('/', { replace: true });
      }
  }, [authUser, authLoading, navigate]);

  if (authLoading) return <div>Cargando...</div>;
  if (!authUser) return null;

  return (
    <>
      <Navbar user={user} onLogout={onLogout} />
      <main className="container">
        <header className="header-row">
          <h2>Mis hábitos</h2>
          <div className="header-actions">
            <AISuggestionsModal onCreate={addHabit} />
            <AddHabitModal onCreate={addHabit} />
          </div>
        </header>

        <section className="stats">
          <div className="stat">
            <span className="stat__label">Total hábitos: </span>
            <span className="stat__value">{generalStats?.general.totalHabits || habits.length}</span>
          </div>
          <div className="stat">
            <span className="stat__label">Rachas activas: </span>
            <span className="stat__value">{generalStats?.general.totalActiveStreaks || 0}</span>
          </div>
          <div className="stat">
            <span className="stat__label">Cumplimiento promedio: </span>
            <span className="stat__value">{generalStats?.general.avgCompletionRate || 0}%</span>
          </div>
          <div className="stat">
            <span className="stat__label">Completados hoy: </span>
            <span className="stat__value">{todayDone.size}</span>
          </div>
        </section>

        {loading ? (
          <div className="muted">Cargando hábitos…</div>
        ) : habits.length === 0 ? (
          <div className="empty">
            <p>Aún no tienes hábitos. ¡Crea el primero!</p>
            <div className="empty-actions">
              <AddHabitModal onCreate={addHabit} />
              <AISuggestionsModal onCreate={addHabit} />
            </div>
          </div>
        ) : (
          <section className="grid">
            {habits.map(h => (
              <HabitCard
                key={h._id}
                habit={h}
                markedToday={todayDone.has(h._id)}
                onToggle={()=>toggleCheckin(h._id)}
                onUpdate={updateHabit}
                onDelete={deleteHabit}
              />
            ))}
          </section>
        )}
      </main>
    </>
  )
}
