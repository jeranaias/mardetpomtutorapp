# PowerApp Canvas Design - MARDET Tutoring System

## App Overview

**App Name**: `MARDET - Language Tutoring System`  
**Type**: Canvas App (Phone layout for mobile, Tablet for desktop)  
**Service Account**: `pa.svc.mardet.tutoring`  
**Data Sources**: 6 SharePoint Lists from Segment 2

---

## Architecture

### App Structure
```
┌─────────────────────────────────────┐
│         Navigation Menu              │
├─────────────────────────────────────┤
│  • Dashboard (Home)                  │
│  • My Schedule (Student/Tutor)       │
│  • Book Appointment (Student)        │
│  • Session Notes (Tutor)             │
│  • Progress Tracker (Student)        │
│  • Analytics (Admin/Tutor Chief)     │
│  • Settings                          │
└─────────────────────────────────────┘
```

### User Roles & Screens

| Role | Dashboard | Schedule | Book | Notes | Progress | Analytics |
|------|-----------|----------|------|-------|----------|-----------|
| Student | ✅ | ✅ My | ✅ | ❌ | ✅ My | ❌ |
| Tutor | ✅ | ✅ My | ❌ | ✅ | ✅ View | ✅ Limited |
| Tutor Chief | ✅ | ✅ All | ✅ | ✅ | ✅ All | ✅ Full |
| Admin | ✅ | ✅ All | ✅ | ✅ | ✅ All | ✅ Full |

---

## Screen Designs

### Screen 1: Dashboard (Home)

**Purpose**: Landing page with quick stats and actions

**Layout:**
```
┌─────────────────────────────────────┐
│  USMC DLI Language Tutoring          │
│  Welcome, [User Name]                │
├─────────────────────────────────────┤
│                                      │
│  Quick Stats (Tiles)                 │
│  ┌──────┐ ┌──────┐ ┌──────┐         │
│  │ Next │ │Total │ │Hours │         │
│  │Appt  │ │This  │ │This  │         │
│  │      │ │Week  │ │Month │         │
│  └──────┘ └──────┘ └──────┘         │
│                                      │
│  Upcoming Appointments (Gallery)     │
│  ┌─────────────────────────────┐    │
│  │ Tomorrow 1400 - SSgt Smith  │    │
│  │ Arabic Grammar              │    │
│  │ [View] [Cancel]             │    │
│  ├─────────────────────────────┤    │
│  │ Dec 20 0900 - GySgt Jones   │    │
│  │ Russian Vocab               │    │
│  │ [View] [Cancel]             │    │
│  └─────────────────────────────┘    │
│                                      │
│  Quick Actions (Buttons)             │
│  [Book New Appointment]              │
│  [View My Schedule]                  │
│  [Browse Resources]                  │
│                                      │
└─────────────────────────────────────┘
```

**Data Sources:**
- Appointments (filtered by current user)
- Students or Tutors (current user info)

**Key Formulas:**

```powerFx
// OnVisible - Load user data
Set(varCurrentUser, User());
Set(varUserRole, 
    If(
        User().Email in Tutors.Email, "Tutor",
        User().Email in Students.Email, "Student",
        "Guest"
    )
);

// Next Appointment Tile
Set(varNextAppt,
    First(
        SortByColumns(
            Filter(
                Appointments,
                StudentID.Email = varCurrentUser.Email || TutorID.Email = varCurrentUser.Email,
                Status = "Scheduled",
                AppointmentDate > Now()
            ),
            "AppointmentDate",
            Ascending
        )
    )
);

// Total This Week
Set(varWeeklyCount,
    CountRows(
        Filter(
            Appointments,
            StudentID.Email = varCurrentUser.Email || TutorID.Email = varCurrentUser.Email,
            Status = "Completed",
            AppointmentDate >= Today() - Weekday(Today()) + 2,
            AppointmentDate < Today() - Weekday(Today()) + 9
        )
    )
);

// Hours This Month
Set(varMonthlyHours,
    Sum(
        Filter(
            Appointments,
            StudentID.Email = varCurrentUser.Email || TutorID.Email = varCurrentUser.Email,
            Status = "Completed",
            Month(AppointmentDate) = Month(Today()),
            Year(AppointmentDate) = Year(Today())
        ),
        Duration
    ) / 60
);
```

---

### Screen 2: Book Appointment (Students Only)

**Purpose**: Student-facing appointment booking with conflict detection

