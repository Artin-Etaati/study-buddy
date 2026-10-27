import LikeDislikeBtns from "./LikeDislikeButtons.jsx"
import { useEffect, useState } from "react";
import { supabase } from '@/services/supabase'
import Card from "./Card.jsx"
import { UserAuth } from '@/AuthContext'


function UserPreview() {
    const { userId } = UserAuth()
    const [profiles, setProfiles] = useState(null);
    const [fetchLoading, setFetchLoading] = useState(true)
    const [makeLoading, setMakeLoading] = useState(false)
    const [error, setError] = useState(null)
    const [profileViewId, setProfileViewId] = useState(null)
    const [fetchNextBatch, setFetchNextBatch] = useState(null);
    const [currentProfile, setNextProfile] = useState(null)
    const FETCH_LIMIT = 5;
    useEffect(() => {
        async function fetchProfile() {
            setFetchLoading(true)
            console.log("called fetch")
            const { data, error } = await supabase.rpc('fetch_profiles_new', {
                input_limit: FETCH_LIMIT
            });
            if (error) {
                setError("error occured")
                return;
            }
            console.log(data)
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
            if (isExpired || profilePicExpTime == null) {
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
                        console.log("server error")
                        if (profiles.length == 1) {
                            setFetchNextBatch(!fetchNextBatch)
                        } else {
                            setProfiles(profiles => profiles.slice(1))
                        }
                        return;
                    }
                } catch (error) {
                    // @@@ handle error
                    console.log(error)
                }
            }
            const currentYear = new Date().getFullYear();
            const age = String(currentYear - parseInt(profiles[0].birthday.substring(0, 4), 10));
            profiles[0].birthday = age
            console.log(profiles[0])
            setNextProfile(profiles[0])
            setMakeLoading(false)
            setError(null)
        }
        makeCurrentProfile();
    }, [profiles])

    async function handleLike() {
        const { data, error } = await supabase.from("swipes").insert({ swiper_id: userId, swiped_id: profileViewId, action: true })

        if (error) {
            console.log(error)
            return;
        }

        if (profiles.length == 1) {
            setFetchNextBatch(!fetchNextBatch)
        } else {
            setProfiles(profiles => profiles.slice(1))
        }
    }

    async function handleDislike() {
        const { data, error } = await supabase.from("swipes").insert({ swiper_id: userId, swiped_id: profileViewId, action: false })

        if (error) {
            console.log(error)
            return;
        }
        if (profiles.length == 1) {
            setFetchNextBatch(!fetchNextBatch)
        } else {
            setProfiles(profiles => profiles.slice(1))
        }

    }

    if (fetchLoading) return (<div>Loading fetch...</div>)
    if (makeLoading) return (<div>Loading make...</div>)
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