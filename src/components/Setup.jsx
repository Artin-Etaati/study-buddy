import React, { useEffect, useState } from 'react'
import classes from './Setup.module.css'
import { supabase } from '../services/supabase'


const Setup = () => {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [major, setMajor] = useState('');
  const [studyStyle, setStudyStyle] = useState('');
  const [studyLocation, setStudyLocation] = useState('');
  const [universities, setUniversities] = useState([]);
  const [university, setUniversity] = useState('');



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

  return (
    <div className={classes.localbody}>

      <h1>Set Up Your Profile</h1>

      <form>

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

        <label>Study Location</label>
        <input
          type="text"
          value={studyLocation}
          onChange={(e) => setStudyLocation(e.target.value)}
        />

      </form>

    </div>
  )
}

export default Setup