**Layout:**
```
┌─────────────────────────────────────┐
│  Book Tutoring Appointment           │
├─────────────────────────────────────┤
│                                      │
│  1. Select Language                  │
│  [Dropdown: Arabic ▼]                │
│                                      │
│  2. Select Focus Area(s)             │
│  ☐ Vocab  ☐ Grammar  ☐ Listening    │
│  ☐ Reading ☐ Speaking ☐ DLPT Prep   │
│                                      │
│  3. Choose Tutor                     │
│  [Dropdown: SSgt Smith (Available) ▼]│
│  Specialties: Grammar, DLPT Prep     │
│  Available: 15 hrs this week         │
│                                      │
│  4. Select Date & Time               │
│  [Date Picker: Dec 16, 2025]         │
│  [Time: 14:00 ▼]                     │
│                                      │
│  5. Duration                         │
│  ⚪ 30 min  ⚫ 60 min                 │
│  ⚪ 90 min  ⚪ 120 min                │
│                                      │
│  6. Location                         │
│  ⚪ Tutoring Center  ⚪ Online        │
│  ⚪ Building 637     ⚪ Other         │
│                                      │
│  Meeting Link (if online):           │
│  [_____________________________]     │
│                                      │
│  Notes (optional):                   │
│  [_____________________________]     │
│  [_____________________________]     │
│                                      │
│  Recurring Appointment?              │
│  ☐ Weekly until: [Date Picker]       │
│                                      │
│  ──────────────────────────────────  │
│  Conflict Check: ✅ No conflicts     │
│  ──────────────────────────────────  │
│                                      │
│  [Cancel]              [Book Now]    │
│                                      │
└─────────────────────────────────────┘
```

**Key Formulas:**

```powerFx
// Filter tutors by selected language
Set(varAvailableTutors,
    Filter(
        Tutors,
        varSelectedLanguage in Languages,
        Status = "Active"
    )
);

// Calculate tutor availability this week
Set(varTutorHoursThisWeek,
    Sum(
        Filter(
            Appointments,
            TutorID.ID = ddlTutor.Selected.ID,
            AppointmentDate >= Today() - Weekday(Today()) + 2,
            AppointmentDate < Today() - Weekday(Today()) + 9,
            Status = "Scheduled"
        ),
        Duration
    ) / 60
);
Set(varTutorAvailable, 
    ddlTutor.Selected.MaxHoursPerWeek - varTutorHoursThisWeek
);

// Conflict detection - Check student conflicts
Set(varStudentConflict,
    !IsEmpty(
        Filter(
            Appointments,
            StudentID.Email = varCurrentUser.Email,
            Status = "Scheduled",
            AppointmentDate <= DateAdd(DateTimePicker.SelectedDate, Duration, Minutes),
            DateAdd(AppointmentDate, Duration, Minutes) >= DateTimePicker.SelectedDate
        )
    )
);

// Conflict detection - Check tutor conflicts
Set(varTutorConflict,
    !IsEmpty(
        Filter(
            Appointments,
            TutorID.ID = ddlTutor.Selected.ID,
            Status = "Scheduled",
            AppointmentDate <= DateAdd(DateTimePicker.SelectedDate, Duration, Minutes),
            DateAdd(AppointmentDate, Duration, Minutes) >= DateTimePicker.SelectedDate
        )
    )
);

// Combined conflict check
Set(varHasConflict, varStudentConflict || varTutorConflict);

// Icon display for conflict status
Icon.Icon = If(varHasConflict, Icon.Cancel, Icon.CheckBadge);
Icon.Color = If(varHasConflict, Color.Red, Color.Green);
Label.Text = If(
    varHasConflict,
    "⚠️ Conflict detected - choose different time",
    "✅ No conflicts - ready to book"
);

// Book Now button - OnSelect
If(
    !varHasConflict,
    // No conflict - create appointment
    Patch(
        Appointments,
        Defaults(Appointments),
        {
            Title: Concatenate(varCurrentStudent.FullName, " with ", ddlTutor.Selected.FullName),
            StudentID: LookUp(Students, Email = varCurrentUser.Email),
            TutorID: ddlTutor.Selected,
            AppointmentDate: DateTimePicker.SelectedDate,
            Duration: rgDuration.Selected.Value,
            Status: "Scheduled",
            Location: rgLocation.Selected.Value,
            MeetingLink: If(rgLocation.Selected.Value = "Online", txtMeetingLink.Text, ""),
            FocusArea: Concat(galFocusAreas.AllItems, If(Selected, Value & ", ", "")),
            BookingNotes: txtNotes.Text,
            CreatedByStudent: true,
            ReminderSent: false,
            RecurringPattern: If(
                chkRecurring.Value,
                JSON({
                    frequency: "weekly",
                    end: datRecurringEnd.SelectedDate
                }),
                ""
            ),
            RecurringSeriesID: If(chkRecurring.Value, GUID(), "")
        }
    );
    // Create recurring appointments if selected
    If(
        chkRecurring.Value,
        ForAll(
            Sequence(
                DateDiff(Today(), datRecurringEnd.SelectedDate, Days) / 7
            ) As Week,
            Patch(
                Appointments,
                Defaults(Appointments),
                {
                    Title: Concatenate(varCurrentStudent.FullName, " with ", ddlTutor.Selected.FullName),
                    StudentID: LookUp(Students, Email = varCurrentUser.Email),
                    TutorID: ddlTutor.Selected,
                    AppointmentDate: DateAdd(DateTimePicker.SelectedDate, Week.Value * 7, Days),
                    Duration: rgDuration.Selected.Value,
                    Status: "Scheduled",
                    Location: rgLocation.Selected.Value,
                    FocusArea: Concat(galFocusAreas.AllItems, If(Selected, Value & ", ", "")),
                    RecurringSeriesID: varRecurringID
                }
            )
        )
    );
    Notify("Appointment booked successfully!", NotificationType.Success);
    Navigate(ScreenSchedule, ScreenTransition.Fade)
,
    // Has conflict
    Notify("Cannot book - time conflict detected", NotificationType.Error)
);
```

