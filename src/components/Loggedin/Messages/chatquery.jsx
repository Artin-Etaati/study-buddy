import { useState, useEffect } from "react";
import { Outlet, useOutletContext } from "react-router-dom"
import { supabase } from "../../../services/supabase";
import { UserAuth } from "../../../AuthContext";

export default function chatquery () {
    const [matchList,setMatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const {session} = UserAuth();
    const [chats,setChats] = useState([]);
    const [activeChatId, setactiveChatId] = useState(null); //activeChat used to determine what chat is currently open. equal to a matchID or NULL
    const {setchatMounted,preview, setPreview} = useOutletContext(); //used for notifications. passed down from layout.
    const {profileURLS} = useOutletContext(); //for profile URLS

    //this useeffect fetches chat previews and sets matchlist
    useEffect (()=>{
        //on chat mount setchatmounted to true to signify the chatList is mounted.
        setchatMounted(true);

        //from the view called chat_summaries fetch all data about last message with each match
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
                last_message_time,
                user1_unread_count,
                user2_unread_count`
                )
                .order('last_message_time', { ascending: false, nullsFirst: false });
            if(error) return console.error(error);
            
            //take the chat data and manually add a local isunread attribute and unread count attribute
            const formattedChats = data.map((row)=> {
                const isFromMe = row.last_message_sender === session.user.id;
                const matchedProfileId = row.user1_id === session.user.id ? row.user2_id : row.user1_id;
                return {
                    ...row, 
                    is_unread_for_me: isFromMe ? false : !row.last_message_read,
                    my_unread_count: row.user1_id === session.user.id ? row.user1_unread_count : row.user2_unread_count,
                    matchPicture: profileURLS.current.find((profile)=>profile.id===matchedProfileId).profileLink

                }
            })

            //set formattedChats to chat state
            setChats(formattedChats);
            

             //take the formattedChats and create simple list of matched users and their info
             const matchList = formattedChats.map((row)=>{
                const matchedProfile = row.user1_id===session.user.id ? row.user2 : row.user1
                return {
                    matchId:row.match_id,
                    name:matchedProfile.first_name,
                    id:matchedProfile.id
                }
            })

             //set the new data to matchlist
             setMatchlist(matchList);
             setLoading(false);
        }

        fetchChats()
        return () => setchatMounted(false); //when leaving the chat components make sure to signfiy its unmounted
    },[])
    
    //this useEffect manages all global messages for a user
    useEffect (()=>{
        if(!chats.length) return;
        //creates a realtime channel for global messages on an insert into the message table
        const channel = supabase
                .channel(`globalChatsChatQuery`)
                .on('postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'messages'},
                     (payload) => {
                        const latestRow = payload.new;

                        const isFromMe = latestRow.sender_id === session.user.id;

                        const isChatOpen = latestRow.match_id === activeChatId;
                        
                        //is it from them and is the chat closed. only case to be unread
                        const isUnreadforme = !isFromMe && !isChatOpen;

                        //editedChats is the list of recent chats without the one that just sent you a message
                        const editedChats = chats.filter((row)=>row.match_id!==latestRow.match_id);
                        //chat details is the info needed about who just sent you a message
                        const chatDetails = chats.find((row)=>row.match_id===latestRow.match_id)

                        //create an entire custom Chat row that includes extra local attributes based on latest message recieved
                        const editedRow = {
                            match_id:latestRow.match_id,
                            user1_id:chatDetails.user1_id,
                            user2_id:chatDetails.user2_id,
                            user1:chatDetails.user1,
                            user2:chatDetails.user2,
                            last_message_content:latestRow.content,
                            last_message_sender:latestRow.sender_id,
                            last_message_read:latestRow.read,
                            last_message_time:latestRow.created_at,
                            is_unread_for_me:isUnreadforme,
                            my_unread_count: isUnreadforme ? chatDetails.my_unread_count + 1 : chatDetails.my_unread_count,
                            matchPicture:chatDetails.matchPicture
                        }

                        //set the chats to the new row first to signify new message and puts the editedchats behind it
                        setChats([editedRow, ...editedChats])
                        //only sets the preview for notification to work if you are in someone elses chat. Not in the current chat or main chatlistpage.
                        if(editedRow.match_id!==activeChatId && activeChatId!==null) setPreview((prev)=>[...prev,editedRow])
                       
                    })
                .subscribe();

        
                return () => supabase.removeChannel(channel); //remove channel on unmount

    },[activeChatId,chats]) //reupdate listeners on chat or activechat change

    if(loading) return <div>fetching users...</div>

    return (
        <Outlet context={{matchList, chats, setactiveChatId, setChats, preview, setPreview}}/>
    )
}