import { Outlet } from "react-router-dom"
import Navbar from './Navbar'
import classes from "../css/main.module.css"
import PrivateRoute from './PrivateRoute'


const Layout = () => {
    return(
    <PrivateRoute>
    <div className={classes.main}>
        <Navbar/>
        <Outlet/>
    </div>
    </PrivateRoute>
    )
}

export default Layout