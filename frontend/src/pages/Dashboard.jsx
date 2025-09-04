import Navbar from '../components/Navbar.jsx'
import AddHabitModal from '../components/AddHabitModal.jsx'
import HabitCard from '../components/HabitCard.jsx'
import { useHabits } from '../hooks/useHabits.js'

export default function Dashboard(){
  const { habits, loading, addHabit, toggleCheckin, todayDone } = useHabits()

  return (
    <>
      <Navbar />
      <main className="container">
        <header className="header-row">
          <h2>Mis hábitos</h2>
          <AddHabitModal onCreate={addHabit} />
        </header>

        <section className="stats">
          <div className="stat">
            <span className="stat__label">Hábitos: </span>
            <span className="stat__value">{habits.length}</span>
          </div>
        </section>

        {loading ? (
          <div className="muted">Cargando hábitos…</div>
        ) : habits.length === 0 ? (
          <div className="empty"><p>Aún no tienes hábitos. ¡Crea el primero!</p></div>
        ) : (
          <section className="grid">
            {habits.map(h => (
              <HabitCard
                key={h._id}
                habit={h}
                markedToday={todayDone.has(h._id)}
                onToggle={()=>toggleCheckin(h._id)}
              />
            ))}
          </section>
        )}
      </main>
    </>
  )
}
