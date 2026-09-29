import { createBrowserRouter } from "react-router-dom";
import Dashboard from './components/Dashboard';
import Front from "./components/front";
import App from "./App";
import PrivateRoute from "./components/PrivateRoute";

export const Router = createBrowserRouter ([
    {path: "/", element: <App />},
    {path: "/signin", element: <Front isSignup={false}/>},
    {path: "/signup", element: <Front isSignup={true}/>},
    {path: "/dashboard", element: <PrivateRoute> <Dashboard /> </PrivateRoute>},
    {path: "*", element: <Front />}
]);