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
    <div className={classes.localbody}>
      <div className={classes.main}>
        <header className={classes.header}>
          <div className={classes.userBadge}>
            <span className={classes.avatar}>
              {session?.user?.email?.charAt(0).toUpperCase() || 'U'}
            </span>
            <div className={classes.userInfo}>
              <p className={classes.welcomeText}>Welcome back,</p>
              <h2 className={classes.userEmail}>{session?.user?.email}</h2>
            </div>
          </div>
          <button onClick={handleSignout} className={classes.signOutBtn}>
            Sign out
          </button>
        </header>

        <section className={classes.contentGrid}>
          <div className={classes.card}>
            <h3>Account Overview</h3>
            <p>Status: <span className={classes.activeBadge}>Active</span></p>
          </div>

          <div className={classes.card}>
            <h3>Recent Activity</h3>
            <p>No recent activity recorded.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard