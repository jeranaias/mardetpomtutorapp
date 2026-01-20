# Tutor Chief Landing Page Design Guide

## Role: MARDET_TutorChiefs (~7 users)

### User Profile
- Senior leadership (MSgt, MGySgt, or senior civilians)
- Oversee tutors and students for their language(s)
- Need operational visibility and approval authority
- Desktop-primary, may need quick mobile access for approvals

---

## Landing Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│  MARDET Language Tutoring              [Chief] [User] [Out] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Tutor Chief Dashboard                                      │
│  MSgt Williams | Arabic Section                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────┐│
│  │ TODAY       │ │ THIS WEEK   │ │ PENDING     │ │ ALERTS ││
│  │             │ │             │ │ APPROVALS   │ │        ││
│  │    12       │ │    68       │ │     3       │ │   2    ││
│  │  Sessions   │ │  Sessions   │ │  Requests   │ │ Issues ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └────────┘│
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  PENDING APPROVALS                            [!] 3  │   │
│  │                                                      │   │
│  │  ☐ Extended Session - LCpl Wilson (Arabic)          │   │
│  │    Requested by: SSgt Smith | 90 min session        │   │
│  │    [Approve] [Deny] [View Details]                  │   │
│  │                                                      │   │
│  │  ☐ Off-Hours Request - PFC Martinez (Arabic)        │   │
│  │    Requested by: GySgt Jones | Saturday 0900        │   │
│  │    [Approve] [Deny] [View Details]                  │   │
│  │                                                      │   │
│  │  ☐ New Tutor Registration - SSgt Brown              │   │
│  │    Languages: Arabic, Farsi                          │   │
│  │    [Approve] [Deny] [View Details]                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────────────────┐ ┌────────────────────────┐   │
│  │  TUTOR WORKLOAD          │ │  ATTENTION NEEDED      │   │
│  │                          │ │                        │   │
│  │  SSgt Smith    18/20 hrs │ │  ⚠ 2 No-shows today   │   │
│  │  ████████████████░░ 90%  │ │  ⚠ 3 Notes pending    │   │
│  │                          │ │  ⚠ 1 Student inactive │   │
│  │  GySgt Jones   12/20 hrs │ │                        │   │
│  │  ████████████░░░░░░ 60%  │ │  [View All Alerts]     │   │
│  │                          │ │                        │   │
│  │  SSgt Lee       8/20 hrs │ └────────────────────────┘   │
│  │  ████████░░░░░░░░░░ 40%  │                              │
│  │                          │                              │
│  │  [View All Tutors]       │                              │
│  └──────────────────────────┘                              │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  DAILY OPERATIONS - Jan 14, 2025                     │   │
│  │                                                      │   │
│  │  Time    Tutor         Student        Status        │   │
│  │  ──────────────────────────────────────────────────  │   │
│  │  0900    SSgt Smith    LCpl Wilson    ✓ Completed   │   │
│  │  0900    GySgt Jones   PFC Adams      ✓ Completed   │   │
│  │  1030    SSgt Smith    PFC Martinez   ◷ In Progress │   │
│  │  1030    SSgt Lee      Cpl Brown      ✓ Completed   │   │
│  │  1300    GySgt Jones   LCpl Davis     ○ Scheduled   │   │
│  │  1300    SSgt Smith    Cpl Thompson   ○ Scheduled   │   │
│  │                                                      │   │
│  │  [View Full Schedule] [Export Report]                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ [Dashboard] [Approvals] [Tutors] [Students] [Reports] [⚙] │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Components

### 1. Header Section
**Elements:**
- App logo/name
- Role badge ("Chief")
- User name
- Logout

**Power Fx:**
```
// Verify user is in TutorChiefs group
Set(varIsTutorChief,
    !IsBlank(LookUp(Tutors,
        Email = User().Email &&
        // Additional chief flag or role check
        Status = "Active"
    ))
)

// For group-based check (if using Azure AD groups)
// This would be handled by app sharing - only MARDET_TutorChiefs can access
```

