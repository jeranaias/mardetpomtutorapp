# Student Landing Page Design Guide

## Role: MARDET_Students (~400 users)

### User Profile
- Junior Marines (Pvt - Sgt typically)
- Learning one of 9 languages at DLI
- Need to book tutoring sessions and track their own progress
- Mobile-friendly is important (may access from phone)

---

## Landing Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│  MARDET Language Tutoring                    [User] [Logout]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Welcome back, LCpl Wilson!                                 │
│  Language: Arabic | Class: ARA-001-2025                     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │  NEXT APPOINTMENT   │  │   QUICK BOOK        │          │
│  │                     │  │                     │          │
│  │  Tomorrow 1400      │  │  [Book Session]     │          │
│  │  SSgt Smith         │  │                     │          │
│  │  Grammar Review     │  │  Available tutors:  │          │
│  │                     │  │  3 today            │          │
│  │  [View Details]     │  │                     │          │
│  └─────────────────────┘  └─────────────────────┘          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  MY UPCOMING SESSIONS                                │   │
│  │                                                      │   │
│  │  Date       Time   Tutor        Focus      Status   │   │
│  │  ─────────────────────────────────────────────────  │   │
│  │  15 Jan     1400   SSgt Smith   Grammar    Scheduled│   │
│  │  17 Jan     0900   GySgt Jones  Listening  Scheduled│   │
│  │  22 Jan     1300   SSgt Smith   DLPT Prep  Scheduled│   │
│  │                                                      │   │
│  │  [View All] [Cancel Selected]                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │  MY PROGRESS        │  │   RESOURCES         │          │
│  │                     │  │                     │          │
│  │  Current Grade: B+  │  │  [Study Materials]  │          │
│  │  DLPT-L: 1+         │  │                     │          │
│  │  DLPT-R: 2          │  │  [Practice Tests]   │          │
│  │  Trend: Improving   │  │                     │          │
│  │                     │  │  [Grammar Guides]   │          │
│  │  [View Full Report] │  │                     │          │
│  └─────────────────────┘  └─────────────────────┘          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  [Home]    [Book]    [My Sessions]    [Progress]    [Help] │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Components

### 1. Header Section
**Elements:**
- App logo/name
- User display name
- Logout button

**Power Fx:**
```
// Get current user info
Set(varCurrentUser,
    LookUp(Students, Email = User().Email)
)

// Display name
varCurrentUser.FullName

// Check if user exists (validation)
If(IsBlank(varCurrentUser),
    Navigate(ErrorScreen, ScreenTransition.None),
    // Continue loading
)
```

### 2. Welcome Banner
**Elements:**
- Personalized greeting with rank and name
- Language and class assignment
- Visual indicator of status

**Power Fx:**
```
// Welcome message
"Welcome back, " & varCurrentUser.Rank & " " &
    Last(Split(varCurrentUser.FullName, " ")).Value & "!"

// Language and class
"Language: " & varCurrentUser.Language & " | Class: " & varCurrentUser.Class
```

### 3. Next Appointment Card
**Elements:**
- Date/time of next session
- Tutor name
- Focus area
- Quick link to details

**Power Fx:**
```
// Get next upcoming appointment
Set(varNextAppointment,
    First(
        Sort(
            Filter(Appointments,
                StudentID.Id = varCurrentUser.ID &&
                Status = "Scheduled" &&
                AppointmentDate >= Now()
            ),
            AppointmentDate,
            SortOrder.Ascending
        )
    )
)

// Display date
If(IsBlank(varNextAppointment),
    "No upcoming sessions",
    Text(varNextAppointment.AppointmentDate, "dddd, mmmm d") & " at " &
    Text(varNextAppointment.AppointmentDate, "hhmm")
)
```

### 4. Quick Book Button
**Elements:**
- Prominent "Book Session" button
- Count of available tutors today
- Navigate to booking screen

**Power Fx:**
```
// Count available tutors for student's language
CountRows(
    Filter(Tutors,
        varCurrentUser.Language in Languages &&
        Status = "Active"
    )
)

// Button OnSelect
Navigate(BookingScreen, ScreenTransition.Cover)
```

