import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Tours from '../pages/Tours';
import TourDetails from '../pages/TourDetails';
import SearchResultList from '../pages/SearchResultList';
import About from '../pages/About';
import Booked from '../pages/Booked';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import AdminLogin from '../pages/AdminLogin';

import MyAccount from '../Dashboard/UserAccount/MyAccount';
import Bookings from '../Dashboard/AdminPanel/Bookings';
import AdminTours from '../Dashboard/AdminPanel/AdminTours';
import CreateTours from '../Dashboard/AdminPanel/CreateTours';
import UpdateTours from '../Dashboard/AdminPanel/UpdateTour';
import NotFound from '../pages/NotFound';
import Privacy from '../pages/Privacy';
import AboutUs from '../pages/AboutUs';
import ContactUs from '../pages//ContactUs';
import CreateTrip from '../create-trip/index';
import ViewTrip from '../view-trip/[tripId]/index';

// Admin Panel Imports
import AdminLayout from '../pages/Admin/AdminLayout';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import ManageUsers from '../pages/Admin/ManageUsers';
import ManageTours from '../pages/Admin/ManageTours';
import ManageBookings from '../pages/Admin/ManageBookings';
import ManageReviews from '../pages/Admin/ManageReviews';
import AddTourForm from '../Dashboard/AdminPanel/AddTourForm'; // Import the new form

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/AiTrip" element={<CreateTrip />} />
      <Route path="/view-trip/:tripId" element={<ViewTrip />} />
      <Route path="/my-account" element={<MyAccount />} />
      <Route path="/all-booking" element={<Bookings />} />
      <Route path="/all-tours" element={<AdminTours />} />
      <Route path="/update-tour/:id" element={<UpdateTours />} />
      <Route path="/create" element={<CreateTours />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<AdminLogin />} />{' '}
      {/* Add route for AdminLogin */}
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />{' '}
      {/* Add route for ResetPassword */}
      <Route path="/tours" element={<Tours />} />
      <Route path="/tours/:id" element={<TourDetails />} />
      <Route path="/about" element={<About />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/booked" element={<Booked />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/tours/search" element={<SearchResultList />} />
      <Route path="/privacy-policy" element={<Privacy />} />
      {/* Admin Panel Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" />} />{' '}
        {/* Default to dashboard */}
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="tours" element={<ManageTours />} />
        <Route path="tours/add" element={<AddTourForm />} />{' '}
        {/* New route for adding tours */}
        <Route path="tours/update/:id" element={<UpdateTours />} />
        <Route path="bookings" element={<ManageBookings />} />
        <Route path="reviews" element={<ManageReviews />} />
        {/* Add other admin-specific routes here */}
      </Route>
      <Route path="*" element={<NotFound />} />{' '}
      {/* New route for Not Found - must be last */}
    </Routes>
  );
};

export default Router;
