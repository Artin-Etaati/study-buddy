import React, { useEffect, useState } from 'react'
import classes from '@/css/Setup/Setup.module.css'
import { UserAuth } from '@/AuthContext'
import { useNavigate } from 'react-router-dom'
import ProfileFields from './ProfileFields';
import CourseSelector from './CourseSelector';
import StudyPreferences from './StudyPreferences';
import { getUniversities, getMajors, saveProfile } from '@/services/profileService';
import ProfilePhoto from './ProfilePhoto';
import { uploadProfilePhoto } from '@/services/profilePhotoService';
import { supabase } from '@/services/supabase';

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
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { session } = UserAuth();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);



  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData({
    ...formData,
    [name]: value
  });
};

/////// for university
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const data = await getUniversities();
        setUniversities(data);
      } catch (error) {
        console.error('Error fetching universities:', error);
      }
    };

    fetchUniversities();
  }, []);

////// for majors
  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const data = await getMajors();
        setMajors(data);
      } catch (error) {
        console.error('Error fetching majors:', error);
      }
    };

    fetchMajors();
  }, []);
  
/////
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

    try {
      // Step 1: Save profile information
      await saveProfile(formData, courses, session.user.id);

      // Step 2: Upload photo if one was selected
      if (photo) {
        const photoPath = await uploadProfilePhoto(
          photo,
          session.user.id
        );

        // Step 3: Save photo path in the database
        const { error: photoError } = await supabase
          .from('profiles')
          .update({ profile_picture_name: photoPath })
          .eq('id', session.user.id);

        if (photoError) {
          throw photoError;
        }
      }

      // Step 4: Navigate to Home
      console.log('Profile saved successfully');
      navigate('/home');

    } catch (error) {
      console.error('Error saving profile:', error);
      setError(error.message);

    } finally {
      setLoading(false);
    }
  };



//////



return (
  <div className={classes.localbody}>
    <div className={classes.main}>

      <form className={classes.form} onSubmit={handleSubmit}>

        <h1>Set Up Your Profile</h1>

        <ProfilePhoto
          photo={photo}
          setPhoto={setPhoto}
        />

        {/* Personal Information */}
        <ProfileFields
          formData={formData}
          handleChange={handleChange}
          universities={universities}
          majors={majors}
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
        
      <StudyPreferences
        formData={formData}
        handleChange={handleChange}
        />

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