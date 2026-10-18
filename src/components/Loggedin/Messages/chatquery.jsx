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
            //get the matchdata along with foreign key profiles
            const {data:matchData, error:matchError } = await supabase
                .from('matches')
                .select(
                `matchId:id,
                user1_id,
                user2_id,
                user1:profiles!user1_id(*),
                user2:profiles!user2_id(*)`
                );
            if(matchError) return console.error(matchError);

            
             //take the match data and filter it slightly
             const matchinfo = matchData.map((match)=>{
                const isSelfUser1 = match.user1_id===session.user.id;
                return {
                    matchId:match.matchId,
                    matchedProfile: isSelfUser1 ? match.user2 : match.user1
                }
            })
             //set the new data to users
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