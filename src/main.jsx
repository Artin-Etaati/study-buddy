import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Router } from './router.jsx'
import { AuthContextProvider } from './AuthContext.jsx'
import './main.module.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <RouterProvider router={Router}/>
    </AuthContextProvider>
  </StrictMode>,
)
