import { useState, useContext, useEffect } from 'react';
import { FaStar } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';
import BASE_URL from '../../utils/config';
import { useNavigate } from 'react-router-dom';

const GST_RATE = 0.05; // 5% GST for tour packages

const Booking = ({
  price,
  title,
  reviewsArray,
  avgRating,
  tourId,
  tourMaxGroupSize,
}) => {
  const currentDate = new Date().toISOString().split('T')[0];
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [bookingDetails, setBookingDetails] = useState({
    tourId: tourId,
    tourName: title,
    fullName: '',
    phone: '',
    guestSize: 1,
    date: '',
    subtotal: price, // Initially for 1 guest, before GST
    gstAmount: price * GST_RATE, // GST for initial price
    finalPrice: price * (1 + GST_RATE), // Final price for initial price
  });

  useEffect(() => {
    const guestCount = Number(bookingDetails.guestSize) || 1;
    const newSubtotal = price * guestCount;
    const newGstAmount = newSubtotal * GST_RATE;
    const newFinalPrice = newSubtotal + newGstAmount;

    setBookingDetails(prev => ({
      ...prev,
      subtotal: newSubtotal,
      gstAmount: newGstAmount,
      finalPrice: newFinalPrice,
    }));
  }, [price, bookingDetails.guestSize]);

  useEffect(() => {
    // This effect updates tour-specific details and recalculates price if props change
    const guestCount = Number(bookingDetails.guestSize) || 1; // Use current guestSize
    const newSubtotal = price * guestCount;
    const newGstAmount = newSubtotal * GST_RATE;
    const newFinalPrice = newSubtotal + newGstAmount;

    setBookingDetails(prev => ({
      ...prev,
      tourId: tourId,
      tourName: title,
      subtotal: newSubtotal,
      gstAmount: newGstAmount,
      finalPrice: newFinalPrice,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, tourId, price]); // guestSize is managed by the other useEffect to avoid loops

  const handleChange = e => {
    setBookingDetails(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!user) {
      toast.error('Please Sign In first');
      return;
    }

    const payload = {
      tourId: bookingDetails.tourId,
      tourName: bookingDetails.tourName,
      fullName: bookingDetails.fullName,
      phone: bookingDetails.phone,
      guestSize: parseInt(bookingDetails.guestSize),
      date: bookingDetails.date,
      totalPrice: bookingDetails.finalPrice, // Send the final price including GST
      maxGroupSize: parseInt(tourMaxGroupSize),
    };

    try {
      const response = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success('Booking successful!');
        navigate('/booked');
      } else {
        toast.error(result.message || 'Failed to create booking.');
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      toast.error('Server not responding or booking failed. Please try again.');
    }
  };

  return (
    <div className="">
      <div className="flex justify-between items-center ">
        <h3 className="text-[25px] md:text-[40px]  font-bold mb-4 text-start text-BaseColor">
          ${price} <span>/per person</span>
        </h3>
        <div className="flex items-center gap-2">
          <i>
            <FaStar />
          </i>
          <span className="flex gap-1">
            <div>{avgRating}</div>
            <div>({reviewsArray.length})</div>
          </span>
        </div>
      </div>

      <div className="py-6 space-y-4">
        <h5 className="text-[18px] md:text-2xl font-semibold">
          Booking Information
        </h5>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              className="booking_input"
              type="text"
              placeholder="Full Name"
              id="fullName"
              value={bookingDetails.fullName}
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              className="booking_input"
              type="text"
              placeholder="Contact No."
              id="phone"
              value={bookingDetails.phone}
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              className="booking_input"
              type="number"
              placeholder="Number of Persons?"
              id="guestSize"
              value={bookingDetails.guestSize}
              min="1"
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              className="booking_input"
              type="date"
              id="date"
              value={bookingDetails.date}
              min={currentDate}
              required
              onChange={handleChange}
            />
          </div>
          <div className="mt-12">
            <div className="flex my-4 justify-between">
              <span>Price per person: </span>
              <p className="font-semibold">Rs. {price}</p>
            </div>
            <div className="flex my-4 justify-between">
              <span>Guests: </span>
              <p className="font-semibold">{bookingDetails.guestSize}</p>
            </div>
            <div className="flex my-4 justify-between">
              <span>Subtotal: </span>
              <p className="font-semibold">
                Rs. {bookingDetails.subtotal.toFixed(2)}
              </p>
            </div>
            <div className="flex my-4 border-b-[1px] pb-2 border-black justify-between">
              <span>GST ({GST_RATE * 100}%): </span>
              <p className="font-semibold">
                Rs. {bookingDetails.gstAmount.toFixed(2)}
              </p>
            </div>
            <div className="flex my-6 justify-between font-bold text-lg">
              <span>Total Payable: </span>
              <p>Rs. {bookingDetails.finalPrice.toFixed(2)}</p>
            </div>
          </div>
          <button type="submit" className="btn w-full">
            Book Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default Booking;
