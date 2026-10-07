import { UserAuth } from '@/AuthContext'
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const {session, loading} = UserAuth();
    if(loading) {
      return <div>loading...</div>
    }
    return (
    session ? <Outlet/> : <Navigate to ="/"/>
  )
};

export default PrivateRoute