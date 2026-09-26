import {useState} from 'react'
import { Link } from 'react-router-dom'
import classes from './Signup.module.css'
import { UserAuth } from '../AuthContext';

const Signup = () => {
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const[error, setError] = useState('');
  const[loading, setLoading] = useState('');

  const {session} = UserAuth();
 //console.log(session);

  return (
    <div className={classes.localbody}>
    <div className={classes.main}>
    <form className={classes.form} >
      <h2>Sign Up</h2>
      <p>Already have an account? <Link to= "/Signin">Sign in </Link>
      </p>
      <div className={classes.input}>
        <input type="email" name="Email" placeholder="Email"/>
        <input type="password" placeholder = "Password"/>
        <button type="submit" disabled={loading}>Sign Up</button>
      </div>
    </form>
    </div>
    </div>

  )
}

export default Signup