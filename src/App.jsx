import { useEffect, useState } from 'react'
import { supabase } from './services/supabase'
import './AppStyle.css';

function App() {
  return (
    <div className="container mt-5">
      <h1>Study Buddy</h1>
      <p>Find the right study partner.</p>
      <div className='sign-container'>
        <a href="" className='sign-btn'>Create an account</a>
        <a href="" className='sign-btn'>Sign in</a>
      </div>
    </div>
  )
}


export default App