
import classes from '@/css/Setup/Setup.module.css';
import SearchableSelect from './SearchableSelect';

const ProfileFields = ({ formData, handleChange, universities, majors }) => {
  return (
    <>
      {/* First Name + Last Name */}
      <div className={classes.row}>
        <div className={classes.formGroup}>
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>

        <div className={classes.formGroup}>
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Birthday + Gender */}
      <div className={classes.row}>
        <div className={classes.formGroup}>
          <label>Birthday</label>
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
          />
        </div>

        <div className={classes.formGroup}>
          <label>Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>


      {/* School + Major */}
      <div className={classes.row}>
        <div className={classes.formGroup}>
          <label>School</label>
          <SearchableSelect
            name="university"
            value={formData.university}
            options={universities}
            onChange={handleChange}
            placeholder="Search universities..."
          />
        </div>

        <div className={classes.formGroup}>
          <label>Major</label>
          <SearchableSelect
            name="major"
            value={formData.major}
            options={majors}
            onChange={handleChange}
            placeholder="Search majors..."
          />
        </div>
      </div>
    </>
  );
};

export default ProfileFields;


