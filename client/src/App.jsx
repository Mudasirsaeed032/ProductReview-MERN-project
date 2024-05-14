import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './Signup.jsx'
import Login from './Login.jsx'
import Home from './Home.jsx'
import Product from './Product.jsx'

function App() {
  
  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/product/:id" element={<Product />} />
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
