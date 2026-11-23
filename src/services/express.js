import express from "express"
import cors from "cors"
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SECRET_KEY
const port = process.env.EXPRESS_PORT
const supabase = createClient(supabaseUrl, supabaseKey)

const app = express();

app.listen(port);

app.use(cors())
app.use(express.json())

app.post("/createURL", async (request, response) => {
    if (request.body.userId != null && request.body.userId != "") {
        const id = request.body.userId;
        console.log("ran")
        // get profile picture data
        const profileImageData = await getProfileDetails(id);
        if (profileImageData != null) {
            // check if timestamp actually expired
            if (!profilePictureExpired(profileImageData.profile_picture_expiration)) {
                // not expired, reuse same url
                response.send(JSON.stringify({url: profileImageData.profile_picture_url, status: 200}))
            } else {
                // expired, create new signed url
                const newURL = await createNewSignedURL(id, profileImageData.profile_picture_name)
                if(newURL != null){
                    response.send(JSON.stringify({url: newURL, status: 200}));
                } else {
                    response.send(JSON.stringify({status: 500}))
                }

            }
        } else {
            // error occured
            response.send(JSON.stringify({status: 500}))
        }
    }
})

async function getProfileDetails(id) {
    const { data, error } = await supabase.from("profiles").select('profile_picture_expiration, profile_picture_url, profile_picture_name').eq('id', id)
    if (error) {
        console.log("error occured");
        return null;
    }
    return data[0];
}

function profilePictureExpired(profile_picture_expiration) {
    if (profile_picture_expiration != null && profile_picture_expiration != "") {
        const isExpired = new Date(profile_picture_expiration).getTime() <= Date.now() + 10 * 60 * 1000;
        return isExpired;
    }
    return true;
}

async function createNewSignedURL(id, profile_picture_name) {
    const startTime = Date.now();
    const expireInt = 86400 // 1 day in seconds
    const bufferTime = 120000 // allocate buffer time (2 minutes in ms)
    const { data: makeURLData, error: makeURLError } = await supabase.storage.from("Profile_Picture").createSignedUrl("/" + profile_picture_name, expireInt);
    if (makeURLError) {
        console.log("Unable to create profile picture url " + makeURLError)
        return null;
    }
    const expirationTime = new Date(startTime + (expireInt * 1000) - bufferTime).toISOString()
    const generatedUrl = makeURLData.signedUrl;
    // update database
    const { error: updateURLError } = await supabase.from("profiles")
        .update({ profile_picture_url: generatedUrl, profile_picture_expiration: expirationTime})
        .eq('id', id)
    if (updateURLError) {
        console.log("Unable to update profile picture url")
        return null;
    }
    return generatedUrl;
}