# PowerApp Formulas Reference

## Common Formulas Library

This document contains reusable PowerFx formulas for the MARDET Tutoring System.

---

## User Authentication & Role Detection

### Get Current User
```powerFx
Set(varCurrentUser, User());
// Returns: {Email: "user@dliflc.edu", FullName: "John Doe", Image: "..."}
```

### Detect User Role
```powerFx
Set(varUserRole,
    Switch(
        true,
        !IsBlank(LookUp(Tutors, Email = varCurrentUser.Email)), "Tutor",
        !IsBlank(LookUp(Students, Email = varCurrentUser.Email)), "Student",
        varCurrentUser.Email = "admin@dliflc.edu", "Admin",
        "Guest"
    )
);
```

### Get User's Full Record
```powerFx
// For students
Set(varCurrentStudent, 
    LookUp(Students, Email = varCurrentUser.Email)
);

// For tutors
Set(varCurrentTutor,
    LookUp(Tutors, Email = varCurrentUser.Email)
);
```

---

## Date & Time Calculations

### Get Current Week Boundaries
```powerFx
// Monday of current week
Set(varWeekStart, Today() - Weekday(Today()) + 2);

// Sunday of current week  
Set(varWeekEnd, varWeekStart + 6);
```

### Format Date/Time for Display
```powerFx
// Date only: "Dec 15, 2025"
Text(AppointmentDate, "[$-en-US]mmm dd, yyyy")

// Time only: "1400" (military)
Text(AppointmentDate, "[$-en-US]hhmm")

// Full: "Monday, Dec 15 at 1400"
Text(AppointmentDate, "[$-en-US]dddd, mmm dd") & " at " & 
Text(AppointmentDate, "[$-en-US]hhmm")

// Week of year: "Week 50"
"Week " & Text(AppointmentDate, "[$-en-US]ww")
```

### Calculate End Time
```powerFx
// Add duration in minutes to start time
DateAdd(AppointmentDate, Duration, Minutes)

// Display end time
Text(
    DateAdd(AppointmentDate, Duration, Minutes),
    "[$-en-US]hhmm"
)
```

### Check if Date is Today
```powerFx
DateDiff(AppointmentDate, Today(), Days) = 0
```

### Check if Date is This Week
```powerFx
AppointmentDate >= varWeekStart && AppointmentDate <= varWeekEnd
```

---

## Conflict Detection

### Check Student Time Conflict
```powerFx
Set(varStudentConflict,
    !IsEmpty(
        Filter(
            Appointments,
            StudentID.Email = varCurrentUser.Email,
            Status = "Scheduled",
            // Overlaps if:
            // New start < existing end AND new end > existing start
            DateTimePicker.SelectedDate < DateAdd(AppointmentDate, Duration, Minutes),
            DateAdd(DateTimePicker.SelectedDate, rgDuration.Selected.Value, Minutes) > AppointmentDate
        )
    )
);
```

### Check Tutor Time Conflict
```powerFx
Set(varTutorConflict,
    !IsEmpty(
        Filter(
            Appointments,
            TutorID.ID = ddlTutor.Selected.ID,
            Status = "Scheduled",
            DateTimePicker.SelectedDate < DateAdd(AppointmentDate, Duration, Minutes),
            DateAdd(DateTimePicker.SelectedDate, rgDuration.Selected.Value, Minutes) > AppointmentDate
        )
    )
);
```

### Combined Conflict Check
```powerFx
Set(varHasConflict, varStudentConflict || varTutorConflict);

// Display message
If(
    varHasConflict,
    "⚠️ Time conflict detected - please choose another time",
    "✅ No conflicts - ready to book"
)
```

