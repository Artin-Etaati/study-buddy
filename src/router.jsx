
import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "./components/Loggedin/Home/Home";
import Setup from "./components/Frontpage/Setup/Setup";
import Profile from "./components/Loggedin/Profile/Profile";
import Matches from "./components/Loggedin/Matches/Matches";
import ChatList from "./components/Loggedin/Messages/chatList";
import Layout from "./components/Loggedin/Layout";
import About from "./components/Frontpage/Landingpage/about";
import Landingpage from "./components/Frontpage/Landingpage/Landingpage";
import Features from "./components/Frontpage/Landingpage/features";
import Login from "./components/Frontpage/Login/Login";
import ProfileRoute from "./components/ProfileRoute";
import Chatpage from "./components/Loggedin/Messages/chatpage";
import Chatquery from "./components/Loggedin/Messages/chatquery";

export const Router = createBrowserRouter ([
    {path: "/", element: <Navigate to = "/about"/>},


    {element:<ProfileRoute requireProfile={true}/>, children: [
        {element:<Layout/>, children: [
                {path: "/home", element: <Home />},
                {path: "/profile", element:<Profile />},
                {path: "/matches", element:<Matches />},
                {element:<Chatquery/>, children:[
                        {path: "/messages/:profilenum", element:<Chatpage/>},
                        {path: "/messages", element:<ChatList />}
                ]}
        ]}
    ]},

    {element:<ProfileRoute requireProfile={false}/>, children: [
            {path: "/setup", element: <Setup />}
    ]},

    {element: <Landingpage/>, children: [
            {path: "/about", element: <About/>},
            {path: "/features", element: <Features/>},
            {path: "/signup", element: <Login isSignup={true}/>},
            {path: "/login", element: <Login isSignup={false}/>}
    ]},

    {path: "*", element: <Navigate to ="/about"/>}
]);
