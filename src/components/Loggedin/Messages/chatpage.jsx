import { useEffect, useRef, useState } from "react";
import {Navigate, useOutletContext, useParams } from "react-router-dom";
import { supabase } from "../../../services/supabase";
import styles from "./chatpage.module.css"
import { UserAuth } from "../../../AuthContext";


const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function Chat() {

    const[messages, setMessages] = useState([]);
    const {profilenum} = useParams();
    const[loading, setLoading] = useState(true)
    const[sent, setSent] = useState(false);
    const [input, setInput] = useState('');
    const userID = UserAuth().session.user.id;
    const matchInfo = useOutletContext().matchList.find((user)=>user.id===profilenum);
    const containerRef = useRef(null);
    const {setactiveChatId, setChats} = useOutletContext();

  

    useEffect(() => {
        if (!matchInfo) return;
        //keep track that this chat is active
        setactiveChatId(matchInfo.matchId);

        const fetchMessages = async () => {
          const { data, error } = await supabase
              .from('messages')
              .select('*')
              .eq("match_id", matchInfo.matchId)
              .order('created_at', { ascending: true })

          if (error) return console.error('Error fetching messages:', error);
          setMessages(data);

          if(data.length) {
            const{error} = await supabase.rpc('mark_messages_as_read', {
              target_match_id:matchInfo.matchId,
            });
            if(error) return console.error("Failed to mark as read", error);

            setChats((prevChats) => {
              return prevChats.map((chat) => {
                return chat.match_id === matchInfo.matchId ? { ...chat, is_unread_for_me: false } : chat
              })
            });

          }

          setLoading(false)


        };

        fetchMessages();

        const channel = supabase
        .channel(`chat:${matchInfo.matchid}`)
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'messages', filter:`match_id=eq.${matchInfo.matchId}`},
            async (payload) => {
              setMessages((prevMessages) => [...prevMessages, payload.new]);

              if(payload.new.sender_id !== userID) { //prevent unneccesary queries
                const{error} = await supabase.rpc('mark_messages_as_read', {
                  target_match_id:matchInfo.matchId,
                });
                if(error) return console.error("Failed to mark as read", error);
              }
            }
          )
        .subscribe();

        return () => {
          //check race condition of if chat is self or someone else
          setactiveChatId((prev) => (prev === matchInfo.matchId ? null : prev));
          supabase.removeChannel(channel);
        };

    }, [])

    useEffect(()=>{
      if(containerRef.current) containerRef.current.scrollTo({top:containerRef.current.scrollHeight})
    }, [messages])


    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        setSent(true);

        const {error} = await supabase.from('messages').insert([{
            match_id: matchInfo.matchId,
            sender_id: userID,
            content: input.trim(),
            read:false
        }])
        setInput('');
        setSent(false);
        if (error) return console.error(error)
    }

    if(!matchInfo) return <Navigate to='/messages' replace/>
    if(loading) return <div>fetching...</div>


  return (
    <div className={styles.container}>
      <h2>{(matchInfo.name)}</h2>
      
      <div ref={containerRef} className={styles.chatList}>
        {messages.map((msg) => {
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