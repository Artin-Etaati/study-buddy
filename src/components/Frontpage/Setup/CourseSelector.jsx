
import classes from './Setup.module.css';

const CourseSelector = ({
  courseInput,
  setCourseInput,
  courses,
  handleAddCourse,
  handleRemoveCourse
}) => {

  return (
    <div className={classes.formGroup}>

      <label>Current Courses</label>

      <div className={classes.courseInput}>
        <input
          type="text"
          value={courseInput}
          onChange={(e) => setCourseInput(e.target.value)}
          placeholder="Example: COMP 380"
        />

        <button
          type="button"
          className={classes.addButton}
          onClick={handleAddCourse}
        >
          Add Course
        </button>
      </div>

      <div className={classes.courseList}>
        {courses.map((course, index) => (
          <div className={classes.courseTag} key={index}>

            <span>{course}</span>

            <button
              type="button"
              className={classes.removeButton}
              onClick={() => handleRemoveCourse(index)}
            >
              ×
            </button>

          </div>
        ))}
      </div>

    </div>
  );
};

export default CourseSelector;
