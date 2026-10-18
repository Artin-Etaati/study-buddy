import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom"
import { supabase } from "../../../services/supabase";
import { UserAuth } from "../../../AuthContext";

export default function chatquery () {
    const [users,setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const {session} = UserAuth();
    
    useEffect (()=>{
        const fetchMatches = async () => {
            //get raw matches and ids for current user
            const {data:UserIds, error:Iderror } = await supabase
                .from('matches')
                .select('*');
            if(Iderror) return console.error(Iderror);

            //find if current user is matched with user1 or user2 and set ids
            const matchedUserIds = UserIds.map((object)=> object.user1_id===session.user.id ? object.user2_id : object.user1_id);
            
            //find the profile data given the matched ids
            const{data:matchedUsers, error:nameError} = await supabase
             .from('profiles')
             .select("id, first_name")
             .in('id', matchedUserIds)

             if(nameError) return console.error(nameError);
            
             //set the profile data to users
             setUsers(matchedUsers);
             setLoading(false);
        }
        fetchMatches();

    },[])
    if(loading) return <div>fetching users...</div>

    return (
        <Outlet context={{users}}/>
    )
}