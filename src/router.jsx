import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from './components/Home';
import PrivateRoute from "./components/PrivateRoute";
import Setup from "./components/Setup";
import Profile from "./components/Profile";
import Matches from "./components/Matches";
import Messages from "./components/Messages";
import Layout from "./components/Layout";
import About from "./components/Frontpage/Landingpage/about";
import Landingpage from "./components/Frontpage/Landingpage/Landingpage";
import Features from "./components/Frontpage/Landingpage/features";
import Login from "./components/Frontpage/Login/Login";


export const Router = createBrowserRouter ([
    {path: "/", element: <Navigate to = "/about"/>},
    {path: "/signin", element: <Frontpage isSignup={false}/>},
    {path: "/signup", element: <Frontpage isSignup={true}/>},
    {path: "/Setup", element: (<PrivateRoute> <Setup /> </PrivateRoute>)},
    {element:<Layout/>, children: [
        {path: "/home", element: <Home />},
        {path: "/profile", element:<Profile />},
        {path: "/matches", element:<Matches />},
        {path: "/messages", element:<Messages />},
    ]},
    {element: <Landingpage/>, children: [
            {path: "/about", element: <About/>},
            {path: "/features", element: <Features/>},
            {path: "/signup", element: <Login isSignup={true}/>},
            {path: "/login", element: <Login isSignup={false}/>}
    ]},
     {path: "*", element: <Navigate to ="/about"/>}
]);