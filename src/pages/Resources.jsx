import { useState } from 'react'
import { Link } from 'react-router-dom'
import { languages, categories } from '../data/languages'

export default function Resources() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredLanguages = languages.filter(lang => {
    const matchesCategory = selectedCategory === 'all' ||
      Object.entries(categories).find(([cat, codes]) =>
        cat === selectedCategory && codes.includes(lang.code)
      )
    const matchesSearch = lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.includes(searchQuery)
    return matchesCategory && matchesSearch
  })

  const resourceTypes = [
    { id: 'vocab', name: 'Vocabulary', icon: '📚', description: 'Word lists and flashcards' },
    { id: 'grammar', name: 'Grammar', icon: '📝', description: 'Grammar guides and exercises' },
    { id: 'listening', name: 'Listening', icon: '🎧', description: 'Audio materials and podcasts' },
    { id: 'reading', name: 'Reading', icon: '📖', description: 'Reading comprehension materials' },
    { id: 'speaking', name: 'Speaking', icon: '🗣️', description: 'Pronunciation and conversation' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-marine-900 mb-4">Language Resources</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Study materials, practice exercises, and learning resources for all supported languages
        </p>
      </div>

      {/* Resource Types Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {resourceTypes.map(type => (
          <div key={type.id} className="card text-center hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">{type.icon}</div>
            <div className="font-semibold text-marine-900">{type.name}</div>
            <div className="text-xs text-gray-500 mt-1">{type.description}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Languages
            </label>
            <input
              type="text"
              placeholder="Search by language name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dli-navy focus:border-dli-navy"
            />
          </div>
          <div className="md:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Region
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dli-navy focus:border-dli-navy"
            >
              <option value="all">All Regions</option>
              {Object.keys(categories).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Languages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLanguages.map(lang => (
          <Link
            key={lang.code}
            to={`/language/${lang.code}`}
            className="card hover:scale-105 transition-transform"
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">{lang.flag}</span>
              <div>
                <h3 className="text-xl font-bold text-marine-900">{lang.name}</h3>
                <p className="text-sm text-gray-600">{lang.nativeName}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {Object.entries(lang.resources).map(([type, available]) => (
                available && (
                  <span
                    key={type}
                    className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium capitalize"
                  >
                    {type}
                  </span>
                )
              ))}
            </div>

            <div className="text-dli-navy font-semibold text-sm">
              View Resources →
            </div>
          </Link>
        ))}
      </div>

      {filteredLanguages.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No languages found matching your search criteria.
        </div>
      )}

      {/* External Resources */}
      <div className="card bg-marine-50">
        <h2 className="text-2xl font-bold text-marine-900 mb-4">External Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://gloss.dliflc.edu"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="text-2xl">🌐</div>
            <div>
              <div className="font-semibold text-marine-900">GLOSS</div>
              <div className="text-sm text-gray-600">Global Language Online Support System</div>
            </div>
          </a>
          <a
            href="https://www.dliflc.edu"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="text-2xl">🏫</div>
            <div>
              <div className="font-semibold text-marine-900">DLIFLC Main Site</div>
              <div className="text-sm text-gray-600">Defense Language Institute</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