### Check Tutor Weekly Capacity
```powerFx
// Calculate tutor's scheduled hours this week
Set(varTutorWeeklyHours,
    Sum(
        Filter(
            Appointments,
            TutorID.ID = ddlTutor.Selected.ID,
            AppointmentDate >= varWeekStart,
            AppointmentDate <= varWeekEnd,
            Status = "Scheduled"
        ),
        Duration
    ) / 60
);

// Check if under max hours
Set(varTutorAvailable,
    varTutorWeeklyHours < ddlTutor.Selected.MaxHoursPerWeek
);

// Display remaining hours
ddlTutor.Selected.MaxHoursPerWeek - varTutorWeeklyHours & " hours available"
```

---

## Appointment Management

### Create Single Appointment
```powerFx
Patch(
    Appointments,
    Defaults(Appointments),
    {
        Title: Concatenate(
            varCurrentStudent.FullName,
            " with ",
            ddlTutor.Selected.FullName
        ),
        StudentID: varCurrentStudent,
        TutorID: ddlTutor.Selected,
        AppointmentDate: DateTimePicker.SelectedDate,
        Duration: rgDuration.Selected.Value,
        Status: "Scheduled",
        Location: rgLocation.Selected.Value,
        MeetingLink: If(
            rgLocation.Selected.Value = "Online",
            txtMeetingLink.Text,
            ""
        ),
        FocusArea: Concat(
            Filter(galFocusAreas, Selected),
            Value & ", "
        ),
        BookingNotes: txtNotes.Text,
        CreatedByStudent: true,
        ReminderSent: false
    }
);
```

### Create Recurring Appointments
```powerFx
// Generate recurring series ID
Set(varSeriesID, GUID());

// Set end date (e.g., 8 weeks from now)
Set(varRecurringEnd, DateAdd(Today(), 8, Weeks));

// Create appointments for each week
ForAll(
    Sequence(
        DateDiff(Today(), varRecurringEnd, Days) / 7
    ) As WeekNum,
    Patch(
        Appointments,
        Defaults(Appointments),
        {
            Title: Concatenate(
                varCurrentStudent.FullName,
                " with ",
                ddlTutor.Selected.FullName
            ),
            StudentID: varCurrentStudent,
            TutorID: ddlTutor.Selected,
            AppointmentDate: DateAdd(
                DateTimePicker.SelectedDate,
                WeekNum.Value * 7,
                Days
            ),
            Duration: rgDuration.Selected.Value,
            Status: "Scheduled",
            Location: rgLocation.Selected.Value,
            FocusArea: Concat(Filter(galFocusAreas, Selected), Value & ", "),
            RecurringSeriesID: varSeriesID,
            RecurringPattern: JSON({
                frequency: "weekly",
                interval: 1,
                endDate: Text(varRecurringEnd, "yyyy-mm-dd")
            })
        }
    )
);
```

### Update Appointment Status
```powerFx
// Mark as completed
UpdateIf(
    Appointments,
    ID = varSelectedAppointment.ID,
    {Status: "Completed"}
);

// Cancel appointment
UpdateIf(
    Appointments,
    ID = varSelectedAppointment.ID,
    {
        Status: "Cancelled",
        CancellationReason: "Cancelled by " & varUserRole
    }
);

// Mark as no-show
UpdateIf(
    Appointments,
    ID = varSelectedAppointment.ID,
    {Status: "NoShow"}
);
```

### Cancel Recurring Series
```powerFx
// Cancel all appointments in series
UpdateIf(
    Appointments,
    RecurringSeriesID = varSelectedAppointment.RecurringSeriesID,
    Status = "Scheduled",
    {
        Status: "Cancelled",
        CancellationReason: "Series cancelled by " & varUserRole
    }
);
```

---

## Filtering & Searching

### Get User's Upcoming Appointments
```powerFx
SortByColumns(
    Filter(
        Appointments,
        (StudentID.Email = varCurrentUser.Email || TutorID.Email = varCurrentUser.Email),
        Status = "Scheduled",
        AppointmentDate > Now()
    ),
    "AppointmentDate",
    Ascending
)
```

### Get Today's Appointments
```powerFx
Filter(
    Appointments,
    (StudentID.Email = varCurrentUser.Email || TutorID.Email = varCurrentUser.Email),
    Status = "Scheduled",
    DateDiff(AppointmentDate, Today(), Days) = 0
)
```

