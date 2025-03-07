import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Booking.css';

const Bookings = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const destinationFromQuery = new URLSearchParams(location.search).get('destination');
  const isNewBooking = location.pathname === '/bookings/new' && destinationFromQuery;
  const [formData, setFormData] = useState({
    destination: destinationFromQuery || '',
    travelDate: '',
    travelers: 1,
    totalPrice: 0,
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!isNewBooking) {
      const fetchBookings = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/bookings`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setBookings(response.data);
        } catch (err) {
          setError('Failed to fetch bookings');
        }
      };
      fetchBookings();
    }
  }, [user, token, navigate, isNewBooking]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/bookings`,
        { ...formData, status: 'pending' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/bookings');
      alert('Booking created successfully!');
    } catch (err) {
      setError('Failed to create booking');
    }
  };

  return (
    <div className="booking-container">
      <div className="booking-header">
        <h2>{isNewBooking ? 'Create New Booking' : 'My Bookings'}</h2>
      </div>
      {error && <div className="error-message">{error}</div>}

      {isNewBooking && (
        <div className="booking-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Destination ID:</label>
              <input type="text" value={formData.destination} disabled />
            </div>
            <div className="form-group">
              <label>Travel Date:</label>
              <input
                type="date"
                value={formData.travelDate}
                onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Number of Travelers:</label>
              <input
                type="number"
                min="1"
                value={formData.travelers}
                onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="form-group">
              <label>Total Price:</label>
              <input
                type="number"
                value={formData.totalPrice}
                onChange={(e) => setFormData({ ...formData, totalPrice: parseFloat(e.target.value) })}
                required
              />
            </div>
            <button type="submit" className="submit-button">
              Create Booking
            </button>
          </form>
        </div>
      )}

      {!isNewBooking && (
        <div className="bookings-list">
          {bookings.length === 0 ? (
            <p className="loading">No bookings found.</p>
          ) : (
            bookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <h3>{booking.destination?.name || 'N/A'}</h3>
                <div className="booking-info">
                  <p><strong>Travel Date:</strong> {new Date(booking.travelDate).toLocaleDateString()}</p>
                  <p><strong>Travelers:</strong> {booking.travelers}</p>
                  <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
                </div>
                <div className={`booking-status status-${booking.status.toLowerCase()}`}>
                  {booking.status}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Bookings;