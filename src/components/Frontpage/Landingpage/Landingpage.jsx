import { useState } from "react";
import classes from "./Navbar.module.css"
import Frontpage from "../Login/Login";
import Features from "./features";
import About from "./about";

const Landingpage = () => {
  const [view, setview] = useState("About");
  
  const handleState = (name) => {
    setview(name);
  }

  return (
    <div>
    <header className={classes.navbar}>
      <div className={classes.brand} onClick={() => {window.scrollTo({ top: 0, behavior: 'smooth'});setview("About")}}>
        <span className={classes.brandName}>StuddyBuddy</span>
      </div>

      <nav className={classes.navLinks}>
        <button className={classes.navButton} onClick={()=>setview('About')}>
          About Us
        </button>
        <button className={classes.navButton} onClick={()=>setview('Features')}>
          Features
        </button>
        <button className={classes.navButton} onClick={()=>setview('Login')}>
          Log In
        </button>
        <button className={`${classes.navButton} ${classes.primaryButton}`} onClick={()=>setview('Signup')}>
          Get Started
        </button>
      </nav>
    </header>
    {view ==='About' && <About/>}
    {view ==='Login' && <Frontpage isSignup={false} change={handleState}/>}
    {view ==='Signup' && <Frontpage isSignup={true} change={handleState}/>}
    {view ==='Features' && <Features/>}
    </div>
  )
}

export default Landingpage