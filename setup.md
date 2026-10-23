
# Study Buddy - Profile Setup

This document explains how the Profile Setup feature works in Study Buddy.

The Setup page allows new users to enter their personal information, select their university and major, add their courses, choose their study style, and optionally upload a profile photo.

The application uses React for the user interface and Supabase for authentication, database operations, and photo storage.

## 1. Setup Flow

After signing in, the application checks whether the user already has a profile.

```text
User signs in
      |
      v
ProfileRoute
      |
      v
Check profiles table
      |
      +-------------------+
      |                   |
Profile exists       No profile
      |                   |
      v                   v
    /home               /setup
```

Users with existing profiles cannot access `/setup`.

Users without profiles are redirected to `/setup` when trying to access the main application.

This prevents users from skipping the initial profile creation process.

## 2. Main Files

The Setup feature uses the following files:

```text
src/
├── components/
│   └── Frontpage/
│       └── Setup/
│           ├── Setup.jsx
│           ├── ProfileFields.jsx
│           ├── CourseSelector.jsx
│           ├── StudyPreferences.jsx
│           ├── SearchableSelect.jsx
│           └── ProfilePhoto.jsx
│
├── services/
│   ├── profileService.js
│   ├── profilePhotoService.js
│   ├── ProfileCheck.js
│   └── supabase.js
│
├── assets/
│   └── default-avatar.png
│
└── css/
    └── Setup/
        └── Setup.module.css
```

The main responsibility of each file is:

- `Setup.jsx`: Manages the form state, validation, and submission.
- `ProfileFields.jsx`: Displays personal information fields.
- `CourseSelector.jsx`: Allows users to add and remove courses.
- `StudyPreferences.jsx`: Displays study style options.
- `SearchableSelect.jsx`: Provides searchable dropdowns.
- `ProfilePhoto.jsx`: Handles photo selection, validation, and preview.
- `profileService.js`: Communicates with Supabase database tables.
- `profilePhotoService.js`: Uploads photos to Supabase Storage.
- `ProfileCheck.js`: Checks whether a user already has a profile.
- `Setup.module.css`: Styles the Setup page and its components.

## 3. Setup.jsx

Location:

`src/components/Frontpage/Setup/Setup.jsx`

This is the main component responsible for the Setup page.

It manages the state and passes the required data and functions to smaller components.

### React States

The component uses the following states:

- `formData`: Stores personal information and study preferences.
- `courseInput`: Stores the course currently being typed.
- `courses`: Stores the courses added by the user.
- `universities`: Stores universities retrieved from Supabase.
- `majors`: Stores majors retrieved from Supabase.
- `photo`: Stores the selected profile photo.
- `loading`: Tracks whether the form is being submitted.
- `error`: Stores error messages.

### Main Functions

**handleChange()**

Updates `formData` when the user changes an input field.

**handleAddCourse()**

Adds a course to the `courses` array.

The course code is converted to uppercase, and duplicate courses are prevented.

**handleRemoveCourse()**

Removes a selected course from the array.

**handleSubmit()**

Handles form submission.

It validates the information, saves the profile and courses, optionally uploads a photo, and navigates to Home.

## 4. Setup Components

The Setup page is divided into smaller components to keep the code organized.

### ProfileFields.jsx

Handles the user's personal information.

Fields include:

- First name
- Last name
- Birthday
- Gender
- University
- Major

It receives data and functions from `Setup.jsx`.

```jsx
<ProfileFields
  formData={formData}
  handleChange={handleChange}
  universities={universities}
  majors={majors}
/>
```

University and major selections use the reusable `SearchableSelect` component.

### SearchableSelect.jsx

This component creates a searchable dropdown.

It is currently used for universities and majors.

Users can:

- Click the input to open the dropdown.
- Type to filter available options.
- Select an option.
- Navigate options using the keyboard.

The component receives:

- `name`: Identifies the form field.
- `value`: Stores the selected ID.
- `options`: Contains available selections.
- `onChange`: Updates the form state.
- `placeholder`: Displays input instructions.

When an option is selected, its ID is passed back to `Setup.jsx`.

This allows the application to store university and major IDs instead of their names.

### CourseSelector.jsx

Handles the user's current courses.

Users can add multiple courses and remove them before submitting.

```jsx
<CourseSelector
  courseInput={courseInput}
  setCourseInput={setCourseInput}
  courses={courses}
  handleAddCourse={handleAddCourse}
  handleRemoveCourse={handleRemoveCourse}
/>
```

Courses are converted to uppercase before being added.

For example:

```text
comp 380 → COMP 380
```

Duplicate course entries are prevented.

### StudyPreferences.jsx

Handles the user's preferred study style.

Current options:

- In Person
- Online
- Either

