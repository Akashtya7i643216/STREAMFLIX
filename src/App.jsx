import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext'
import Navbar from './components/Navbar/Navbar'
import OnlineStatus from './components/OnlineStatus/OnlineStatus'
import PageLoader from './components/PageLoader/PageLoader'

const SignIn = lazy(() => import('./pages/SignIn/SignIn'))
const Home = lazy(() => import('./pages/Home/Home'))
const Browse = lazy(() => import('./pages/Browse/Browse'))
const Profile = lazy(() => import('./pages/Profile/Profile'))

function ProtectedRoute({ children }) {
  const { user } = useApp()
  return user ? children : <Navigate to="/signin" replace />
}

export default function App() {
  const { user } = useApp()

  return (
    <>
      <OnlineStatus />
      {user && <Navbar />}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/signin" element={user ? <Navigate to="/" replace /> : <SignIn />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/browse/:category" element={<ProtectedRoute><Browse /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  )
}
