import { Outlet } from "react-router-dom"
import Navbar from './Navbar'
import PrivateRoute from '../PrivateRoute'


const Layout = () => {
    return(
    <PrivateRoute>
    <div>
        <Navbar/>
        <Outlet/>
    </div>
    </PrivateRoute>
    )
}

export default Layout