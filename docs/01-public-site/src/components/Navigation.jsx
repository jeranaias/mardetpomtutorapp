import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-marine-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="text-dli-gold font-bold text-2xl">
              USMC DLI
            </div>
            <div className="hidden md:block border-l border-gray-600 pl-3">
              <div className="text-sm font-semibold">Language Tutoring</div>
              <div className="text-xs text-gray-400">Resource Hub</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <Link 
              to="/" 
              className="hover:text-dli-gold transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/resources" 
              className="hover:text-dli-gold transition-colors"
            >
              Resources
            </Link>
            <Link 
              to="/schedule" 
              className="hover:text-dli-gold transition-colors"
            >
              Schedule
            </Link>
            <a 
              href="https://make.powerapps.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-dli-gold text-marine-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
            >
              Book Appointment
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="hover:text-dli-gold transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/resources" 
                className="hover:text-dli-gold transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Resources
              </Link>
              <Link 
                to="/schedule" 
                className="hover:text-dli-gold transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Schedule
              </Link>
              <a 
                href="https://make.powerapps.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-dli-gold text-marine-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors text-center"
              >
                Book Appointment
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
