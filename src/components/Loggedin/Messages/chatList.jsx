import classes from "./Messages.module.css"
import ChatCard from "./chatCard";
import { useOutletContext } from "react-router-dom";


function chatList() {
    const {users} = useOutletContext();

    return (
        <div className={classes.body}>
            <h1>Messages</h1>
            <h2>Searchbar</h2>
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