### 2. KPI Summary Cards
**Elements:**
- Today's sessions count
- This week's sessions count
- Pending approvals (with alert if > 0)
- Issues/alerts count

**Power Fx:**
```
// Today's sessions (for chief's language section)
Set(varTodaySessions,
    CountRows(
        Filter(Appointments,
            DateValue(AppointmentDate) = Today() &&
            Status <> "Cancelled"
            // Add language filter if chief is language-specific
        )
    )
)

// Pending approvals
Set(varPendingApprovals,
    CountRows(
        Filter(ApprovalRequests,
            Status = "Pending" &&
            ApproverEmail = User().Email
        )
    )
)

// Alerts count
Set(varAlerts,
    CountRows(Filter(Appointments, Status = "NoShow" && DateValue(AppointmentDate) = Today())) +
    CountRows(varPendingNotes) +
    CountRows(varInactiveStudents)
)
```

### 3. Pending Approvals Panel
**Elements:**
- List of requests awaiting approval
- Request type, requester, brief description
- Approve/Deny buttons
- Link to details

**Power Fx:**
```
// Approval requests for this chief
Filter(ApprovalRequests,
    Status = "Pending" &&
    ApproverEmail = User().Email
)

// Approve button OnSelect
Patch(ApprovalRequests,
    ThisItem,
    {
        Status: "Approved",
        ApproverResponse: "Approve",
        ResponseDate: Now()
    }
);
Notify("Request approved", NotificationType.Success);

// Deny button OnSelect
Set(varSelectedRequest, ThisItem);
Set(varShowDenyDialog, true);
// Dialog collects denial reason, then:
Patch(ApprovalRequests,
    varSelectedRequest,
    {
        Status: "Denied",
        ApproverResponse: "Deny",
        ApproverComments: varDenialReason,
        ResponseDate: Now()
    }
);
```

### 4. Tutor Workload Panel
**Elements:**
- List of tutors in section
- Hours worked / max hours
- Visual progress bar
- Warning if over 90% or under 30%

**Power Fx:**
```
// Get tutors (filter by language if section-specific)
AddColumns(
    Filter(Tutors, Status = "Active"),
    "WeeklyHours",
        Sum(
            Filter(Appointments,
                TutorID.Id = ID &&
                Status = "Completed" &&
                AppointmentDate >= DateAdd(Today(), -Weekday(Today())+1, TimeUnit.Days) &&
                AppointmentDate <= Today()
            ),
            Duration
        ) / 60
)

// Progress bar width
(ThisItem.WeeklyHours / ThisItem.MaxHoursPerWeek) * ProgressBarMaxWidth

// Color based on utilization
If(ThisItem.WeeklyHours / ThisItem.MaxHoursPerWeek > 0.9,
    ColorValue("#FFC107"),  // Warning yellow - overloaded
    If(ThisItem.WeeklyHours / ThisItem.MaxHoursPerWeek < 0.3,
        ColorValue("#17A2B8"),  // Info blue - underutilized
        ColorValue("#28A745")   // Green - healthy
    )
)
```

### 5. Attention Needed Panel
**Elements:**
- No-shows today
- Pending session notes
- Inactive students (no session in 3+ weeks)
- Link to detailed alert view

**Power Fx:**
```
// No-shows today
CountRows(
    Filter(Appointments,
        Status = "NoShow" &&
        DateValue(AppointmentDate) = Today()
    )
)

// Pending notes (completed sessions without notes)
CountRows(
    Filter(Appointments,
        Status = "Completed" &&
        AppointmentDate >= DateAdd(Today(), -7, TimeUnit.Days) &&
        IsBlank(LookUp(SessionNotes, AppointmentID.Id = ID))
    )
)

// Inactive students (active status but no recent sessions)
CountRows(
    Filter(Students,
        Status = "Active" &&
        IsBlank(
            LookUp(Appointments,
                StudentID.Id = ID &&
                AppointmentDate >= DateAdd(Today(), -21, TimeUnit.Days)
            )
        )
    )
)
```

### 6. Daily Operations Table
**Elements:**
- All sessions for today
- Time, tutor, student, status
- Quick status update capability
- Export to Excel option

