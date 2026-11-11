import { Outlet } from "react-router-dom"
import Navbar from './Navbar'
import layout from './Layout.module.css'
import { supabase } from "../../services/supabase"
import { useEffect, useState } from "react"
import ChatNotification from "./Messages/ChatNotification"


const Layout = () => {
    const [chatMounted, setchatMounted] = useState(false);
    const [preview, setPreview] = useState([])
    const [matches, setMatches] = useState([])
    const [loading, setLoading] = useState(true);

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

    useEffect(()=>{
        if(chatMounted || loading) return;
        const channel = supabase.channel(`globalChatsLayout`)
                .on('postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'messages'},
                     (payload) => {
                        const latestRow = payload.new;
                        const matchInfo = matches.find((row)=>row.id===latestRow.match_id);
                        const editedRow = {...latestRow, 
                            user1_id:matchInfo.user1_id,
                            user2_id:matchInfo.user2_id,
                            user1:matchInfo.user1,
                            user2:matchInfo.user2,
                            last_message_content:latestRow.content
                        }
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