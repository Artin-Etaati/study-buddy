import { Outlet } from "react-router-dom"
import Navbar from './Navbar'
import layout from '@/css/LoggedIn/Layout.module.css'
import { supabase } from "../../services/supabase"
import { useEffect, useRef, useState } from "react"
import ChatNotification from "./Messages/ChatNotification"
import { UserAuth } from "../../AuthContext"


const Layout = () => {
    const [chatMounted, setchatMounted] = useState(false); //if chatQuery is mounted or not
    const [preview, setPreview] = useState([]) //preview array for notifications
    const [matches, setMatches] = useState([]) //list of matched users.
    const [loading, setLoading] = useState(true); 
    const {session} = UserAuth();
    const profileURLS = useRef([]);

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

            const profileNames = [];

            data.forEach((match)=>{
                const matchedUser = match.user1_id === session.user.id ? match.user2 : match.user1;
                if(!profileURLS.current.some((item)=>item?.id===matchedUser.id)) {
                    profileURLS.current.push({id:matchedUser.id})
                    profileNames.push(matchedUser.profile_picture_name);
                }
            })

            if(profileNames.length) {
                const {data:URLData, error:URLError } = await supabase.storage.from('Profile_Picture')
                .createSignedUrls(profileNames, 3600);

                if(URLError) return console.error(URLError);
                profileURLS.current.forEach((profile,index)=> profile.profileLink = URLData[index].signedUrl)
            }

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
                        const matchPicture = profileURLS.current.find((profile)=>profile.id===latestRow.sender_id)
                        const editedRow = {...latestRow, 
                            user1_id:matchInfo.user1_id,
                            user2_id:matchInfo.user2_id,
                            user1:matchInfo.user1,
                            user2:matchInfo.user2,
                            last_message_content:latestRow.content,
                            matchPicture:matchPicture.profileLink
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
        <Outlet context={{setchatMounted,preview,setPreview,profileURLS}}/>
    </div>
    )
}

export default Layout