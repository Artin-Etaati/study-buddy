import {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import classes from './Signup.module.css'
import { UserAuth } from '../AuthContext';

const Signup = () => {
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const[error, setError] = useState('');
  const[loading, setLoading] = useState('');

  const {session, singUpNewUser} = UserAuth();
  const navigate = useNavigate();

  const handleSignUp = async(e) =>{
    e.preventDefault();
    setLoading(true);
    try {
      const result = await singUpNewUser(email,password);

      if(result.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError("an error occured");
    } finally {
      setLoading(false);
    }
  }

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