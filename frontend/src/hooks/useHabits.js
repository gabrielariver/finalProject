import { useEffect, useState, useCallback } from 'react'
import { api } from './useApi'

export function useHabits(){
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [todayDone, setTodayDone] = useState(()=>new Set())
  const [generalStats, setGeneralStats] = useState(null)

  const refresh = useCallback(async ()=>{
    setLoading(true)
    try {
      const [habitsData, todayData] = await Promise.all([
        api('/api/habits'),
        api('/api/checkins/today')
      ])
      
      setHabits(habitsData)
      setTodayDone(new Set(todayData.habitIds))
    } catch (error) {
      console.error('Error fetching habits:', error)
    }
    setLoading(false)
  },[])

  const fetchGeneralStats = useCallback(async () => {
    try {
      const stats = await api('/api/habits/stats')
      setGeneralStats(stats)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }, [])

  useEffect(()=>{ 
    refresh()
    fetchGeneralStats()
  },[refresh, fetchGeneralStats])

  async function addHabit(payload){
    try {
      await api('/api/habits', { method:'POST', body: JSON.stringify(payload) })
      await refresh()
      await fetchGeneralStats()
    } catch (error) {
      console.error('Error adding habit:', error)
      throw error
    }
  }

  async function updateHabit(id, payload) {
    try {
      await api(`/api/habits/${id}`, { method:'PUT', body: JSON.stringify(payload) })
      await refresh()
      await fetchGeneralStats()
    } catch (error) {
      console.error('Error updating habit:', error)
      throw error
    }
  }

  async function deleteHabit(id) {
    try {
      await api(`/api/habits/${id}`, { method:'DELETE' })
      await refresh()
      await fetchGeneralStats()
    } catch (error) {
      console.error('Error deleting habit:', error)
      throw error
    }
  }

  async function toggleCheckin(habitId){
    const wasChecked = todayDone.has(habitId)
    
    // Optimistic update
    setTodayDone(prev=>{
      const next = new Set(prev)
      next.has(habitId) ? next.delete(habitId) : next.add(habitId)
      return next
    })
    
    try{
      await api('/api/checkins/today', { method:'POST', body: JSON.stringify({ habitId }) })
      // Refresh to get updated stats
      await refresh()
      await fetchGeneralStats()
    }catch(e){
      // Revert optimistic update on error
      setTodayDone(prev=>{
        const next = new Set(prev)
        wasChecked ? next.add(habitId) : next.delete(habitId)
        return next
      })
      console.error('Error toggling checkin:', e)
      throw e
    }
  }

  return { 
    habits, 
    loading, 
    addHabit, 
    updateHabit,
    deleteHabit,
    toggleCheckin, 
    todayDone,
    generalStats 
  }
}
