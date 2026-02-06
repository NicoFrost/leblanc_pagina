import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage, NotFoundPage, SystemPage } from './pages'
import { useAuthStore } from './hooks'


function App() {

  const {status, checkAuthToken} = useAuthStore()

  useEffect(() => {
    checkAuthToken();
  }, [])

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<SystemPage />} />
        {/* { 
          (status === 'authenticated') 
            ? <Route path="/" element={<SystemPage />} />
            : <Route path="/" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        } */}
      </Routes>
    </HashRouter>
  )
}

export default App
