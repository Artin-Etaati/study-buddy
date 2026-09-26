import {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import classes from './Signup.module.css'
import { UserAuth } from '../AuthContext';

const Signin = () => {
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const[error, setError] = useState('');
  const[loading, setLoading] = useState('');

  const {session, signInUser} = UserAuth();
  const navigate = useNavigate();


  const handleSignin = async(e) =>{
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInUser(email,password);
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
    <form className={classes.form} onSubmit={handleSignin}>
      <h2>Sign In</h2>
      <p>Don't have an account? <Link to= "/signup">Sign up </Link>
      </p>
      <div className={classes.input}>
        <input onChange={(e)=>setEmail(e.target.value)} type="email" name="Email" placeholder="Email"/>
        <input onChange={(e)=>setPassword(e.target.value)}type="password" placeholder = "Password"/>
        <button type="submit" disabled={loading}>Sign in</button>
        {error && <p>{error}</p>}
      </div>
    </form>
    </div>
    </div>

  )
}

export default Signin