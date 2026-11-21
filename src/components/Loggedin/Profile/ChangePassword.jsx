import { useState } from 'react';
import { supabase } from '@/services/supabase';
import styles from '@/css/LoggedIn/EditProfile.module.css';

const ChangePassword = ({ onCancel }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdatePassword = async () => {
    if (isUpdating) return;

    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (currentPassword === newPassword) {
      setError('New password must be different from your current password.');
      return;
    }

    setIsUpdating(true);

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError) throw userError;

      const email = userData.user?.email;

      if (!email) {
        throw new Error('Unable to find your account email.');
      }

      // Verify current password
      const { error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password: currentPassword
        });

      if (signInError) {
        setError('Current password is incorrect.');
        return;
      }

      // Update password
      const { error: updateError } =
        await supabase.auth.updateUser({
          password: newPassword
        });

      if (updateError) throw updateError;

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      alert('Password updated successfully!');
      onCancel();

    } catch (error) {
      console.error('Error updating password:', error);
      setError('Failed to update password. Please try again.');

    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={styles.editPage}>
      <div className={styles.editCard}>
        <h1 className={styles.pageTitle}>Change Password</h1>

        <div className={styles.formGroup}>
          <label htmlFor="currentPassword">Current Password</label>
          <input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && (
          <p className={styles.error}>{error}</p>
        )}

        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
            disabled={isUpdating}
          >
            Cancel
          </button>

          <button
            type="button"
            className={styles.saveButton}
            onClick={handleUpdatePassword}
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>
    </div>
  );


};

export default ChangePassword;