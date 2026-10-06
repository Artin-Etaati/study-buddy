import { UserAuth } from '@/AuthContext'
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const {session} = UserAuth();

    return (
    session ? <Outlet/> : <Navigate to ="/"/>
  )
};

export default PrivateRoute