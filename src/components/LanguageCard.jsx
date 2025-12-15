import { Link } from 'react-router-dom'

export default function LanguageCard({ language }) {
  return (
    <Link
      to={`/language/${language.code}`}
      className="card hover:scale-105 transition-transform cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-4xl mb-2">{language.flag}</div>
          <h3 className="text-xl font-bold text-marine-900">
            {language.name}
          </h3>
          <p className="text-sm text-gray-600">{language.nativeName}</p>
        </div>
        <span className={`
          px-3 py-1 rounded-full text-xs font-semibold
          ${language.difficulty === 'Category I' ? 'bg-green-100 text-green-800' : ''}
          ${language.difficulty === 'Category III' ? 'bg-yellow-100 text-yellow-800' : ''}
          ${language.difficulty === 'Category IV' ? 'bg-red-100 text-red-800' : ''}
        `}>
          {language.difficulty}
        </span>
      </div>

      <p className="text-sm text-gray-700 mb-4">
        {language.description}
      </p>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2 text-gray-600">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <span>{language.tutorCount} tutors</span>
        </div>

        <div className="text-dli-navy font-semibold">
          View Resources →
        </div>
      </div>
    </Link>
  )
}