### 5. Upcoming Sessions Gallery
**Elements:**
- Gallery showing next 5 appointments
- Date, time, tutor, focus area, status
- Cancel button (with confirmation)

**Power Fx:**
```
// Gallery Items
Sort(
    Filter(Appointments,
        StudentID.Id = varCurrentUser.ID &&
        Status = "Scheduled" &&
        AppointmentDate >= Today()
    ),
    AppointmentDate,
    SortOrder.Ascending
)

// Cancel button OnSelect
UpdateIf(Appointments,
    ID = ThisItem.ID,
    {Status: "Cancelled", CancellationReason: "Cancelled by student"}
);
Notify("Appointment cancelled", NotificationType.Success);
Refresh(Appointments);
```

### 6. Progress Summary Card
**Elements:**
- Current grade
- Latest DLPT scores
- Trend indicator (arrow up/down/stable)
- Link to full progress report

**Power Fx:**
```
// Get latest progress record
Set(varLatestProgress,
    First(
        Sort(
            Filter(ProgressTracking,
                StudentID.Id = varCurrentUser.ID
            ),
            SnapshotDate,
            SortOrder.Descending
        )
    )
)

// Trend icon
Switch(varLatestProgress.Trends,
    "Improving", Icon.TrendingUp,
    "Declining", Icon.TrendingDown,
    Icon.Remove  // Stable
)
```

### 7. Resources Quick Links
**Elements:**
- Links to study materials filtered by student's language
- Featured resources
- Link to full resource library

**Power Fx:**
```
// Filter resources for student's language
Filter(Resources,
    Language = varCurrentUser.Language &&
    Active = true
)

// Featured resources
Filter(Resources,
    Language = varCurrentUser.Language &&
    Featured = true &&
    Active = true
)
```

### 8. Bottom Navigation
**Elements:**
- Home (current screen)
- Book (booking screen)
- My Sessions (full appointment list)
- Progress (detailed progress view)
- Help (FAQ/contact)

---

## Data Filters (Security)

Students should ONLY see:
- Their own appointments
- Their own progress records
- Tutors who teach their language
- Resources for their language

**Row-Level Security Filter:**
```
// All student data queries must include:
StudentID.Id = varCurrentUser.ID

// Or for email-based:
StudentEmail = User().Email
```

---

## Mobile Considerations

- Use responsive containers
- Stack cards vertically on narrow screens
- Bottom navigation should be thumb-friendly
- Minimum touch target: 44x44 pixels
- Font size minimum: 14pt for readability

---

## Color Scheme

| Element | Color | Hex |
|---------|-------|-----|
| Header | Marine Corps Scarlet | #CC0000 |
| Primary Button | Gold | #FFD700 |
| Success/Improving | Green | #28A745 |
| Warning/Declining | Orange | #FFC107 |
| Background | Light Gray | #F5F5F5 |
| Card Background | White | #FFFFFF |

---

## Error States

### No Appointments
```
"You have no upcoming sessions. Book one now!"
[Book Session Button]
```

### User Not Found
```
"Your account is not registered in the system.
Please contact your Tutor Chief."
```

### No Progress Data
```
"No progress data yet.
Your tutor will add notes after your first session."
```

---

## Navigation Map

```
Student Landing Page
    │
    ├── Book Session → Booking Screen
    │       └── Confirmation → Back to Landing
    │
    ├── View Details → Appointment Details Screen
    │       └── Cancel → Confirmation Modal → Landing
    │
    ├── My Sessions → Full Appointment List
    │       └── Individual Session → Details
    │
    ├── Progress → Full Progress Report
    │       └── Historical Scores Graph
    │
    └── Resources → Resource Library
            └── External Links (new tab)
```

---

## Testing Checklist

- [ ] User can see only their own data
- [ ] Next appointment displays correctly
- [ ] Booking button navigates to booking screen
- [ ] Cancel appointment works with confirmation
- [ ] Progress card shows latest data
- [ ] Resources filtered by language
- [ ] Mobile layout works on phone
- [ ] Error states display appropriately
- [ ] Logout works correctly
