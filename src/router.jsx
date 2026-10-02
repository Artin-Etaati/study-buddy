import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from './components/Dashboard';
import Login from "./components/Frontpage/Login/Login";
import PrivateRoute from "./components/PrivateRoute";
import Landingpage from "./components/Frontpage/Landingpage/Landingpage";
//import About from "./components/Frontpage/Landingpage/about";

export const Router = createBrowserRouter ([
    {path: "/", element:<Navigate to ="/landingpage"/>},
    {path: "/landingpage", element: <Landingpage/>/*, children:[{index: true, element:<About/>}]*/},
    {path: "/signin", element: <Login isSignup={false}/>},
    {path: "/signup", element: <Login isSignup={true}/>},
    {path: "/dashboard", element: <PrivateRoute> <Dashboard /> </PrivateRoute>},
    {path: "*", element: <Navigate to ="/landingpage"/>}
]);