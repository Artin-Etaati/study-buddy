import { useEffect, useState } from "react";
import {Navigate, useOutletContext, useParams } from "react-router-dom";
import { supabase } from "../../../services/supabase";
import styles from "./chatpage.module.css"
import { UserAuth } from "../../../AuthContext";




export default function Chat() {

    const[messages, setMessages] = useState([]);
    const {profilenum} = useParams();
    const[loading, setLoading] = useState(true)
    const[sent, setSent] = useState(false);
    const [input, setInput] = useState('');
    const userID = UserAuth().session.user.id;
    const matchInfo = useOutletContext().users.find((user)=>user.matchedProfile.id===profilenum);


  

    useEffect(() => {
        const fetchMessages = async () => {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq("match_id", matchInfo.matchId)
            .order('created_at', { ascending: true })

        if (error) return console.error('Error fetching messages:', error);
        setMessages(data);
        setLoading(false)
        };

        fetchMessages();

        const channel = supabase
        .channel('public:messages')
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'messages' },
            (payload) => {
            setMessages((prevMessages) => [...prevMessages, payload.new]);
            }
        )
        .subscribe();

        return () => {
        supabase.removeChannel(channel);
        };

    }, [])


    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        setSent(true);

        const {error} = await supabase.from('messages').insert([{
            match_id: matchInfo.matchId,
            sender_id: userID,
            content: input.trim()
        }])
        setInput('');
        setSent(false);
        if (error) return console.error(error)
    }

    if(!matchInfo) return <Navigate to='/messages' replace/>
    if(loading) return <div>fetching...</div>


  return (
    <div className={styles.container}>
      <h2>{(matchInfo.matchedProfile.first_name)}</h2>
      
      <div className={styles.chatList}>
        {messages.map((msg) => {
            const self = msg.sender_id === userID;
            const sender = self ? "You" : matchInfo.matchedProfile.first_name;
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