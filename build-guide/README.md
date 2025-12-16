# MARDET Tutoring System - Build Guide

Complete walkthrough for building the MARDET Language Tutoring System from scratch. Follow segments in order.

---

## Overview

This system was built for the Marine Corps Detachment at DLIFLC to manage language tutoring services. It consists of 7 segments that work together:

| Segment | What It Is | Build Time |
|---------|------------|------------|
| 1. Public Site | React website on GitHub Pages | 1-2 hours |
| 2. SharePoint Lists | Backend data storage (6 lists) | 15 min |
| 3. PowerApp | Main application for tutors/students | 2-3 hours |
| 4. Power Automate | Automated workflows (reminders, sync) | 1-2 hours |
| 5. Power BI | Analytics dashboard | 1-2 hours |
| 6. Approval System | Chain-of-command approvals | 1 hour |
| 7. Training | Documentation and guides | 1 hour |

**Total estimated build time:** 8-12 hours

---

## Prerequisites

Before starting, ensure you have:

- [ ] GitHub account with repository access
- [ ] SharePoint Online site with Owner permissions
- [ ] Power Platform access (PowerApps, Power Automate, Power BI)
- [ ] Node.js installed (for Segment 1)
- [ ] Admin willing to approve Power Platform connections

---

## Build Order

**Must follow this order due to dependencies:**

```
Segment 1 (Public Site)     ─┐
                             ├──> Can be done in parallel
Segment 2 (SharePoint Lists) ─┘
         │
         ▼
Segment 3 (PowerApp) ──────────> Requires Segment 2
         │
         ▼
Segment 4 (Power Automate) ────> Requires Segments 2 & 3
         │
         ▼
Segment 5 (Power BI) ──────────> Requires Segment 2
         │
         ▼
Segment 6 (Approval System) ───> Requires Segments 3 & 4
         │
         ▼
Segment 7 (Training) ──────────> Do last, documents everything
```

---

## Segment Folders

Each folder contains everything needed to build that segment:

### [Segment 1: Public Site](./segment-1-public-site/)
React website hosted on GitHub Pages. Public-facing info about the tutoring program.

### [Segment 2: SharePoint Lists](./segment-2-sharepoint-lists/)
CSV files to import into SharePoint. Creates the 6 backend lists.

### [Segment 3: PowerApp](./segment-3-powerapp/)
Complete build guide with all screens and Power Fx formulas.

### [Segment 4: Power Automate](./segment-4-power-automate/)
Automated workflows for reminders, notifications, and data sync.

### [Segment 5: Power BI](./segment-5-power-bi/)
Analytics dashboard connecting to SharePoint lists.

### [Segment 6: Approval System](./segment-6-approval-system/)
Approval workflows for special requests.

### [Segment 7: Training](./segment-7-training/)
User guides and admin documentation.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USERS                                    │
├──────────────────┬──────────────────┬───────────────────────────┤
│   Public Web     │    PowerApp      │      Power BI             │
│   (GitHub Pages) │   (Tutors/       │    (Leadership)           │
│                  │    Students)     │                           │
└────────┬─────────┴────────┬─────────┴─────────────┬─────────────┘
         │                  │                       │
         ▼                  ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SHAREPOINT LISTS                              │
│  ┌─────────┐ ┌──────────┐ ┌──────────────┐ ┌──────────────────┐ │
│  │ Tutors  │ │ Students │ │ Appointments │ │ SessionNotes     │ │
│  └─────────┘ └──────────┘ └──────────────┘ └──────────────────┘ │
│  ┌─────────────────┐ ┌───────────┐                              │
│  │ ProgressTracking│ │ Resources │                              │
│  └─────────────────┘ └───────────┘                              │
└─────────────────────────────────────────────────────────────────┘
         ▲                  │
         │                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    POWER AUTOMATE                                │
│  • Appointment reminders        • Stats sync to GitHub          │
│  • Session completion alerts    • Approval routing              │
│  • Weekly digest emails         • No-show notifications         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Quick Start

1. Clone this repo
2. Go to `build-guide/segment-1-public-site/` and follow the README
3. Go to `build-guide/segment-2-sharepoint-lists/` and import CSVs
4. Continue through each segment in order

---

## Customization

This system was built for MARDET at DLIFLC but can be adapted:

- **Languages:** Edit the language lists in CSVs and PowerApp dropdowns
- **Ranks:** Modify rank choices in SharePoint list settings
- **Branding:** Update colors in `src/index.css` and PowerApp theme
- **Company structure:** Adjust Company/Platoon/Squad fields as needed

---

## Support

If you get stuck:
1. Check the troubleshooting section in each segment's README
2. Review Microsoft's Power Platform documentation
3. Contact the original developer

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| Dec 2024 | 1.0 | Initial build |

