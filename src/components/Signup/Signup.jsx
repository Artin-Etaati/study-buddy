import {useState} from 'react'
import { Link } from 'react-router-dom'
import "./Signup.css"
import { UserAuth } from '../../AuthContext';

const Signup = () => {
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const[error, setError] = useState('');
  const[loading, setLoading] = useState('');

  const {session} = UserAuth();
 //console.log(session);

  return (
    <div className="main">
    <form >
      <h2>Sign Up</h2>
      <p>Already have an account? <Link to= "/Signin">Sign in </Link>
      </p>
      <div className="input">
        <input type="email" name="Email" placeholder="Email"/>
        <input type="password" placeholder = "Password"/>
        <button type="submit" disabled={loading}>Sign Up</button>
      </div>
    </form>
    </div>
  )
}

export default Signup