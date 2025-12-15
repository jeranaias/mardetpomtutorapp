import { useParams, Link } from 'react-router-dom'
import { languages, difficultyLevels } from '../data/languages'

export default function LanguagePage() {
  const { languageCode } = useParams()
  const language = languages.find(l => l.code === languageCode)

  if (!language) {
    return (
      <div className="text-center py-16">
        <h1 className="text-3xl font-bold text-marine-900 mb-4">Language Not Found</h1>
        <p className="text-gray-600 mb-8">The requested language could not be found.</p>
        <Link to="/" className="btn-primary">Return Home</Link>
      </div>
    )
  }

  const difficulty = difficultyLevels[language.difficulty]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start gap-6">
        <div className="text-6xl">{language.flag}</div>
        <div>
          <h1 className="text-4xl font-bold text-marine-900">{language.name}</h1>
          <p className="text-2xl text-gray-600">{language.nativeName}</p>
          <div className="flex items-center gap-4 mt-3">
            <span className={`
              px-4 py-1 rounded-full text-sm font-semibold
              ${language.difficulty === 'Category I' ? 'bg-green-100 text-green-800' : ''}
              ${language.difficulty === 'Category III' ? 'bg-yellow-100 text-yellow-800' : ''}
              ${language.difficulty === 'Category IV' ? 'bg-red-100 text-red-800' : ''}
            `}>
              {language.difficulty}
            </span>
            <span className="text-gray-500">{language.category}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="card">
        <h2 className="text-xl font-semibold text-marine-900 mb-3">About This Program</h2>
        <p className="text-gray-700">{language.description}</p>
      </div>

      {/* Program Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-dli-navy mb-2">{difficulty?.weeks}</div>
          <div className="text-gray-600">Weeks of Training</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-dli-navy mb-2">{difficulty?.hours}</div>
          <div className="text-gray-600">Total Hours</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-dli-navy mb-2">{language.tutorCount}</div>
          <div className="text-gray-600">Available Tutors</div>
        </div>
      </div>

      {/* Difficulty Info */}
      <div className="card bg-marine-50">
        <h2 className="text-xl font-semibold text-marine-900 mb-3">Difficulty Level</h2>
        <p className="text-gray-700">
          <strong>{language.difficulty}:</strong> {difficulty?.description}
        </p>
      </div>

      {/* Available Resources */}
      <div className="card">
        <h2 className="text-xl font-semibold text-marine-900 mb-4">Available Resources</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(language.resources).map(([type, available]) => (
            <div
              key={type}
              className={`text-center p-4 rounded-lg ${
                available ? 'bg-green-50 text-green-800' : 'bg-gray-100 text-gray-400'
              }`}
            >
              <div className="text-2xl mb-2">
                {type === 'vocab' && '📚'}
                {type === 'grammar' && '📝'}
                {type === 'listening' && '🎧'}
                {type === 'reading' && '📖'}
                {type === 'speaking' && '🗣️'}
              </div>
              <div className="text-sm font-semibold capitalize">{type}</div>
              <div className="text-xs mt-1">
                {available ? 'Available' : 'Coming Soon'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/book" className="btn-primary text-center">
          Book Tutoring Session
        </Link>
        <Link to="/resources" className="btn-secondary text-center">
          Browse All Resources
        </Link>
      </div>

      {/* Back Link */}
      <div className="text-center">
        <Link to="/" className="text-dli-navy hover:underline">
          ← Back to All Languages
        </Link>
      </div>
    </div>
  )
}