### Filter Tutors by Language
```powerFx
Filter(
    Tutors,
    varSelectedLanguage in Languages,
    Status = "Active"
)
```

### Search Students by Name
```powerFx
Filter(
    Students,
    StartsWith(FullName, txtSearch.Text),
    Status = "Active"
)
// Or use Search() for partial matches
Search(
    Students,
    txtSearch.Text,
    "FullName", "Email", "Class"
)
```

### Get Appointments for Date Range
```powerFx
Filter(
    Appointments,
    AppointmentDate >= datStart.SelectedDate,
    AppointmentDate <= datEnd.SelectedDate,
    Status <> "Cancelled"
)
```

---

## Statistics & Analytics

### Count This Week's Appointments
```powerFx
CountRows(
    Filter(
        Appointments,
        StudentID.Email = varCurrentUser.Email,
        Status = "Completed",
        AppointmentDate >= varWeekStart,
        AppointmentDate <= varWeekEnd
    )
)
```

### Total Hours This Month
```powerFx
Sum(
    Filter(
        Appointments,
        StudentID.Email = varCurrentUser.Email,
        Status = "Completed",
        Month(AppointmentDate) = Month(Today()),
        Year(AppointmentDate) = Year(Today())
    ),
    Duration
) / 60
```

### Average Session Duration
```powerFx
Average(
    Filter(
        SessionNotes,
        AppointmentID.StudentID.Email = varCurrentUser.Email
    ),
    Duration
)
```

### No-Show Rate (Percentage)
```powerFx
CountRows(
    Filter(Appointments, Status = "NoShow", StudentID = varCurrentStudent)
) / 
CountRows(
    Filter(Appointments, StudentID = varCurrentStudent)
) * 100
```

### Tutor Utilization Rate
```powerFx
// Hours scheduled / Max hours * 100
(Sum(
    Filter(
        Appointments,
        TutorID.ID = varCurrentTutor.ID,
        AppointmentDate >= varWeekStart,
        AppointmentDate <= varWeekEnd,
        Status = "Scheduled"
    ),
    Duration
) / 60) / varCurrentTutor.MaxHoursPerWeek * 100
```

---

## Session Notes

### Create Session Note
```powerFx
Patch(
    SessionNotes,
    Defaults(SessionNotes),
    {
        Title: "Session - " & varSelectedAppointment.AppointmentID,
        AppointmentID: varSelectedAppointment,
        SessionDate: varSelectedAppointment.AppointmentDate,
        Duration: Value(txtActualDuration.Text),
        MaterialsCovered: richMaterials.HtmlText,
        StudentPerformance: rgPerformance.Selected.Value,
        FocusAreas: Concat(
            Filter(galFocusAreas, Selected),
            Value & ", "
        ),
        HomeworkAssigned: richHomework.HtmlText,
        NextSessionGoals: txtGoals.Text,
        StudentParticipation: rgParticipation.Selected.Value,
        ChallengesObserved: txtChallenges.Text,
        Recommendations: txtRecommendations.Text,
        AttachedResources: txtResources.Text
    }
);
```

### Get Student's Recent Notes
```powerFx
FirstN(
    SortByColumns(
        Filter(
            SessionNotes,
            AppointmentID.StudentID.Email = varCurrentStudent.Email
        ),
        "SessionDate",
        Descending
    ),
    5
)
```

---

## Progress Tracking

### Get Latest Progress Snapshot
```powerFx
First(
    SortByColumns(
        Filter(
            ProgressTracking,
            StudentID.Email = varCurrentStudent.Email
        ),
        "SnapshotDate",
        Descending
    )
)
```

