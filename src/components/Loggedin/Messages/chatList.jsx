import { useState } from "react";
import classes from "./Chats.module.css"
import ChatCard from "./chatCard";
import { useNavigate, useOutletContext } from "react-router-dom";


function chatList() {
    const {users} = useOutletContext();
    const [input,setInput] = useState("")
    const navigate = useNavigate();

    const filteredUsers = users.filter((user)=>user.matchedProfile.first_name.toLowerCase().includes(input));

    return (
        <div className={classes.body}>
            <h1>Messages</h1>
            <div className={classes.inputContainer}>
                <input className={classes.searchinput} placeholder="Search" value ={input} onChange={(e)=>setInput(e.target.value)}></input>
                {input.trim() && 
                    (<div className={classes.dropdown}>
                        {filteredUsers.length ? 
                        (filteredUsers.map((user)=><div className={classes.dropdownItem} onClick={()=>navigate(`/messages/${user.matchedProfile.id}`)}>{user.matchedProfile.first_name}</div>)) : 
                        <div className={classes.dropdownItem}>None found</div>}


                    </div>)
                }
            </div>
                <h2>Current Messages</h2>
                <div className={classes.messagecontainer}>
                    {users.length>0 ? users.map((user)=>
                        <ChatCard user={user.matchedProfile}></ChatCard>
                    ): <p>None found</p>}
                </div>
        </div>
    )
}

export default chatList