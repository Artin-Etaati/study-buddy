import classes from '@/css/Loggedin/Matches.module.css'
import defaultAvatar from '@/assets/default-avatar.png';
import {createPortal} from "react-dom";
import {useEffect, useState} from "react";
import { supabase } from '@/services/supabase'

const ProfileModal = ({profile, setIsOpen}) => {
    const [courses, setCourses] = useState([]);
    const profileId = profile?.sender_id || profile?.id 
    useEffect(()=> {
      const fetchCourses = async ()=> {
        setCourses([]);
        if(!profileId) return;
        const{data,error} = await supabase
        .from("user_courses")
        .select("course_id ,courses(course_code)")
        .eq("user_id",profileId)
        if(error){
            console.error("Error fetching courses", error);
            return;
        }
        const courseIds = data.map((course) => course.courses.course_code);
        setCourses(courseIds);
      }
      fetchCourses();
    },[profileId]);
    return createPortal(
<div className={classes.profileModal}>
<div className={classes.profileContent}>
<div className={classes.modalAvatar}>
<img src={profile.profile_picture_url ||defaultAvatar} alt="User Avatar" />
</div>

<div className={classes.profileHeader}>
<h2>{profile.first_name} {profile.last_name}</h2>
<p>Major: {profile.majors?.name}</p>
</div>

<hr className={classes.profileLine} />

<div className={classes.profileDetails}>
<h3><strong>Gender:</strong> {profile.gender}</h3> <h3><strong>Study Style:</strong> {profile.study_style}</h3>
</div>
<div className = {classes.aboutMe}>
  <h3>About Me</h3>
<p>{profile.bio || "No bio is avaliable " }</p>
</div>
<div className = {classes.profileCourses}>
  <h3>Courses</h3>
<p>{courses.length > 0 ? courses.map((course) => (
  <span key={course} className ={classes.courseBubble}>{course}</span>)) : "No courses listed"}</p>
</div>
<div className = {classes.closeButton}>
<button onClick={() => setIsOpen(false)}> ✕ </button>
</div>
</div>
</div>,
document.body
)}
export default ProfileModal;