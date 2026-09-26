import React from 'react'
import { UserAuth } from '../AuthContext'
import { useNavigate } from 'react-router-dom';
import classes from './Dashboard.module.css'

const Dashboard = () => {
  const{session, signOut} = UserAuth();
  const navigate = useNavigate();

  const handleSignout = async (e) => {
    e.preventDefault();
    try {
      await signOut();
      navigate('/');
    } catch (err) {
      console.error(err);
    }

  }

  return (
    <div className={classes.main}>
      <h1>Dashboard</h1>
      <h2>Welcome, {session?.user?.email} </h2>
        <div>
          <p onClick={handleSignout}>Sign out</p>
        </div>
    </div>
  )
}

export default Dashboard