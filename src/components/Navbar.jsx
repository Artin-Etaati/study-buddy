import { Link } from "react-router-dom"
import navbar from "../css/Navbar.module.css"
function Navbar() {
    return (
        <div className={navbar.container}>
            <Link className={navbar.text_container} to={"/home"}>
                <img className={navbar.icon} src="../src/assets/icons/home.svg"></img>
                <nav className={navbar.text}>Home</nav>
            </Link>
            <Link className={navbar.text_container} to={"/profile"}>
                <img className={navbar.icon} src="../src/assets/icons/profile.svg"></img>
                <nav className={navbar.text}>Profile</nav>
            </Link>
            <Link className={navbar.text_container} to={"/matches"}>
                <img className={navbar.icon} src="../src/assets/icons/matches.svg"></img>
                <nav className={navbar.text}>Matches</nav>
            </Link>
            <Link className={navbar.text_container} to={"/messages"}>
                <img className={navbar.icon} src="../src/assets/icons/messages.svg"></img>
                <nav className={navbar.text}>Messages</nav>
            </Link>
        </div >
    )

}



export default Navbar