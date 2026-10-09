
# Study Buddy

Study Buddy is a web application designed to help university students find compatible study partners.

Many students have difficulty finding people in their classes who have similar study habits or schedules. Study Buddy aims to solve this problem by helping students connect with others from their university based on their courses, major, study style, and other preferences.

This project is being developed as part of **COMP 380 - Software Engineering** at California State University, Northridge (CSUN).

## 1. Project Overview

Study Buddy allows students to create an account, set up their profile, and eventually receive recommendations for potential study partners.

The main goal is to make finding study partners easier, especially for students who may not feel comfortable approaching classmates in person.

### Main Objectives

- Allow students to create an account and sign in.
- Allow students to create a personal study profile.
- Connect students based on their university and courses.
- Recommend study partners using a compatibility ranking system.
- Allow students to like or reject recommendations.
- Create matches when two students like each other.
- Allow matched students to communicate.

## 2. Technology Stack

### Frontend

- React - Builds the user interface using reusable components.
- JavaScript - Handles application logic and user interactions.
- Vite - Development server and build tool.
- Bootstrap - Provides styling and responsive UI utilities.
- CSS Modules - Provides component-specific styling.
- React Router - Handles page navigation and protected routes.

### Backend and Database

- Supabase - Provides backend services.
- PostgreSQL - Stores application data.
- Supabase Authentication - Manages user accounts and sessions.
- Supabase Row Level Security (RLS) - Controls database access.

### Development Tools

- Git - Version control.
- GitHub - Code collaboration and pull requests.
- Visual Studio Code - Code editor.

## 3. Project Features

### Authentication

**Status: Implemented**

Students can create an account, sign in, and sign out using Supabase Authentication.

Authentication is managed through `AuthContext.jsx`, which provides the current session and authentication functions to the rest of the application.

Main functions:

- `signUpNewUser()`
- `signInUser()`
- `signOut()`

The application also uses `onAuthStateChange()` to update the session when the user's authentication state changes.

### Profile Setup

**Status: Implemented**

After creating an account, students are directed to the profile setup page.

The setup form collects:

- First name
- Last name
- Birthday
- Gender
- University
- Major
- Current courses
- Study style

Students can add multiple courses and remove courses before submitting.

The application saves profile information to Supabase.

### Protected Routes

**Status: Implemented**

The application uses two route protection components.

**PrivateRoute**

Checks whether the user is authenticated.

If the user is not signed in, they cannot access protected pages.

**ProfileRoute**

Checks whether the authenticated user already has a profile.

- Users without a profile are directed to `/setup`.
- Users with a profile can access the main application.
- Users with an existing profile are redirected away from `/setup`.

### Study Partner Recommendations

**Status: In Development**

The Home page contains the initial design for displaying recommended student profiles.

The current implementation uses sample profile data.

The planned recommendation system will consider:

- University
- Current courses
- Major
- Study style
- User preferences

Students will be ranked based on compatibility.

### Swipes and Matches

**Status: Planned / In Development**

Students will be able to like or reject recommended profiles.

The planned process is:

1. A student views a recommended profile.
2. The student likes or rejects the profile.
3. The application stores the decision.
4. If both students like each other, a match is created.
5. Matched students can communicate.

### Messaging

**Status: Planned**

The application will eventually allow matched students to send messages to each other.

The messaging page currently exists as a placeholder.

## 4. Project Structure

The main source code is organized as follows:

```text
study-buddy/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   │
│   │   ├── Frontpage/
│   │   │   ├── Landingpage/
│   │   │   ├── Login/
│   │   │   └── Setup/
│   │   │       ├── Setup.jsx
│   │   │       ├── ProfileFields.jsx
│   │   │       ├── CourseSelector.jsx
│   │   │       └── StudyPreferences.jsx
│   │   │
│   │   ├── Loggedin/
│   │   │   ├── Home/
│   │   │   ├── Profile/
│   │   │   ├── Matches/
│   │   │   ├── Messages/
│   │   │   ├── Layout.jsx
│   │   │   └── Navbar.jsx
│   │   │
│   │   ├── PrivateRoute.jsx
│   │   └── ProfileRoute.jsx
│   │
│   ├── services/
│   │   ├── supabase.js
│   │   ├── profileService.js
│   │   └── ProfileCheck.js
│   │
│   ├── AuthContext.jsx
│   ├── router.jsx
│   └── main.jsx
│
├── package.json
├── vite.config.js
└── README.md
```

