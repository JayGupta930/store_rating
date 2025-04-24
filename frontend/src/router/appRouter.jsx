import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/loginPage/loginPage";
import RegistrationPage from "../pages/registrationPage/registrationPage";
import SystemAdmin from "../pages/dashboardPage/systemAdministrator/systemAdmin";
import OwnerDashboard from "../pages/dashboardPage/storeOwner/ownerDashboard";
import OwnerProfile from "../pages/dashboardPage/storeOwner/ownerProfile";
import UserDashboard from "../pages/dashboardPage/userDashboard/userDash";
import UserProfile from "../pages/dashboardPage/userDashboard/profile";
import Home from "../components/home/home";
import ChangePassword from "../pages/changePassword/changePassword";
import ViewStore from "../pages/dashboardPage/userDashboard/viewStore";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/loginPage" element={<LoginPage />} />
      <Route path="/registrationPage" element={<RegistrationPage />} />
      <Route path="/systemAdmin" element={<SystemAdmin />} />
      <Route path="/ownerDashboard" element={<OwnerDashboard />} />
      <Route path="/ownerDashboard/profile" element={<OwnerProfile />} />
      <Route path="/userDash" element={<UserDashboard />} />
      <Route path="/userDash/profile" element={<UserProfile />} />
      <Route path="/changePassword" element={<ChangePassword />} />
      <Route path="/viewStore/:id" element={<ViewStore />} />
    </Routes>
  );
};

export default AppRouter;
