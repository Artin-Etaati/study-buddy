# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Study Buddy

Study Buddy is a web application that helps university students find compatible study partners.

Students will be able to create a profile, add their current courses, and find other students from the same university and course. Study Buddy will then rank potential study partners based on compatibility factors such as study style and preferred study location.

## Main Features

- Student account creation and login
- Student profile setup
- University selection
- Add current courses
- Find students taking the same course
- Study partner recommendations
- Compatibility-based matchmaking
- Match requests
- Messaging between matched students

## Tech Stack

### Frontend

- React
- JavaScript
- Bootstrap
- Vite

### Backend / Database

- Supabase
- PostgreSQL
- Supabase Authentication
- Supabase Storage

### Development Tools

- Git
- GitHub
- VS Code

## Database

The current database contains four main application tables:

- `universities` - Stores supported universities and their email domains
- `profiles` - Stores student profile information
- `courses` - Stores courses for each university
- `user_courses` - Connects students to the courses they are currently taking

Supabase Authentication manages user accounts separately through `auth.users`.

## Matchmaking Process

The planned matchmaking process is:

1. Student selects one of their current courses.
2. Study Buddy finds students from the same university.
3. Students taking the selected course are found.
4. The current user is removed from the results.
5. Remaining students are ranked based on compatibility.
6. Recommended study partners are displayed to the user.

## Current Progress

- [x] Create GitHub repository
- [x] Set up React and Vite
- [x] Add Bootstrap
- [x] Create Supabase project
- [x] Design initial database
- [x] Create database tables
- [x] Connect React to Supabase
- [x] Test database connection
- [x] Configure initial Row Level Security policy
- [ ] Build user signup
- [ ] Build login and logout
- [ ] Build profile setup
- [ ] Add course selection
- [ ] Build matchmaking system
- [ ] Build match request system
- [ ] Build messaging
- [ ] Testing and final UI improvements

## Project Status

The initial project setup and database connection are complete.

The next development milestone is implementing user authentication with Supabase Auth.

## Team Project

Study Buddy is being developed as a semester project for COMP 380 - Software Engineering.

iahdgsoids
