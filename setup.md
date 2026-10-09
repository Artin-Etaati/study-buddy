
# Study Buddy - Profile Setup

This part of the Study Buddy project handles profile creation and profile-based routing.

The goal is to make sure every signed-in user completes their profile before using the main parts of the application.

## 1. Setup Flow

When a user signs in, the application checks whether they already have a profile in the Supabase `profiles` table.

```text
User signs in
      |
      v
PrivateRoute
Checks if the user is authenticated
      |
      v
ProfileRoute
Checks if the user has a profile
      |
      +-------------------+
      |                   |
Profile exists       No profile
      |                   |
      v                   v
   /home              /setup
```

Users with completed profiles cannot access `/setup`.

Users without profiles cannot access `/home`, `/profile`, `/matches`, or `/messages`.

## 2. Main Files

### Setup.jsx

Location:

`src/components/Frontpage/Setup/Setup.jsx`

This is the main component responsible for the Setup page.

It manages the following React states:

- `formData` - Stores the user's personal information and study preferences.
- `courseInput` - Stores the course currently being typed.
- `courses` - Stores the list of courses the user added.
- `universities` - Stores the universities retrieved from Supabase.
- `loading` - Tracks whether the profile is being saved.
- `error` - Stores any error messages.

It also contains these functions:

**handleChange()**

Updates `formData` whenever a user changes an input field.

**handleAddCourse()**

Adds a course to the `courses` array. It converts the course code to uppercase and prevents duplicates.

**handleRemoveCourse()**

Removes a course from the `courses` array.

**handleSubmit()**

Validates the form, calls `saveProfile()` to save the information in Supabase, and navigates to `/home` after a successful save.

## 3. Setup Components

The Setup form is divided into three smaller components to keep the code organized.

### ProfileFields.jsx

Handles the user's personal information:

- First name
- Last name
- Birthday
- Gender
- University
- Major

Receives these props from `Setup.jsx`:

```jsx
<ProfileFields
  formData={formData}
  handleChange={handleChange}
  universities={universities}
/>
```

### CourseSelector.jsx

Handles the courses the user is currently taking.

It allows users to add and remove courses.

Receives these props:

```jsx
<CourseSelector
  courseInput={courseInput}
  setCourseInput={setCourseInput}
  courses={courses}
  handleAddCourse={handleAddCourse}
  handleRemoveCourse={handleRemoveCourse}
/>
```

### StudyPreferences.jsx

Handles the user's study style.

Receives these props:

```jsx
<StudyPreferences
  formData={formData}
  handleChange={handleChange}
/>
```

All three components receive their data and functions from `Setup.jsx`.

This allows `Setup.jsx` to manage the state while the smaller components handle displaying the form.

## 4. Database Service

### profileService.js

Location:

`src/services/profileService.js`

This file handles database operations related to profile setup.

It contains two main functions.

### getUniversities()

Retrieves the list of universities from the Supabase `universities` table.

The results are displayed in the university dropdown.

### saveProfile()

Saves the user's profile and courses into Supabase.

The process is:

1. Save the user's personal information in `profiles`.
2. Check whether each selected course already exists.
3. Insert courses that do not exist into `courses`.
4. Connect the user to their courses using `user_courses`.

The database operations are separated from the React components to keep the UI code cleaner.

## 5. Profile Check

### ProfileCheck.js

Location:

`src/services/ProfileCheck.js`

This file contains the function:

```js
hasProfile(userId)
```

It checks whether a profile exists for the given user.

The Supabase query is:

```js
const { data, error } = await supabase
  .from('profiles')
  .select('id')
  .eq('id', userId)
  .maybeSingle();
```

If a profile exists, the function returns `true`.

If no profile exists, it returns `false`.

Note: The filename should match the capitalization used in its import statement. The current `ProfileRoute.jsx` import uses `profileCheck`, so renaming the file to `profileCheck.js` is recommended.

## 6. Route Protection

### PrivateRoute.jsx

This component checks whether the user is authenticated.

If the user is signed in, they can continue to the next route.

If the user is not signed in, they are redirected away from the protected pages.

### ProfileRoute.jsx

Location:

`src/components/ProfileRoute.jsx`

This component checks whether the authenticated user has a profile.

It calls:

```js
hasProfile(session.user.id)
```

The result determines which pages the user can access.

### Routes requiring a profile

```jsx
<ProfileRoute requireProfile={true} />
```

These routes include:

- `/home`
- `/profile`
- `/matches`
- `/messages`

If the user does not have a profile, they are redirected to `/setup`.

### Setup route

```jsx
<ProfileRoute requireProfile={false} />
```

This route is used for `/setup`.

If the user already has a profile, they are redirected to `/home`.

This prevents users from returning to the initial Setup page after creating their profile.

## 7. Router Structure

The routing structure is defined in:

`src/router.jsx`

```text
PrivateRoute
│
├── ProfileRoute (requireProfile = true)
│   │
│   └── Layout
│       ├── /home
│       ├── /profile
│       ├── /matches
│       └── /messages
│
└── ProfileRoute (requireProfile = false)
    └── /setup
```

The application checks two things before allowing access to protected pages:

1. Is the user signed in?
2. Does the user have a profile?

## 8. Supabase Tables

### profiles

Stores the user's personal information and study preferences.

Important columns:

```text
id
university_id
first_name
last_name
birthday
gender
major
study_style
created_at
```

The `id` references the user's ID in Supabase Authentication.

### universities

Stores information about universities.

Important columns:

```text
id
name
domain
location
```

### courses

Stores courses associated with universities.

Important columns:

```text
id
university_id
course_code
```

### user_courses

Connects users to the courses they are taking.

Important columns:

```text
user_id
course_id
```

This creates a many-to-many relationship between users and courses.

One user can take multiple courses, and one course can have multiple users.

## 9. How Profile Submission Works

When the user clicks Submit:

1. `handleSubmit()` prevents the browser's default form submission.
2. It checks whether all required fields are filled.
3. It checks whether at least one course was added.
4. It checks whether the user is signed in.
5. It sets `loading` to `true`.
6. It calls `saveProfile()` from `profileService.js`.
7. The profile information is saved in Supabase.
8. After saving, the application attempts to navigate to `/home`.
9. If saving fails, an error message is displayed.
10. The loading state is reset.

## 10. Known Issue

After submitting a new profile, the user may remain on `/setup` until the page is refreshed.

This happens because `ProfileRoute` may still hold the previous profile status:

```js
profileExists = false;
```

Even though the profile was successfully saved, the component may not immediately check Supabase again.

Refreshing the page causes the profile check to run again.

A future improvement is to update or refresh the profile status immediately after successfully saving the profile.

Another improvement is handling errors in `ProfileRoute` so the page does not remain stuck on "Checking profile..." if the database request fails.

## 11. Overall Architecture

```text
Setup.jsx
│
├── ProfileFields.jsx
│
├── CourseSelector.jsx
│
├── StudyPreferences.jsx
│
└── profileService.js
        │
        └── Supabase
            ├── profiles
            ├── universities
            ├── courses
            └── user_courses


ProfileRoute.jsx
│
└── ProfileCheck.js
        │
        └── Supabase
            └── profiles
```

## 12. Summary

The Profile Setup feature is responsible for collecting user information, saving it in Supabase, and making sure users complete their profiles before accessing the main application.

The code is separated into three main responsibilities:

- **UI Components:** Display the form and collect user input.
- **Services:** Handle communication with Supabase.
- **Route Protection:** Control which pages users can access based on authentication and profile status.

This structure makes the application easier to understand, maintain, and expand as new Study Buddy features are developed.
