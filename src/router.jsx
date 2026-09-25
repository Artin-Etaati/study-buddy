import { createBrowserRouter } from "react-router-dom";
import Dashboard from './components/Dashboard/Dashboard';
import Signup from './components/Signup/Signup';
import Signin from "./components/Signin/Signin";
import App from "./App";

export const Router = createBrowserRouter ([
    {path: "/", element: <App />},
    {path: "/signin", element: <Signin/>},
    {path: "/signup", element: <Signup />},
    {path: "/dashboard", element: <Dashboard />},

]);