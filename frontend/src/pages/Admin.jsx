// import React from 'react'
import React, { useState, useEffect } from 'react';
import '../styles/admin.css'
import { Container, Row, Col, CardSubtitle } from 'reactstrap'
import { BASE_URL } from '../utils/config'

const Admin = () => {
    const [activeTab, setActiveTab] = useState('createTour');
    const [bookings, setBookings] = useState([]);
 
    const handleCreateTour = async (e) => {
       e.preventDefault();
 
       const newTour = {
          title: e.target.title.value,
          city: e.target.city.value,
          address: e.target.address.value,
          distance: e.target.distance.value,
          photo: e.target.photo.value,
          desc: e.target.desc.value,
          price: e.target.price.value,
          maxGroupSize: e.target.maxGroupSize.value,
          featured: false,
          reviews: []
       };
 
       try {
          const res = await fetch(`${BASE_URL}/tours/`, {
             method: 'POST',
             headers: {
                'Content-Type': 'application/json',
             },
             body: JSON.stringify(newTour),
          });
 
          const result = await res.json();
 
          if (res.ok) {
             alert('Tour created successfully!');
             e.target.reset();
          } else {
             alert(result.message || 'Failed to create tour');
          }
       } catch (error) {
          console.error('Error:', error);
          alert('An error occurred. Please try again.');
       }
    };
 
    const fetchBookings = async () => {
       try {
          const res = await fetch(`${BASE_URL}/booking`);
          const data = await res.json();
          if (res.ok) {
             setBookings(data.data || []);
          } else {
             alert(data.message || 'Failed to fetch bookings');
          }
       } catch (error) {
          console.error('Error:', error);
          alert('An error occurred while fetching bookings.');
       }
    };
 
    useEffect(() => {
       if (activeTab === 'viewBookings') {
          fetchBookings();
       }
    }, [activeTab]);
 
    return (
       <>
          <div className="admin__tabs">
             <button
                className={`tab ${activeTab === 'createTour' ? 'active' : ''}`}
                onClick={() => setActiveTab('createTour')}
             >
                Create Tour
             </button>
             <button
                className={`tab ${activeTab === 'viewBookings' ? 'active' : ''}`}
                onClick={() => setActiveTab('viewBookings')}
             >
                View All Bookings
             </button>
          </div>
 
          {activeTab === 'createTour' && (
             <section>
                <Container>
                   <Row>
                      <Col lg='12'>
                         <h2 className='create__tour-title'>Create a New Tour</h2>
                      </Col>
                      <Col lg='12'>
                         <form onSubmit={handleCreateTour}>
                            <div className="form__group">
                               <label htmlFor="title">Title</label>
                               <input type="text" id="title" placeholder="Tour Title" required />
                            </div>
                            <div className="form__group">
                               <label htmlFor="city">City</label>
                               <input type="text" id="city" placeholder="City" required />
                            </div>
                            <div className="form__group">
                               <label htmlFor="address">Address</label>
                               <input type="text" id="address" placeholder="Address" required />
                            </div>
                            <div className="form__group">
                               <label htmlFor="distance">Distance (km)</label>
                               <input type="number" id="distance" placeholder="Distance" required />
                            </div>
                            <div className="form__group">
                               <label htmlFor="photo">Photo URL</label>
                               <input type="text" id="photo" placeholder="Photo URL" required />
                            </div>
                            <div className="form__group">
                               <label htmlFor="desc">Description</label>
                               <textarea id="desc" placeholder="Tour Description" required></textarea>
                            </div>
                            <div className="form__group">
                               <label htmlFor="price">Price ($)</label>
                               <input type="number" id="price" placeholder="Price" required />
                            </div>
                            <div className="form__group">
                               <label htmlFor="maxGroupSize">Max Group Size</label>
                               <input type="number" id="maxGroupSize" placeholder="Max Group Size" required />
                            </div>
                            <div className="form__group">
                               <button type="submit" className="btn btn-primary">Create Tour</button>
                            </div>
                         </form>
                      </Col>
                   </Row>
                </Container>
             </section>
          )}
 
          {activeTab === 'viewBookings' && (
             <section>
                <Container>
                   <Row>
                      <Col lg='12'>
                         <h2 className='bookings__title'>All Bookings</h2>
                         {bookings.length > 0 ? (
                            <div className="bookings__container">
                               {bookings.map((booking) => (
                                  <div key={booking._id} className="booking__card">
                                     <h3 className="tour__name">{booking.tourName}</h3>
                                     <p><strong>Full Name:</strong> {booking.fullName}</p>
                                     <p><strong>User Email:</strong> {booking.userEmail}</p>
                                     <p><strong>Guest Size:</strong> {booking.guestSize}</p>
                                     <p><strong>Phone:</strong> {booking.phone}</p>
                                     <p><strong>Booking Date:</strong> {new Date(booking.bookAt).toLocaleDateString()}</p>
                                     <p><strong>Created At:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
                                  </div>
                               ))}
                            </div>
                         ) : (
                            <p>No bookings found.</p>
                         )}
                      </Col>
                   </Row>
                </Container>
             </section>
          )}
       </>
    );
 };
 
 export default Admin;