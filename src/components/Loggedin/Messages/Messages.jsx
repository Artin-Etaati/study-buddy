import { useEffect, useState } from "react"
import classes from "./Messages.module.css"
import { UserAuth } from "../../../AuthContext";
import { supabase } from "../../../services/supabase";
import MessageCard from "./MessageCard";


function Messages() {
    const [choice, setChoice] = useState("");
    const [users, setUsers] = useState([]);
    const {session} = UserAuth();

    useEffect (()=>{
        console.log("usersession:", session.user.id)

        const fetchMatches = async () => {
            //get raw matches and ids for current user
            const {data:UserIds, error:Iderror } = await supabase
                .from('matches')
                .select('*');
            if(Iderror) return console.error(Iderror);

            //find if current user is matched with user1 or user2 and set ids
            const matchedUserIds = UserIds.map((object)=> object.user1_id===session.user.id ? object.user2_id : object.user1_id);
            
            //find the profile data given the matched ids
            const{data:matchedUsers, error:nameError} = await supabase
             .from('profiles')
             .select("id, first_name")
             .in('id', matchedUserIds)

             if(nameError) return console.error(nameError);
            
             //set the profile data to users
             setUsers(matchedUsers);
        }
        fetchMatches();

    },[])

    const handleselect = (e) => {
        setChoice(e.target.value);
    }

    return (
        <div className={classes.body}>
            <h1>Messages</h1>
            <select name="choices" onChange={handleselect} value={choice}>
                <option value="select" key="0">Select</option>
                {users.map((user)=><option key={user.id} value={user.id}>{user.first_name}</option>)}
            </select>
            <h2>Current Messages</h2>
            <div className={classes.messagecontainer}>
                {users.length>0 ? users.map((user)=>
                    <MessageCard name={user.first_name}></MessageCard>
                ): <p>Loading...</p>}
            </div>
        </div>
    )
}

export default Messages