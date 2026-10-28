import { useEffect, useState } from "react";
import { supabase } from '@/services/supabase'
import classes from '@/css/Loggedin/Matches.module.css'
import { UserAuth } from '@/AuthContext'
import MatchCard from '@/components/Loggedin/Matches/MatchCard.jsx'
import RequestModal from '@/components/Loggedin/Matches/RequestModal.jsx'
const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [setSelectedProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const { userId } = UserAuth()
  const approvedRequest = async (id) => {
    if(!userId) return;

    const acceptedPerson = requests.find((requests) => requests.id === id);
    if (!acceptedPerson) return;
  
    const { error: matchError } = await supabase.from("matches").insert({
      user1_id: userId,
      user2_id: acceptedPerson.sender_id,
    });
    if (matchError) {
      console.error("Error getting match", matchError);
      return;
    }
    setMatches((prevMatches) => [
      ...prevMatches,
      { ...acceptedPerson, id: acceptedPerson.sender_id },
    ]);
    setRequests((prevRequests) =>
      prevRequests.filter((request) => request.id !== id),
    );
  };
  const denyedRequest = async (id) => {
    if(!userId) return;

    const { data: removeDeny, error: denyrequestError } = await supabase
      .from("swipes")
      .delete()
      .eq("id", id)
       .eq("swiped_id", userId)
      .select("id");
    if (denyrequestError) {
      console.error("Error removing match:", denyrequestError);
      return;
    }
    if (!removeDeny || removeDeny.length === 0){
      console.error("No request was deleted");
      return;
    }
    setRequests((prevRequests) =>
      prevRequests.filter((request) => request.id !== id)
    );
  };
  const removeMatch = async (matchId) => {
    const windowConfirm = window.confirm(
      "Are you sure you want to remove this match?",
    );
    if (!windowConfirm) {
      return;
    }
   if(!userId) return;

    const { data: removeData, error: removeError } = await supabase
      .from("matches")
      .delete()
      .or("and(user1_id.eq." + userId + ",user2_id.eq." + matchId + "),and(user1_id.eq." + matchId + ",user2_id.eq." + userId + ")")
      .select("id");
    if (removeError) {
      console.error("Error removing match:", removeError);
      return;
    }
    const {error: swipeError } = await supabase
      .from("swipes")
      .delete()
      .eq("swiper_id", matchId)
      .eq("swiped_id", userId)
      .select("id");
         if(swipeError){
          console.error("Error removing the swipe", swipeError)
          return;
         }
        
    if (!removeData || removeData.length ===0){
      console.error("No match was deleted", swipeError);
      return;
    }
    setMatches((prevMatches) =>
      prevMatches.filter((match) => match.id !== matchId),
    );
    setRequests((prevRequests) =>
      prevRequests.filter((request) => request.sender_id !== matchId)
  )
  };
  useEffect(() => {
    const fetchMatches = async () => {
     if(!userId) return;

      const { data: matchesData, error: matchesError } = await supabase
        .from("matches")
        .select("*")
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

      if (matchesError) {
        console.error("Error fetching matches:", matchesError);
        return;
      }
      const userIds = matchesData.map((match) =>
        match.user1_id === userId ? match.user2_id : match.user1_id,
      );
      if (userIds.length === 0) {
        setMatches([]);
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userIds);

      if (userError) {
        console.error("Error fetching user data:", userError);
        return;
      }
      setMatches(userData);
    };
    fetchMatches();
  }, []);
  useEffect(() => {
    const fetchRequests = async () => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError) {
        console.error("Error fetching session:", userError);
        return;
      }
      const userId = userData.user.id;
      const { data: existingMatches, error: existingmatchesError } =
        await supabase
          .from("matches")
          .select("user1_id, user2_id")
          .or("user1_id.eq." + userId + ",user2_id.eq." + userId);
      if (existingmatchesError) {
        console.error("Error fetching existing matches", existingmatchesError);
        return;
      }
      const { data, error } = await supabase
        .from("swipes")
        .select("*")
        .eq("swiped_id", userId)
        .eq("action", true);
      if (error) {
        console.error("Error fetching user data:", error);
        return;
      }

      const unmatchedLikes = data.filter(
        (swipe) =>
          !existingMatches.some(
            (match) =>
              match.user1_id === swipe.swiper_id ||
              match.user2_id === swipe.swiper_id,
          ),
      );

      const senderIds = unmatchedLikes.map((swipe) => swipe.swiper_id);

      if (senderIds.length == 0) {
        setRequests([]);
        return;
      }
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .in("id", senderIds);
      if (profileError) {
        console.error("Error fetching profiles", profileError);
        return;
      }
      const incomingRequests = unmatchedLikes
        .map((swipe) => {
          const profile = profiles.find(
            (person) => person.id === swipe.swiper_id,
          );
          if (!profile) return null;
          return {
            ...profile,
            id: swipe.id,
            sender_id: swipe.swiper_id,
          };
        })
        .filter((request) => request != null);
      setRequests(incomingRequests);
    };
    fetchRequests();
  }, []);
  return (
    <div className={classes.localbody}>
      <div className={classes.header}>
        <h1>Matches</h1>
        <div className={classes.incomingRequests}>
          <button onClick={() => setSelectedProfile(true)}>
            Incoming Requests
          </button>
        </div>
      </div>
{selectedProfile && (
           <div className={classes.requestsModal}>
             <div className={classes.requestsContent}>
               <h2>Incoming Requests</h2>
               {requests.length == 0 ? (
                 <p>No incoming requests at the moment.</p>
               ) : (
                 requests.map((request) => (
                   <div className={classes.requestCard} key={request.id}>
                     <div className={classes.requestAvatar}>
                       <img src={ request.profile_picture_url || defaultAvatar} alt="User Avatar" 
                       onError ={(e) => {
                         e.currentTarget.oneError = null;
                         e.currentTarget.src = defaultAvatar;
                       }}
                       />
                     </div>
                     <div className={classes.requestInfo}>
                       <div className={classes.requestDetails}>
                         <p>
                           {request.first_name} {request.last_name}
                         </p>
                         <p>Major: {request.major}</p>
                       </div>
                       <div className={classes.requestActions}>
                         <button
                           className={classes.approveButton}
                           onClick={() => approvedRequest(request.id)}
                           aria-label="Approve Request"
                         >
                           ✓
                         </button>
                         <button
                           className={classes.denyButton}
                           onClick={() => denyedRequest(request.id)}
                           aria-label="Deny Request"
                         >
                           ✕
                         </button>
                       </div>
                     </div>
                   </div>
                 ))
               )}
               <button onClick={() => setSelectedProfile(false)}>Close</button>
             </div>
           </div>
         )}
      <div className={classes.matchCount}>
        <p>Total Matches: {matches.length}</p>
      </div>
      <div className={classes.matchesList}>
        {matches.length === 0 ? (
          <div className={classes.matchEmpty}>
            <p>Match with people to find them here!</p>
          </div>
        ) : (
          matches.map((match) => (
            <MatchCard
            key = {match.id}
            match = {match}
            onRemove = {removeMatch}
           />
          ))
        )}
      </div>
    </div>
  );
};
export default Matches;
