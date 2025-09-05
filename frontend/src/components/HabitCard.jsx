import { useState } from 'react'

function Dot({ color }){ return <span className="dot" style={{ backgroundColor: color || '#7c3aed' }} /> }

function EditHabitModal({ habit, onUpdate, onDelete }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(habit.name)
  const [color, setColor] = useState(habit.color || '#7c3aed')
  const [emoji, setEmoji] = useState(habit.emoji || '🔥')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleUpdate = async (e) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) return setError('El nombre es obligatorio')
    
    try {
      setLoading(true)
      await onUpdate(habit._id, { name: name.trim(), color, emoji })
      setOpen(false)
    } catch (err) {
      setError(err.message || 'Error al actualizar')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar este hábito?')) return
    
    try {
      setLoading(true)
      await onDelete(habit._id)
      setOpen(false)
    } catch (err) {
      setError(err.message || 'Error al eliminar')
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <button className="btn-icon" onClick={() => setOpen(true)} title="Editar hábito">
        ⚙️
      </button>
    )
  }

  return (
    <div className="modal__backdrop" onClick={() => !loading && setOpen(false)}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>Editar hábito</h3>
        <form className="form" onSubmit={handleUpdate} noValidate>
          <label>Nombre
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Leer 10 min" required />
          </label>
          <label>Color
            <input type="color" value={color} onChange={e => setColor(e.target.value)} />
          </label>
          <label>Emoji
            <input value={emoji} onChange={e => setEmoji(e.target.value)} maxLength={2} />
          </label>
          {error && <div className="error">{error}</div>}
          <div className="row space-between">
            <button className="btn danger" type="button" disabled={loading} onClick={handleDelete}>
              {loading ? 'Eliminando...' : 'Eliminar'}
            </button>
            <div className="row">
              <button className="btn" type="button" disabled={loading} onClick={() => setOpen(false)}>
                Cancelar
              </button>
              <button className="btn primary" type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function HabitCard({ habit, onToggle, onUpdate, onDelete, markedToday }){
  const { name, color, emoji, stats } = habit
  
  return (
    <article className="card">
      <header className="card__header">
        <div className="card__title">
          <Dot color={color} /> <span className="emoji">{emoji || '✅'}</span> {name}
        </div>
        <div className="card__actions">
          <EditHabitModal habit={habit} onUpdate={onUpdate} onDelete={onDelete} />
          <button className={`btn ${markedToday ? 'success' : 'primary'}`} onClick={onToggle}>
            {markedToday ? 'Hecho' : 'Marcar ✔'}
          </button>
        </div>
      </header>
      
      {stats && (
        <div className="card__stats">
          <div className="stat-mini">
            <span className="stat-mini__label">Racha actual:</span>
            <span className="stat-mini__value">{stats.currentStreak} días</span>
          </div>
          <div className="stat-mini">
            <span className="stat-mini__label">Mejor racha:</span>
            <span className="stat-mini__value">{stats.bestStreak} días</span>
          </div>
          <div className="stat-mini">
            <span className="stat-mini__label">Cumplimiento:</span>
            <span className="stat-mini__value">{stats.completionRate}%</span>
          </div>
        </div>
      )}
    </article>
  )
}
