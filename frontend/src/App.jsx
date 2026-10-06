import React from "react";
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import OwnerSignup from "./pages/owner/OwnerSignup";
import Login from "./pages/Login";
import Home from "./pages/Home";

import OwnerDashboard from "./pages/owner/OwnerDashboard";
import CreateHotel from "./pages/owner/CreateHotel";
import EditHotel from "./pages/owner/EditHotel";
import MyHotels from "./pages/owner/MyHotels";
import ManageRooms from "./pages/owner/ManageRooms";
import CreateRoom from "./pages/owner/CreateRoom";
import EditRoom from "./pages/owner/EditRoom";
import ViewRoom from "./pages/owner/ViewRoom";
import OwnerHotelBookings from "./pages/owner/OwnerHotelBookings";
import OwnerBookingDetails from "./pages/owner/OwnerBookingDetails";
import ViewHotel from "./pages/owner/ViewHotel";

import CustomerSignup from "./pages/auth/CustomerSignup";
import HotelDetails from "./pages/customer/HotelDetails";
import RoomSelection from "./pages/customer/RoomSelection";
import BookingDetails from "./pages/customer/BookingDetails";

import Payment from "./pages/payment/Payment";
import PaymentSuccess from "./pages/payment/PaymentSuccess";

import MyBookings from "./pages/customer/MyBookings";
import BookingView from "./pages/customer/BookingView";

import HotelSearch from "./pages/HotelSearch";
import Profile from "./pages/Profile";

import PageNotFound from "./pages/PageNotFound";

const App = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <Routes>
                {/* =========================
                    PUBLIC ROUTES
                ========================= */}

                <Route
                    path="/"
                    element={<HotelSearch />}
                />

                <Route
                    path="/signup/customer"
                    element={<CustomerSignup />}
                />

                <Route
                    path="/signup/owner"
                    element={<OwnerSignup />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/hotels/:hotelId"
                    element={<HotelDetails />}
                />

                <Route
                    path="/hotels/:hotelId/rooms"
                    element={<RoomSelection />}
                />

                {/* =========================
                    CUSTOMER ROUTES
                ========================= */}

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute
                            allowedRoles={["customer", "owner"]}
                        >
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/my-bookings"
                    element={
                        <ProtectedRoute
                            allowedRoles={["customer"]}
                        >
                            <MyBookings />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/booking-details"
                    element={
                        <ProtectedRoute
                            allowedRoles={["customer"]}
                        >
                            <BookingDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/payment/:bookingId"
                    element={
                        <ProtectedRoute
                            allowedRoles={["customer"]}
                        >
                            <Payment />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/payment/success/:bookingId"
                    element={
                        <ProtectedRoute
                            allowedRoles={["customer"]}
                        >
                            <PaymentSuccess />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/bookings/:bookingId"
                    element={
                        <ProtectedRoute
                            allowedRoles={["customer"]}
                        >
                            <BookingView />
                        </ProtectedRoute>
                    }
                />

                {/* =========================
                    OWNER ROUTES
                ========================= */}

                <Route
                    path="/owner/dashboard"
                    element={
                        <ProtectedRoute
                            allowedRoles={["owner"]}
                        >
                            <OwnerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/owner/hotels/create"
                    element={
                        <ProtectedRoute
                            allowedRoles={["owner"]}
                        >
                            <CreateHotel />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/owner/my-hotels"
                    element={
                        <ProtectedRoute
                            allowedRoles={["owner"]}
                        >
                            <MyHotels />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/owner/hotels/:hotelId/rooms"
                    element={
                        <ProtectedRoute
                            allowedRoles={["owner"]}
                        >
                            <ManageRooms />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/owner/hotels/:hotelId/rooms/create"
                    element={
                        <ProtectedRoute
                            allowedRoles={["owner"]}
                        >
                            <CreateRoom />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/owner/hotels/:hotelId/rooms/:roomId/edit"
                    element={
                        <ProtectedRoute
                            allowedRoles={["owner"]}
                        >
                            <EditRoom />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/owner/hotels/:hotelId/rooms/:roomId"
                    element={
                        <ProtectedRoute
                            allowedRoles={["owner"]}
                        >
                            <ViewRoom />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/owner/hotels/:hotelId/bookings"
                    element={
                        <ProtectedRoute allowedRoles={["owner"]}> <OwnerHotelBookings /> </ProtectedRoute>
                    }
                />

                <Route
                    path="/owner/hotels/:hotelId/bookings/:bookingId"
                    element={
                        <ProtectedRoute allowedRoles={["owner"]}> <OwnerBookingDetails /> </ProtectedRoute>
                    }
                />

                <Route
                    path="/owner/hotels/:hotelId/edit"
                    element={
                        <ProtectedRoute allowedRoles={["owner"]}> <EditHotel /> </ProtectedRoute>
                    }
                />

                <Route
                    path="/owner/hotels/:hotelId"
                    element={
                        <ProtectedRoute allowedRoles={["owner"]}> <ViewHotel /> </ProtectedRoute>
                    }
                />

                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </div>
    );
};

export default App;