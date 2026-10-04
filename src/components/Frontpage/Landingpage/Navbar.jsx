import {useNavigate } from "react-router-dom";
import classes from "./Navbar.module.css"


const Navbar = () => {
  const navigate = useNavigate();
  return (
    <header className={classes.navbar}>
      <div className={classes.brand} onClick={() => window.scrollTo({top: 0})}>
        <span className={classes.brandName}>StuddyBuddy</span>
      </div>

      <nav className={classes.navLinks}>
        <button className={classes.navButton} onClick={()=>navigate("/about")}>
          About Us
        </button>
        <button className={classes.navButton} onClick={()=>navigate("/features")}>
          Features
        </button>
        <button className={classes.navButton} onClick={()=>navigate("/signin")}>
          Log In
        </button>
        <button className={`${classes.navButton} ${classes.primaryButton}`} onClick={()=>navigate("/signup")}>
          Get Started
        </button>
      </nav>
    </header>
  )
}

export default Navbar