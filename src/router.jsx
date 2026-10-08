
import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "./components/Loggedin/Home/Home";
import Setup from "./components/Frontpage/Setup/Setup";
import Profile from "./components/Loggedin/Profile/Profile";
import Matches from "./components/Loggedin/Matches/Matches";
import Messages from "./components/Loggedin/Messages/Messages";
import Layout from "./components/Loggedin/Layout";
import About from "./components/Frontpage/Landingpage/about";
import Landingpage from "./components/Frontpage/Landingpage/Landingpage";
import Features from "./components/Frontpage/Landingpage/features";
import Login from "./components/Frontpage/Login/Login";
import PrivateRoute from "./components/PrivateRoute";
import ProfileRoute from "./components/ProfileRoute";


export const Router = createBrowserRouter ([
    {path: "/", element: <Navigate to = "/about"/>},

    {element:<PrivateRoute/>, children: [

        {element:<ProfileRoute requireProfile={true}/>, children: [
            {element:<Layout/>, children: [
                {path: "/home", element: <Home />},
                {path: "/profile", element:<Profile />},
                {path: "/matches", element:<Matches />},
                {path: "/messages", element:<Messages />},
            ]}
        ]},

        {element:<ProfileRoute requireProfile={false}/>, children: [
            {path: "/setup", element: <Setup />}
        ]}

    ]},

    {element: <Landingpage/>, children: [
            {path: "/about", element: <About/>},
            {path: "/features", element: <Features/>},
            {path: "/signup", element: <Login isSignup={true}/>},
            {path: "/login", element: <Login isSignup={false}/>}
    ]},

    {path: "*", element: <Navigate to ="/about"/>}
]);
