# MARDET Language Tutoring System

**Enterprise tutoring management system for Defense Language Institute**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Classification: UNCLASSIFIED](https://img.shields.io/badge/Classification-UNCLASSIFIED-green.svg)](#security--compliance)
[![Platform: Microsoft 365](https://img.shields.io/badge/Platform-Microsoft%20365-blue.svg)](#technology-stack)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Documentation](#documentation)
- [Quick Start](#quick-start)
- [Deployment Guide](#deployment-guide)
- [Security & Compliance](#security--compliance)
- [For Other DoD Units](#for-other-dod-units)
- [Training & Support](#training--support)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Overview

The MARDET Language Tutoring System is a comprehensive tutoring management platform designed for the Marine Corps Detachment at the Defense Language Institute Foreign Language Center (DLIFLC). It manages scheduling, session tracking, and analytics for 400+ Marines learning critical foreign languages.

### The Problem

Military language students at DLIFLC needed a modern system to:
- Schedule tutoring sessions without conflicts
- Track academic progress across multiple metrics
- Reduce administrative overhead for tutoring staff
- Provide leadership visibility into program effectiveness

### The Solution

A fully integrated Microsoft Power Platform solution that:
- Automates appointment scheduling with intelligent conflict detection
- Sends automated confirmations, reminders, and notifications
- Provides real-time dashboards for operational and executive insights
- Requires **zero additional licensing costs** (uses existing M365 Government licenses)

### Key Benefits

| Metric | Impact |
|--------|--------|
| Admin Time Saved | ~520 hours/year |
| No-Show Reduction | ~20% improvement |
| Session Documentation | 95%+ completion rate |
| Implementation Cost | $0 (existing licenses) |

---

## Features

### Core Capabilities

- **Smart Scheduling** - Book appointments with automatic conflict detection for students and tutors
- **Recurring Sessions** - Set up weekly recurring appointments with a single booking
- **Automated Notifications** - Confirmation emails, 24-hour reminders, and status updates
- **Session Documentation** - Structured note-taking for tutors with progress tracking
- **Analytics Dashboards** - Executive, operational, and student progress views
- **Mobile Responsive** - Full functionality on phones, tablets, and desktops

### User Roles

| Role | Capabilities |
|------|-------------|
| **Student** | Book sessions, view schedule, track progress |
| **Tutor** | Manage availability, write session notes, view student progress |
| **Admin** | Full system access, reporting, user management |
| **Leadership** | Executive dashboards and program metrics |

### Languages Supported

The system supports all DLIFLC language programs including:
- Arabic (Modern Standard, Egyptian, Iraqi, Levantine)
- Chinese (Mandarin)
- Korean
- Russian
- Persian (Farsi)
- And more...

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     PUBLIC INTERNET                              │
│  ┌─────────────┐                                                │
│  │ GitHub Pages│◄── React Public Site (Information Only)        │
│  └─────────────┘                                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              DoD MICROSOFT 365 GOVERNMENT CLOUD                  │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    AZURE AD                              │   │
│  │     CAC Authentication │ Security Groups │ RBAC          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│         ┌────────────────────┼────────────────────┐             │
│         ▼                    ▼                    ▼             │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
│  │  PowerApp   │     │  SharePoint │     │  Power BI   │       │
│  │  (5 Screens)│◄───►│  (6 Lists)  │◄───►│(3 Dashboards│       │
│  └─────────────┘     └─────────────┘     └─────────────┘       │
│         │                    │                                   │
│         ▼                    ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              POWER AUTOMATE (5 Workflows)                │   │
│  │  Confirmations │ Reminders │ No-Show │ Status │ Digest   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│                      ┌─────────────┐                            │
│                      │   Outlook   │                            │
│                      │   (Email)   │                            │
│                      └─────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Public Site | React 18 + Vite + Tailwind | Information portal |
| Data Storage | SharePoint Online | Lists and document storage |
| Application | Power Apps Canvas | Main user interface |
| Automation | Power Automate | Workflows and notifications |
| Analytics | Power BI | Dashboards and reporting |
| Authentication | Azure AD + CAC | Identity and access |
| Email | Exchange Online | Notifications |

### Data Model

Six SharePoint lists store all system data:

1. **Tutors** (14 columns) - Tutor profiles, languages, availability
2. **Students** (16 columns) - Student info, program, academic data
3. **Appointments** (18 columns) - Scheduling with conflict detection
4. **SessionNotes** (13 columns) - Session documentation
5. **ProgressTracking** (13 columns) - Academic progress snapshots
6. **Resources** (12 columns) - Learning resources library

---

## Documentation

This repository contains comprehensive documentation organized into 7 segments:

### [Segment 1: Public Site](docs/01-public-site/)
React-based public information portal with language program details and booking links.

| File | Description |
|------|-------------|
| [README.md](docs/01-public-site/README.md) | Setup and deployment guide |
| [SETUP.md](docs/01-public-site/SETUP.md) | Detailed deployment instructions |
| `src/` | React source code |

**Build Time:** 2-3 hours

### [Segment 2: SharePoint Data Model](docs/02-sharepoint/)
Complete data model with 6 SharePoint lists and PowerShell deployment script.

| File | Description |
|------|-------------|
| [README.md](docs/02-sharepoint/README.md) | Quick reference |
| [SHAREPOINT_LISTS_SCHEMA.md](docs/02-sharepoint/SHAREPOINT_LISTS_SCHEMA.md) | Complete schema definitions |
| [MANUAL_LIST_CREATION.md](docs/02-sharepoint/MANUAL_LIST_CREATION.md) | GUI-based setup guide |
| [DATA_MODEL_REFERENCE.md](docs/02-sharepoint/DATA_MODEL_REFERENCE.md) | ER diagrams and validation |

**Build Time:** 30 min (script) or 2 hours (manual)

### [Segment 3: PowerApp](docs/03-powerapp/)
5-screen Power Apps canvas application with 50+ PowerFx formulas.

| File | Description |
|------|-------------|
| [README.md](docs/03-powerapp/README.md) | Implementation guide |
| [POWERAPP_DESIGN.md](docs/03-powerapp/POWERAPP_DESIGN.md) | Screen layouts and wireframes |
| [FORMULAS_REFERENCE.md](docs/03-powerapp/FORMULAS_REFERENCE.md) | All PowerFx formulas |
| [CONFIGURATION_DEPLOYMENT.md](docs/03-powerapp/CONFIGURATION_DEPLOYMENT.md) | Setup guide |

**Build Time:** 10-15 hours

### [Segment 4: Power Automate](docs/04-automate/)
5 automated workflows with professional HTML email templates.

| File | Description |
|------|-------------|
| [README.md](docs/04-automate/README.md) | Overview |
| [POWER_AUTOMATE_WORKFLOWS.md](docs/04-automate/POWER_AUTOMATE_WORKFLOWS.md) | Complete workflow designs |
| [CONFIGURATION_GUIDE.md](docs/04-automate/CONFIGURATION_GUIDE.md) | Setup instructions |

**Build Time:** 4-5 hours

### [Segment 5: Power BI](docs/05-powerbi/)
3 analytics dashboards with 100+ DAX formulas.

| File | Description |
|------|-------------|
| [README.md](docs/05-powerbi/README.md) | Implementation guide |
| [POWERBI_DASHBOARDS.md](docs/05-powerbi/POWERBI_DASHBOARDS.md) | Dashboard designs |
| [DAX_REFERENCE.md](docs/05-powerbi/DAX_REFERENCE.md) | All DAX formulas |

**Build Time:** 8-9 hours

### [Segment 6: Cybersecurity Approval](docs/06-approval/)
Complete ATO package for DoD cybersecurity approval.

| File | Description |
|------|-------------|
| [README.md](docs/06-approval/README.md) | Approval process guide |
| [CYBERSECURITY_PACKAGE.md](docs/06-approval/CYBERSECURITY_PACKAGE.md) | Main ATO document |
| [HELPDESK_TICKET_TEMPLATE.md](docs/06-approval/HELPDESK_TICKET_TEMPLATE.md) | ServiceNow ticket template |
| [APPENDICES.md](docs/06-approval/APPENDICES.md) | Diagrams and checklists |

**Timeline:** 21-30 days for approval

### [Segment 7: User Training](docs/07-training/)
Complete training program for students, tutors, and administrators.

| File | Description |
|------|-------------|
| [README.md](docs/07-training/README.md) | Training implementation plan |
| [STUDENT_QUICK_START.md](docs/07-training/STUDENT_QUICK_START.md) | Student user guide |
| [TUTOR_HANDBOOK.md](docs/07-training/TUTOR_HANDBOOK.md) | Comprehensive tutor guide |
| [FAQ.md](docs/07-training/FAQ.md) | 80+ frequently asked questions |

---

## Quick Start

### Prerequisites

- Microsoft 365 Government (GCC/GCC-High) tenant
- SharePoint Online site
- Power Apps license (seeded with M365 is sufficient)
- Power Automate license (seeded with M365 is sufficient)
- Power BI Pro or Premium (for dashboard sharing)
- Administrative access to create SharePoint lists

### Installation Overview

```
Week 0   ──► Submit cybersecurity approval (Segment 6)
              │
Week 1-3 ──► Build while awaiting approval
              ├── Deploy SharePoint lists (Segment 2)
              ├── Build PowerApp (Segment 3)
              ├── Configure workflows (Segment 4)
              └── Create dashboards (Segment 5)
              │
Week 4   ──► Receive ATO, deploy public site (Segment 1)
              │
Week 5   ──► Pilot testing (5-10 users)
              │
Week 6   ──► Tutor training (Segment 7)
              │
Week 7-8 ──► Student training
              │
Week 9   ──► Go-live
```

### First Steps

1. **Clone this repository**
   ```bash
   git clone https://github.com/jeranaias/mardetpomtutorapp.git
   cd mardetpomtutorapp
   ```

2. **Review the documentation**
   - Start with [Segment 6](docs/06-approval/) to understand approval requirements
   - Review [Segment 2](docs/02-sharepoint/) for data model understanding

3. **Submit cybersecurity approval**
   - Use the templates in [docs/06-approval/](docs/06-approval/)
   - Typical approval: 21-30 days

4. **Begin building**
   - Follow segment guides in order (1-5)
   - Each segment includes detailed build instructions

---

## Deployment Guide

### Phase 1: Preparation

1. **Security Approval** - Submit ATO package from Segment 6
2. **Create Service Account** - `pa.svc.[unit].tutoring@dliflc.edu`
3. **Create SharePoint Site** - Dedicated site for the application
4. **Create Azure AD Groups**:
   - `SG-Tutoring-Students`
   - `SG-Tutoring-Tutors`
   - `SG-Tutoring-Admins`

### Phase 2: Build (While Awaiting Approval)

| Step | Segment | Time |
|------|---------|------|
| 1 | Create SharePoint lists | 30 min - 2 hours |
| 2 | Build PowerApp screens | 10-15 hours |
| 3 | Configure workflows | 4-5 hours |
| 4 | Create Power BI dashboards | 8-9 hours |

### Phase 3: Deployment

1. **Receive ATO** - Get formal approval from cybersecurity
2. **Deploy Public Site** - GitHub Pages (free) or internal hosting
3. **Connect Components** - Link PowerApp to SharePoint, configure workflows
4. **Test End-to-End** - Complete user journey testing

### Phase 4: Training & Go-Live

1. **Pilot Test** - 5-10 users for 1 week
2. **Train Tutors** - 2 sessions, 30 tutors
3. **Train Students** - By company, 400 students
4. **Go-Live** - Full production deployment

---

## Security & Compliance

### Classification

**UNCLASSIFIED** - This system processes no classified information.

### Compliance Framework

| Standard | Status | Notes |
|----------|--------|-------|
| DoD 8500.01 | 95% Compliant | Cyber Security |
| FISMA Low | 100% Compliant | Federal Information Security |
| Privacy Act | 100% Compliant | PII Protection |
| NIST 800-53 | Aligned | Security Controls |

### Security Controls

- **Authentication**: CAC-enabled Azure AD
- **Authorization**: Role-based access control (RBAC)
- **Encryption**: TLS 1.2+ in transit, AES-256 at rest
- **Audit Logging**: Full activity logging via M365
- **Data Location**: US-only data centers (GCC)

### Data Handled

| Data Type | Classification | Protection |
|-----------|---------------|------------|
| Names | PII (Routine) | Access controls |
| Emails | PII (Routine) | Access controls |
| Academic records | Educational | FERPA-aligned |
| Appointment data | Unclassified | Standard |

### Risk Assessment

**Overall Risk Level: LOW**

- No classified data processing
- No external data connections
- Microsoft-managed infrastructure
- Inherits M365 GCC FedRAMP authorization

---

## For Other DoD Units

This system was designed to be easily adaptable for other military units. Here's how to customize it for your organization:

### Customization Points

1. **Branding**
   - Update colors in `tailwind.config.js`
   - Replace logos in `public/` folder
   - Modify unit name in all documents

2. **Language Programs**
   - Edit `src/data/languages.json` for your programs
   - Adjust dashboard metrics accordingly

3. **Organizational Structure**
   - Update Azure AD group names
   - Modify approval workflow recipients
   - Adjust role definitions as needed

4. **Contact Information**
   - Replace `@dliflc.edu` with your domain
   - Update phone numbers
   - Modify office locations

### Service Account Setup

```
Recommended naming convention:
pa.svc.[unit].[app]@[domain].mil

Example:
pa.svc.mardet.tutoring@dliflc.edu
```

### Minimum Requirements

- Microsoft 365 Government (GCC or GCC-High)
- SharePoint Online
- Power Platform (seeded licenses sufficient)
- Power BI for reporting

### Licensing

This project uses the MIT License - you are free to:
- Use this system for any purpose
- Modify it for your needs
- Distribute it within your organization
- Share improvements back to the community

---

## Training & Support

### Training Materials

Complete training materials are provided in [Segment 7](docs/07-training/):

- **Student Quick Start Guide** - 15-minute onboarding
- **Tutor Handbook** - Comprehensive tutor training
- **FAQ** - 80+ common questions answered
- **Training Plan** - Implementation timeline

### Support Tiers

| Tier | Method | Resolution |
|------|--------|------------|
| 1 | Self-service (FAQ, guides) | 80% |
| 2 | Email support | 15% |
| 3 | In-person office hours | 4% |
| 4 | IT escalation | 1% |

### Common Issues

See [FAQ.md](docs/07-training/FAQ.md) for solutions to common issues including:
- Login problems
- Booking conflicts
- Notification issues
- Mobile access

---

## Contributing

We welcome contributions from other DoD units and the broader community!

### How to Contribute

1. **Fork** this repository
2. **Create** a feature branch (`git checkout -b feature/improvement`)
3. **Commit** your changes (`git commit -am 'Add new feature'`)
4. **Push** to the branch (`git push origin feature/improvement`)
5. **Create** a Pull Request

### Contribution Guidelines

- Follow existing code style and documentation format
- Test all changes before submitting
- Update documentation for any new features
- Ensure no sensitive information is included

### Reporting Issues

- Use GitHub Issues for bug reports
- Include steps to reproduce
- Specify your environment (browser, device, etc.)
- Check existing issues before creating new ones

### Feature Requests

- Open a GitHub Issue with the "enhancement" label
- Describe the use case and expected benefit
- Consider if the feature benefits other organizations

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 U.S. Marine Corps / Defense Language Institute

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Security Disclaimer

This repository contains documentation and code templates. It does **NOT** contain:
- Classified information
- Personally identifiable information (PII)
- Credentials or secrets
- Operational security data

All sensitive information has been redacted or replaced with placeholders.

---

## Acknowledgments

### Organizations

- **U.S. Marine Corps** - Marine Corps Detachment, DLIFLC
- **Defense Language Institute Foreign Language Center** - Host institution
- **DCSIT** - Information technology support

### Mission

This project supports the Marine Corps mission of developing linguistically and culturally capable Marines who can operate effectively in joint, interagency, and multinational environments.

### Special Thanks

To all the tutors and language instructors who dedicate themselves to preparing Marines for their vital language missions worldwide.

---

**Semper Fidelis**

---

## Project Statistics

| Metric | Value |
|--------|-------|
| Documentation | 300+ pages |
| Major Documents | 28 |
| Technical Build Time | 25-35 hours |
| Deployment Timeline | 8-10 weeks |
| User Capacity | 440 users |
| Annual Appointments | 20,000-30,000 |
| Cost Savings | ~520 admin hours/year |

---

**Document Version:** 1.0
**Last Updated:** December 2025
**Classification:** UNCLASSIFIED
