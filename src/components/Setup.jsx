import React, { useEffect, useState } from 'react'
import classes from './Setup.module.css'
import { supabase } from '../services/supabase'
import { UserAuth } from '../AuthContext'


const Setup = () => {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [major, setMajor] = useState('');
  const [studyStyle, setStudyStyle] = useState('');
  const [universities, setUniversities] = useState([]);
  const [university, setUniversity] = useState('');
  const [courseInput, setCourseInput] = useState('');
  const [courses, setCourses] = useState([]);
  const { session } = UserAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


///////
  useEffect(() => {

    const getUniversities = async () => {

      const { data, error } = await supabase.from('universities').select('*');

      if (error) {
        console.error('Error getting universities:', error);
        return;
      }

      setUniversities(data);
    };

    getUniversities();

  }, []);


//////
  const handleAddCourse = () => {
  if (courseInput.trim() === '') {
    return;
  }

  setCourses([...courses, courseInput.trim()]);
  setCourseInput('');
  };


///////
  const handleRemoveCourse = (indexToRemove) => {

  const updatedCourses = courses.filter(
    (_, index) => index !== indexToRemove
  );

  setCourses(updatedCourses);
  };

//////
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    // Save/update profile
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: session.user.id,
        university_id: university,
        first_name: firstName,
        last_name: lastName,
        birthday: birthday,
        gender: gender,
        major: major,
        study_style: studyStyle,
      });

    if (error) {
      console.error('Error creating profile:', error);
      setError(error.message);
      setLoading(false);
      return;
    }

    console.log('Profile created successfully');

    // Convert React courses array into database rows
    const courseRows = courses.map((course) => ({
      university_id: university,
      course_code: course.trim().toUpperCase()
    }));

    // Insert courses and get the new rows back
    // const { data: insertedCourses, error: courseError } = await supabase
    //   .from('courses')
    //   .insert(courseRows)
    //   .select();

  const savedCourses = [];

  for (const course of courseRows) {

    const { data: existingCourse, error: findError } = await supabase
      .from('courses')
      .select('*')
      .eq('university_id', course.university_id)
      .eq('course_code', course.course_code)
      .maybeSingle();

    if (findError) {
      console.error('Error finding course:', findError);
      setError(findError.message);
      setLoading(false);
      return;
    }

    if (existingCourse) {

      savedCourses.push(existingCourse);

    } else {

      const { data: newCourse, error: insertError } = await supabase
        .from('courses')
        .insert(course)
        .select()
        .single();

      if (insertError) {
        console.error('Error creating course:', insertError);
        setError(insertError.message);
        setLoading(false);
        return;
      }

      savedCourses.push(newCourse);
    }
  }

  // Now ALL courses have been processed
  console.log('Saved courses:', savedCourses);

  const userCourseRows = savedCourses.map((course) => ({
    user_id: session.user.id,
    course_id: course.id
  }));

  console.log('User course rows:', userCourseRows);

  const { error: userCourseError } = await supabase
    .from('user_courses')
    .insert(userCourseRows);

  if (userCourseError) {
    console.error('Error connecting courses to user:', userCourseError);
    setError(userCourseError.message);
    setLoading(false);
    return;
  }

  console.log('Courses connected to user successfully');

  setLoading(false);
  };
//////




  return (
    <div className={classes.localbody}>

      <h1>Set Up Your Profile</h1>

      <form onSubmit = {handleSubmit}>

        <label>First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <label>Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <label>Birthday</label>
        <input
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
        />

        <label>Gender</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <label>School</label>

        <select
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
        >
          <option value="">Select School</option>

          {universities.map((school) => (
            <option key={school.id} value={school.id}>
              {school.name}
            </option>
          ))}

        </select>

        <label>Major</label>
        <input
          type="text"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
        />
        <label>Current Courses</label>

        <input
          type="text"
          value={courseInput}
          onChange={(e) => setCourseInput(e.target.value)}
          placeholder="Example: COMP 380"
        />

        <button type="button" onClick = {handleAddCourse}>
          Add Course
        </button>

        <div>
          {courses.map((course, index) => (
            <div key={index}>

              <span>{course}</span>

              <button
                type="button"
                onClick={() => handleRemoveCourse(index)}
              >
                ×
              </button>

            </div>
          ))}
        </div>

        <label>Study Style</label>
        <select
          value={studyStyle}
          onChange={(e) => setStudyStyle(e.target.value)}
        >
          <option value="">Select Study Style</option>
          <option value="In Person">In Person</option>
          <option value="Online">Online</option>
          <option value="Either">Either</option>
        </select>

      

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Submit'}
      </button>

      {error && <p>{error}</p>}



      </form>

    </div>
  )
}

export default Setup