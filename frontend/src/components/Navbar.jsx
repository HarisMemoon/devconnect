// src/components/Navbar.jsx
import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            DevConnect
          </Link>

          {/* Links */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
              Home
            </Link>
            <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">
              Login
            </Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-600 font-medium">
              Register
            </Link>
          </div>

          {/* Mobile Menu Placeholder (for future burger menu if needed) */}
          <div className="md:hidden">
            {/* Add mobile menu logic later if needed */}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