---

### Screen 3: My Schedule (Calendar View)

**Purpose**: View all appointments in calendar format

**Layout:**
```
┌─────────────────────────────────────┐
│  My Schedule                         │
│  [< Week]  Dec 15-21, 2025  [Week >]│
├─────────────────────────────────────┤
│                                      │
│  Week View (Gallery)                 │
│  ─────────────────────────────────── │
│  Mon 12/15                           │
│    0900-1000  SSgt Smith - Arabic    │
│              [View] [Cancel]         │
│                                      │
│  Tue 12/16                           │
│    1400-1500  GySgt Jones - Russian  │
│              [View] [Cancel]         │
│    1600-1730  MSgt Lee - Chinese     │
│              [View] [Cancel]         │
│                                      │
│  Wed 12/17                           │
│    (No appointments)                 │
│                                      │
│  Thu 12/18                           │
│    1000-1100  SSgt Smith - Arabic    │
│              [View] [Cancel]         │
│  ─────────────────────────────────── │
│                                      │
│  [Filter: All ▼] [Status: All ▼]    │
│                                      │
│  [+ Book New Appointment]            │
│                                      │
└─────────────────────────────────────┘
```

**Key Formulas:**

```powerFx
// OnVisible - Set week start
Set(varWeekStart, Today() - Weekday(Today()) + 2); // Monday
Set(varWeekEnd, varWeekStart + 6); // Sunday

// Load appointments for current week
Set(varWeeklyAppointments,
    SortByColumns(
        Filter(
            Appointments,
            StudentID.Email = varCurrentUser.Email || TutorID.Email = varCurrentUser.Email,
            AppointmentDate >= varWeekStart,
            AppointmentDate <= varWeekEnd,
            Status <> "Cancelled"
        ),
        "AppointmentDate",
        Ascending
    )
);

// Previous Week button
Set(varWeekStart, varWeekStart - 7);
Set(varWeekEnd, varWeekEnd - 7);

// Next Week button
Set(varWeekStart, varWeekStart + 7);
Set(varWeekEnd, varWeekEnd + 7);

// Gallery Items - Group by date
GroupBy(
    varWeeklyAppointments,
    "AppointmentDate",
    "DateGroup"
);

// Display time format
Text(AppointmentDate, "[$-en-US]hhmm") & "-" & 
Text(DateAdd(AppointmentDate, Duration, Minutes), "[$-en-US]hhmm");

// Display tutor/student based on role
If(
    varUserRole = "Student",
    TutorID.FullName & " - " & StudentID.Language,
    StudentID.FullName & " - " & StudentID.Language
);

// Cancel button - OnSelect
UpdateIf(
    Appointments,
    ID = ThisItem.ID,
    {
        Status: "Cancelled",
        CancellationReason: "Cancelled by " & If(varUserRole = "Student", "student", "tutor")
    }
);
Notify("Appointment cancelled", NotificationType.Warning);
Refresh(Appointments);
```

---

### Screen 4: Session Notes (Tutors Only)

**Purpose**: Document completed sessions

