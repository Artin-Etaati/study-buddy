import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"

const Landingpage = () => {
    return (
        <div>
            <Navbar/>
            <Outlet/>
       </div> 
    )
}
export default Landingpage