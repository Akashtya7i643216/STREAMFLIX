import React, { createContext, useContext, useReducer, useCallback } from 'react'

const AppContext = createContext(null)

const initialState = {
  user: null,          // { name, email, isGuest }
  theme: 'dark',
  watchlist: [],
  watchHistory: [],
  isOnline: navigator.onLine,
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload }
    case 'LOGOUT':
      return { ...state, user: null, watchlist: [], watchHistory: [] }
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' }
    case 'ADD_WATCHLIST': {
      const exists = state.watchlist.find((m) => m.id === action.payload.id)
      if (exists) return state
      return { ...state, watchlist: [action.payload, ...state.watchlist] }
    }
    case 'REMOVE_WATCHLIST':
      return { ...state, watchlist: state.watchlist.filter((m) => m.id !== action.payload) }
    case 'ADD_HISTORY': {
      const filtered = state.watchHistory.filter((m) => m.id !== action.payload.id)
      return { ...state, watchHistory: [action.payload, ...filtered].slice(0, 50) }
    }
    case 'SET_ONLINE':
      return { ...state, isOnline: action.payload }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
  }, [state.theme])

  React.useEffect(() => {
    const onOnline = () => dispatch({ type: 'SET_ONLINE', payload: true })
    const onOffline = () => dispatch({ type: 'SET_ONLINE', payload: false })
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  const login = useCallback((user) => dispatch({ type: 'LOGIN', payload: user }), [])
  const logout = useCallback(() => dispatch({ type: 'LOGOUT' }), [])
  const toggleTheme = useCallback(() => dispatch({ type: 'TOGGLE_THEME' }), [])
  const addToWatchlist = useCallback((movie) => dispatch({ type: 'ADD_WATCHLIST', payload: movie }), [])
  const removeFromWatchlist = useCallback((id) => dispatch({ type: 'REMOVE_WATCHLIST', payload: id }), [])
  const addToHistory = useCallback((movie) => dispatch({ type: 'ADD_HISTORY', payload: movie }), [])

  return (
    <AppContext.Provider value={{ ...state, login, logout, toggleTheme, addToWatchlist, removeFromWatchlist, addToHistory }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
