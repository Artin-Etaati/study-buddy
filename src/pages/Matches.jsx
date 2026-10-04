import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import classes from "./Matches.module.css";
const Matches = () => {
  const [matches, setMatches] = useState([]);
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
  return (
    <div className={classes.localbody}>
      <div className={classes.header}>
        <h1>Matches</h1>
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
                <button>View Profile</button>
                <button>Message</button>
                <button>Remove Match</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default Matches;
