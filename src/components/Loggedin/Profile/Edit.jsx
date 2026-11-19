import { useEffect, useState } from 'react';
import SearchableSelect from '@/components/Frontpage/Setup/SearchableSelect';
import CourseSelector from '@/components/Frontpage/Setup/CourseSelector';
import EditPhoto from './EditPhoto';
import styles from '@/css/LoggedIn/EditProfile.module.css';



const Edit = ({ profile, majors, currentPhoto, onCancel, onSave, isSaving  }) => {
  const [firstName, setFirstName] = useState(profile.first_name);
  const [lastName, setLastName] = useState(profile.last_name);
  const [birthday, setBirthday] = useState(profile.birthday || '');
  const [gender, setGender] = useState(profile.gender || '');
  const [studyStyle, setStudyStyle] = useState(profile.study_style || '');
  const [major, setMajor] = useState(profile.major_id);
  const [errors, setErrors] = useState({});
  const originalCourses = (profile.user_courses || [])
  .map((item) => item.courses?.course_code)
  .filter(Boolean);
  const [courses, setCourses] = useState(originalCourses);
  const [courseInput, setCourseInput] = useState('');
  const [courseError, setCourseError] = useState('');
  const [photo, setPhoto] = useState(null);
  const [removePhoto, setRemovePhoto] = useState(false);



  const coursesChanged =
    [...courses].sort().join('|') !==
    [...originalCourses].sort().join('|');
    

  const hasChanges =
    firstName.trim() !== profile.first_name.trim() ||
    lastName.trim() !== profile.last_name.trim() ||
    birthday !== (profile.birthday || '') ||
    gender.trim() !== (profile.gender || '') ||
    studyStyle !== (profile.study_style || '') ||
    String(major) !== String(profile.major_id) ||
    coursesChanged ||
    photo !== null ||
    (removePhoto && !!profile.profile_picture_name);



  const handleAddCourse = () => {
    if (isSaving) return;

    const newCourse = courseInput.trim().toUpperCase();

    if (!newCourse) return;

    if (courses.includes(newCourse)) {
      setCourseError('This course has already been added.');
      return;
    }

    setCourses((prev) => [...prev, newCourse]);
    setCourseInput('');
    setCourseError('');
  };

const handleRemoveCourse = (indexToRemove) => {
  if (isSaving) return;

  setCourses((prev) =>
    prev.filter((_, index) => index !== indexToRemove)
  );

  setCourseError('');
};


  const handleSave = () => {
    const newErrors = {};

    if (courses.length === 0) {
      newErrors.courses = 'Please add at least one course.';
    }

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    // First name validation
    if (trimmedFirstName.length < 2 || trimmedFirstName.length > 50) {
      newErrors.firstName = 'First name must be 2-50 characters.';
    }

    // Last name validation
    if (trimmedLastName.length < 2 || trimmedLastName.length > 50) {
      newErrors.lastName = 'Last name must be 2-50 characters.';
    }

    // Birthday validation
    if (!birthday) {
      newErrors.birthday = 'Birthday is required.';
    } else {
      const selectedDate = new Date(birthday + 'T00:00:00');
      const today = new Date();

      const isValidDate =
        /^\d{4}-\d{2}-\d{2}$/.test(birthday) &&
        !Number.isNaN(selectedDate.getTime()) &&
        selectedDate.getFullYear() === Number(birthday.slice(0, 4)) &&
        selectedDate.getMonth() + 1 === Number(birthday.slice(5, 7)) &&
        selectedDate.getDate() === Number(birthday.slice(8, 10));

      if (!isValidDate) {
        newErrors.birthday = 'Please enter a valid birthday.';
      } else if (selectedDate > today) {
        newErrors.birthday = 'Birthday cannot be in the future.';
      }
    }

    // Gender validation
    if (!gender.trim()) {
      newErrors.gender = 'Gender is required.';
    }

    // Major validation
    const selectedMajor = majors.find(
      (item) => String(item.id) === String(major)
    );

    if (!selectedMajor) {
      newErrors.major = 'Please select a valid major.';
    }

    // Study style validation
    const validStudyStyles = ['In Person', 'Online', 'Either'];

    if (!validStudyStyles.includes(studyStyle)) {
      newErrors.studyStyle = 'Please select a valid study style.';
    }

    // Store validation errors
    setErrors(newErrors);

    // Stop if any validation failed
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Prepare information for saving
    const formData = {
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      birthday,
      gender: gender.trim(),
      studyStyle,
      major: selectedMajor.id,
      courses,
      coursesChanged,
      photo,
      removePhoto: removePhoto && !!profile.profile_picture_name
    };

    // Send information to Profile.jsx
    onSave(formData);
  };







  return (
    <div className={styles.editPage}>
      <div className={styles.editCard}>
        <h1 className={styles.pageTitle}>Edit Profile</h1>

        {/* Profile Photo */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Profile Photo</h2>

          <EditPhoto
            currentPhoto={currentPhoto}
            photo={photo}
            setPhoto={setPhoto}
            removePhoto={removePhoto}
            setRemovePhoto={setRemovePhoto}
          />
        </section>

        {/* Personal Information */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Personal Information</h2>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {errors.firstName && (
                <p className={styles.error}>{errors.firstName}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {errors.lastName && (
                <p className={styles.error}>{errors.lastName}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Birthday</label>
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
              {errors.birthday && (
                <p className={styles.error}>{errors.birthday}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Gender</label>
              <input
                type="text"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              />
              {errors.gender && (
                <p className={styles.error}>{errors.gender}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>University</label>
              <p>{profile.universities?.name}</p>
            </div>

            <div className={styles.formGroup}>
              <label>Major</label>
              <SearchableSelect
                name="major"
                options={majors}
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="Select your major"
              />
              {errors.major && (
                <p className={styles.error}>{errors.major}</p>
              )}
            </div>
          </div>
        </section>

        {/* Current Courses */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Current Courses</h2>

          <CourseSelector
            courseInput={courseInput}
            setCourseInput={setCourseInput}
            courses={courses}
            handleAddCourse={handleAddCourse}
            handleRemoveCourse={handleRemoveCourse}
          />

          {courseError && (
            <p className={styles.error}>{courseError}</p>
          )}

          {errors.courses && (
            <p className={styles.error}>{errors.courses}</p>
          )}
        </section>

        {/* Study Preferences */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Study Preferences</h2>

          <div className={styles.formGroup}>
            <label>Study Style</label>

            <select
              value={studyStyle}
              onChange={(e) => setStudyStyle(e.target.value)}
            >
              <option value="In Person">In Person</option>
              <option value="Online">Online</option>
              <option value="Either">Either</option>
            </select>

            {errors.studyStyle && (
              <p className={styles.error}>{errors.studyStyle}</p>
            )}
          </div>
        </section>

        {/* Save and Cancel */}
        <div className={styles.buttonGroup}>
          <button
            className={styles.cancelButton}
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </button>

          <button
            className={styles.saveButton}
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );


}
export default Edit;
