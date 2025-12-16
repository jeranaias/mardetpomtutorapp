# Segment 1: Public Site

React website hosted on GitHub Pages. Provides public information about the tutoring program.

---

## What This Segment Creates

- Public-facing website at `https://[username].github.io/[repo-name]/`
- Information about available languages and tutors
- Schedule and contact information
- Dynamic stats (updated via Power Automate)

---

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - SPA routing
- **gh-pages** - Deployment

---

## Build Steps

### 1. Initialize Project

```bash
npm create vite@latest . -- --template react
npm install
npm install -D tailwindcss postcss autoprefixer
npm install react-router-dom
npm install -D gh-pages
npx tailwindcss init -p
```

### 2. Configure Tailwind

Edit `tailwind.config.js`:
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 3. Configure Vite for GitHub Pages

Edit `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/YOUR-REPO-NAME/',
})
```

### 4. Add Deploy Script

In `package.json`, add:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### 5. Create Pages

Create these files in `src/pages/`:
- `Home.jsx` - Landing page with stats
- `LanguagePage.jsx` - Individual language details
- `Resources.jsx` - Study resources
- `Schedule.jsx` - Operating hours
- `BookAppointment.jsx` - How to book info

### 6. Create Components

Create in `src/components/`:
- `Navigation.jsx` - Header with nav links
- `LanguageCard.jsx` - Card for each language

### 7. Set Up Routing

In `src/App.jsx`:
```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import LanguagePage from './pages/LanguagePage'
// ... other imports

function App() {
  return (
    <BrowserRouter basename="/YOUR-REPO-NAME">
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/language/:langCode" element={<LanguagePage />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/book" element={<BookAppointment />} />
      </Routes>
    </BrowserRouter>
  )
}
```

### 8. Handle SPA Routing on GitHub Pages

Create `public/404.html`:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Redirecting...</title>
  <script>
    // Redirect to index with path preserved
    var path = window.location.pathname;
    var repo = '/YOUR-REPO-NAME';
    if (path.startsWith(repo)) {
      sessionStorage.setItem('redirect', path);
    }
    window.location.replace(repo + '/');
  </script>
</head>
<body>
  Redirecting...
</body>
</html>
```

In `src/main.jsx`, add redirect handling:
```javascript
// Handle GitHub Pages SPA redirect
const redirect = sessionStorage.getItem('redirect');
if (redirect) {
  sessionStorage.removeItem('redirect');
  const path = redirect.replace('/YOUR-REPO-NAME', '');
  if (path && path !== '/') {
    window.history.replaceState(null, '', '/YOUR-REPO-NAME' + path);
  }
}
```

### 9. Dynamic Stats (Optional)

Create `public/stats.json` for Power Automate to update:
```json
{
  "lastUpdated": "2025-01-01T00:00:00Z",
  "summary": {
    "totalStudents": 0,
    "totalTutors": 0,
    "activeAppointments": 0
  }
}
```

Create `src/hooks/useStats.js` to fetch it:
```javascript
import { useState, useEffect } from 'react'

export function useStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'stats.json')
      .then(res => res.json())
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return { stats, loading }
}
```

### 10. Deploy

```bash
npm run deploy
```

Enable GitHub Pages in repo settings → Source: `gh-pages` branch.

---

## File Structure

```
src/
├── main.jsx           # Entry point with redirect handling
├── App.jsx            # Router setup
├── index.css          # Tailwind imports + custom styles
├── components/
│   ├── Navigation.jsx
│   └── LanguageCard.jsx
├── pages/
│   ├── Home.jsx
│   ├── LanguagePage.jsx
│   ├── Resources.jsx
│   ├── Schedule.jsx
│   └── BookAppointment.jsx
├── hooks/
│   └── useStats.js
└── data/
    └── languages.js   # Static language data
public/
├── stats.json         # Dynamic stats (updated by Power Automate)
├── 404.html           # SPA routing fix
└── favicon.svg
```

---

## Customization

### Colors
Edit `src/index.css` to change the color scheme:
```css
:root {
  --color-primary: #003366;    /* Navy */
  --color-secondary: #0070C0;  /* Blue */
  --color-accent: #00B050;     /* Green */
}
```

### Languages
Edit `src/data/languages.js` to add/remove languages:
```javascript
export const languages = [
  { code: 'ara', name: 'Arabic', tutors: 8, flag: '🇸🇦' },
  // Add more...
]
```

### Content
Edit individual page files to update text, hours, contact info.

---

## Troubleshooting

**White screen on GitHub Pages:**
- Check `vite.config.js` has correct `base` path
- Verify 404.html exists with correct repo name
- Check browser console for errors

**Routes not working:**
- Ensure `BrowserRouter` has `basename` prop
- Check 404.html redirect script

**Stats not loading:**
- Check stats.json exists in public/
- Verify fetch URL includes base path

---

## Related Files in Main Repo

- `/src/` - All React source code
- `/public/` - Static assets
- `/package.json` - Dependencies and scripts
- `/vite.config.js` - Build configuration

