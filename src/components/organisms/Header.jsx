import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import SearchBar from "@/components/molecules/SearchBar"
import Button from "@/components/atoms/Button"
import { useCart } from "@/hooks/useCart"

const Header = () => {
  const navigate = useNavigate()
  const { items } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0)

  const handleSearch = (searchTerm) => {
    navigate(`/categories?search=${encodeURIComponent(searchTerm)}`)
  }

  const navLinks = [
    { to: "/", label: "होम", icon: "Home" },
    { to: "/categories", label: "कैटेगरी", icon: "Grid3X3" },
    { to: "/orders", label: "ऑर्डर्स", icon: "Package" },
    { to: "/admin", label: "एडमिन", icon: "Settings" }
  ]

  return (
    <header className="bg-white shadow-nav sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2 rounded-lg">
              <ApperIcon name="Store" size={24} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                RL Apna Store
              </h1>
              <p className="text-xs text-secondary-500">आसान ऑनलाइन शॉपिंग</p>
            </div>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/cart")}
              className="relative p-2"
            >
              <ApperIcon name="ShoppingCart" size={20} />
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              <ApperIcon name={isMenuOpen ? "X" : "Menu"} size={20} />
            </Button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
                >
                  <ApperIcon name={link.icon} size={16} />
                  <span className="hidden lg:inline">{link.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden py-3 border-t">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t py-4"
          >
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 p-3 rounded-lg text-sm font-medium text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
                >
                  <ApperIcon name={link.icon} size={16} />
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </div>
    </header>
  )
}

export default Header