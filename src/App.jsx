import { useEffect, useState } from 'react'
//import { supabase } from './supabase'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Signup from "./pages/signup";
import Signin from "./pages/signin";
import "./index.css";


function App() {
  return (
   <BrowserRouter>
   <div className='home-container'>
      <h1>Study Buddy</h1>
      <p>Find the right study partner.</p>
    </div>    
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/signup" element={<Signup />}></Route>
      <Route path="/signin" element={<Signin />}></Route>
    </Routes>
  
   </BrowserRouter>
)}

export default App