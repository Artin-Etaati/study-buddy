import React, { useEffect, useState } from 'react'
import classes from './Setup.module.css'
import { UserAuth } from '@/AuthContext'
import { useNavigate } from 'react-router-dom'
import ProfileFields from './ProfileFields';
import CourseSelector from './CourseSelector';
import StudyPreferences from './StudyPreferences';
import { getUniversities, saveProfile } from '@/services/profileService';

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

    try {
      await saveProfile(formData, courses, session.user.id);
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