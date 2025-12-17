import { Link } from 'react-router-dom'
import { languages } from '../data/languages'

export default function BookAppointment() {
  // PowerApp URL - update this when deployed
  const powerAppUrl = 'https://apps.powerapps.com/play/e/default-YOUR-TENANT-ID/a/YOUR-APP-ID'

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-marine-900 mb-4">Book Tutoring Session</h1>
        <p className="text-xl text-gray-600">
          Schedule your language tutoring appointment
        </p>
      </div>

      {/* Main Booking Card */}
      <div className="card border-2 border-dli-gold">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📅</div>
          <h2 className="text-2xl font-bold text-marine-900 mb-4">
            MARDET Tutoring Scheduler
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Access the full scheduling system to book, manage, and track your tutoring sessions.
          </p>

          {/* Launch PowerApp Button */}
          <a
            href={powerAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-dli-gold text-marine-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-colors shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open Scheduling App
          </a>

          <p className="text-sm text-gray-500 mt-4">
            Requires DLI network access and dliflc.edu login with MFA
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="text-3xl mb-3">📋</div>
          <h3 className="text-lg font-bold text-marine-900 mb-2">Book Sessions</h3>
          <p className="text-gray-600 text-sm">
            Schedule tutoring appointments with conflict detection and recurring session support.
          </p>
        </div>
        <div className="card">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="text-lg font-bold text-marine-900 mb-2">Track Progress</h3>
          <p className="text-gray-600 text-sm">
            Monitor your learning progress, view session history, and track DLPT readiness.
          </p>
        </div>
        <div className="card">
          <div className="text-3xl mb-3">🔔</div>
          <h3 className="text-lg font-bold text-marine-900 mb-2">Get Reminders</h3>
          <p className="text-gray-600 text-sm">
            Receive automatic email confirmations and 24-hour reminders for your sessions.
          </p>
        </div>
        <div className="card">
          <div className="text-3xl mb-3">📝</div>
          <h3 className="text-lg font-bold text-marine-900 mb-2">View Notes</h3>
          <p className="text-gray-600 text-sm">
            Access session notes and tutor feedback to reinforce your learning.
          </p>
        </div>
      </div>

      {/* Available Languages */}
      <div className="card">
        <h2 className="text-xl font-bold text-marine-900 mb-4">Available Languages</h2>
        <div className="flex flex-wrap gap-3">
          {languages.map(lang => (
            <div
              key={lang.code}
              className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg"
            >
              <span>{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
              <span className="text-xs text-gray-500">({lang.tutorCount} tutors)</span>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="card bg-marine-50">
        <h2 className="text-xl font-bold text-marine-900 mb-6">How to Book</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-10 h-10 bg-dli-gold text-marine-900 rounded-full flex items-center justify-center font-bold mx-auto mb-3">1</div>
            <div className="font-semibold text-marine-800">Login</div>
            <div className="text-sm text-gray-600">Sign in with your dliflc.edu account</div>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-dli-gold text-marine-900 rounded-full flex items-center justify-center font-bold mx-auto mb-3">2</div>
            <div className="font-semibold text-marine-800">Select</div>
            <div className="text-sm text-gray-600">Choose language and tutor</div>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-dli-gold text-marine-900 rounded-full flex items-center justify-center font-bold mx-auto mb-3">3</div>
            <div className="font-semibold text-marine-800">Schedule</div>
            <div className="text-sm text-gray-600">Pick date and time slot</div>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-dli-gold text-marine-900 rounded-full flex items-center justify-center font-bold mx-auto mb-3">4</div>
            <div className="font-semibold text-marine-800">Confirm</div>
            <div className="text-sm text-gray-600">Receive email confirmation</div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="text-center text-gray-600">
        <p className="mb-2">Having trouble accessing the booking system?</p>
        <p className="text-sm">
          Contact the Tutoring Center or submit a{' '}
          <a
            href="https://dliflc.service-now.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dli-navy hover:underline"
          >
            helpdesk ticket
          </a>
        </p>
      </div>

      {/* Back Link */}
      <div className="text-center">
        <Link to="/" className="text-dli-navy hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
