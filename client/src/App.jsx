import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './Signup.jsx'
import Login from './Login.jsx'
import Home from './Home.jsx'
import Product from './Product.jsx'
import ReviewPage from './ReviewPage.jsx'
import Profile from './Profile.jsx'
import NotFound from './NotFound.jsx'
import EditPage from './EditPage.jsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/product/:id/review" element={<ReviewPage />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/edit/:id" element={<EditPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
