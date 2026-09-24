import { useEffect, useState } from 'react'
//import { supabase } from './supabase'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";


function App() {
  return (
   <BrowserRouter>
   <div>
      <h1>Study Buddy</h1>
      <p>Find the right study partner.</p>
    </div>    
    <Routes>
      <Route path="/" element={<Home />}></Route>
    </Routes>
  
   </BrowserRouter>
)}

export default App