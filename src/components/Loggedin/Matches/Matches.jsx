import { useEffect, useState } from "react";
import { supabase } from '@/services/supabase'
import classes from '@/css/Loggedin/Matches.module.css'
import { UserAuth } from '@/AuthContext'
import MatchCard from '@/components/Loggedin/Matches/MatchCard.jsx'
import ProfileModal from  '@/components/Loggedin/Matches/ProfileModal.jsx'
import RequestsModal from  '@/components/Loggedin/Matches/RequestsModal.jsx'

const Matches = () => {
  const [requestProfile, setRequestsProfile] = useState(null);
  const [incomingRequests, setIncomingRequests] = useState(false);
  const [matches, setMatches] = useState([]);
  const [requests, setRequests] = useState([]);
  const [existingMatches, setExistingMatches] = useState([]);
  const [matchesLoaded, setMatchesLoaded] = useState(false);
  const { userId } = UserAuth()
  
  const approvedRequest = async (id) => {
    if(!userId) return;
    const acceptedPerson = requests.find((requests) => requests.id === id);
    if (!acceptedPerson) return;
    const { error: matchError } = await supabase.
    from("matches")
    .insert({user1_id: userId, user2_id: acceptedPerson.sender_id,
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
    setExistingMatches((prevMatches) => [
      ...prevMatches,
      { user1_id: userId, user2_id: acceptedPerson.sender_id },
    ]);
  };
  const denyRequest = async (id) => {
    if(!userId) return;
    const { data: removeRequest, error: denyrequestError } = await supabase
      .from("swipes")
      .update({ action: false })
      .eq("id", id)
       .eq("swiped_id", userId)
      .select("id");
    if (denyrequestError) {
      console.error("Error removing match:", denyrequestError);
      return;
    }
    if (!removeRequest|| removeRequest.length === 0){
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
    const { data, error } = await supabase
      .from("matches")
      .delete()
      .or("and(user1_id.eq." + userId + ",user2_id.eq." + matchId + "),and(user1_id.eq." + matchId + ",user2_id.eq." + userId + ")")
      .select("id");
    if (error) {
      console.error("Error removing match:", error);
      return;
    }
    const {error: swipeError } = await supabase
      .from("swipes")
      .update({action:false}) 
      .eq("swiper_id", matchId)
      .eq("swiped_id", userId)
      .select("id");
         if(swipeError){
          console.error("Error removing the swipe", swipeError)
          return;
         }
    if (!data ||data.length ===0){
      console.error("No match was deleted", swipeError);
      return;
    }
    setMatches((prevMatches) =>
      prevMatches.filter((match) => match.id !== matchId),
    );
    setRequests((prevRequests) =>
      prevRequests.filter((request) => request.sender_id !== matchId)
  )
  //this function is removing the match from the existingMatches state so that it can be used to filter out requests that are already matched
  setExistingMatches((prevMatches) =>prevMatches.filter((match) =>
        !((match.user1_id === userId && match.user2_id === matchId) || (match.user1_id === matchId && match.user2_id === userId)
        ),
    ),
  );
}
  //Func to update the avatar url for each profile
  const updateAvatar = async(profiles) =>{
  const updatedAvatars = await Promise.all(
        profiles.map(async(profile) => {
          if (!profile.profile_picture_name) return profile;
        const { data: photoData, error: photoError } = await supabase.storage
          .from('Profile_Picture')
          .createSignedUrl(profile.profile_picture_name, 3600);

        if (photoError) {
          console.error('Error loading profile photo:', photoError);
          return profile;
        }
        return { ...profile, profile_picture_url: photoData.signedUrl,};}));     
      return updatedAvatars;
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
      setExistingMatches(matchesData);
      setMatchesLoaded(true);
      const userIds = matchesData.map((match) =>
        match.user1_id === userId ? match.user2_id : match.user1_id,
      );
      if (userIds.length === 0) {
        setMatches([]);
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("*,majors(name)")
        .in("id", userIds);

      if (userError) {
        console.error("Error fetching user data:", userError);
        return;
      };
      const updatedAvatars = await updateAvatar(userData);
      setMatches(updatedAvatars);
    };  
    fetchMatches();
  }, [userId]);
  
  useEffect(() => {
    const fetchRequests = async () => {
      if(!userId|| !matchesLoaded) return;
      const { data, error } = await supabase
        .from("swipes")
        .select("*")
        .eq("swiped_id", userId)
        .eq("action", true);
      if (error) {
        console.error("Error fetching user data:", error);
        return;
      }
      //filters out requests that are already in matches
      const filteredLikes = data.filter((swipe) =>
          !existingMatches.some((match) =>
              match.user1_id === swipe.swiper_id || //checks the match in either column
              match.user2_id === swipe.swiper_id,
          ),
      );
      //creates an array of the new request IDs that are not in matches
      const senderIds = filteredLikes.map((swipe) => swipe.swiper_id); 
      if (senderIds.length == 0) {
        setRequests([]);
        return;
      }
      const { data: profiles, error: profileError} = await supabase
        .from("profiles")
        .select("*,majors(name)")
        .in("id", senderIds); //gets the profile info for everyone from senderIds
      if (profileError) {
        console.error("Error fetching profiles", profileError);
        return;
      }
      //updates the avatar url for each profile and returns the profile info with the updated avatar url
      const updatedAvatars = await updateAvatar(profiles);
      //Combine the swipe data with the profile data to create a new array of incoming requests with the profile information
      const incomingRequests = filteredLikes.map((swipe) => {
          const profile = updatedAvatars.find(
            (person) => person.id === swipe.swiper_id, //matches id to swiper id
          );
          if (!profile) return null;
          return {
            ...profile,
            id: swipe.id,
            sender_id: swipe.swiper_id,
          };
        })
        //any profiles that were null are filtered out of the incoming requests
        .filter((request) => request != null);
      setRequests(incomingRequests);
    };
    fetchRequests();
  }, [userId, matchesLoaded, existingMatches]);
  return (
    <div className={classes.localbody}>
      <div className={classes.header}>
      <h1>Matches</h1>
      <div className={classes.incomingRequests}>
      <button onClick={() =>setIncomingRequests(true)}>
      Incoming Requests{requests.length > 0 && (
        <span className={classes.requestCount}>{requests.length}</span>
        )}
     </button>
     </div>
    </div>
           {incomingRequests && (
           <RequestsModal 
           requests = {requests}
           approvedRequest = {approvedRequest}
           denyRequest = {denyRequest}
           isClose = {()=> setIncomingRequests(false)}
           setRequestsProfile = {setRequestsProfile}
           />
         )}
       <div className={classes.matchCount}>
        <p>Total Matches: {matches.length}</p>
       </div>
      <div className={classes.matchesList}>
        {matches.length === 0 ? ( <div className={classes.matchEmpty}>
          <p>Match with people to find them here!</p>
          </div>
        ) : (
          matches.map((match) => (
            <MatchCard 
            key = {match.id}
            match = {match}
            removeMatch = {removeMatch}
           />
          )))}
          {requestProfile && (
            <ProfileModal  profile = {requestProfile} setIsOpen = {setRequestsProfile}/>)}
      </div>
    </div>
  );
};
export default Matches;
