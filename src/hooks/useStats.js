import { useState, useEffect } from 'react'

const STATS_URL = import.meta.env.BASE_URL + 'stats.json'

export function useStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(STATS_URL)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch stats')
        return res.json()
      })
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching stats:', err)
        setError(err)
        setLoading(false)
      })
  }, [])

  return { stats, loading, error }
}

// Helper to format the last updated date
export function formatLastUpdated(isoString) {
  if (!isoString) return 'Unknown'
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
