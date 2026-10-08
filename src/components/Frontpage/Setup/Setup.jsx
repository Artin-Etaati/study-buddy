import React, { useEffect, useState } from 'react'
import classes from './Setup.module.css'
import { supabase } from '@/services/supabase'
import { UserAuth } from '@/AuthContext'
import { useNavigate } from 'react-router-dom'
import ProfileFields from './ProfileFields';
import CourseSelector from './CourseSelector';

const Setup = () => {

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthday: '',
    gender: '',
    university: '',
    major: '',
    studyStyle: ''
  });
  const [courseInput, setCourseInput] = useState('');
  const [courses, setCourses] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { session } = UserAuth();
  const navigate = useNavigate();



  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData({
    ...formData,
    [name]: value
  });
};

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
    const newCourse = courseInput.trim().toUpperCase();

    // Don't add empty course
    if (newCourse === '') {
      return;
    }

    // Don't add duplicate course
    if (courses.includes(newCourse)) {
      setError('This course has already been added.');
      return;
    }

    setCourses([...courses, newCourse]);
    setCourseInput('');
    setError('');
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

  setError('');

  // Validate profile fields
  if (
    !formData.firstName.trim() ||
    !formData.lastName.trim() ||
    !formData.birthday ||
    !formData.gender ||
    !formData.university ||
    !formData.major.trim() ||
    !formData.studyStyle
  ) {
    setError('Please fill out all required fields.');
    return;
  }

  // Make sure at least one course was added
  if (courses.length === 0) {
    setError('Please add at least one course.');
    return;
  }

  // Make sure user is signed in
  if (!session?.user) {
    setError('User is not signed in.');
    return;
  }

  setLoading(true);


  //  Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: session.user.id,
      university_id: formData.university,
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      birthday: formData.birthday,
      gender: formData.gender,
      major: formData.major.trim(),
      study_style: formData.studyStyle,
    });

  if (profileError) {
    console.error('Error creating profile:', profileError);
    setError(profileError.message);
    setLoading(false);
    return;
  }


  // Prepare courses
  const courseRows = courses.map((course) => ({
    university_id: formData.university,
    course_code: course
  }));


  // Add all courses in ONE request
  const { error: courseError } = await supabase
    .from('courses')
    .upsert(courseRows, {
      onConflict: 'university_id,course_code',
      ignoreDuplicates: true
    });

  if (courseError) {
    console.error('Error saving courses:', courseError);
    setError(courseError.message);
    setLoading(false);
    return;
  }


  // Get IDs of selected courses
  const courseCodes = courseRows.map(
    (course) => course.course_code
  );

  const { data: savedCourses, error: fetchError } = await supabase
    .from('courses')
    .select('id')
    .eq('university_id', formData.university)
    .in('course_code', courseCodes);

  if (fetchError) {
    console.error('Error getting courses:', fetchError);
    setError(fetchError.message);
    setLoading(false);
    return;
  }



  const userCourseRows = savedCourses.map((course) => ({
    user_id: session.user.id,
    course_id: course.id
  }));

  const { error: userCourseError } = await supabase
    .from('user_courses')
    .insert(userCourseRows);

  if (userCourseError) {
    console.error('Error connecting courses:', userCourseError);
    setError(userCourseError.message);
    setLoading(false);
    return;
  }



  setLoading(false);
  navigate('/dashboard');
};
//////



return (
  <div className={classes.localbody}>
    <div className={classes.main}>

      <form className={classes.form} onSubmit={handleSubmit}>

        <h1>Set Up Your Profile</h1>

        {/* Personal Information */}
        <ProfileFields
          formData={formData}
          handleChange={handleChange}
          universities={universities}
        />

        {/* Courses */}
        <CourseSelector
          courseInput={courseInput}
          setCourseInput={setCourseInput}
          courses={courses}
          handleAddCourse={handleAddCourse}
          handleRemoveCourse={handleRemoveCourse}
        />

        {/* Study Style */}
        <div className={classes.formGroup}>
          <label>Study Style</label>

          <select
            name="studyStyle"
            value={formData.studyStyle}
            onChange={handleChange}
          >
            <option value="">Select Study Style</option>
            <option value="In Person">In Person</option>
            <option value="Online">Online</option>
            <option value="Either">Either</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          className={classes.submitButton}
          type="submit"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Submit'}
        </button>

        {/* Error Message */}
        {error && (
          <p className={classes.error}>
            {error}
          </p>
        )}

      </form>

    </div>
  </div>
);





}

export default Setup