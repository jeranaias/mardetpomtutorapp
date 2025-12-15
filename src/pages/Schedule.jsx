import { useState } from 'react'
import { Link } from 'react-router-dom'
import { languages } from '../data/languages'

export default function Schedule() {
  const [selectedLanguage, setSelectedLanguage] = useState('all')

  // Sample schedule data - in production this would come from the PowerApp/SharePoint
  const scheduleData = {
    tutoring: {
      weekdays: '0800 - 1600',
      location: 'Tutoring Center',
      appointment: 'Required'
    },
    officeHours: {
      days: 'Tuesday & Thursday',
      time: '1300 - 1500',
      location: 'Tutoring Center',
      appointment: 'Walk-in Welcome'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-marine-900 mb-4">Tutoring Schedule</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          View availability and schedule your tutoring sessions
        </p>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card border-l-4 border-dli-gold">
          <h2 className="text-xl font-bold text-marine-900 mb-4">Regular Tutoring Hours</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Hours:</span>
              <span className="font-semibold">{scheduleData.tutoring.weekdays}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="font-semibold">{scheduleData.tutoring.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Appointment:</span>
              <span className="font-semibold text-dli-red">{scheduleData.tutoring.appointment}</span>
            </div>
          </div>
        </div>

        <div className="card border-l-4 border-green-500">
          <h2 className="text-xl font-bold text-marine-900 mb-4">Drop-in Office Hours</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Days:</span>
              <span className="font-semibold">{scheduleData.officeHours.days}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-semibold">{scheduleData.officeHours.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Appointment:</span>
              <span className="font-semibold text-green-600">{scheduleData.officeHours.appointment}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Language Filter */}
      <div className="card">
        <h2 className="text-xl font-bold text-marine-900 mb-4">Tutors by Language</h2>
        <div className="mb-4">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dli-navy focus:border-dli-navy"
          >
            <option value="all">All Languages</option>
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tutor List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {languages
            .filter(lang => selectedLanguage === 'all' || lang.code === selectedLanguage)
            .map(lang => (
              <div key={lang.code} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <div>
                    <div className="font-semibold text-marine-900">{lang.name}</div>
                    <div className="text-sm text-gray-600">{lang.tutorCount} tutors available</div>
                  </div>
                </div>
                <Link
                  to="/book"
                  className="text-dli-navy font-semibold text-sm hover:underline"
                >
                  Book Session →
                </Link>
              </div>
            ))
          }
        </div>
      </div>

      {/* Weekly Calendar View - Placeholder */}
      <div className="card">
        <h2 className="text-xl font-bold text-marine-900 mb-4">Weekly Overview</h2>
        <div className="grid grid-cols-5 gap-2 text-center">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
            <div key={day} className="bg-marine-100 rounded-lg p-3">
              <div className="font-semibold text-marine-900 text-sm">{day}</div>
              <div className="text-xs text-gray-600 mt-1">0800-1600</div>
              <div className="mt-2 text-xs text-green-600">Available</div>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-4 text-center">
          For real-time availability, use the booking system below.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center bg-marine-800 text-white rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Ready to Book?</h2>
        <p className="text-gray-300 mb-6">
          Access the full scheduling system to book your tutoring session
        </p>
        <Link to="/book" className="btn-primary">
          Open Booking System
        </Link>
      </div>

      {/* Contact Info */}
      <div className="card bg-gray-50">
        <h2 className="text-xl font-bold text-marine-900 mb-4">Need Help?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-marine-800">Tutoring Center</h3>
            <p className="text-gray-600 text-sm">For scheduling questions and assistance</p>
          </div>
          <div>
            <h3 className="font-semibold text-marine-800">Tutor Chief</h3>
            <p className="text-gray-600 text-sm">For program inquiries and special requests</p>
          </div>
        </div>
      </div>
    </div>
  )
}
