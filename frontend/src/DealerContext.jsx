import { createContext, useState, useContext, useEffect } from 'react'

const DealerContext = createContext()

export function DealerProvider({ children }) {
  const [dealerProfile, setDealerProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load dealer profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('dealerProfile')
    if (savedProfile) {
      try {
        setDealerProfile(JSON.parse(savedProfile))
      } catch (err) {
        console.error('Failed to load dealer profile:', err)
      }
    }
    setLoading(false)
  }, [])

  const updateDealerProfile = (profile) => {
    setDealerProfile(profile)
    localStorage.setItem('dealerProfile', JSON.stringify(profile))
  }

  const clearDealerProfile = () => {
    setDealerProfile(null)
    localStorage.removeItem('dealerProfile')
  }

  return (
    <DealerContext.Provider value={{ dealerProfile, updateDealerProfile, clearDealerProfile, loading }}>
      {children}
    </DealerContext.Provider>
  )
}

export function useDealer() {
  const context = useContext(DealerContext)
  if (!context) {
    throw new Error('useDealer must be used within DealerProvider')
  }
  return context
}
