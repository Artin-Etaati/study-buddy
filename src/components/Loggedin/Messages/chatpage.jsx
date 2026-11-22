import { useEffect, useRef, useState } from "react";
import {Navigate, useOutletContext, useParams } from "react-router-dom";
import { supabase } from "../../../services/supabase";
import styles from "./chatpage.module.css"
import { UserAuth } from "../../../AuthContext";

//function for formating the supabase date format
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function Chatpage() {

    const[messages, setMessages] = useState([]); //the messages between each other
    const {profilenum} = useParams(); //the userID in the URL
    const[loading, setLoading] = useState(true)
    const[sent, setSent] = useState(false); //if a message is sending or not
    const [input, setInput] = useState(''); //message input
    const userID = UserAuth().session.user.id;
    //returns the user data of the current open chat if its in the current users matchlist
    const matchInfo = useOutletContext().matchList.find((user)=>user.id===profilenum);

    const containerRef = useRef(null); //used to focus the page to bottom
    const {setactiveChatId, setChats} = useOutletContext(); //used for determining current chat and setting local data
    const viewingStatus = useRef(false); //ref for if matched user is viewing page

  
    //this useeffect subscribes to realtime and fetches messages
    useEffect(() => {
        //keep track that this chat is active
        setactiveChatId(matchInfo.matchId);

        //create supabase realtime channel and display user present by their supabaseID
         const channel = supabase
        .channel(`chat:${matchInfo.matchid}`, {config: {presence: {key:userID}}});

        //when a new message is sent in the current chat update the message state
        channel.on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'messages', filter:`match_id=eq.${matchInfo.matchId}`},
             (payload) => {
              setMessages((prevMessages) => [...prevMessages, payload.new]);
            }
          );

          //if two users are in the chat then viewingstatus is true, else its false
        channel.on('presence', {event:'sync'}, ()=> {
          const currentState = channel.presenceState();
          const recipientData = currentState[matchInfo.id];

          if(recipientData && recipientData.length) {
            viewingStatus.current = true;
          } else {
            viewingStatus.current = false;
          }
        });

        //subscribes to the listener and sets a presence attribute for viewing
        channel.subscribe(async (status)=>{
          if(status==='SUBSCRIBED') {
            await channel.track({viewing:true})
          }
        });

        //fetch messages from message table for current matchID
        const fetchMessages = async () => {
          const { data, error } = await supabase
              .from('messages')
              .select('*')
              .eq("match_id", matchInfo.matchId)
              .order('created_at', { ascending: true })

          if (error) return console.error('Error fetching messages:', error);
          setMessages(data);

          //marks messages as read when the chat is mounted
          if(data.length) { //this is not always required as messages might be caught up. add an && !unread
            const{error} = await supabase.rpc('mark_messages_as_read', {
              target_match_id:matchInfo.matchId,
            });
            if(error) return console.error("Failed to mark as read", error);

            //set message to read on click locally. keep all chats the same but for the current one make sure unread and count are reset
            setChats((prevChats) => {
              return prevChats.map((chat) => {
                return chat.match_id === matchInfo.matchId ? { ...chat, is_unread_for_me: false, my_unread_count:0} : chat
              })
            });

          }
          //scroll to bottom once messages are fetched
          if(containerRef.current) containerRef.current.scrollTo({top:containerRef.current.scrollHeight})
          setLoading(false)
        };

        fetchMessages();

       

        return () => {
          //check race condition of if chat is self or someone else
          setactiveChatId((prev) => (prev === matchInfo.matchId ? null : prev));
          supabase.removeChannel(channel); //remove channel when unmounted
        };

    }, [])

    //every new message jump to bottom
    useEffect(()=>{
      if(containerRef.current) containerRef.current.scrollTo({top:containerRef.current.scrollHeight})
    }, [messages])


    const handleSendMessage = async (e) => {
        e.preventDefault();
        //message blank so return
        if (!input.trim()) return;
        setSent(true);

        //insert message based on current chat data, viewing data and content
        const {error} = await supabase.from('messages').insert([{
            match_id: matchInfo.matchId,
            sender_id: userID,
            content: input.trim(),
            read:viewingStatus.current
        }])
        setInput('');
        setSent(false);
        if (error) return console.error(error)
    }

    //if a user was never found at first matchinfo return
    if(!matchInfo) return <Navigate to='/messages' replace/>
    if(loading) return <div>fetching...</div>


  return (
    <div className={styles.container}>
      <h2>{(matchInfo.name)}</h2>
      <div ref={containerRef} className={styles.chatList}>
        {messages.map((msg) => {
          //for each message determine if the sender was yourself
            const self = msg.sender_id === userID;
            const sender = self ? "You" : matchInfo.name;
          return (
            <div 
              key={msg.id} 
              className={`${styles.chatListItem} ${self ? styles.sendMessage : styles.recieveMessage}`}>
              <div className={styles.sender}>{sender}</div>
              <div className={styles.content}>{msg.content}</div>
              <div className={styles.timestamp}>{formatTimestamp(msg.created_at)}</div>
            </div>
          );
        })}
      </div>



      <form onSubmit={handleSendMessage} className={styles.form}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className={styles.input}
        />
        <button type="submit" className={styles.button} disabled={sent}>Send</button>
      </form>
    </div>
  );
}