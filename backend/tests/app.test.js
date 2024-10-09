// app.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index.js'; // Assuming your Express app is exported from index.js
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Tour from '../models/Tour.js';

beforeAll(async () => {
    // Connect to the test database before running tests
    await mongoose.connect(process.env.MONGO_TEST_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    // Clean up and close the connection to the database
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
});

// User Authentication Tests
describe('User Authentication', () => {
    it('should register a new user', async () => {
        const res = await request(app).post('/api/v1/auth/register').send({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'testpassword',
            photo: 'testphoto.jpg',
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Successfully created!');
    });

    it('should login a user', async () => {
        await request(app).post('/api/v1/auth/register').send({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'testpassword',
            photo: 'testphoto.jpg',
        });

        const res = await request(app).post('/api/v1/auth/login').send({
            email: 'testuser@example.com',
            password: 'testpassword',
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.data).toHaveProperty('username', 'testuser');
    });

    it('should not login with wrong credentials', async () => {
        const res = await request(app).post('/api/v1/auth/login').send({
            email: 'wronguser@example.com',
            password: 'wrongpassword',
        });

        expect(res.statusCode).toEqual(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('User not found!');
    });
});

// Tour Management Tests
describe('Tour Management', () => {
    it('should create a new tour', async () => {
        const res = await request(app).post('/api/v1/tours').send({
            title: 'Exciting Tour',
            city: 'New York',
            address: '123 Main St',
            distance: 10,
            photo: 'tourphoto.jpg',
            desc: 'An exciting tour of New York City',
            price: 100,
            maxGroupSize: 5,
            featured: false,
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Successfully created');
        expect(res.body.data).toHaveProperty('title', 'Exciting Tour');
    });

    it('should update an existing tour', async () => {
        // First, create a tour to update
        const newTour = await Tour.create({
            title: 'Old Tour',
            city: 'Los Angeles',
            address: '456 Another St',
            distance: 15,
            photo: 'oldtourphoto.jpg',
            desc: 'An old tour of Los Angeles',
            price: 200,
            maxGroupSize: 10,
        });

        const res = await request(app)
            .put(`/api/v1/tours/${newTour._id}`)
            .send({ title: 'Updated Tour' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Successfully updated');
        expect(res.body.data).toHaveProperty('title', 'Updated Tour');
    });

    it('should delete an existing tour', async () => {
        // First, create a tour to delete
        const newTour = await Tour.create({
            title: 'Tour to Delete',
            city: 'Chicago',
            address: '789 Chicago St',
            distance: 20,
            photo: 'chicagotourphoto.jpg',
            desc: 'A tour of Chicago',
            price: 150,
            maxGroupSize: 8,
        });

        const res = await request(app).delete(`/api/v1/tours/${newTour._id}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Successfully deleted');
    });

    it('should get a single tour', async () => {
        const newTour = await Tour.create({
            title: 'Tour to Get',
            city: 'Miami',
            address: '123 Miami St',
            distance: 30,
            photo: 'miamitourphoto.jpg',
            desc: 'A tour of Miami',
            price: 120,
            maxGroupSize: 6,
        });

        const res = await request(app).get(`/api/v1/tours/${newTour._id}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Successfully');
        expect(res.body.data).toHaveProperty('title', 'Tour to Get');
    });

    it('should get all tours', async () => {
        const res = await request(app).get('/api/v1/tours');

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toBeInstanceOf(Array);
    });
});

// Booking Management Tests
describe('Booking Management', () => {
    let userId;

    // Create a user for booking tests
    beforeAll(async () => {
        const user = await User.create({
            username: 'bookingUser',
            email: 'bookinguser@example.com',
            password: 'bookingpassword',
            photo: 'bookingphoto.jpg',
        });
        userId = user._id;
    });

    it('should create a new booking', async () => {
        // Create a tour to book
        const tour = await Tour.create({
            title: 'Tour to Book',
            city: 'San Francisco',
            address: '321 Market St',
            distance: 25,
            photo: 'sfphoto.jpg',
            desc: 'A beautiful tour of San Francisco',
            price: 150,
            maxGroupSize: 4,
        });

        const res = await request(app).post('/api/v1/booking').send({
            userId: userId,
            userEmail: 'bookinguser@example.com',
            tourName: tour.title,
            fullName: 'John Doe',
            guestSize: 3,
            phone: 1234567890,
            bookAt: new Date(),
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Your tour is booked!');
    });

    it('should handle booking creation errors', async () => {
        const res = await request(app).post('/api/v1/booking').send({
            // Missing required fields
        });

        expect(res.statusCode).toEqual(500);
        expect(res.body.success).toBe(true); // Note: This assumes your error response is structured this way
        expect(res.body.message).toBe('Internal server error!'); // Change this if your error message is different
    });
});