### Calculate Progress Trend
```powerFx
// Get last 2 snapshots
Set(colRecentProgress,
    FirstN(
        SortByColumns(
            Filter(ProgressTracking, StudentID = varCurrentStudent),
            "SnapshotDate",
            Descending
        ),
        2
    )
);

// Compare grades
Set(varTrend,
    Switch(
        true,
        IsEmpty(colRecentProgress), "No Data",
        CountRows(colRecentProgress) = 1, "New",
        Value(Last(colRecentProgress).CurrentGrade) > Value(First(colRecentProgress).CurrentGrade), "Improving",
        Value(Last(colRecentProgress).CurrentGrade) < Value(First(colRecentProgress).CurrentGrade), "Declining",
        "Stable"
    )
);
```

---

## Galleries & Collections

### Group Appointments by Date
```powerFx
// Gallery.Items
GroupBy(
    varWeeklyAppointments,
    "AppointmentDate",
    "DateGroup"
);

// Header label in gallery
Text(ThisItem.AppointmentDate, "[$-en-US]dddd, mmm dd")
```

### Filter Multi-Select Checklist
```powerFx
// Gallery of checkboxes for Focus Areas
Items: ["Vocab", "Grammar", "Listening", "Reading", "Speaking", "Writing", "DLPT Prep"]

// Get selected items
Concat(
    Filter(galFocusAreas, Selected),
    Value,
    ", "
)
```

### Sort Dropdown Options
```powerFx
// Tutors dropdown sorted by name
ddlTutor.Items = SortByColumns(varAvailableTutors, "FullName", Ascending)
```

---

## Validation

### Required Field Check
```powerFx
// Button enabled only if all required fields filled
btnSubmit.DisplayMode = If(
    !IsBlank(txtName.Text) &&
    !IsBlank(ddlLanguage.Selected) &&
    !IsBlank(DateTimePicker.SelectedDate),
    DisplayMode.Edit,
    DisplayMode.Disabled
);
```

### Email Format Validation
```powerFx
Set(varValidEmail,
    IsMatch(
        txtEmail.Text,
        "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    )
);
```

### Date Range Validation
```powerFx
// Appointment must be in future
Set(varValidDate,
    DateTimePicker.SelectedDate > Now()
);

// Appointment must be during business hours (0800-1700)
Set(varValidTime,
    Hour(DateTimePicker.SelectedDate) >= 8 &&
    Hour(DateTimePicker.SelectedDate) < 17
);
```

---

## Notifications

### Success Notification
```powerFx
Notify(
    "Appointment booked successfully!",
    NotificationType.Success,
    3000  // Display for 3 seconds
);
```

### Error Notification
```powerFx
Notify(
    "Error: Unable to book appointment",
    NotificationType.Error
);
```

### Warning Notification
```powerFx
Notify(
    "Appointment cancelled",
    NotificationType.Warning
);
```

### Info Notification
```powerFx
Notify(
    "Reminder: Appointment in 24 hours",
    NotificationType.Information
);
```

---

## Navigation

### Navigate to Screen
```powerFx
// Basic navigation
Navigate(scrDashboard, ScreenTransition.Fade);

// Navigate with context variable
Navigate(
    scrAppointmentDetails,
    ScreenTransition.Cover,
    {ctxSelectedAppointment: ThisItem}
);
```

### Navigate Back
```powerFx
Back(ScreenTransition.UnCover);
```

### Reset Form and Navigate
```powerFx
ResetForm(frmBooking);
Navigate(scrDashboard, ScreenTransition.Fade);
```

---

## Error Handling

### Check if Record Exists
```powerFx
If(
    IsBlank(LookUp(Students, Email = varCurrentUser.Email)),
    // User not in system
    Navigate(scrRegistration),
    // User exists
    Navigate(scrDashboard)
);
```

### Try-Catch Pattern (Error Handling)
```powerFx
// Store result of operation
Set(varResult,
    Patch(Appointments, Defaults(Appointments), {...})
);

// Check if successful
If(
    IsError(varResult),
    Notify("Error: " & FirstError.Message, NotificationType.Error),
    Notify("Success!", NotificationType.Success)
);
```

---

## Conditional Formatting