```jsx
<StudyPreferences
  formData={formData}
  handleChange={handleChange}
/>
```

### ProfilePhoto.jsx

Handles optional profile photo selection.

Users can:

- Choose a photo from their device.
- Preview the selected photo.
- Remove the selected photo.
- Continue without uploading a photo.

Supported formats:

- JPG
- PNG
- WebP

Maximum file size:

**5 MB**

If no photo is selected, the component displays the default avatar.

```jsx
<ProfilePhoto
  photo={photo}
  setPhoto={setPhoto}
/>
```

The component uses `URL.createObjectURL()` to display a local preview.

It also uses `URL.revokeObjectURL()` to clean up the preview URL.

The selected photo is stored in the `photo` state inside `Setup.jsx`.

The photo is not uploaded immediately when selected. Uploading happens when the user submits the form.

## 5. Database Service

### profileService.js

Location:

`src/services/profileService.js`

This service handles database operations for profile setup.

It contains three main functions.

### getUniversities()

Retrieves available universities from the `universities` table.

The results are used by the university dropdown.

### getMajors()

Retrieves available majors from the `majors` table.

The results are ordered alphabetically.

Majors are stored separately from universities, allowing the same major to be used by students from different universities.

### saveProfile()

Saves the user's profile and course information.

The process is:

1. Save personal information in the `profiles` table.
2. Save selected courses in the `courses` table.
3. Retrieve the IDs of those courses.
4. Connect the user to their courses in `user_courses`.

The function uses `upsert()` instead of regular `insert()` for profiles and course relationships.

### Why Upsert Is Used

`upsert()` allows a row to be inserted or handled according to its conflict settings when a matching row already exists.

For the `profiles` table:

```js
.from('profiles')
.upsert({
  id: userId,
  // Other profile fields
});
```

Since the profile ID is the user's authentication ID, this avoids a duplicate primary-key error when the same profile is saved again.

For `user_courses`:

```js
.from('user_courses')
.upsert(userCourseRows, {
  onConflict: 'user_id,course_id',
  ignoreDuplicates: true
});
```

The combination of `user_id` and `course_id` is the primary key.

This prevents duplicate course relationships.

The `courses` table also uses `upsert()` with:

```js
onConflict: 'university_id,course_code',
ignoreDuplicates: true
```

This avoids inserting duplicate course records for the same university.

These changes make retrying a failed submission safer.

However, the database operations are still separate and are not performed as one transaction.

## 6. Profile Photo Upload

### profilePhotoService.js

Location:

`src/services/profilePhotoService.js`

This service handles uploading profile photos to Supabase Storage.

The main function is:

```js
uploadProfilePhoto(photo, userId)
```

It receives the selected photo and the authenticated user's ID.

### Upload Process

1. Get the photo's file extension.
2. Generate a unique filename using `crypto.randomUUID()`.
3. Create a storage path using the user's ID.
4. Upload the file to Supabase Storage.
5. Return the uploaded file path.

Example storage path:

```text
user-id/random-uuid.jpg
```

The storage bucket is named:

```text
Profile_Picture
```

### Saving the Photo Path

After uploading, `Setup.jsx` updates the user's profile:

```js
const { error: photoError } = await supabase
  .from('profiles')
  .update({
    profile_picture_name: photoPath
  })
  .eq('id', session.user.id);
```

The database stores the file path rather than the image itself.

This allows other parts of the application to locate the image in Supabase Storage.

### Optional Photo Behavior

Uploading a photo is optional.

If no photo is selected, the upload step is skipped.

If the photo upload or photo-path update fails, the error is caught separately.

The application still navigates to Home because the required profile information has already been saved.

In the reviewed GitHub version, the photo error is logged to the console but no warning is displayed to the user.

The default avatar is used when no profile image URL is available.

## 7. Supabase Tables

### profiles

Stores personal information and study preferences.

Important columns:

```text
id
university_id
major_id
first_name
last_name
birthday
gender
study_style
profile_picture_name
created_at
```

The `id` references the user's Supabase Authentication ID.

The `major_id` references the selected major.

The `profile_picture_name` stores the uploaded photo's storage path.

### universities

Stores university information.

```text
id
name
domain
location
```

### majors

Stores the available majors.

```text
id
name
```

Majors are maintained separately from universities.

### courses

Stores courses associated with universities.

```text
id
university_id
course_code
```

### user_courses

Connects users to their courses.

```text
user_id
course_id
```

The combination of `user_id` and `course_id` forms the primary key.

This creates a many-to-many relationship between users and courses.

One user can take multiple courses, and one course can belong to multiple users.

## 8. How Profile Submission Works

When the user clicks Submit:

