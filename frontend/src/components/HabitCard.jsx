function Dot({ color }){ return <span className="dot" style={{ backgroundColor: color || '#7c3aed' }} /> }

export default function HabitCard({ habit, onToggle, markedToday }){
  const { name, color, emoji } = habit
  return (
    <article className="card">
      <header className="card__header">
        <div className="card__title">
          <Dot color={color} /> <span className="emoji">{emoji || '✅'}</span> {name}
        </div>
        <button className={`btn ${markedToday ? 'success' : 'primary'}`} onClick={onToggle}>
          {markedToday ? 'Hecho' : 'Marcar ✔'}
        </button>
      </header>
    </article>
  )
}
