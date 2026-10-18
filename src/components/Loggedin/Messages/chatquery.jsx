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
            //get raw matches for current user
            const {data:matchData, error:matchError } = await supabase
                .from('matches')
                .select('*');
            if(matchError) return console.error(matchError);


            //find if current user is matched with user1 or user2 and set ids
            const matchedUserIds = matchData.map((object)=> object.user1_id===session.user.id ? object.user2_id : object.user1_id);
            
            //find the profile data given the matched ids
            const{data:matchedUsers, error:nameError} = await supabase
             .from('profiles')
             .select("id, first_name")
             .in('id', matchedUserIds)


             if(nameError) return console.error(nameError);
            
             //take the match data and profile data and create one object
             const matchinfo = matchData.map((match)=>{
                const matchedUserID = match.user1_id==session.user.id ? match.user2_id : match.user1_id;
                return {
                    matchId:match.id,
                    matchedProfile: matchedUsers.find((user)=>user.id===matchedUserID)
                }
            })
             //set the combined data to users
             setUsers(matchinfo);
             setLoading(false);
        }
        fetchMatches();

    },[])
    if(loading) return <div>fetching users...</div>

    return (
        <Outlet context={{users}}/>
    )
}