1. `handleSubmit()` prevents the browser's default form submission.
2. It validates all required profile fields.
3. It checks whether at least one course was added.
4. It checks whether the user is signed in.
5. It sets `loading` to `true`.
6. It calls `saveProfile()` to save the profile and courses.
7. If a photo was selected, it calls `uploadProfilePhoto()`.
8. If the photo uploads successfully, its path is saved in `profiles`.
9. If the optional photo step fails, the error is caught without stopping navigation.
10. The application navigates to `/home`.
11. The loading state is reset.

If saving the required profile or course information fails, an error message is displayed instead of continuing normally.

### Submission Flow

```text
User clicks Submit
        |
        v
Validate required fields
        |
        v
Check selected courses
        |
        v
Check authentication
        |
        v
Save profile and courses
        |
        +-------------------+
        |                   |
      Success             Failure
        |                   |
        v                   v
   Photo selected?      Show error
        |
    +---+---+
    |       |
   Yes      No
    |       |
    v       |
Upload photo|
    |       |
    v       |
Save path   |
    |       |
    +---+---+
        |
        v
     /home
```

Photo upload failures are handled separately from required profile-saving failures.

## 9. Profile Check and Route Protection

### ProfileCheck.js

Location:

`src/services/ProfileCheck.js`

Contains:

```js
hasProfile(userId)
```

This function checks whether the authenticated user has a row in the `profiles` table.

It returns `true` if a profile exists and `false` otherwise.

### ProfileRoute.jsx

Location:

`src/components/ProfileRoute.jsx`

This component controls access to pages based on whether the user has a profile.

Routes requiring a profile:

```text
/home
/profile
/matches
/messages
```

Users without a profile are redirected to `/setup`.

The Setup route uses:

```jsx
<ProfileRoute requireProfile={false} />
```

Users who already have a profile are redirected to `/home`.

This means Setup is intended for initial profile creation, not editing an existing profile.

## 10. Styling

The Setup page uses CSS Modules.

Location:

`src/css/Setup/Setup.module.css`

The styling includes:

- Gradient page background
- Centered form card
- Organized input sections
- Searchable dropdown styling
- Course tags
- Profile photo preview
- Photo selection and removal buttons
- Submit button
- Error messages

CSS Modules keep the Setup styles separate from other pages.

## 11. Known Issues and Limitations

### Partial Database Saving

Profile and course information are saved through multiple Supabase requests.

If a later request fails, earlier database changes may already have been saved.

Because `ProfileRoute` checks for the existence of a profile row, a partially saved profile can also prevent the user from returning to Setup after refreshing.

A future improvement would be to use a PostgreSQL transaction through a Supabase RPC function.

### Orphaned Profile Photos

If a photo uploads successfully but saving its path in the database fails, the file may remain in Storage without being referenced by the profile.

A future improvement would remove the uploaded file when the database update fails.

### Photo Upload Error Feedback

The reviewed code logs photo upload errors in the browser console.

It does not currently display a notification to the user.

A simple alert or warning message could improve the user experience.

### Invalid Photo Selection

If the user selects a valid photo and then selects an invalid one, the previous valid photo may remain selected.

This can be improved by clearing the photo state when validation fails.

### Form Validation

The form checks for required fields and at least one course.

Additional validation could be added for future birthdays and course-code formatting.

### Profile Route Refresh

The profile existence state may not update immediately after submitting Setup.

This can cause navigation issues until the profile check runs again.

### University and Major Loading Errors

If retrieving universities or majors fails, the error is logged to the console.

The page does not currently display a specific loading error or retry button.

## 12. Overall Architecture

```text
Setup.jsx
│
├── ProfileFields.jsx
│   └── SearchableSelect.jsx
│       ├── Universities
│       └── Majors
│
├── CourseSelector.jsx
│
├── StudyPreferences.jsx
│
├── ProfilePhoto.jsx
│   └── default-avatar.png
│
├── profileService.js
│   └── Supabase Database
│       ├── profiles
│       ├── universities
│       ├── majors
│       ├── courses
│       └── user_courses
│
└── profilePhotoService.js
    └── Supabase Storage
        └── Profile_Picture


ProfileRoute.jsx
│
└── ProfileCheck.js
    └── Supabase
        └── profiles
```

## 13. Summary

The Profile Setup feature allows new Study Buddy users to create their profiles before accessing the main application.

The current implementation includes:

- Personal information collection
- Searchable university and major dropdowns
- Multiple course selection
- Study style selection
- Optional profile photo upload
- Photo preview and default avatar
- Supabase database integration
- Supabase Storage integration
- Upsert operations to reduce duplicate-record errors
- Profile-based route protection
- Updated Setup page styling

The feature separates responsibilities between React components and Supabase services.

`Setup.jsx` manages the form logic, smaller components display the inputs, and service files communicate with Supabase.

This structure makes the feature easier to maintain, test, and improve as Study Buddy development continues.
