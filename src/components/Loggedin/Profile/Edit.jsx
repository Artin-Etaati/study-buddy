
const Edit = ({ profile, onCancel }) => {
  return (
    <div>
      <h1>Edit Profile</h1>

      <p>First Name: {profile.first_name}</p>
      <p>Last Name: {profile.last_name}</p>

      <button onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
};

export default Edit;
