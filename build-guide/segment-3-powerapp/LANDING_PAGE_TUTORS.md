# Tutor Landing Page Design Guide

## Role: MARDET_Tutors (~30 users)

### User Profile
- Senior NCOs (SSgt - MGySgt) or Civilians
- Teach one or more of 9 languages
- Need to manage their schedule and document sessions
- Desktop-primary (usually in office)

---

## Landing Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│  MARDET Language Tutoring                    [User] [Logout]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Good morning, SSgt Smith!                                  │
│  Languages: Arabic, Farsi | Status: Active                  │
│  This week: 12/20 hours scheduled                           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  TODAY'S SCHEDULE - Tuesday, Jan 14                  │   │
│  │                                                      │   │
│  │  0900  LCpl Wilson    Arabic    Grammar    [Notes]  │   │
│  │  1030  PFC Martinez   Arabic    Vocab      [Notes]  │   │
│  │  1300  Cpl Thompson   Farsi     DLPT Prep  [Notes]  │   │
│  │  1500  LCpl Davis     Arabic    Listening  [Notes]  │   │
│  │                                                      │   │
│  │  [View Full Calendar]                                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │  PENDING NOTES      │  │   QUICK STATS       │          │
│  │                     │  │                     │          │
│  │  3 sessions need    │  │  This Week:         │          │
│  │  documentation      │  │  Sessions: 15       │          │
│  │                     │  │  Students: 8        │          │
│  │  - Yesterday 1400   │  │  Hours: 12.5        │          │
│  │  - Yesterday 1530   │  │                     │          │
│  │  - Monday 0900      │  │  This Month:        │          │
│  │                     │  │  Sessions: 42       │          │
│  │  [Complete Notes]   │  │  No-shows: 2        │          │
│  └─────────────────────┘  └─────────────────────┘          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  MY STUDENTS (Active)                                │   │
│  │                                                      │   │
│  │  Name           Language  Class       Last Session  │   │
│  │  ─────────────────────────────────────────────────  │   │
│  │  LCpl Wilson    Arabic    ARA-001     2 days ago    │   │
│  │  PFC Martinez   Arabic    ARA-002     Today         │   │
│  │  Cpl Thompson   Farsi     FAR-001     1 week ago    │   │
│  │  LCpl Davis     Arabic    ARA-001     3 days ago    │   │
│  │                                                      │   │
│  │  [View All Students]                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  [Home]  [Calendar]  [Students]  [Session Notes]  [Help]   │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Components

### 1. Header Section
**Elements:**
- App logo/name
- User display name and role indicator
- Logout button

**Power Fx:**
```
// Get current tutor info
Set(varCurrentTutor,
    LookUp(Tutors, Email = User().Email)
)

// Verify tutor exists
If(IsBlank(varCurrentTutor),
    Navigate(UnauthorizedScreen, ScreenTransition.None)
)
```

### 2. Welcome Banner with Stats
**Elements:**
- Personalized greeting with rank
- Languages taught
- Weekly hours progress bar

**Power Fx:**
```
// Greeting based on time
Switch(
    true,
    Hour(Now()) < 12, "Good morning, ",
    Hour(Now()) < 17, "Good afternoon, ",
    "Good evening, "
) & varCurrentTutor.Rank & " " &
    Last(Split(varCurrentTutor.FullName, " ")).Value & "!"

// Weekly hours calculation
Set(varWeeklyHours,
    Sum(
        Filter(Appointments,
            TutorID.Id = varCurrentTutor.ID &&
            Status = "Completed" &&
            AppointmentDate >= DateAdd(Today(), -Weekday(Today())+1, TimeUnit.Days) &&
            AppointmentDate <= Today()
        ),
        Duration
    ) / 60
)

// Progress bar value
varWeeklyHours / varCurrentTutor.MaxHoursPerWeek
```

### 3. Today's Schedule
**Elements:**
- List of today's appointments
- Time, student name, language, focus area
- Quick "Add Notes" button for completed sessions
- Color coding by status

**Power Fx:**
```
// Today's appointments
Sort(
    Filter(Appointments,
        TutorID.Id = varCurrentTutor.ID &&
        DateValue(AppointmentDate) = Today()
    ),
    AppointmentDate,
    SortOrder.Ascending
)

// Status color
Switch(ThisItem.Status,
    "Scheduled", ColorValue("#007BFF"),  // Blue
    "Completed", ColorValue("#28A745"),  // Green
    "NoShow", ColorValue("#DC3545"),     // Red
    "Cancelled", ColorValue("#6C757D")   // Gray
)

// Show "Add Notes" only for completed without notes
Visible = ThisItem.Status = "Completed" &&
    IsBlank(LookUp(SessionNotes, AppointmentID.Id = ThisItem.ID))
```

### 4. Pending Notes Alert
**Elements:**
- Count of sessions needing documentation
- List of sessions without notes
- Quick link to add notes

