import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import LanguagePage from './pages/LanguagePage'
import Resources from './pages/Resources'
import Schedule from './pages/Schedule'
import BookAppointment from './pages/BookAppointment'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/language/:languageCode" element={<LanguagePage />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/book" element={<BookAppointment />} />
        </Routes>
      </main>
      <footer className="bg-marine-900 text-white mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            Marine Corps Detachment - Defense Language Institute Foreign Language Center
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Monterey, California | {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
