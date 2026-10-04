import {useNavigate } from "react-router-dom";
import classes from "./Navbar.module.css"


const Navbar = () => {
  const navigate = useNavigate();
  return (
    <header className={classes.navbar}>
      <div className={classes.logo} onClick={() => window.scrollTo({top: 0})}>
        <span className={classes.logoimg}>logo</span>
        StuddyBuddy
      </div>

      <nav className={classes.navLinks}>
        <button className={classes.navButton} onClick={()=>navigate("/about")}>
          About Us
        </button>
        <button className={classes.navButton} onClick={()=>navigate("/features")}>
          Features
        </button>
        <button className={classes.navButton} onClick={()=>navigate("/login")}>
          Log In
        </button>
        <button className={classes.primaryButton + " " + classes.navButton} onClick={()=>navigate("/signup")}>
          Get Started
        </button>
      </nav>
    </header>
  )
}

export default Navbar