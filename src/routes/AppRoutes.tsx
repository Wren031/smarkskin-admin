import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import DashboardPage from "../features/dashboard/DashboardPage/DashboardPage";

import ProductPage from "../features/products/pages/ProductPage";
import SettingsPage from "../features/settings/pages/SettingsPage";
import UsersPage from "../features/users/pages/UserPage";
import RecommendationPage from "../features/recommendations/page/RecommendationPage";

import SkinConditionPage from "../features/condition/page/SkinConditionPage";
import AddRecommendationsPage from "../features/recommendations/page/AddRecommendationsPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>

          <Route index element={<DashboardPage />} />

          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="products" element={<ProductPage />} />
          <Route path="recommendation" element={<RecommendationPage />} />
          
          <Route path="recommendation/add" element={<AddRecommendationsPage />} />
          <Route path="condition" element={<SkinConditionPage />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}