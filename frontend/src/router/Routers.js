import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ThankYou from '../pages/ThankYou'
import Home from './../pages/Home'
import Login from './../pages/Login'
import Register from './../pages/Register'
import SearchResultList from './../pages/SearchResultList'
import TourDetails from './../pages/TourDetails'
import Tours from '../pages/Tours'
import Admin from '../pages/Admin'

const Routers = () => {
   // Get user data from localStorage
   const user = JSON.parse(localStorage.getItem('user'));

   // Check if user exists and if the username is 'admin'
   const isAdmin = user && user.username === 'admin';

   return (
      <Routes>
         {/* Redirect to /home if user doesn't exist and trying to access /admin */}
         <Route path='/' element={<Navigate to={isAdmin ? '/admin' : '/home'} />} />
         
         <Route path='/home' element={user && isAdmin ? <Navigate to="/admin" />: <Home/>} />
         
         {/* If user doesn't exist or isn't admin, redirect to /home */}
         <Route path='/admin' element={user && isAdmin ? <Admin /> : <Navigate to="/home" />} />

         <Route path='/tours' element={<Tours/>} />
         <Route path='/tours/:id' element={<TourDetails/>} />
         <Route path='/login' element={<Login/>} />
         <Route path='/register' element={<Register/>} />
         <Route path='/thank-you' element={<ThankYou/>} />
         <Route path='/tours/search' element={<SearchResultList/>} />
      </Routes>
   )
}

export default Routers
