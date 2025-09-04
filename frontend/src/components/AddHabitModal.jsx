import { useState } from 'react'

export default function AddHabitModal({ onCreate }){
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [color, setColor] = useState('#7c3aed')
  const [emoji, setEmoji] = useState('🔥')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e)=>{
    e.preventDefault()
    setError('')
    if(!name.trim()) return setError('El nombre es obligatorio')
    try{
      setLoading(true)
      await onCreate({ name:name.trim(), color, emoji })
      setName(''); setColor('#7c3aed'); setEmoji('🔥'); setOpen(false)
    }catch(err){ setError(err.message || 'Error') }
    finally{ setLoading(false) }
  }

  return (
    <>
      <button className="btn primary" onClick={()=>setOpen(true)}>+ Nuevo hábito</button>
      {open && (
        <div className="modal__backdrop" onClick={()=>!loading && setOpen(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h3>Crear hábito</h3>
            <form className="form" onSubmit={submit} noValidate>
              <label>Nombre
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="Leer 10 min" required/>
              </label>
              <label>Color
                <input type="color" value={color} onChange={e=>setColor(e.target.value)} />
              </label>
              <label>Emoji
                <input value={emoji} onChange={e=>setEmoji(e.target.value)} maxLength={2} />
              </label>
              {error && <div className="error">{error}</div>}
              <div className="row end">
                <button className="btn" type="button" disabled={loading} onClick={()=>setOpen(false)}>Cancelar</button>
                <button className="btn primary" type="submit" disabled={loading}>{loading?'Creando…':'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
