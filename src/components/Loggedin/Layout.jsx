import { Outlet } from "react-router-dom"
import Navbar from './Navbar'
import PrivateRoute from '../PrivateRoute'
import layout from './Layout.module.css'


const Layout = () => {
    return(
    <PrivateRoute>
    <div className={layout.main}>
        <Navbar/>
        <Outlet/>
    </div>
    </PrivateRoute>
    )
}

export default Layout