import { createBrowserRouter } from "react-router-dom";
import Home from './components/Home';
import Frontpage from "./components/Frontpage";
import App from "./App";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./components/Profile";
import Matches from "./components/Matches";
import Messages from "./components/Messages";
export const Router = createBrowserRouter ([
    {path: "/", element: <App />},
    {path: "/signin", element: <Frontpage isSignup={false}/>},
    {path: "/signup", element: <Frontpage isSignup={true}/>},
    {path: "/home", element: <PrivateRoute><Home /></PrivateRoute>},
    {path: "/profile", element:<PrivateRoute><Profile /></PrivateRoute>},
    {path: "/matches", element:<PrivateRoute><Matches /></PrivateRoute>},
    {path: "/messages", element:<PrivateRoute><Messages /></PrivateRoute>},
    {path: "*", element: <Frontpage/>}
]);