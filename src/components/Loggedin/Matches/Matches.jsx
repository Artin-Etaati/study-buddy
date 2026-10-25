import { useEffect, useState } from "react";
import { supabase } from "../../../services/supabase";
import classes from "./Matches.module.css";
const Matches = () => {
  const [matches, setMatches] = useState([
    { id: 1, first_name: "John", last_name: "Doe", major: "Computer Science" },
    { id: 2, first_name: "Jane", last_name: "Smith", major: "Mathematics" },
    { id: 3, first_name: "Alice", last_name: "Johnson", major: "Physics" },
  ]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  //  { id: 1, first_name: "John", last_name: "Doe", major: "Computer Science" },
  //{ id: 2, first_name: "Jane", last_name: "Smith", major: "Mathematics" },
  //{ id: 3, first_name: "Alice", last_name: "Johnson", major: "Physics" },
  //]);
  const approvedRequest = async (id) => {
    const acceptedPerson = requests.find((requests) => requests.id === id);
    if (!acceptedPerson) return;
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("Error getting user", userError);
      return;
    }
    const userId = userData.user.id;
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
  const denyedRequest = (id) => {
    setRequests((prevRequests) =>
      prevRequests.filter((request) => request.id !== id),
    );
  };
  const removeMatch = async (matchId) => {
    const windowConfirm = window.confirm(
      "Are you sure you want to remove this match?",
    );
    if (!windowConfirm) {
      return;
    }
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("Error getting user", userError);
      return;
    }

    const userId = userData.user.id;

    const { data: removeData, error: removeError } = await supabase
      .from("matches")
      .delete()
      .or(
        "and(user1_id.eq.${userId},user2_id.eq.${matchId}),and(user1_id.eq.${matchId},user2_id.eq.${userId})",
      )
      .select("id");
    if (removeError) {
      console.error("Error removing match:", removeError);
      return;
    }
    console.log("Match removed:", removeData);
    setMatches((prevMatches) =>
      prevMatches.filter((match) => match.id !== matchId),
    );
  };
  useEffect(() => {
    const fetchMatches = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      console.log("logged in user:", sessionData);

      if (sessionError) {
        console.error("Error fetching session:", sessionError);
        return;
      }

      const userId = sessionData.session.user.id;

      const { data: matchesData, error: matchesError } = await supabase
        .from("matches")
        .select("*")
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);
      console.log("match rows:", matchesData);

      if (matchesError) {
        console.error("Error fetching matches:", matchesError);
        return;
      }
      const userIds = matchesData.map((match) =>
        match.user1_id === userId ? match.user2_id : match.user1_id,
      );
      console.log("userIds:", userIds);
      if (userIds.length === 0) {
        setMatches([]);
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("*")
        .in("id", userIds);
      console.log("profiles returned", userData);

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

      console.log("My user ID:", userId);
      const { data, error } = await supabase
        .from("swipes")
        .select("*")
        .eq("swiped_id", userId)
        .eq("action", true);
      if (error) {
        console.error("Error fetching user data:", error);
        return;
      }
      console.log("Likes recieved", data);

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
      console.log("Request profiles recieved", profiles);
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
                    <img src="/images.png" alt="User Avatar" />
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
            <div className={classes.matchCard} key={match.id}>
              <div className={classes.avatar}>
                <img src="/images.png" alt="User Avatar" />
              </div>
              <div className={classes.matchinfo}>
                <h2>
                  {match.first_name} {match.last_name}
                </h2>
                <p>Major: {match.major}</p>
              </div>
              <div className={classes.matchProfile}>
                <button onClick={() => setIsOpen(match)}>View Profile</button>
                {isOpen?.id == match.id && (
                  <div className={classes.profileModal}>
                    <div className={classes.profileContent}>
                      <div className={classes.modalAvatar}>
                        <img src="/images.png" alt="User Avatar" />
                      </div>
                      <div className={classes.profileHeader}>
                        <h2>
                          {match.first_name} {match.last_name}
                        </h2>
                        <p>Major: {match.major}</p>
                      </div>

                      <hr className={classes.profileLine} />

                      <div className={classes.profileDetails}>
                        <p>About Me: {match.bio}</p>
                      </div>
                      <button onClick={() => setIsOpen(false)}>Close</button>
                    </div>
                  </div>
                )}
                <button onClick={() => removeMatch(match.id)}>
                  Remove Match
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default Matches;
