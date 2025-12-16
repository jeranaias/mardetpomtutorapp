import { Link } from 'react-router-dom'
import { languages, categories } from '../data/languages'
import { useStats, formatLastUpdated } from '../hooks/useStats'
import LanguageCard from '../components/LanguageCard'

export default function Home() {
  const { stats, loading } = useStats()

  // Use stats from JSON if available, otherwise fall back to calculated values
  const totalTutors = stats?.summary?.totalTutors ?? languages.reduce((sum, lang) => sum + lang.tutorCount, 0)
  const totalStudents = stats?.summary?.totalStudents ?? 400
  const totalLanguages = stats?.summary?.totalLanguages ?? languages.length

  // Merge tutor counts from stats into languages for display
  const languagesWithStats = languages.map(lang => ({
    ...lang,
    tutorCount: stats?.tutorsByLanguage?.[lang.code] ?? lang.tutorCount,
    studentCount: stats?.studentsByLanguage?.[lang.code] ?? 0
  }))

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-marine-900 mb-4">
          Marine Corps Language Tutoring
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Comprehensive language resources and tutoring support for Marines at the
          Defense Language Institute Foreign Language Center
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/book" className="btn-primary">
            Book a Tutoring Session
          </Link>
          <a href="#languages" className="btn-secondary">
            Browse Languages
          </a>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="card text-center">
          <div className={`text-3xl md:text-4xl font-bold text-dli-navy mb-2 ${loading ? 'animate-pulse' : ''}`}>
            {totalLanguages}
          </div>
          <div className="text-sm md:text-base text-gray-600">Languages Supported</div>
        </div>
        <div className="card text-center">
          <div className={`text-3xl md:text-4xl font-bold text-dli-navy mb-2 ${loading ? 'animate-pulse' : ''}`}>
            {totalTutors}
          </div>
          <div className="text-sm md:text-base text-gray-600">Active Tutors</div>
        </div>
        <div className="card text-center">
          <div className={`text-3xl md:text-4xl font-bold text-dli-navy mb-2 ${loading ? 'animate-pulse' : ''}`}>
            ~{totalStudents}
          </div>
          <div className="text-sm md:text-base text-gray-600">Students Served</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl md:text-4xl font-bold text-dli-navy mb-2">24/7</div>
          <div className="text-sm md:text-base text-gray-600">Resource Access</div>
        </div>
      </section>

      {/* Last Updated Notice */}
      {stats?.lastUpdated && (
        <div className="text-center text-sm text-gray-500">
          Stats last updated: {formatLastUpdated(stats.lastUpdated)}
        </div>
      )}

      {/* Languages by Category */}
      <section id="languages" className="space-y-8">
        <h2 className="text-3xl font-bold text-center text-marine-900">
          Supported Languages
        </h2>

        {Object.entries(categories).map(([category, languageCodes]) => (
          <div key={category}>
            <h3 className="text-2xl font-semibold text-marine-800 mb-4">
              {category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {languagesWithStats
                .filter(lang => languageCodes.includes(lang.code))
                .map(lang => (
                  <LanguageCard key={lang.code} language={lang} />
                ))
              }
            </div>
          </div>
        ))}
      </section>

      {/* Weekly Activity - only show if we have real data */}
      {stats?.weeklyStats && stats.weeklyStats.completedSessions > 0 && (
        <section className="card bg-green-50 border border-green-200">
          <h2 className="text-xl font-bold text-marine-900 mb-4">This Week's Activity</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-700">{stats.weeklyStats.completedSessions}</div>
              <div className="text-sm text-gray-600">Sessions Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-700">{stats.weeklyStats.newBookings}</div>
              <div className="text-sm text-gray-600">New Bookings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-700">{stats.weeklyStats.cancelledSessions}</div>
              <div className="text-sm text-gray-600">Cancellations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-700">{stats.weeklyStats.noShows}</div>
              <div className="text-sm text-gray-600">No-Shows</div>
            </div>
          </div>
        </section>
      )}

      {/* Quick Links Section */}
      <section className="bg-marine-800 text-white rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-3 text-dli-gold">For Students</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="/book" className="hover:text-dli-gold transition-colors">
                  Schedule Tutoring Session
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-dli-gold transition-colors">
                  Browse Study Materials
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="hover:text-dli-gold transition-colors">
                  View Tutor Schedule
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3 text-dli-gold">For Tutors</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="/book" className="hover:text-dli-gold transition-colors">
                  Manage Availability
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="hover:text-dli-gold transition-colors">
                  View Schedule
                </Link>
              </li>
              <li>
                <Link to="/book" className="hover:text-dli-gold transition-colors">
                  Submit Session Notes
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3 text-dli-gold">For Staff</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="/book" className="hover:text-dli-gold transition-colors">
                  View Analytics Dashboard
                </Link>
              </li>
              <li>
                <Link to="/book" className="hover:text-dli-gold transition-colors">
                  Manage Tutors
                </Link>
              </li>
              <li>
                <Link to="/book" className="hover:text-dli-gold transition-colors">
                  Generate Reports
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
