import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from './components/Dashboard';
import PrivateRoute from "./components/PrivateRoute";
import About from "./components/Frontpage/Landingpage/about";
import Landingpage from "./components/Frontpage/Landingpage/Landingpage";
import Features from "./components/Frontpage/Landingpage/features";
import Login from "./components/Frontpage/Login/Login";

export const Router = createBrowserRouter ([
    {path: "/", element:<Navigate to ="/about"/>},
    {element: <Landingpage/>, children: [
            {path: "/about", element: <About/>},
            {path: "/features", element: <Features/>},
            {path: "/signup", element: <Login isSignup={true}/>},
            {path: "/signin", element: <Login isSignup={false}/>}
    ]},
    {path: "/dashboard", element: <PrivateRoute> <Dashboard /> </PrivateRoute>},
    {path: "*", element: <Navigate to ="/about"/>}
]);