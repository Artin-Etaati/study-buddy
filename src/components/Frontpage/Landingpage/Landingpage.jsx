import { useState } from "react";
import styles from "./Navbar.module.css"
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
    <header className={styles.navbar}>
      <div className={styles.brand} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <span className={styles.logoIcon}>🔥</span>
        <span className={styles.brandName}>StuddyBuddy</span>
      </div>

      <nav className={styles.navLinks}>
        <button className={styles.navButton} onClick={()=>setview('About')}>
          About Us
        </button>
        <button className={styles.navButton} onClick={()=>setview('Features')}>
          Features
        </button>
        <button className={styles.navButton} onClick={()=>setview('Login')}>
          Log In
        </button>
        <button className={`${styles.navButton} ${styles.primaryButton}`} onClick={()=>setview('Signup')}>
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