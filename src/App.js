// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProviderPrivateRoute from "./components/ProviderPrivateRoute";
import { Link } from 'react-router-dom';

import Home from './pages/Home';
import Register from "./Register";
import Login from "./Login";
import Services from './pages/Services';
import CartPage from './pages/CartPage';
import UserBooking from './pages/UserBooking'
import CategoryPage from "./pages/CategoryPage";
//import ProviderDetails from "./pages/ProviderDetails";
import ProviderBookingPage from "./pages/ProviderBookingPage";
import MyBookingHistory from "./pages/MyBookingHistory";


// Admin Layout & Pages
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AddService from './pages/admin/AddService';
import ViewServices from './pages/admin/ViewServices';
import Category from './pages/admin/Category';
import SubCategory from './pages/admin/SubCategory';
import ServiceType from './pages/admin/ServiceType';
import ManageUsers from './pages/admin/ManageUsers';
import ManageProviders from './pages/admin/ManageProviders';
import AddPackage from './pages/admin/AddPackage';
import ViewPackages from "./pages/admin/ViewPackages";
import AddOffer from "./pages/admin/AddOffer";
import ViewOffers from "./pages/admin/ViewOffers";

// Import Provider Pages
import ProviderLayout from "./pages/provider/ProviderLayout";
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import ProviderBookings from "./pages/provider/ProviderBookings";
import ProviderProfile from "./pages/provider/ProviderProfile";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


function App() {
  return (
    <Router>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />                <Route path="/services/:categoryId" element={<Services />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/book/:providerId" element={<UserBooking />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
<Route path="/my-booking-history" element={<MyBookingHistory />} />

<Route
  path="/provider/:providerId/:serviceId"
  element={<ProviderBookingPage />}
/>

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Redirect /admin to /admin/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
          
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="categories" element={<Category />} />
          <Route path="add-service" element={<AddService />} />
          <Route path="view-services" element={<ViewServices />} />
          <Route path="servicetypes" element={<ServiceType />} />
          <Route path="subcategories" element={<SubCategory />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="manage-providers" element={<ManageProviders />} />
          <Route path="add-package" element={<AddPackage />} />
          <Route path="view-packages" element={<ViewPackages />} />
          <Route path="add-offer" element={<AddOffer />} />
          <Route path="/admin/view-offers" element={<ViewOffers />} />        </Route>

{/* PROVIDER PROTECTED ROUTES */}
<Route
  path="/provider"
  element={
    <ProviderPrivateRoute>
      <ProviderLayout />
    </ProviderPrivateRoute>
  }
>
  <Route index element={<Navigate to="dashboard" replace />} />
  <Route path="dashboard" element={<ProviderDashboard />} />
  <Route path="bookings" element={<ProviderBookings />} />
  <Route path="profile" element={<ProviderProfile />} />
</Route>

      </Routes>
    </Router>
  );
}

export default App;