**Power Fx:**
```
// Sessions needing notes (completed but no SessionNotes record)
Set(varPendingNotes,
    Filter(Appointments,
        TutorID.Id = varCurrentTutor.ID &&
        Status = "Completed" &&
        IsBlank(LookUp(SessionNotes, AppointmentID.Id = ID))
    )
)

// Count
CountRows(varPendingNotes)

// Alert visibility
Visible = CountRows(varPendingNotes) > 0
```

### 5. Quick Stats Card
**Elements:**
- This week: sessions, unique students, hours
- This month: total sessions, no-show count
- Visual indicators

**Power Fx:**
```
// This week sessions
CountRows(
    Filter(Appointments,
        TutorID.Id = varCurrentTutor.ID &&
        Status in ["Completed", "Scheduled"] &&
        AppointmentDate >= DateAdd(Today(), -Weekday(Today())+1, TimeUnit.Days)
    )
)

// Unique students this week
CountRows(
    Distinct(
        Filter(Appointments,
            TutorID.Id = varCurrentTutor.ID &&
            AppointmentDate >= DateAdd(Today(), -Weekday(Today())+1, TimeUnit.Days)
        ),
        StudentID.Id
    )
)

// Monthly no-shows
CountRows(
    Filter(Appointments,
        TutorID.Id = varCurrentTutor.ID &&
        Status = "NoShow" &&
        Month(AppointmentDate) = Month(Today()) &&
        Year(AppointmentDate) = Year(Today())
    )
)
```

### 6. My Students Gallery
**Elements:**
- Students who have had appointments with this tutor
- Language, class, days since last session
- Warning indicator if student hasn't had session in 2+ weeks

**Power Fx:**
```
// Get unique students for this tutor
AddColumns(
    Distinct(
        Filter(Appointments,
            TutorID.Id = varCurrentTutor.ID
        ),
        StudentID.Id
    ),
    "StudentRecord", LookUp(Students, ID = StudentID.Id),
    "LastSession",
        Max(
            Filter(Appointments,
                TutorID.Id = varCurrentTutor.ID &&
                StudentID.Id = StudentID.Id &&
                Status = "Completed"
            ),
            AppointmentDate
        )
)

// Days since last session
DateDiff(ThisItem.LastSession, Today(), TimeUnit.Days)

// Warning icon visible if > 14 days
Visible = DateDiff(ThisItem.LastSession, Today(), TimeUnit.Days) > 14
```

### 7. Bottom Navigation
**Elements:**
- Home (current screen)
- Calendar (full schedule view)
- Students (student list with details)
- Session Notes (documentation area)
- Help (FAQ/contact)

---

## Data Filters (Security)

Tutors should ONLY see:
- Their own appointments
- Students assigned to them (via appointments)
- Their own session notes
- All resources (for recommendation)

**Row-Level Security Filter:**
```
// Appointments - only assigned to this tutor
TutorID.Id = varCurrentTutor.ID

// Students - only those with appointments with this tutor
StudentID.Id in
    Distinct(
        Filter(Appointments, TutorID.Id = varCurrentTutor.ID),
        StudentID.Id
    )
```

---

## Quick Actions

### Mark Session Complete
```
// From today's schedule - mark as completed
UpdateIf(Appointments,
    ID = ThisItem.ID,
    {Status: "Completed"}
);
Navigate(SessionNotesScreen, ScreenTransition.Cover, {AppointmentRecord: ThisItem});
```

### Mark No-Show
```
// Mark student as no-show
UpdateIf(Appointments,
    ID = ThisItem.ID,
    {Status: "NoShow"}
);
// Trigger no-show notification flow automatically
Notify("Marked as no-show. Notification sent.", NotificationType.Warning);
```

### Quick Session Note
```
// Navigate to session notes with pre-filled appointment
Navigate(SessionNotesScreen, ScreenTransition.Cover,
    {
        AppointmentRecord: ThisItem,
        StudentRecord: LookUp(Students, ID = ThisItem.StudentID.Id)
    }
)
```

---

## Color Scheme

| Element | Color | Hex |
|---------|-------|-----|
| Header | Marine Corps Scarlet | #CC0000 |
| Primary Button | Gold | #FFD700 |
| Scheduled | Blue | #007BFF |
| Completed | Green | #28A745 |
| No-Show | Red | #DC3545 |
| Cancelled | Gray | #6C757D |
| Alert/Warning | Orange | #FFC107 |

---

## Status Workflow

```
Scheduled → [Session Time Passes]
    │
    ├── Completed → [Add Session Notes]
    │       └── Notes Saved ✓
    │
    ├── NoShow → [Auto-notification sent]
    │
    └── Cancelled → [Logged with reason]
```

---

## Notifications to Show

- **Red Badge**: Pending session notes count
- **Yellow Banner**: Student hasn't attended in 2+ weeks
- **Info Banner**: Approaching max weekly hours

---

## Testing Checklist

- [ ] Tutor sees only their appointments
- [ ] Today's schedule shows correctly
- [ ] Can mark session as Completed
- [ ] Can mark session as No-Show
- [ ] Session notes link works
- [ ] Pending notes count accurate
- [ ] Weekly hours calculation correct
- [ ] Student list shows only assigned students
- [ ] Navigation works correctly
- [ ] Logout functions properly