**Power Fx:**
```
// Today's full schedule
Sort(
    Filter(Appointments,
        DateValue(AppointmentDate) = Today()
    ),
    AppointmentDate,
    SortOrder.Ascending
)

// Status icons
Switch(ThisItem.Status,
    "Completed", "✓",
    "Scheduled", "○",
    "NoShow", "✗",
    "Cancelled", "—",
    "◷"  // In progress (current time within session window)
)
```

### 7. Bottom Navigation
**Elements:**
- Dashboard (current)
- Approvals (approval queue)
- Tutors (tutor management)
- Students (student roster)
- Reports (Power BI embed)
- Settings (admin functions)

---

## Approval Workflows

### Extended Session Approval
```
Request Type: Extended Session
Approver: NCOIC (Tutor Chief)
Auto-approve if: Duration <= 90 minutes
Require approval if: Duration > 90 minutes

On Approve:
- Update appointment duration
- Notify tutor and student
- Log approval

On Deny:
- Notify requester with reason
- Log denial
```

### Off-Hours Request
```
Request Type: Off-Hours
Approver Chain: NCOIC → OIC (if weekend/holiday)
Fields: Requested date/time, justification

On Approve (NCOIC):
- If weekday evening: Complete
- If weekend/holiday: Forward to OIC

On Approve (OIC):
- Create appointment
- Notify all parties
```

### Registration Approval
```
Request Type: Student/Tutor Registration
Approver: NCOIC
Fields: User info from MS Form

On Approve:
- Create record in Students/Tutors list
- Add user to appropriate M365 group
- Send welcome email
```

---

## Data Access (Security)

Tutor Chiefs can see:
- All appointments (or filtered by their language section)
- All tutors (or their section)
- All students (or their section)
- All session notes
- All progress records
- Approval requests assigned to them

**Access Pattern:**
```
// If chiefs are section-specific (e.g., Arabic Chief)
Set(varChiefLanguages, varCurrentTutor.Languages)

// Filter all data by those languages
Filter(Students, Language in varChiefLanguages)
Filter(Tutors, /* has overlap with */ varChiefLanguages)
Filter(Appointments, /* student language in */ varChiefLanguages)
```

---

## Quick Actions

### Reassign Appointment
```
// If tutor is unavailable, reassign to another
Set(varShowReassignDialog, true);
Set(varSelectedAppointment, ThisItem);
// Dialog shows available tutors
// On select:
Patch(Appointments, varSelectedAppointment, {TutorID: varNewTutor});
// Notify both tutors and student
```

### Add Tutor to Schedule
```
// Quick action to create appointment
Navigate(QuickBookScreen, ScreenTransition.Cover,
    {
        PreselectedTutor: ThisItem,
        PreselectedDate: Today()
    }
)
```

### Export Daily Report
```
// Generate CSV/Excel of today's operations
// Use Power Automate flow triggered by button
```

---

## Color Scheme

| Element | Color | Hex |
|---------|-------|-----|
| Header | Marine Corps Scarlet | #CC0000 |
| Chief Badge | Gold | #FFD700 |
| Approval Pending | Orange | #FFC107 |
| Alert/Warning | Red | #DC3545 |
| Success/Approved | Green | #28A745 |
| Info | Blue | #17A2B8 |
| Utilization High | Yellow | #FFC107 |
| Utilization Low | Light Blue | #17A2B8 |
| Utilization Normal | Green | #28A745 |

---

## Reports Quick Access

Embed or link to Power BI dashboards:
- **Operations Dashboard**: Today's metrics, week trends
- **Tutor Performance**: Utilization, session quality
- **Student Progress**: DLPT trends, at-risk students

---

## Testing Checklist

- [ ] KPI cards show accurate counts
- [ ] Pending approvals list is correct
- [ ] Approve/Deny workflow functions
- [ ] Tutor workload calculations accurate
- [ ] Alerts show correct issues
- [ ] Daily schedule displays all sessions
- [ ] Can reassign appointments
- [ ] Reports link/embed works
- [ ] Navigation functions correctly
- [ ] Only chiefs can access this screen
