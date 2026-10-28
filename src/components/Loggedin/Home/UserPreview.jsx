import LikeDislikeBtns from "./LikeDislikeButtons.jsx"
import { useEffect, useState } from "react";
import { supabase } from '@/services/supabase'
import Card from "./Card.jsx"
import { UserAuth } from '@/AuthContext'


function UserPreview() {
    const { userId } = UserAuth()
    const [profiles, setProfiles] = useState([]);
    const [fetchLoading, setFetchLoading] = useState(true)
    const [makeLoading, setMakeLoading] = useState(false)
    const [error, setError] = useState(null)
    const [profileViewId, setProfileViewId] = useState(null)
    const [fetchNextBatch, setFetchNextBatch] = useState(null);
    const [currentProfile, setNextProfile] = useState(null)
    const FETCH_LIMIT = 10;
    useEffect(() => {
        async function fetchProfile() {
            setFetchLoading(true)
            const { data, error } = await supabase.rpc('fetch_profiles_new', {
                input_limit: FETCH_LIMIT
            });
            if (error) {
                setError("error occured")
                return;
            }
            if (data.length > 0) {
                setProfiles(data);
            } else {
                setProfiles(null);
            }
            setFetchLoading(false)
            setError(null)
        };

        fetchProfile();
    }, [fetchNextBatch])


    useEffect(() => {
        async function makeCurrentProfile() {
            if (fetchLoading) return;
            if (profiles == null || profiles.length == 0) return;
            setMakeLoading(true)
            const profilePicExpTime = profiles[0].profile_picture_expiration
            setProfileViewId(profiles[0].id);
            const isExpired = new Date(profilePicExpTime).getTime() <= Date.now() + 10 * 60 * 1000;
            if (profiles[0].profile_picture_name && (isExpired || profilePicExpTime == null)) {
                // image has expired
                // Generate a new signedURL
                try {
                    const response = await fetch("http://localhost:3000/createURL", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/JSON"
                        },
                        body: JSON.stringify({ userId: profiles[0].id })
                    })

                    const serverResponse = await response.json();
                    if (serverResponse.status == 200) {
                        profiles[0].profile_picture_url = serverResponse.url;
                    } else {
                        // error occured on server
                        // load next profile
                        // @@@ add fix that if for any reason server can't create signed url OR server is unresponsive @@@
                        return;
                    }
                } catch (error) {
                    // @@@ handle error
                }
            }
            const currentYear = new Date().getFullYear();
            const age = String(currentYear - parseInt(profiles[0].birthday.substring(0, 4), 10));
            profiles[0].birthday = age
            setNextProfile(profiles[0])
            setMakeLoading(false)
            setError(null)
        }
        makeCurrentProfile();
    }, [profiles])

    async function handleLike() {
        const { data, error } = await supabase.from("swipes").insert({ swiper_id: userId, swiped_id: profileViewId, action: true })

        if (error) {return;}

        if (profiles.length == 1) {
            setFetchNextBatch(!fetchNextBatch)
        } else {
            setProfiles(profiles => profiles.slice(1))
        }
    }

    async function handleDislike() {
        const { data, error } = await supabase.from("swipes").insert({ swiper_id: userId, swiped_id: profileViewId, action: false })

        if (error) {return;}
        if (profiles.length == 1) {
            setFetchNextBatch(!fetchNextBatch)
        } else {
            setProfiles(profiles => profiles.slice(1))
        }

    }

    if (fetchLoading || makeLoading) return (<div>Loading</div>)
    if (error) return (<div>{error}</div>)
    return (
        <>
            {profiles != null && currentProfile != null ?
                <div>
                    <Card profile={currentProfile}></Card>
                    <LikeDislikeBtns profile={currentProfile} onLike={handleLike} onDislike={handleDislike} />
                </div> :
                <h3>No current profiles. check back later.</h3>
            }
        </>
    )
}

export default UserPreview