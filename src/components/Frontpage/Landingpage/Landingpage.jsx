import styles from "./Navbar.module.css"
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <header className={styles.navbar}>
      <div className={styles.brand} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <span className={styles.logoIcon}>🔥</span>
        <span className={styles.brandName}>StuddyBuddy</span>
      </div>

      <nav className={styles.navLinks}>
        <button className={styles.navButton}>
          About Us
        </button>
        <button className={styles.navButton}>
          Features
        </button>
        <button className={styles.navButton} onClick={()=>navigate('/signin')}>
          Log In
        </button>
        <button className={`${styles.navButton} ${styles.primaryButton}`} onClick={()=>navigate('/signup')}>
          Get Started
        </button>
      </nav>
    </header>
    
  )
}

export default Navbar