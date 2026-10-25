import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "./services/supabase";
const AuthContext = createContext({});

export const AuthContextProvider = ({children}) => {
    const[session, setSession] = useState(null);
    const[loading, setLoading] = useState(true);
    const[userId, setUserId] = useState(null)
    //Sign up
    const signUpNewUser = async (email, password)=>{
        const{data, error} = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if(error) {
            console.error("there was a problem signing up", error);
            return{success:false, error: error.message};
        }
        return {success:true, data}
    };



    //Sign in
    const signInUser = async (email, password) =>{ 
            const {data, error} = await supabase.auth.signInWithPassword({
                email:email,
                password: password,
            });

            if(error) {
                console.error("sign in error occured: ", error);
                return {success:false, error: error.message};
            }
            return {success:true, data};
    };
    
    useEffect (()=>{

        async function loadAuth() {
            setLoading(true);
            try {
                const {data: {session}, error: sessionError} = await supabase.auth.getSession();

                if(sessionError) throw sessionError

                const {data: {user}, error: userIdError} = await supabase.auth.getUser();

                if(userIdError) throw userIdError

                setSession(session)
                setUserId(user.id ?? null)
            } catch(error) {
                console.log("Authentication error " + error)

                setSession(null)
                setUserId(null)

            } finally {
                setLoading(false)
            }
        }
        const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) =>{
            setSession(session);
            // @@@ make this use getUser() @@@
            setUserId(session.user.id ?? null)
            setLoading(false);
        });
        
        loadAuth()
        return () => {
            console.log("leaving");
             subscription.unsubscribe();
        }
        }, []);


    //sign out
    const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error("there was an error: ", error);
    }
    };

    
    return (
       <AuthContext.Provider value={{session, userId, signUpNewUser, signInUser, signOut, loading}}>
        {children}
       </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(AuthContext);
}