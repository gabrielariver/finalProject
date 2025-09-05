import { useState } from 'react'
import { api } from '../hooks/useApi'

export default function AISuggestionsModal({ onCreate }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [userProfile, setUserProfile] = useState({
    age: '',
    interests: '',
    goals: ''
  })
  const [error, setError] = useState('')

  const getSuggestions = async () => {
    setError('')
    setLoading(true)
    
    try {
      const response = await api('/api/ai/suggest', {
        method: 'POST',
        body: JSON.stringify(userProfile)
      })
      setSuggestions(response.suggestions)
    } catch (err) {
      setError(err.message || 'Error al obtener sugerencias')
    } finally {
      setLoading(false)
    }
  }

  const addSuggestedHabit = async (suggestion) => {
    try {
      await onCreate({
        name: suggestion.name,
        color: getCategoryColor(suggestion.category),
        emoji: suggestion.emoji
      })
      
      // Remover la sugerencia de la lista
      setSuggestions(prev => prev.filter(s => s.name !== suggestion.name))
    } catch (err) {
      setError(err.message || 'Error al crear hábito')
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      salud: '#22c55e',
      productividad: '#3b82f6',
      bienestar: '#a855f7',
      aprendizaje: '#f59e0b'
    }
    return colors[category] || '#7c3aed'
  }

  const getCategoryIcon = (category) => {
    const icons = {
      salud: '💪',
      productividad: '⚡',
      bienestar: '🌟',
      aprendizaje: '🎓'
    }
    return icons[category] || '✨'
  }

  return (
    <>
      <button className="btn secondary" onClick={() => setOpen(true)}>
        ✨ Sugerencias IA
      </button>
      
      {open && (
        <div className="modal__backdrop" onClick={() => !loading && setOpen(false)}>
          <div className="modal modal--large" onClick={e => e.stopPropagation()}>
            <h3>Sugerencias de Hábitos con IA</h3>
            
            {suggestions.length === 0 ? (
              <div className="form">
                <p className="muted">
                  Cuéntanos un poco sobre ti para generar sugerencias personalizadas:
                </p>
                
                <label>
                  Edad (opcional)
                  <input
                    type="number"
                    value={userProfile.age}
                    onChange={e => setUserProfile(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="25"
                  />
                </label>
                
                <label>
                  Intereses (opcional)
                  <input
                    value={userProfile.interests}
                    onChange={e => setUserProfile(prev => ({ ...prev, interests: e.target.value }))}
                    placeholder="Ej: fitness, lectura, programación"
                  />
                </label>
                
                <label>
                  Objetivos (opcional)
                  <input
                    value={userProfile.goals}
                    onChange={e => setUserProfile(prev => ({ ...prev, goals: e.target.value }))}
                    placeholder="Ej: mejorar salud, ser más productivo"
                  />
                </label>
                
                {error && <div className="error">{error}</div>}
                
                <div className="row end">
                  <button 
                    className="btn" 
                    type="button" 
                    disabled={loading} 
                    onClick={() => setOpen(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    className="btn primary" 
                    type="button" 
                    disabled={loading} 
                    onClick={getSuggestions}
                  >
                    {loading ? 'Generando...' : 'Generar Sugerencias'}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="muted mb-16">
                  Aquí tienes algunas sugerencias personalizadas. Haz clic en "Agregar" para incluir un hábito:
                </p>
                
                <div className="suggestions-grid">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="suggestion-card">
                      <div className="suggestion-card__header">
                        <span className="suggestion-card__emoji">{suggestion.emoji}</span>
                        <div className="suggestion-card__info">
                          <h4 className="suggestion-card__name">{suggestion.name}</h4>
                          <span className="suggestion-card__category">
                            {getCategoryIcon(suggestion.category)} {suggestion.category}
                          </span>
                        </div>
                      </div>
                      
                      <p className="suggestion-card__description">
                        {suggestion.description}
                      </p>
                      
                      <button 
                        className="btn primary btn--sm"
                        onClick={() => addSuggestedHabit(suggestion)}
                      >
                        Agregar hábito
                      </button>
                    </div>
                  ))}
                </div>
                
                {error && <div className="error mt-16">{error}</div>}
                
                <div className="row space-between mt-16">
                  <button 
                    className="btn secondary" 
                    onClick={() => setSuggestions([])}
                  >
                    ← Nuevas sugerencias
                  </button>
                  <button 
                    className="btn" 
                    onClick={() => setOpen(false)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
