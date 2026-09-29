import {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import classes from './front.module.css'
import { UserAuth } from '../AuthContext';

const Front = ({isSignup}) => {
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const[error, setError] = useState('');
  const[loading, setLoading] = useState('');

  const {signUpNewUser, signInUser} = UserAuth();
  const navigate = useNavigate();

  const handleForm = async(e,callback) =>{
    e.preventDefault();
    setLoading(true);
    
    const result = await callback(email,password);

    if(result.success) {
        navigate('/dashboard');
    } else {
        setError(result.error);
    }
    setLoading(false);
  }



  return (
    <div className={classes.localbody}>
    <div className={classes.main}>
    <form className={classes.form} onSubmit={(e) => handleForm(e, isSignup ? signUpNewUser : signInUser)}>
      <h2>{isSignup ? 'Sign Up': 'Sign in'}</h2>
      <p>{isSignup ? 'Already have an account?' : "Dont have an account?"} <Link to={isSignup ? "/Signin" : "/Signup"}>{isSignup ? "Sign in" : "Sign up"} </Link>
      </p>
      <div className={classes.input}>
        <input onChange={(e)=>setEmail(e.target.value)} type="email" name="Email" placeholder="Email"/>
        <input onChange={(e)=>setPassword(e.target.value)}type="password" placeholder = "Password"/>
        <button type="submit" disabled={loading}>{isSignup ? "Sign up" : "Sign in"}</button>
        {error && <p>{error}</p>}
      </div>
    </form>
    </div>
    </div>

  )
}

export default Front