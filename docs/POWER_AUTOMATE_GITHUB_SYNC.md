# Power Automate → GitHub Stats Sync

This document explains how to set up a Power Automate flow that automatically updates the public site's statistics from SharePoint data.

## Overview

```
SharePoint Lists → Power Automate (Daily) → GitHub API → stats.json → Site Rebuild
```

## Prerequisites

1. SharePoint lists deployed (Segment 2)
2. GitHub Personal Access Token with `repo` scope
3. Power Automate Premium license (for HTTP connector) OR use standard connectors

## stats.json Structure

The flow updates `public/stats.json` with this structure:

```json
{
  "lastUpdated": "2025-12-15T06:00:00Z",
  "summary": {
    "totalStudents": 400,
    "totalTutors": 41,
    "totalLanguages": 9,
    "appointmentsThisMonth": 245,
    "appointmentsThisWeek": 58
  },
  "tutorsByLanguage": {
    "ara": 8,
    "rus": 6,
    "cmn": 7,
    "kor": 5,
    "fas": 4,
    "spa": 3,
    "fra": 2,
    "ind": 2,
    "jpn": 4
  },
  "studentsByLanguage": {
    "ara": 89,
    "rus": 52,
    "cmn": 78,
    "kor": 65,
    "fas": 34,
    "spa": 28,
    "fra": 18,
    "ind": 12,
    "jpn": 24
  },
  "weeklyStats": {
    "completedSessions": 52,
    "cancelledSessions": 4,
    "noShows": 2,
    "newBookings": 61
  }
}
```

## Flow Design

### Trigger
- **Recurrence**: Daily at 0600

### Actions

#### 1. Get Tutor Counts by Language
```
Action: SharePoint - Get items
Site: [Your SharePoint Site]
List: Tutors
Filter Query: Status eq 'Active'
```

Then use **Select** and **Group By** to count tutors per language.

#### 2. Get Student Counts by Language
```
Action: SharePoint - Get items
Site: [Your SharePoint Site]
List: Students
Filter Query: Status eq 'Active'
```

#### 3. Get Weekly Appointment Stats
```
Action: SharePoint - Get items
Site: [Your SharePoint Site]
List: Appointments
Filter Query: StartTime ge '@{addDays(utcNow(), -7)}'
```

Count by status:
- `Status eq 'Completed'` → completedSessions
- `Status eq 'Cancelled'` → cancelledSessions
- `Status eq 'No-Show'` → noShows
- `Status eq 'Scheduled'` → newBookings

#### 4. Compose JSON
```
Action: Compose
Inputs: {
  "lastUpdated": "@{utcNow()}",
  "summary": {
    "totalStudents": @{length(studentItems)},
    "totalTutors": @{length(tutorItems)},
    ...
  },
  ...
}
```

#### 5. Update GitHub File

**Option A: HTTP Connector (Premium)**
```
Action: HTTP
Method: PUT
URI: https://api.github.com/repos/jeranaias/mardetpomtutorapp/contents/public/stats.json
Headers:
  Authorization: Bearer [YOUR_GITHUB_TOKEN]
  Accept: application/vnd.github.v3+json
Body: {
  "message": "Update stats - @{utcNow()}",
  "content": "@{base64(outputs('Compose_JSON'))}",
  "sha": "@{outputs('Get_Current_File')?['sha']}"
}
```

**Option B: GitHub Connector (Standard)**
If you have the GitHub connector available:
```
Action: GitHub - Create or update file contents
Repository: jeranaias/mardetpomtutorapp
Path: public/stats.json
Content: @{outputs('Compose_JSON')}
Commit message: Update stats - @{formatDateTime(utcNow(), 'yyyy-MM-dd')}
```

### Getting the Current File SHA

Before updating, you need the current file's SHA:
```
Action: HTTP
Method: GET
URI: https://api.github.com/repos/jeranaias/mardetpomtutorapp/contents/public/stats.json
Headers:
  Authorization: Bearer [YOUR_GITHUB_TOKEN]
```

## GitHub Personal Access Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. Store in Power Automate as a secure variable or Azure Key Vault

## Alternative: GitHub Actions Workflow

Instead of Power Automate pushing to GitHub, you can:

1. Power Automate writes stats to a SharePoint list called `PublicStats`
2. GitHub Actions workflow runs daily
3. Workflow fetches from SharePoint API and commits

This avoids needing the HTTP premium connector.

## Testing

1. Run the flow manually first
2. Check GitHub for the commit
3. Wait ~2 minutes for GitHub Pages to rebuild
4. Verify stats appear on the public site

## Error Handling

Add these to your flow:
- **Configure run after**: Continue on failure for non-critical steps
- **Try-Catch pattern**: Use Scope actions with run-after-failure
- **Notifications**: Send email on flow failure

## Security Notes

- GitHub token should have minimal permissions (just `repo`)
- Consider using Azure Key Vault for token storage
- Stats contain no PII - just aggregate counts
- Flow runs under service account, not personal account

## Monitoring

- Check flow run history weekly
- Set up alerts for consecutive failures
- Verify stats.json updates are appearing on the site

---

**Document Version:** 1.0
**Last Updated:** December 2025
