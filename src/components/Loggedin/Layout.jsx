import { Outlet } from "react-router-dom"
import Navbar from './Navbar'
import layout from './Layout.module.css'


const Layout = () => {
    return(
    <div className={layout.main}>
        <Navbar/>
        <Outlet/>
    </div>
    )
}

export default Layout