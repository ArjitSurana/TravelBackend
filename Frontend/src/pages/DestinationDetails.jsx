import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const DestinationDetails = () => {
  const { id } = useParams(); 
  const [destination, setDestination] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/destinations/${id}`);
        setDestination(response.data);
      } catch (err) {
        setError('Failed to fetch destination details');
      }
    };
    fetchDestination();
  }, [id]);

  if (!destination) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{destination.name}</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <img
        src={destination.images[0] || 'https://via.placeholder.com/400'}
        alt={destination.name}
        style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '5px', marginBottom: '1rem' }}
      />
      <p><strong>Location:</strong> {destination.location}</p>
      <p><strong>Description:</strong> {destination.description}</p>
      <p><strong>Price:</strong> ${destination.price}</p>
      <p><strong>Category:</strong> {destination.category}</p>
      <p><strong>Rating:</strong> {destination.rating}</p>
      <Link to={`/bookings/new?destination=${destination._id}`}>
        <button style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer', marginTop: '1rem' }}>
          Book Now
        </button>
      </Link>
    </div>
  );
};

export default DestinationDetails;