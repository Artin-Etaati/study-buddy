
import { useState } from "react";
import { UserAuth } from "../context/authContext";
import { supabase } from "../services/supabase";

export default function() {
    
    const {session, signUpNewUser} = UserAuth()
    const [email, setEmail] = useState(undefined);
    const [password, setPassword] = useState(undefined);
    const [error, setError] = useState(undefined);
    const handleSignUp = async (e) => {
        e.preventDefault();
        const{data, error} = await supabase.auth.signUp({
            email: email,
            password: password
        });
        if(error){
            setError(error.message);
        }
        
    }
    return (
        <div>
            <h1>Signup</h1>
            <form onSubmit={handleSignUp}>
                <input onChange={(e) => setEmail(e.target.value)} type="email"></input>
                <input onChange={(e) => setPassword(e.target.value)} type="password"></input>
                <button type="submit">Signup</button>
                <p>{error}</p>
            </form>
        </div>
    )
}