**Layout:**
```
┌─────────────────────────────────────┐
│  Session Notes                       │
├─────────────────────────────────────┤
│                                      │
│  Appointment Details                 │
│  Student: LCpl Jane Doe              │
│  Date: Dec 15, 2025 14:00            │
│  Language: Arabic                    │
│  Scheduled: 60 min                   │
│                                      │
│  Actual Duration (minutes):          │
│  [____60____]                        │
│                                      │
│  Materials Covered:                  │
│  [Rich text editor                   │
│   - Covered chapter 5 grammar        │
│   - Practiced verb conjugations      │
│   - Reviewed homework from last week │
│  ]                                   │
│                                      │
│  Focus Areas:                        │
│  ☑ Vocab  ☑ Grammar  ☐ Listening    │
│  ☐ Reading ☐ Speaking ☐ DLPT Prep   │
│                                      │
│  Student Performance:                │
│  ⚪ Excellent  ⚫ Good                │
│  ⚪ Satisfactory  ⚪ Needs Improvement│
│                                      │
│  Student Participation:              │
│  ⚫ Engaged  ⚪ Average  ⚪ Distracted │
│                                      │
│  Homework Assigned:                  │
│  [Rich text editor                   │
│   Complete exercises 1-10 on page 45 │
│  ]                                   │
│                                      │
│  Next Session Goals:                 │
│  [_____________________________]     │
│                                      │
│  Challenges Observed:                │
│  [_____________________________]     │
│                                      │
│  Recommendations:                    │
│  [_____________________________]     │
│                                      │
│  Attached Resources:                 │
│  [Links to materials]                │
│                                      │
│  [Cancel]              [Save Notes]  │
│                                      │
└─────────────────────────────────────┘
```

**Key Formulas:**

```powerFx
// OnVisible - Load completed appointments needing notes
Set(varCompletedSessions,
    Filter(
        Appointments,
        TutorID.Email = varCurrentUser.Email,
        Status = "Completed",
        !(ID in SessionNotes.AppointmentID.ID)
    )
);

// Save Notes button - OnSelect
Patch(
    SessionNotes,
    Defaults(SessionNotes),
    {
        Title: "Session - " & varSelectedAppointment.ID,
        AppointmentID: varSelectedAppointment,
        SessionDate: varSelectedAppointment.AppointmentDate,
        Duration: Value(txtActualDuration.Text),
        MaterialsCovered: richMaterials.HtmlText,
        StudentPerformance: rgPerformance.Selected.Value,
        FocusAreas: Concat(galFocusNotes.AllItems, If(Selected, Value & ", ", "")),
        HomeworkAssigned: richHomework.HtmlText,
        NextSessionGoals: txtGoals.Text,
        StudentParticipation: rgParticipation.Selected.Value,
        ChallengesObserved: txtChallenges.Text,
        Recommendations: txtRecommendations.Text,
        AttachedResources: txtResources.Text
    }
);
Notify("Session notes saved successfully!", NotificationType.Success);
Back();
```

---

### Screen 5: Progress Tracker (Students)

**Purpose**: View academic progress over time

**Layout:**
```
┌─────────────────────────────────────┐
│  My Progress                         │
├─────────────────────────────────────┤
│                                      │
│  Current Status                      │
│  Language: Arabic                    │
│  Current Grade: B+ (87%)             │
│  Trend: ⬆️ Improving                 │
│                                      │
│  DLPT Scores                         │
│  ┌────────────┬────────────┐         │
│  │ Listening  │  Reading   │         │
│  │    2+      │     2      │         │
│  └────────────┴────────────┘         │
│                                      │
│  Progress Chart                      │
│  [Line graph showing grade over time]│
│                                      │
│  Tutoring Summary                    │
│  Total Sessions: 12                  │
│  Total Hours: 14.5                   │
│  This Month: 4 sessions              │
│                                      │
│  Recent Session Notes (Gallery)      │
│  ┌─────────────────────────────┐    │
│  │ Dec 15 - SSgt Smith          │    │
│  │ Performance: Good            │    │
│  │ Focus: Grammar, Vocab        │    │
│  │ [View Full Notes]            │    │
│  ├─────────────────────────────┤    │
│  │ Dec 12 - SSgt Smith          │    │
│  │ Performance: Excellent       │    │
│  │ Focus: Listening             │    │
│  │ [View Full Notes]            │    │
│  └─────────────────────────────┘    │
│                                      │
└─────────────────────────────────────┘
```

**Key Formulas:**