## 5. Main Application Files

### AuthContext.jsx

Manages authentication throughout the application.

It stores:

- The current user session
- Authentication loading state

It provides functions for signing up, signing in, and signing out.

Other components access authentication information through the `UserAuth()` hook.

### router.jsx

Defines the application's routes using React Router.

Public pages include:

```text
/about
/features
/signup
/login
```

Protected pages include:

```text
/setup
/home
/profile
/matches
/messages
```

### PrivateRoute.jsx

Prevents users who are not signed in from accessing protected pages.

### ProfileRoute.jsx

Checks whether a signed-in user has a profile.

It uses the `hasProfile()` function to determine whether the user should access `/setup` or the main application.

### Setup.jsx

Handles the profile setup form.

It manages form state, course selection, validation, and profile submission.

The form is divided into smaller components:

- `ProfileFields.jsx`
- `CourseSelector.jsx`
- `StudyPreferences.jsx`

### profileService.js

Handles profile-related database operations.

Main functions:

**getUniversities()**

Retrieves the available universities from Supabase.

**saveProfile()**

Saves the user's personal information and connects the user to their selected courses.

### ProfileCheck.js

Contains the `hasProfile()` function.

This function checks whether a row exists in the `profiles` table for the authenticated user.

### supabase.js

Creates the Supabase client used throughout the application.

It reads the Supabase URL and publishable key from environment variables.

## 6. Database Design

Study Buddy uses PostgreSQL through Supabase.

### Current Core Tables

**universities**

Stores university information.

| Column | Description |
|--------|-------------|
| id | University ID |
| name | University name |
| domain | University email domain |
| location | University location |

**profiles**

Stores student information.

| Column | Description |
|--------|-------------|
| id | User ID, references auth.users |
| university_id | Student's university |
| first_name | First name |
| last_name | Last name |
| birthday | Date of birth |
| gender | Gender |
| major | Student's major |
| study_style | Preferred study style |
| created_at | Profile creation time |

**courses**

Stores courses associated with universities.

| Column | Description |
|--------|-------------|
| id | Course ID |
| university_id | University offering the course |
| course_code | Course code |

**user_courses**

Connects students to their courses.

| Column | Description |
|--------|-------------|
| user_id | References profiles |
| course_id | References courses |

### Database Relationships

```text
auth.users
    |
    | 1:1
    v
profiles
    |
    | Many-to-One
    v
universities


profiles
    |
    | One-to-Many
    v
user_courses
    |
    | Many-to-One
    v
courses
```

The `user_courses` table creates a many-to-many relationship between students and courses.

This allows one student to take multiple courses and multiple students to take the same course.

### Planned Database Features

Additional database structures will support:

- User preferences and filters
- Swipe decisions
- Mutual matches
- Conversations
- Messages

These features are part of the ongoing development of Study Buddy.

## 7. Authentication and Profile Flow

The application follows this process:

```text
Student visits Study Buddy
            |
            v
       Sign Up / Login
            |
            v
   Supabase Authentication
            |
            v
       PrivateRoute
            |
            v
       ProfileRoute
            |
      +-----+-----+
      |           |
Profile exists  No profile
      |           |
      v           v
    /home       /setup
                  |
                  v
            Complete form
                  |
                  v
           Save to Supabase
                  |
                  v
                /home
```

The purpose of this system is to prevent students from using the main application without first creating a profile.

## 8. Planned Matchmaking Algorithm

The matchmaking system will recommend compatible students based on their profile information.

The planned process is:

1. Retrieve potential study partners.
2. Filter students by university.
3. Find students taking relevant courses.
4. Remove the current user from the results.
5. Apply selected user preferences.
6. Calculate compatibility scores.
7. Sort students by their scores.
8. Display the ranked recommendations.

The exact ranking weights and filtering rules will be determined during development.

## 9. Installation and Setup

### Requirements

