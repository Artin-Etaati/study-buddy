
import classes from './Setup.module.css';

const StudyPreferences = ({ formData, handleChange }) => {

  return (
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
  );
};

export default StudyPreferences;
