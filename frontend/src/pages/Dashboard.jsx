import { useEffect, useState } from "react"

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [habits, setHabits] = useState([])

  useEffect(() => {
    // Obtener usuario
    fetch("http://localhost:3000/api/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(() => window.location.href = "/")

    // Obtener hábitos
    fetch("http://localhost:3000/api/habits", { credentials: "include" })
      .then(res => res.json())
      .then(data => setHabits(data))
  }, [])

  const marcarHoy = async (habitId) => {
    await fetch(`http://localhost:3000/api/habits/${habitId}/complete`, {
      method: "POST",
      credentials: "include"
    })
    // Vuelve a cargar hábitos
    const res = await fetch("http://localhost:3000/api/habits", { credentials: "include" })
    const data = await res.json()
    setHabits(data)
  }

  const logout = async () => {
    await fetch("http://localhost:3000/auth/logout", {
      method: "POST",
      credentials: "include"
    })
    window.location.href = "/"
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>
      {user && (
        <>
          <p>Hola, {user.name}</p>
          <img src={user.avatar} alt="avatar" width={80} />
          <br />
          <button onClick={logout}>Cerrar sesión</button>
        </>
      )}
      <hr />
      <h3>Tus Hábitos</h3>
      <ul>
        {habits.map(habit => (
          <li key={habit._id}>
            <strong>{habit.name}</strong> — Racha: {habit.streak} días
            {habit.completedToday ? (
              <span> ✅</span>
            ) : (
              <button onClick={() => marcarHoy(habit._id)}>✔ Hoy</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
