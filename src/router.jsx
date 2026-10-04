import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from './components/Home';
import Frontpage from "./components/Frontpage";
import Profile from "./components/Profile";
import Matches from "./components/Matches";
import Messages from "./components/Messages";
import Layout from "./components/Layout";
export const Router = createBrowserRouter ([
    {path: "/", element: <Navigate to = "/signin"/>},
    {path: "/signin", element: <Frontpage isSignup={false}/>},
    {path: "/signup", element: <Frontpage isSignup={true}/>},
    {element:<Layout/>, children: [
    {path: "/home", element: <Home />},
    {path: "/profile", element:<Profile />},
    {path: "/matches", element:<Matches />},
    {path: "/messages", element:<Messages />},
    ]},
     {path: "*", element: <Navigate to ="/signup"/>}
]);