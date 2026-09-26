import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";

const AuthContext = createContext();



export const AuthContextProvider = ({children}) => {
    const [session, setSession] = useState(undefined);

    //Signup
    const signUpUser = async () => {
        const {data, error} = await supabase.auth.signup({
            email: email,
            password: password,
        });
    }

    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session);
        })

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    }, [])
    return(
        <AuthContext.Provider value={{session, signUpUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(AuthContext);
}