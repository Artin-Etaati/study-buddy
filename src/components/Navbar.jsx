import { Link } from "react-router-dom"
import navbar from "../css/Navbar.module.css"
function Navbar() {
    return (
        <div className={navbar.container}>
            <Link className={navbar.text} to={"/home"}>Home</Link>
            <Link className={navbar.text} to={"/profile"}>Profile</Link>
            <Link className={navbar.text} to={"/matches"}>Matches</Link>
            <Link className={navbar.text} to={"/messages"}>Chats</Link>
        </div >
    )

}



export default Navbar