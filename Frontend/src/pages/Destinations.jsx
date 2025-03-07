import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/destinations`);
        setDestinations(response.data);
      } catch (err) {
        setError('Failed to fetch destinations');
      }
    };
    fetchDestinations();
  }, []);

  return (
    <div>
      <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2rem' }}>All Destinations</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
        {destinations.map((destination) => (
          <div key={destination._id} style={{ border: '1px solid #ccc', borderRadius: '5px', overflow: 'hidden' }}>
            <img
              src={destination.images[0] || 'https://via.placeholder.com/250'}
              alt={destination.name}
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            <div style={{ padding: '1rem' }}>
              <h3>{destination.name}</h3>
              <p>Location: {destination.location}</p>
              <p>Price: ${destination.price}</p>
              <p>Category: {destination.category}</p>
              <p>Rating: {destination.rating}</p>
              <Link to={`/bookings/new?destination=${destination._id}`}>
                <button style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer' }}>
                  Book Now
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Destinations;