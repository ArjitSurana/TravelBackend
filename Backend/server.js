require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();


app.use(express.json()); 
app.use(cors()); 


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err));


app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/destinations', require('./routes/destinationRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use. Try a different port or stop the conflicting process.`);
  } else {
    console.log('Server error:', err); 
  }
});