import LikeDislikeBtns from "./LikeDislikeButtons.jsx"
import { useEffect, useState } from "react";
import { supabase } from '@/services/supabase'
import Card from "./Card.jsx"
import { UserAuth } from '@/AuthContext'


function UserPreview() {
    const { userId } = UserAuth()
    const [profiles, setProfiles] = useState(null);
    const [fetchLoading, setFetchLoading] = useState(true)
    const [makeProfileLoading, setProfileLoading] = useState(true)
    const [error, setError] = useState(null)
    const [profileViewId, setProfileViewId] = useState(null)
    const [fetchNextBatch, setFetchNextBatch] = useState(null);
    const [currentProfile, setNextProfile] = useState(null)
    const FETCH_LIMIT = 2;
    useEffect(() => {
        async function fetchProfile() {
            setFetchLoading(true)
            console.log("called fetch")
            const { data, error } = await supabase.rpc('fetch_profiles', {
                input_limit: FETCH_LIMIT
            });
            if (error) {
                setError("error occured")
                return;
            }
            if (data.length > 0) {
                // const profilePicExpTime = data[0].profile_picture_expiration
                // setProfileViewId(data[0].id);
                // const isExpired = new Date(profilePicExpTime).getTime() <= Date.now() + 10 * 60 * 1000;
                // if (isExpired || profilePicExpTime == null) {
                //     // image has expired
                //     // Generate a new signedURL
                //     try {
                //         const response = await fetch("http://localhost:3000/createURL", {
                //             method: "POST",
                //             headers: {
                //                 "Content-Type": "application/JSON"
                //             },
                //             body: JSON.stringify({ userId: data[0].id })
                //         })

                //         const newUrl = await response.json()
                //         data[0].profile_picture_url = newUrl.url;
                //     } catch (error) {
                //         // @@@ handle error
                //         console.log(error)
                //     }
                // }
                // const currentYear = new Date().getFullYear();
                // const age = String(currentYear - parseInt(data[0].birthday.substring(0, 4), 10));
                // data[0].birthday = age
                setProfiles(data);
                setNextProfile(data[0])
            } else {
                // currently no profiles to show
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
            setProfileLoading(true)
            // setLoading(true)
            console.log(currentProfile)
            const profilePicExpTime = currentProfile.profile_picture_expiration
            setProfileViewId(currentProfile.id);
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
                        body: JSON.stringify({ userId: currentProfile.id })
                    })

                    const newUrl = await response.json()
                    currentProfile.profile_picture_url = newUrl.url;
                } catch (error) {
                    // @@@ handle error
                    console.log(error)
                }

                // setProfiles(data);
                // setLoading(false)

                setProfileLoading(false)
            }
            const currentYear = new Date().getFullYear();
            const age = String(currentYear - parseInt(currentProfile.birthday.substring(0, 4), 10));
            currentProfile.birthday = age
            setProfileLoading(false)
            setError(null)

        }
        makeCurrentProfile();
    }, [currentProfile])

    async function handleLike() {
        const { data, error } = await supabase.from("swipes").insert({ swiper_id: userId, swiped_id: profileViewId, action: true })

        if (error) {
            console.log(error)
            return;
        }
        setProfiles(profiles.shift())
        if (profiles.length == 0) {
            setFetchNextBatch(!fetchNextBatch)
        } else {
            setNextProfile(profiles[0])
        }

    }

    async function handleDislike() {
        const { data, error } = await supabase.from("swipes").insert({ swiper_id: userId, swiped_id: profileViewId, action: false })

        if (error) {
            console.log(error)
            return;
        }
        setProfiles(profiles.shift())
        if (profiles.length == 0) {
            setFetchNextBatch(!fetchNextBatch)
        } else {
            setNextProfile(profiles[0])
        }

    }


    if (fetchLoading) return (<div>Loading...</div>)
    if (makeProfileLoading) return (<div>Loading...</div>)
    if (error) return (<div>{error}</div>)
    return (
        <>
            {profiles != null ?
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