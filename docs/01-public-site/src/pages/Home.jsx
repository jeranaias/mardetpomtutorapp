import { languages, categories } from '../data/languages.json'
import LanguageCard from '../components/LanguageCard'

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-5xl font-bold text-marine-900 mb-4">
          Marine Corps Language Tutoring
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Comprehensive language resources and tutoring support for Marines at the 
          Defense Language Institute Foreign Language Center
        </p>
        <div className="flex gap-4 justify-center">
          <a 
            href="https://make.powerapps.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Book a Tutoring Session
          </a>
          <a href="#languages" className="btn-secondary">
            Browse Languages
          </a>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="text-4xl font-bold text-dli-navy mb-2">
            {languages.length}
          </div>
          <div className="text-gray-600">Languages Supported</div>
        </div>
        <div className="card text-center">
          <div className="text-4xl font-bold text-dli-navy mb-2">
            {languages.reduce((sum, lang) => sum + lang.tutorCount, 0)}
          </div>
          <div className="text-gray-600">Active Tutors</div>
        </div>
        <div className="card text-center">
          <div className="text-4xl font-bold text-dli-navy mb-2">~400</div>
          <div className="text-gray-600">Students Served</div>
        </div>
        <div className="card text-center">
          <div className="text-4xl font-bold text-dli-navy mb-2">24/7</div>
          <div className="text-gray-600">Resource Access</div>
        </div>
      </section>

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
              {languages
                .filter(lang => languageCodes.includes(lang.code))
                .map(lang => (
                  <LanguageCard key={lang.code} language={lang} />
                ))
              }
            </div>
          </div>
        ))}
      </section>

      {/* Quick Links Section */}
      <section className="bg-marine-800 text-white rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">For Students</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="https://make.powerapps.com" className="hover:text-dli-gold">
                  Schedule Tutoring Session
                </a>
              </li>
              <li>
                <a href="/resources" className="hover:text-dli-gold">
                  Browse Study Materials
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-dli-gold">
                  Track Progress
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">For Tutors</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="https://make.powerapps.com" className="hover:text-dli-gold">
                  Manage Availability
                </a>
              </li>
              <li>
                <a href="https://make.powerapps.com" className="hover:text-dli-gold">
                  View Schedule
                </a>
              </li>
              <li>
                <a href="https://make.powerapps.com" className="hover:text-dli-gold">
                  Submit Session Notes
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">For Staff</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="https://make.powerapps.com" className="hover:text-dli-gold">
                  View Analytics Dashboard
                </a>
              </li>
              <li>
                <a href="https://make.powerapps.com" className="hover:text-dli-gold">
                  Manage Tutors
                </a>
              </li>
              <li>
                <a href="https://make.powerapps.com" className="hover:text-dli-gold">
                  Generate Reports
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
