import { createBrowserRouter } from "react-router-dom";
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';
import Signin from "./components/Signin";
import App from "./App";
import PrivateRoute from "./components/PrivateRoute";

export const Router = createBrowserRouter ([
    {path: "/", element: <App />},
    {path: "/signin", element: <Signin/>},
    {path: "/signup", element: <Signup />},
    {path: "/dashboard", element: <PrivateRoute> <Dashboard /> </PrivateRoute>},

]);