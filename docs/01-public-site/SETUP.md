# Public Site Setup Guide

## Prerequisites

- Node.js 18+ and npm
- Git
- GitHub account with access to create repositories
- Basic familiarity with React and command line

## Initial Setup

### 1. Create GitHub Repository

```bash
# On GitHub.com, create a new private repository named:
dli-language-resources

# Enable GitHub Pages in repository settings:
# Settings → Pages → Source: GitHub Actions
```

### 2. Clone and Initialize

```bash
# Clone this documentation repo
git clone [your-repo-url]
cd dli-language-resources

# Install dependencies
npm install
```

### 3. Update Configuration

Edit `vite.config.js` and update the `base` path to match your repo name:

```javascript
export default defineConfig({
  base: '/dli-language-resources/', // Match your GitHub repo name
  // ...
})
```

Update `src/main.jsx` basename to match:

```javascript
<BrowserRouter basename="/dli-language-resources">
```

### 4. Development Server

```bash
# Start local development server
npm run dev

# Site will be available at http://localhost:3000
```

## Deploying to GitHub Pages

### Option 1: Manual Deployment

```bash
# Build and deploy
npm run deploy

# This will:
# 1. Build the production site
# 2. Push to gh-pages branch
# 3. Site will be live at: https://[org].github.io/dli-language-resources/
```

### Option 2: GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./dist
          
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v3
```

## Adding Content

### Adding Language Resources

1. Create language-specific directories in `public/resources/`:

```
public/resources/
├── arabic/
│   ├── vocab/
│   ├── grammar/
│   └── practice/
├── russian/
│   ├── vocab/
│   └── grammar/
└── ...
```

2. Add PDF, MP3, or other files to these directories
3. Update resource links in the React components

### Adding New Language

Edit `src/data/languages.json`:

```javascript
{
  code: 'xxx',
  name: 'Language Name',
  nativeName: 'Native Script',
  flag: '🇽🇽',
  category: 'Category Name',
  difficulty: 'Category I/III/IV',
  description: 'Description',
  resources: {
    vocab: true,
    grammar: true,
    listening: true,
    reading: true,
    speaking: true
  },
  tutorCount: 0
}
```

## Common Tasks

### Updating Site Content

1. Edit React components in `src/`
2. Test locally: `npm run dev`
3. Commit and push to trigger automatic deployment

### Adding Study Materials

1. Place files in `public/resources/[language]/`
2. Add links in relevant language page components
3. Deploy changes

### Customizing Styling

- Main colors: `tailwind.config.js`
- Component styles: `src/index.css`
- Inline Tailwind: Component files

## Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### GitHub Pages Not Updating

1. Check GitHub Actions tab for deployment status
2. Verify Pages settings in repository
3. Clear browser cache
4. Wait 2-3 minutes for CDN propagation

### Routing Issues (404 on refresh)

Add `404.html` to `public/` directory that redirects to `index.html` for client-side routing.

## Maintenance

### Regular Updates

```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit
npm audit fix
```

### Monitoring

- Check GitHub Actions for deployment failures
- Monitor user feedback for broken links
- Review analytics (if implemented)

## Production Checklist

- [ ] Repository name matches `base` config in `vite.config.js`
- [ ] GitHub Pages enabled in repository settings
- [ ] All placeholder URLs updated to production URLs
- [ ] PowerApp links point to production PowerApp
- [ ] Test all navigation links
- [ ] Test on mobile devices
- [ ] Verify all resource files are accessible
- [ ] Check browser console for errors
- [ ] Verify PowerApp link opens correctly

## Security Notes

- This is a **public-facing site** - no PII or sensitive data
- All authentication happens in the PowerApp (separate system)
- Resource files should be reviewed before upload
- Keep dependencies updated for security patches

## Support

For technical issues with the public site:
- Check GitHub Issues
- Contact MARDET technical lead
- Review React/Vite documentation

For PowerApp/scheduling issues:
- Contact DCSIT helpdesk
- Reference ticket for Cybersecurity approval
