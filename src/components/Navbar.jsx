import { NavLink } from "react-router-dom"
import navbar from "../css/Navbar.module.css"
import {UserAuth} from "../AuthContext"
function Navbar() {
    const {signOut} = UserAuth()
    return (
        <div className={navbar.container}>
            <div className={navbar.link_container}>
                <NavLink className={({isActive}) => isActive ? navbar.text_container + " " + navbar.active : navbar.text_container} to={"/home"}>
                    <img className={navbar.icon} src="../src/assets/icons/home.svg"></img>
                    <nav className={navbar.text}>Home</nav>
                </NavLink>
                <NavLink className={({isActive}) => isActive ? navbar.text_container + " " + navbar.active : navbar.text_container} to={"/profile"}>
                    <img className={navbar.icon} src="../src/assets/icons/profile.svg"></img>
                    <nav className={navbar.text}>Profile</nav>
                </NavLink>
                <NavLink className={({isActive}) => isActive ? navbar.text_container + " " + navbar.active : navbar.text_container} to={"/matches"}>
                    <img className={navbar.icon} src="../src/assets/icons/matches.svg"></img>
                    <nav className={navbar.text}>Matches</nav>
                </NavLink>
                <NavLink className={({isActive}) => isActive ? navbar.text_container + " " + navbar.active : navbar.text_container} to={"/messages"}>
                    <img className={navbar.icon} src="../src/assets/icons/messages.svg"></img>
                    <nav className={navbar.text}>Messages</nav>
                </NavLink>
            </div>
            <button onClick={signOut} className={navbar.signout}>Sign out</button>
        </div>
    )

}



export default Navbar