import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './App.css'
import authService from "./appwrite/auth"
import {login, logout} from "./store/authSlice"
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
      if (userData) {
        dispatch(login(userData))
      } else {
        dispatch(logout())
      }
    })
    .finally(() => setLoading(false))
  }, [dispatch])
  
  return !loading ? (
    <div className='min-h-screen flex flex-col bg-[#f8f6f1]'>
      <div className='w-full flex-1'>
        <Header />
        <div>
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  ) : (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f6f1] text-[#686b70]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e9e2d7] border-t-[#b77945]" aria-label="Loading" />
    </div>
  )
}

export default App