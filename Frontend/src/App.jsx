import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './pages/Navbar';
import Footer from './pages/Footer';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import DestinationDetails from './pages/DestinationDetails.jsx';
import Profile from './pages/Profile';
import Bookings from './pages/Booking.jsx'; 
import Login from './pages/Login';
import './App.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Navbar />
        <main>
          <Home />
        </main>
        <Footer />
      </>
    ),
  },
  {
    path: '/destinations',
    element: (
      <>
        <Navbar />
        <main>
          <Destinations />
        </main>
        <Footer />
      </>
    ),
  },
  {
    path: '/destinations/:id',
    element: (
      <>
        <Navbar />
        <main>
          <DestinationDetails />
        </main>
        <Footer />
      </>
    ),
  },
  {
    path: '/profile',
    element: (
      <>
        <Navbar />
        <main>
          <Profile />
        </main>
        <Footer />
      </>
    ),
  },
  {
    path: '/bookings',
    element: (
      <>
        <Navbar />
        <main>
          <Bookings />
        </main>
        <Footer />
      </>
    ),
  },
  {
    path: '/bookings/new', 
    element: (
      <>
        <Navbar />
        <main>
          <Bookings />
        </main>
        <Footer />
      </>
    ),
  },
  {
    path: '/login',
    element: (
      <>
        <Navbar />
        <main>
          <Login />
        </main>
        <Footer />
      </>
    ),
  },
]);

const App = () => (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

export default App;