Before running the project, install:

- Node.js
- npm
- Git
- Visual Studio Code (recommended)

You also need access to the project's Supabase backend.

### Step 1: Clone the Repository

```bash
git clone https://github.com/Artin-Etaati/study-buddy.git
```

Navigate to the project folder:

```bash
cd study-buddy
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs the packages listed in `package.json`.

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory.

Add:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

These values can be found in the Supabase project dashboard.

Use the project's public/publishable key, not the Supabase secret or service-role key.

Do not commit the `.env` file to GitHub.

### Step 4: Run the Application

```bash
npm run dev
```

Vite will display a local development URL in the terminal.

Open that URL in your browser.

### Other Commands

Build the application:

```bash
npm run build
```

Run ESLint:

```bash
npm run lint
```

Preview the production build:

```bash
npm run preview
```

## 10. Development Workflow

The team uses Git and GitHub to manage the project.

The general workflow is:

1. Create a feature branch.
2. Make changes to the code.
3. Test the changes locally.
4. Commit the changes.
5. Push the branch to GitHub.
6. Create a pull request.
7. Review and merge the changes.

Example:

```bash
git checkout -b feature/example
```

After making changes:

```bash
git add .
git commit -m "Add example feature"
git push -u origin feature/example
```

Using separate branches allows team members to work on different features without directly modifying the main branch.

## 11. Current Development Progress

### Completed

- [x] Create GitHub repository
- [x] Set up React and Vite
- [x] Install Bootstrap
- [x] Connect application to Supabase
- [x] Create initial database tables
- [x] Implement user sign-up
- [x] Implement user sign-in
- [x] Implement user sign-out
- [x] Create authentication context
- [x] Manage user sessions
- [x] Create profile setup form
- [x] Add university selection
- [x] Add multiple course selection
- [x] Save profiles to Supabase
- [x] Save user-course relationships
- [x] Refactor Setup into smaller components
- [x] Implement protected routes
- [x] Add profile existence checks
- [x] Create initial Home and navigation pages
- [x] Create initial recommendation card UI

### In Progress / Planned

- [ ] Resolve profile routing refresh issue after setup submission
- [ ] Improve error handling
- [ ] Retrieve real student profiles for recommendations
- [ ] Implement matchmaking filters
- [ ] Implement compatibility ranking algorithm
- [ ] Implement swipe functionality
- [ ] Implement mutual matches
- [ ] Implement messaging
- [ ] Build full Profile page
- [ ] Add profile editing
- [ ] Improve UI and responsiveness
- [ ] Complete application testing

## 12. Known Issues and Limitations

### Profile Navigation

After submitting the Setup form, the application may remain on `/setup` until the page is refreshed.

This is related to the profile status stored in `ProfileRoute`.

### Profile Check Errors

If the profile database check fails, the current route component may remain on the loading message.

### Profile Saving

Profile and course information are currently saved through multiple database operations.

If a later operation fails, earlier changes may already have been saved.

### Matchmaking

The Home page currently displays a sample profile. Real recommendation queries and ranking are not yet connected.

### Other Pages

The Profile, Matches, and Messages pages are still under development.

## 13. Future Improvements

Future development will focus on completing the main Study Buddy experience.

Planned improvements include:

- Personalized study partner recommendations
- More advanced matching preferences
- Compatibility scores
- Mutual matching
- Real-time messaging
- Profile pictures
- Profile editing
- Improved mobile responsiveness
- Better error handling and testing

## 14. Project Management

Study Buddy is being developed using the Scrum methodology.

The team divides development into smaller tasks and features.

GitHub branches and pull requests are used to organize changes and support collaboration.

The project is developed incrementally, with features being implemented, tested, and improved throughout the semester.

## 15. Project Status

**Status: Active Development**

Authentication, profile setup, database integration, and protected routing are implemented.

The current focus is developing the matchmaking system and connecting the main application pages to real student data.

The long-term goal is to provide university students with an easy way to find compatible study partners and communicate with them.

## 16. Repository

GitHub Repository:

https://github.com/Artin-Etaati/study-buddy

Developed for **COMP 380 - Software Engineering** at California State University, Northridge.
