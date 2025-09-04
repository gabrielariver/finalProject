import { useEffect, useState, useCallback } from 'react'
import { api } from './useApi'

export function useHabits(){
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [todayDone, setTodayDone] = useState(()=>new Set())

  const refresh = useCallback(async ()=>{
    setLoading(true)
    const data = await api('/api/habits')
    setHabits(data)
    setLoading(false)
  },[])

  useEffect(()=>{ refresh() },[refresh])

  async function addHabit(payload){
    await api('/api/habits', { method:'POST', body: JSON.stringify(payload) })
    await refresh()
  }

  async function toggleCheckin(habitId){
    setTodayDone(prev=>{
      const next = new Set(prev)
      next.has(habitId) ? next.delete(habitId) : next.add(habitId)
      return next
    })
    try{
      await api('/api/checkins/today', { method:'POST', body: JSON.stringify({ habitId }) })
    }catch(e){
      setTodayDone(prev=>{
        const next = new Set(prev)
        next.has(habitId) ? next.delete(habitId) : next.add(habitId)
        return next
      })
      throw e
    }
  }

  return { habits, loading, addHabit, toggleCheckin, todayDone }
}
