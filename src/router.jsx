import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from './components/Dashboard';
import PrivateRoute from "./components/PrivateRoute";
import Landingpage from "./components/Frontpage/Landingpage/Landingpage";

export const Router = createBrowserRouter ([
    {path: "/", element:<Navigate to ="/landingpage"/>},
    {path: "/landingpage", element: <Landingpage/>},
    {path: "/dashboard", element: <PrivateRoute> <Dashboard /> </PrivateRoute>},
    {path: "*", element: <Navigate to ="/landingpage"/>}
]);