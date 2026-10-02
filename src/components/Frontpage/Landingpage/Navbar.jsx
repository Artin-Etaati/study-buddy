import React from 'react'
import styles from "./Navbar.module.css"

const Navbar = () => {
  return (
    <header className={styles.navbar}>
      <div className={styles.brand} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <span className={styles.logoIcon}>🔥</span>
        <span className={styles.brandName}>StuddyBuddy</span>
      </div>

      {/* Navigation buttons */}
      <nav className={styles.navLinks}>
        <button className={styles.navButton}>
          About Us
        </button>
        <button className={styles.navButton}>
          Features
        </button>
        <button className={styles.navButton}>
          Log In
        </button>
        <button className={`${styles.navButton} ${styles.primaryButton}`}>
          Get Started
        </button>
      </nav>
    </header>
    
  )
}

export default Navbar