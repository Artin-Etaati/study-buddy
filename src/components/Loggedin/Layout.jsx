import { Outlet } from "react-router-dom"
import Navbar from './Navbar'
import layout from './Layout.module.css'
import { supabase } from "../../services/supabase"
import { useEffect, useState } from "react"
import ChatNotification from "./Messages/ChatNotification"


const Layout = () => {
    const [chatMounted, setchatMounted] = useState(false); //if chatQuery is mounted or not
    const [preview, setPreview] = useState([]) //preview array for notifications
    const [matches, setMatches] = useState([]) //list of matched users.
    const [loading, setLoading] = useState(true); 

    //this useeffect fetches your matches from the match table
    //necessary because notification requires knowing more than just senderID
    useEffect(()=>{
        const fetchUsers = async ()=> {
            const { data, error } = await supabase
            .from('matches')
            .select(`
                id,
                user1_id,
                user2_id,
                user1:profiles!user1_id(*),
                user2:profiles!user2_id(*)     
            `);
            if(error) console.error(error);
            setMatches(data);
            setLoading(false)
        }
        fetchUsers();
    },[])

    //this useeffect creates a realtime listener on the message table for inserts. similar to global one in chatQuery
    //to prevent two listeners at once this checks if the chat is mounted before executing
    //watches loading as well because its dependent on matched users for logic 
    useEffect(()=>{
        if(chatMounted || loading) return;
        const channel = supabase.channel(`globalChatsLayout`)
                .on('postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'messages'},
                     (payload) => {
                        //create a custom row based on the message recieved that includes necessary data to show a notification 
                        const latestRow = payload.new;
                        const matchInfo = matches.find((row)=>row.id===latestRow.match_id);
                        const editedRow = {...latestRow, 
                            user1_id:matchInfo.user1_id,
                            user2_id:matchInfo.user2_id,
                            user1:matchInfo.user1,
                            user2:matchInfo.user2,
                            last_message_content:latestRow.content
                        }
                        //sets the notification array
                        setPreview((prev)=>[...prev,editedRow])
                     }).subscribe();
        
        return () => supabase.removeChannel(channel);
                     
    },[chatMounted,loading])
    
    if(loading) return <div>loading...</div>

    return(
    <div className={layout.main}>
        <ChatNotification preview={preview} setPreview={setPreview}/>
        <Navbar/>
        <Outlet context={{setchatMounted,preview,setPreview}}/>
    </div>
    )
}

export default Layout