import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";
import DashboardPage from "../features/dashboard/DashboardPage/DashboardPage";

import LoginPage from "../features/auth/page/LoginPage";

import ProductPage from "../features/products/pages/ProductPage";
import SettingsPage from "../features/settings/pages/SettingsPage";
import UsersPage from "../features/users/pages/UserPage";
import RecommendationPage from "../features/recommendations/page/RecommendationPage";

import SkinConditionPage from "../features/condition/page/SkinConditionPage";
import ReportPage from "../features/reports/page/ReportPage";
import UserScanPage from "../features/scan/screen/UserScanPage";
import ViewScanPage from "../features/scan/screen/ViewScan";
import LandingPage from "../features/landing/screen/LandingPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<DashboardLayout />}>

          {/* FIX: default admin redirect */}
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="products" element={<ProductPage />} />

          {/* Recommendation Routes */}
          <Route path="recommendation" element={<RecommendationPage />} />

          <Route path="report" element={<ReportPage />} />
          <Route path="condition" element={<SkinConditionPage />} />

          {/* Scan Routes */}
          <Route path="users-scan" element={<UserScanPage />} />
          <Route path="scans/:id" element={<ViewScanPage />} />

        </Route>

        {/* Global fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}