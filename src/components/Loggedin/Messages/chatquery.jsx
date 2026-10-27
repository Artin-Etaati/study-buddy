import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom"
import { supabase } from "../../../services/supabase";
import { UserAuth } from "../../../AuthContext";

export default function chatquery () {
    const [matchList,setMatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const {session} = UserAuth();
    const [chats,setChats] = useState([]);
    const [activeChatId, setactiveChatId] = useState(null);
    
    useEffect (()=>{
        let chatData;
        const fetchChats = async () => {
            //get chat summaries along with match data
            const {data, error } = await supabase
                .from('chat_summaries')
                .select(
                `match_id,
                user1_id,
                user2_id,
                user1:profiles!user1_id(*),
                user2:profiles!user2_id(*),
                last_message_content,
                last_message_sender,
                last_message_read,
                last_message_time`
                )
                .order('last_message_time', { ascending: false, nullsFirst: false });
            if(error) return console.error(error);
            
            //set chat summaries to chat state
            setChats(data);
            
            //set chatData so that realtime can use it
            chatData = data;

             //take the chatsummeries and create list of matched users with matchID
             const matchList = data.map((row)=>{
                const matchedProfile = row.user1_id===session.user.id ? row.user2 : row.user1
                return {
                    matchId:row.match_id,
                    name:matchedProfile.first_name,
                    id:matchedProfile.id
                }
            })
             //set the new data to users
             setMatchlist(matchList);
             setLoading(false);
        }

        fetchChats()

      
        const channel = supabase
                .channel('public:messages')
                .on('postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'messages'},
                     (payload) => {
                        const latestRow = payload.new;
                        const editedChats = chatData.filter((row)=>row.match_id!==latestRow.match_id);
                        const users = chatData.find((row)=>row.match_id===payload.new.match_id)
                        const editedRow = {
                            match_id:latestRow.match_id,
                            user1_id:users.user1_id,
                            user2_id:users.user2_id,
                            user1:users.user1,
                            user2:users.user2,
                            last_message_content:latestRow.content,
                            last_message_sender:latestRow.sender_id,
                            last_mesage_read:latestRow.read,
                            last_message_time:latestRow.created_at
                        }

                        setChats([editedRow, ...editedChats])
                       
                    })
                .subscribe();
        
                return () => supabase.removeChannel(channel);

    },[])

    if(loading) return <div>fetching users...</div>

    return (
        <Outlet context={{matchList, chats, setactiveChatId}}/>
    )
}