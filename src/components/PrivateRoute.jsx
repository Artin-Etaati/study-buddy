import React from 'react'
import { UserAuth } from '../AuthContext'
import { Navigate } from 'react-router-dom';
import Navbar from "../components/Navbar";

const PrivateRoute = ({children}) => {
    const {session} = UserAuth();

    if(session===undefined) {
        return<p>Loading...</p>
    }

    return (
    <>{session ? <div className='main'><Navbar/>{children}</div> : <Navigate to ="/signup"/>}</>
  )
};

export default PrivateRoute