```powerFx
// OnVisible - Load student progress
Set(varStudentProgress,
    SortByColumns(
        Filter(
            ProgressTracking,
            StudentID.Email = varCurrentUser.Email
        ),
        "SnapshotDate",
        Descending
    )
);

// Latest progress record
Set(varLatestProgress, First(varStudentProgress));

// Total sessions
Set(varTotalSessions,
    CountRows(
        Filter(
            Appointments,
            StudentID.Email = varCurrentUser.Email,
            Status = "Completed"
        )
    )
);

// Total hours
Set(varTotalHours,
    Sum(
        Filter(
            Appointments,
            StudentID.Email = varCurrentUser.Email,
            Status = "Completed"
        ),
        Duration
    ) / 60
);

// Recent session notes
Set(varRecentNotes,
    SortByColumns(
        Filter(
            SessionNotes,
            AppointmentID.StudentID.Email = varCurrentUser.Email
        ),
        "SessionDate",
        Descending
    )
);
```

---

## Naming Conventions

### Controls
- **Screen**: scr[Name] - e.g., `scrDashboard`, `scrBookAppointment`
- **Gallery**: gal[Name] - e.g., `galAppointments`, `galTutors`
- **Dropdown**: ddl[Name] - e.g., `ddlLanguage`, `ddlTutor`
- **Button**: btn[Action] - e.g., `btnBook`, `btnCancel`
- **Label**: lbl[Name] - e.g., `lblWelcome`, `lblConflict`
- **Text Input**: txt[Name] - e.g., `txtNotes`, `txtDuration`
- **Date Picker**: dat[Name] - e.g., `datAppointment`
- **Radio Group**: rg[Name] - e.g., `rgDuration`, `rgLocation`
- **Checkbox**: chk[Name] - e.g., `chkRecurring`
- **Icon**: ico[Name] - e.g., `icoConflict`, `icoSuccess`

### Variables
- **Global**: var[Name] - e.g., `varCurrentUser`, `varUserRole`
- **Collection**: col[Name] - e.g., `colAppointments`
- **Context**: ctx[Name] - e.g., `ctxSelectedTutor`

---

## Connection Setup

### Step 1: Add Data Sources
```
App → Data → Add data
- Tutors (SharePoint)
- Students (SharePoint)
- Appointments (SharePoint)
- SessionNotes (SharePoint)
- ProgressTracking (SharePoint)
- Resources (SharePoint)
```

### Step 2: App OnStart Formula
```powerFx
// Load current user info
Set(varCurrentUser, User());

// Determine user role
Set(varUserRole,
    Switch(
        true,
        !IsBlank(LookUp(Tutors, Email = varCurrentUser.Email)), "Tutor",
        !IsBlank(LookUp(Students, Email = varCurrentUser.Email)), "Student",
        varCurrentUser.Email in ["admin@dliflc.edu"], "Admin",
        "Guest"
    )
);

// Load user-specific record
If(
    varUserRole = "Student",
    Set(varCurrentStudent, LookUp(Students, Email = varCurrentUser.Email))
);
If(
    varUserRole = "Tutor",
    Set(varCurrentTutor, LookUp(Tutors, Email = varCurrentUser.Email))
);

// Load all languages for dropdowns
Set(colLanguages, ["Arabic", "Russian", "Chinese", "Korean", "Farsi", "Spanish", "French", "Indonesian", "Japanese"]);

// Navigate to appropriate home screen
Navigate(scrDashboard, ScreenTransition.None);
```

---

## Performance Optimization

### Delegation
- Use delegable functions: Filter, LookUp, Search, Sort
- Avoid: CountRows (use CountIf), AddColumns in large datasets
- Set delegation limit: Settings → Advanced → Data row limit: 2000

### Caching
```powerFx
// Cache frequently used data
ClearCollect(colActiveTutors, Filter(Tutors, Status = "Active"));
ClearCollect(colMyAppointments, Filter(Appointments, StudentID.Email = varCurrentUser.Email));
```

### Lazy Loading
```powerFx
// Only load data when screen becomes visible
Screen.OnVisible = ClearCollect(colData, Filter(...));
```

---

## Testing Checklist

- [ ] All SharePoint connections working
- [ ] User role detection accurate
- [ ] Conflict detection prevents double-booking
- [ ] Appointments create successfully
- [ ] Calendar displays correctly
- [ ] Session notes save properly
- [ ] Progress tracker loads data
- [ ] Permissions enforced (students can't see tutor admin)
- [ ] Mobile layout responsive
- [ ] No delegation warnings in formulas

---

## Next: Deploy to Production

After testing:
1. Export app as .msapp file
2. Import to service account: `pa.svc.mardet.tutoring`
3. Share with security groups
4. Enable in production environment
5. Train users (Segment 7)
