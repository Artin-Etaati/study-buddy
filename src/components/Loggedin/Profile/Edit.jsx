import { useEffect, useState } from 'react';
import SearchableSelect from '@/components/Frontpage/Setup/SearchableSelect';



const Edit = ({ profile, majors, onCancel, onSave, isSaving  }) => {
  const [firstName, setFirstName] = useState(profile.first_name);
  const [lastName, setLastName] = useState(profile.last_name);
  const [birthday, setBirthday] = useState(profile.birthday || '');
  const [gender, setGender] = useState(profile.gender || '');
  const [studyStyle, setStudyStyle] = useState(profile.study_style || '');
  const [major, setMajor] = useState(profile.major_id);

  const handleSave = () => {
    const formData = {
      firstName,
      lastName,
      birthday,
      gender,
      studyStyle,
      major
    };

    onSave(formData);
  };




  return (
    <div>
      <h1>Edit Profile</h1>

      <label>First Name:</label>
      <input
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />

      <label>Last Name:</label>
      <input
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />

      <label>Birthday:</label>
      <input
        type="date"
        value={birthday}
        onChange={(e) => setBirthday(e.target.value)}
      />

      <label>Gender:</label>
      <input
        type="text"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
      />

      <label>University:</label>
      <p>{profile.universities?.name}</p>

      <label>Major:</label>
      <SearchableSelect
        options={majors}
        value={major}
        onChange={setMajor}
        placeholder="Select your major"
      />

      <label>Study Style:</label>
      <select
        value={studyStyle}
        onChange={(e) => setStudyStyle(e.target.value)}
      >
        <option value="In Person">In Person</option>
        <option value="Online">Online</option>
        <option value="Either">Either</option>
      </select>

    <button onClick={handleSave} disabled={isSaving}>
      {isSaving ? 'Saving...' : 'Save'}
    </button>

    <button onClick={onCancel} disabled={isSaving}>
      Cancel
    </button>
    
    </div>
  );
};

export default Edit;
