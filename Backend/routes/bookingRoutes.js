const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Destination = require('../models/Destination');
const auth = require('../middleware/auth');

// Get all bookings for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('destination')
      .sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new booking
router.post('/', auth, async (req, res) => {
  try {
    // Validate destination exists
    const destination = await Destination.findById(req.body.destination);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    // Validate travel date is in the future
    const travelDate = new Date(req.body.travelDate);
    if (travelDate <= new Date()) {
      return res.status(400).json({ message: 'Travel date must be in the future' });
    }

    // Validate number of travelers
    if (req.body.travelers < 1) {
      return res.status(400).json({ message: 'Number of travelers must be at least 1' });
    }

    // Calculate total price
    const totalPrice = destination.price * req.body.travelers;

    const booking = new Booking({
      user: req.user.id,
      destination: req.body.destination,
      travelDate: req.body.travelDate,
      status: 'pending',
      totalPrice: totalPrice,
      travelers: req.body.travelers,
    });

    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Confirm a booking
router.post('/confirm/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or not authorized' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Booking can only be confirmed if it is pending' });
    }

    booking.status = 'confirmed';
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Cancel a booking
router.post('/cancel/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or not authorized' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a booking
router.put('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or not authorized' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot update a cancelled booking' });
    }

    // If updating travel date, validate it's in the future
    if (req.body.travelDate) {
      const travelDate = new Date(req.body.travelDate);
      if (travelDate <= new Date()) {
        return res.status(400).json({ message: 'Travel date must be in the future' });
      }
      booking.travelDate = travelDate;
    }

    // If updating travelers, recalculate total price
    if (req.body.travelers) {
      if (req.body.travelers < 1) {
        return res.status(400).json({ message: 'Number of travelers must be at least 1' });
      }
      const destination = await Destination.findById(booking.destination);
      booking.totalPrice = destination.price * req.body.travelers;
      booking.travelers = req.body.travelers;
    }

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a booking
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or not authorized' });
    }

    await booking.deleteOne();
    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;