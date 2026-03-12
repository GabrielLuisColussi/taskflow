import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {
    return (
    <BrowserRouter>
        <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
            path="/dashboard"
            element={
            <PrivateRoute>
                <Dashboard />
            </PrivateRoute>
            }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        </BrowserRouter>
    );
}
