import {useState } from "react";
import classes from "./Chats.module.css"
import ChatCard from "./chatCard";
import { useNavigate, useOutletContext } from "react-router-dom";


function chatList() {
    //takes matchlist and chats from chatquery
    const {matchList, chats} = useOutletContext();
    const [input,setInput] = useState("")
    const navigate = useNavigate();

    //filters users matches based on searchbar
    const filteredMatches = matchList.filter((user)=>user.name.toLowerCase().includes(input));


    return (
        <div className={classes.body}>
            <h1>Messages</h1>
            <div className={classes.inputContainer}>
                <input className={classes.searchinput} placeholder="Search" value ={input} onChange={(e)=>setInput(e.target.value)}></input>
                {/*if searchbar input exists show a dropdown for users that match search*/}
                {input.trim() && 
                    (<div className={classes.dropdown}>
                        {filteredMatches.length ? 
                        (filteredMatches.map((user)=><div className={classes.dropdownItem} onClick={()=>navigate(`/messages/${user.id}`)}>{user.name}</div>)) : 
                        <div className={classes.dropdownItem}>None found</div>}
                    </div>)
                }
            </div>
                <h2>Current Messages</h2>
                <div className={classes.messagecontainer}>
                    {/*if the user has chats with any user return them formatted as chatCards. Otherwise none found*/}
                    {chats.length ? 
                        chats.map((row)=> {
                            if(!row.last_message_content) return;
                            return <ChatCard row={row} key={row.match_id}></ChatCard>
                        })
                        : <p>None found</p>}
                </div>
        </div>
    )
}

export default chatList