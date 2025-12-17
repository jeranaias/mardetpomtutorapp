# DLI Marine Corps Language Tutoring System

## Project Overview

A hybrid tutoring management system for the Marine Corps Detachment at the Defense Language Institute Foreign Language Center (DLIFLC). This system separates public educational resources from sensitive operational data to maximize security, usability, and compliance.

## System Architecture

### Two-Component Design

**1. Public Component: "DLI Language Resources Hub"**
- **Technology**: React + GitHub Pages
- **Purpose**: Educational resources, study materials, schedules
- **Data**: Zero PII, publicly accessible
- **Hosting**: GitHub Pages (free, fast CDN)
- **Security**: None required - all content is non-sensitive

**2. Private Component: "Tutoring Operations Manager"**
- **Technology**: PowerApp Canvas + SharePoint Lists + Power Automate
- **Purpose**: Appointment scheduling, session notes, progress tracking
- **Data**: PII-protected in SharePoint with MFA/SSO authentication (dliflc.edu)
- **Security**: DLIFLC M365 tenant, follows DLI PowerApp policy
- **Integration**: Links to public resources, PowerBI dashboards

## Supported Languages

- Arabic (MSA)
- Russian
- Chinese (Mandarin)
- Korean
- Farsi (Persian)
- Spanish
- French
- Indonesian
- Japanese
- *(Additional languages per DLI catalog)*

## User Roles

1. **Students (~400 users)**: Book appointments, view resources, track progress
2. **Tutors**: Manage availability, document sessions, access student notes
3. **Tutor Chiefs**: Oversee tutor operations, view analytics
4. **Staff/Admin**: Full system access, configuration, reporting

## Key Features

### Public Site
- Language-specific resource libraries
- Study guides and practice materials
- Static schedules and office hours
- Search functionality
- Mobile-responsive design
- Direct links to appointment booking

### Private PowerApp
- Calendar-based appointment scheduling
- Conflict detection and recurring appointments
- Session documentation and notes
- Student progress tracking (grades, assessments)
- Tutor workload management
- Automated email notifications
- PowerBI analytics integration

## Compliance

**DLIFLC PowerApp Policy Compliant:**
- Naming Convention: `MARDET - Language Tutoring System`
- Service Account: `pa.svc.mardet.tutoring`
- Canvas App (Seeded licensing only)
- Cybersecurity approval via helpdesk ticket
- All PII secured in SharePoint with proper permissions

## Technology Stack

### Public Site
- **Frontend**: React 18+
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Search**: Fuse.js (client-side)
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions

### Private System
- **App Platform**: Microsoft PowerApps (Canvas)
- **Database**: SharePoint Lists
- **Automation**: Power Automate
- **Analytics**: PowerBI
- **Authentication**: DLI M365 SSO/MFA (dliflc.edu)

## Repository Structure

```
dli-language-resources/           # Public site repository
├── public/
│   ├── resources/                # Language-specific materials
│   │   ├── arabic/
│   │   ├── russian/
│   │   ├── chinese/
│   │   └── ...
│   └── assets/
├── src/
│   ├── components/
│   │   ├── LanguageCard.jsx
│   │   ├── ResourceLibrary.jsx
│   │   ├── SearchBar.jsx
│   │   └── Navigation.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── LanguagePage.jsx
│   │   ├── Resources.jsx
│   │   └── Schedule.jsx
│   ├── data/
│   │   └── languages.json
│   ├── App.jsx
│   └── main.jsx
├── docs/
│   ├── DEPLOYMENT.md
│   ├── CONTRIBUTING.md
│   └── MAINTENANCE.md
└── package.json
```

## Development Timeline

### Phase 1: Public Site (Weeks 1-2)
- React app scaffolding
- Language resource structure
- Core components and routing
- Initial content migration
- GitHub Pages deployment

### Phase 2: SharePoint Setup (Weeks 2-3)
- Create SharePoint Lists (data model)
- Configure permissions and security
- Generate test data
- Build PowerBI dashboard connections

### Phase 3: PowerApp Development (Weeks 3-5)
- Canvas app screen design
- SharePoint data connections
- Scheduling logic with conflict detection
- Power Automate workflows
- Solution Checker validation

### Phase 4: Testing & Deployment (Weeks 5-6)
- User acceptance testing
- Cybersecurity review and approval
- Service account setup with DCSIT
- Production deployment
- User training and documentation

## Security Considerations

### Public Site
- No authentication required
- No PII stored or transmitted
- Static content only
- HTTPS via GitHub Pages
- No backend API or database

### Private PowerApp
- Azure AD SSO with MFA required (dliflc.edu accounts)
- All PII in SharePoint (DoD-approved)
- Role-based permissions (Students/Tutors/Admin)
- Service account for automation (not personal accounts)
- Audit logging via SharePoint
- Regular security reviews per DLI policy

## Analytics & Reporting

PowerBI dashboards connected to SharePoint Lists provide:
- Tutor utilization rates
- Student appointment frequency
- No-show/cancellation rates
- Session duration analysis
- Language-specific demand patterns
- Tutor workload distribution
- Progress tracking trends

## Maintenance & Handoff

**Responsibility**: E-9 Detachment leadership
**Continuity**: Billet assignment for technical maintenance
**Documentation**: Comprehensive guides for:
- Adding new resources to public site
- Modifying PowerApp screens/logic
- Creating new Power Automate workflows
- PowerBI dashboard updates
- Service account management

## Contact & Support

**Project Lead**: [System Developer] (through contract end ~2026)
**Detachment**: Marine Corps Detachment, DLIFLC
**Location**: Monterey, California

---

## Quick Start (Development)

### Public Site Setup
```bash
# Clone the repo
git clone https://github.com/[your-org]/dli-language-resources.git
cd dli-language-resources

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### PowerApp Setup
1. Navigate to https://make.powerapps.com
2. Import PowerApp package (provided in `/powerapp/` directory)
3. Connect to SharePoint Lists
4. Configure Power Automate workflows
5. Test with Solution Checker
6. Submit for Cybersecurity approval

---

**Last Updated**: December 2025
**Version**: 1.0.0
**Status**: Development
