import { createBrowserRouter } from "react-router-dom";
import Dashboard from './components/Dashboard';
import Frontpage from "./components/Frontpage";
import App from "./App";
import PrivateRoute from "./components/PrivateRoute";

export const Router = createBrowserRouter ([
    {path: "/", element: <App />},
    {path: "/signin", element: <Frontpage isSignup={false}/>},
    {path: "/signup", element: <Frontpage isSignup={true}/>},
    {path: "/dashboard", element: <PrivateRoute> <Dashboard /> </PrivateRoute>},
    {path: "*", element: <Frontpage/>}
]);