### Status Badge Colors
```powerFx
// For appointment status
Fill = Switch(
    Status,
    "Scheduled", ColorValue("#4CAF50"),  // Green
    "Completed", ColorValue("#2196F3"),   // Blue
    "Cancelled", ColorValue("#F44336"),   // Red
    "NoShow", ColorValue("#FF9800"),      // Orange
    ColorValue("#9E9E9E")                 // Gray default
);
```

### Performance Rating Colors
```powerFx
Color = Switch(
    StudentPerformance,
    "Excellent", ColorValue("#4CAF50"),
    "Good", ColorValue("#8BC34A"),
    "Satisfactory", ColorValue("#FFC107"),
    "Needs Improvement", ColorValue("#FF5722"),
    ColorValue("#9E9E9E")
);
```

### Trend Indicators
```powerFx
Icon = Switch(
    Trends,
    "Improving", Icon.ArrowUp,
    "Declining", Icon.ArrowDown,
    "Stable", Icon.ArrowRight,
    Icon.Help
);

Color = Switch(
    Trends,
    "Improving", Color.Green,
    "Declining", Color.Red,
    "Stable", Color.Orange,
    Color.Gray
);
```

---

## Data Refresh

### Refresh Single List
```powerFx
Refresh(Appointments);
```

### Refresh All Data Sources
```powerFx
Refresh(Tutors);
Refresh(Students);
Refresh(Appointments);
Refresh(SessionNotes);
Refresh(ProgressTracking);
Refresh(Resources);
```

### Auto-Refresh on Timer
```powerFx
// Timer.OnTimerEnd (set Duration: 300000 = 5 minutes)
Refresh(Appointments);
Reset(Timer);
```

---

## JSON Handling

### Store Complex Data as JSON
```powerFx
// Create recurring pattern
Set(varRecurringJSON,
    JSON({
        frequency: "weekly",
        interval: 1,
        daysOfWeek: ["Monday", "Wednesday"],
        endDate: Text(datEnd.SelectedDate, "yyyy-mm-dd")
    })
);
```

### Parse JSON String
```powerFx
// Extract from RecurringPattern field
Set(varPattern,
    ParseJSON(RecurringPattern)
);

// Access properties
varPattern.frequency  // "weekly"
varPattern.endDate    // "2025-06-01"
```

---

## Best Practices

### Use Collections for Performance
```powerFx
// Cache frequently accessed data
ClearCollect(
    colMyAppointments,
    Filter(
        Appointments,
        StudentID.Email = varCurrentUser.Email,
        Status <> "Cancelled"
    )
);

// Use collection instead of querying list repeatedly
Gallery.Items = colMyAppointments
```

### Minimize SharePoint Calls
```powerFx
// BAD - Multiple lookups
LookUp(Students, ID = item.StudentID).FullName
LookUp(Students, ID = item.StudentID).Language

// GOOD - Single lookup with Set
Set(varStudent, LookUp(Students, ID = item.StudentID));
varStudent.FullName
varStudent.Language
```

### Use Concurrent for Multiple Operations
```powerFx
Concurrent(
    ClearCollect(colTutors, Filter(Tutors, Status = "Active")),
    ClearCollect(colStudents, Filter(Students, Status = "Active")),
    ClearCollect(colAppointments, Filter(Appointments, AppointmentDate >= Today()))
);
```

---

## Delegation Warnings

### Avoid Non-Delegable Functions
```powerFx
// BAD - CountRows is not delegable with complex filters
CountRows(Filter(Appointments, Hour(AppointmentDate) = 14))

// GOOD - Pre-filter, then count
Set(col2PMAppointments, Filter(Appointments, Hour(AppointmentDate) = 14));
CountRows(col2PMAppointments)
```

### Keep Filters Simple
```powerFx
// BAD - Complex calculated filters
Filter(Appointments, DateDiff(AppointmentDate, Today(), Days) < 7)

// GOOD - Direct comparisons
Filter(Appointments, AppointmentDate >= Today(), AppointmentDate <= DateAdd(Today(), 7, Days))
```

---

**Use these formulas as templates - adjust field names and logic to match your specific implementation.**
