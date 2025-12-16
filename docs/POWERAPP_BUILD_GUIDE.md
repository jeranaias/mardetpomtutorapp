# MARDET Tutoring PowerApp - Build Guide

Complete copy-paste implementation guide. Follow in order.

---

## Phase 1: Auto-Generate Base App (2 minutes)

1. Go to https://dliflc01.sharepoint.com/sites/MCD
2. Open the **Appointments** list
3. Click **Integrate** → **Power Apps** → **Create an app**
4. Name it: `MARDET Tutoring`
5. Wait for auto-generation (~30 seconds)

You now have a working app with Browse/Detail/Edit screens for Appointments.

---

## Phase 2: Connect All Lists (5 minutes)

In Power Apps Studio:

1. Click **Data** (cylinder icon, left sidebar)
2. Click **Add data**
3. Search "SharePoint"
4. Select your site: `https://dliflc01.sharepoint.com/sites/MCD`
5. Check all 6 lists:
   - ☑ Appointments
   - ☑ Tutors
   - ☑ Students
   - ☑ SessionNotes
   - ☑ ProgressTracking
   - ☑ Resources
6. Click **Connect**

---

## Phase 3: Create App Variables (On App Start)

1. Click **App** in the Tree View (left side)
2. Select **OnStart** property (top formula bar)
3. Paste this formula:

```
// Initialize user context
Set(varCurrentUser, User());
Set(varUserEmail, User().Email);

// Check if user is a tutor
Set(varIsTutor,
    !IsBlank(
        LookUp(Tutors, Email = varUserEmail)
    )
);

// Get tutor record if applicable
Set(varTutorRecord,
    LookUp(Tutors, Email = varUserEmail)
);

// Check if user is a student
Set(varIsStudent,
    !IsBlank(
        LookUp(Students, Email = varUserEmail)
    )
);

// Get student record if applicable
Set(varStudentRecord,
    LookUp(Students, Email = varUserEmail)
);

// Set default date range
Set(varStartDate, Today());
Set(varEndDate, DateAdd(Today(), 14, Days));

// Navigation state
Set(varSelectedAppointment, Blank());
Set(varSelectedStudent, Blank());
```

4. Click the **...** next to App → **Run OnStart**

---

## Phase 4: Create Navigation

### 4.1 Add Header Component (all screens)

On each screen, add a header:

1. **Insert** → **Rectangle**
   - Position: X=0, Y=0
   - Size: Width=Parent.Width, Height=80
   - Fill: `RGBA(0, 51, 102, 1)` (Navy blue)

2. **Insert** → **Text label** (App title)
   - Text: `"MARDET Language Tutoring"`
   - Position: X=20, Y=20
   - Font size: 24
   - Color: White
   - Font weight: Bold

3. **Insert** → **Text label** (User info)
   - Text: `varCurrentUser.FullName`
   - Position: X=Parent.Width - 250, Y=28
   - Color: White
   - Align: Right

### 4.2 Add Navigation Bar

1. **Insert** → **Horizontal container**
   - Position: X=0, Y=80
   - Size: Width=Parent.Width, Height=50
   - Fill: `RGBA(0, 71, 133, 1)`

2. Add 5 buttons inside the container:

**Button 1 - Dashboard:**
```
Text: "Dashboard"
OnSelect: Navigate(scrDashboard, ScreenTransition.Fade)
Fill: If(App.ActiveScreen = scrDashboard, RGBA(255,255,255,0.2), Transparent)
Color: White
```

**Button 2 - Schedule:**
```
Text: "Schedule"
OnSelect: Navigate(scrSchedule, ScreenTransition.Fade)
Fill: If(App.ActiveScreen = scrSchedule, RGBA(255,255,255,0.2), Transparent)
Color: White
```

**Button 3 - Book Session:**
```
Text: "Book Session"
OnSelect: Navigate(scrBooking, ScreenTransition.Fade)
Fill: If(App.ActiveScreen = scrBooking, RGBA(255,255,255,0.2), Transparent)
Color: White
```

**Button 4 - Students:** (Tutors only)
```
Text: "Students"
OnSelect: Navigate(scrStudents, ScreenTransition.Fade)
Visible: varIsTutor
Fill: If(App.ActiveScreen = scrStudents, RGBA(255,255,255,0.2), Transparent)
Color: White
```

**Button 5 - Resources:**
```
Text: "Resources"
OnSelect: Navigate(scrResources, ScreenTransition.Fade)
Fill: If(App.ActiveScreen = scrResources, RGBA(255,255,255,0.2), Transparent)
Color: White
```

---

## Phase 5: Dashboard Screen (scrDashboard)

### 5.1 Create Screen
1. **Insert** → **New screen** → **Blank**
2. Rename to `scrDashboard`
3. Add Header + Nav bar (copy from above)

### 5.2 Stats Cards Row

Create 4 stat cards using this pattern:

**Card Container:**
- Insert → Rectangle
- Size: 200 x 120
- Fill: White
- Border radius: 10

**Stat Number Label:**
```
Text:
// Card 1 - Today's Appointments
CountRows(
    Filter(Appointments,
        DateValue(AppointmentDate) = Today() &&
        (TutorLookup.Value = varTutorRecord.FullName || StudentLookup.Value = varStudentRecord.FullName)
    )
)

// Card 2 - This Week
CountRows(
    Filter(Appointments,
        DateValue(AppointmentDate) >= Today() &&
        DateValue(AppointmentDate) <= DateAdd(Today(), 7, Days) &&
        (TutorLookup.Value = varTutorRecord.FullName || StudentLookup.Value = varStudentRecord.FullName)
    )
)

// Card 3 - Pending Notes (Tutors only)
CountRows(
    Filter(Appointments,
        AppointmentStatus.Value = "Completed" &&
        TutorLookup.Value = varTutorRecord.FullName &&
        IsBlank(LookUp(SessionNotes, AppointmentLookup.Value = Title))
    )
)

// Card 4 - Total Hours This Month
Sum(
    Filter(Appointments,
        AppointmentStatus.Value = "Completed" &&
        Month(DateValue(AppointmentDate)) = Month(Today()) &&
        (TutorLookup.Value = varTutorRecord.FullName || StudentLookup.Value = varStudentRecord.FullName)
    ),
    Duration
) / 60
```
- Font size: 36
- Font weight: Bold
- Color: `RGBA(0, 51, 102, 1)`

**Stat Label:**
- Text: "Today" / "This Week" / "Pending Notes" / "Hours This Month"
- Font size: 14
- Color: Gray

### 5.3 Upcoming Appointments Gallery

1. **Insert** → **Vertical gallery**
2. Rename: `galUpcoming`
3. Data source:
```
Sort(
    Filter(Appointments,
        DateValue(AppointmentDate) >= Today() &&
        AppointmentStatus.Value = "Scheduled" &&
        (TutorLookup.Value = varTutorRecord.FullName || StudentLookup.Value = varStudentRecord.FullName)
    ),
    AppointmentDate,
    Ascending
)
```
4. Size: Width=Parent.Width - 40, Height=300
5. Template size: 80

**Inside gallery template:**

Title label:
```
Text: If(varIsTutor, ThisItem.StudentLookup.Value, ThisItem.TutorLookup.Value)
```

Subtitle label:
```
Text: Text(DateValue(ThisItem.AppointmentDate), "ddd, mmm d") & " at " & Text(DateTimeValue(ThisItem.AppointmentDate), "h:mm AM/PM")
```

Detail label:
```
Text: ThisItem.Duration & " min • " & ThisItem.Location.Value
```

Status icon (circle):
```
Fill: Switch(ThisItem.AppointmentStatus.Value,
    "Scheduled", RGBA(0, 176, 80, 1),
    "Completed", RGBA(0, 112, 192, 1),
    "Cancelled", RGBA(192, 0, 0, 1),
    "NoShow", RGBA(255, 192, 0, 1),
    Gray
)
```

### 5.4 Quick Actions (Tutors)

Add buttons below stats (visible only for tutors):

**Quick Add Appointment:**
```
Text: "+ New Appointment"
OnSelect: Navigate(scrBooking, ScreenTransition.Fade)
Visible: varIsTutor
Fill: RGBA(0, 112, 192, 1)
Color: White
```

**Add Session Notes:**
```
Text: "Add Notes"
OnSelect: Navigate(scrSessionNotes, ScreenTransition.Fade)
Visible: varIsTutor
Fill: RGBA(0, 176, 80, 1)
Color: White
```

---

## Phase 6: Schedule Screen (scrSchedule)

### 6.1 Create Screen
1. **Insert** → **New screen** → **Blank**
2. Rename to `scrSchedule`
3. Add Header + Nav bar

### 6.2 Date Navigation

**Previous Week Button:**
```
Text: "< Prev"
OnSelect: Set(varStartDate, DateAdd(varStartDate, -7, Days))
```

**Date Range Label:**
```
Text: Text(varStartDate, "mmm d") & " - " & Text(DateAdd(varStartDate, 6, Days), "mmm d, yyyy")
Font weight: Bold
```

**Next Week Button:**
```
Text: "Next >"
OnSelect: Set(varStartDate, DateAdd(varStartDate, 7, Days))
```

### 6.3 Calendar Gallery

1. **Insert** → **Horizontal gallery**
2. Rename: `galCalendarDays`
3. Items:
```
ForAll(Sequence(7, 0, 1),
    {
        DayDate: DateAdd(varStartDate, Value, Days),
        DayName: Text(DateAdd(varStartDate, Value, Days), "ddd"),
        DayNum: Text(DateAdd(varStartDate, Value, Days), "d")
    }
)
```
4. Template width: Parent.Width / 7

**Day Header Label:**
```
Text: ThisItem.DayName
Align: Center
Font weight: Bold
```

**Day Number Label:**
```
Text: ThisItem.DayNum
Align: Center
Fill: If(ThisItem.DayDate = Today(), RGBA(0, 112, 192, 1), Transparent)
Color: If(ThisItem.DayDate = Today(), White, Black)
```

### 6.4 Appointments by Day Gallery

Nested gallery showing appointments per day:

**Inside each day column, add vertical gallery:**
```
Items: Filter(Appointments,
    DateValue(AppointmentDate) = ThisItem.DayDate &&
    (TutorLookup.Value = varTutorRecord.FullName || StudentLookup.Value = varStudentRecord.FullName)
)
```

**Appointment card:**
```
Fill: Switch(ThisItem.AppointmentStatus.Value,
    "Scheduled", RGBA(0, 176, 80, 0.2),
    "Completed", RGBA(0, 112, 192, 0.2),
    "Cancelled", RGBA(192, 0, 0, 0.2),
    RGBA(200, 200, 200, 0.2)
)
Border: 2px left solid with same color (full opacity)
```

**Time label:**
```
Text: Text(DateTimeValue(ThisItem.AppointmentDate), "h:mm")
Font size: 11
Font weight: Bold
```

**Person label:**
```
Text: If(varIsTutor, ThisItem.StudentLookup.Value, ThisItem.TutorLookup.Value)
Font size: 10
```

**OnSelect for card:**
```
Set(varSelectedAppointment, ThisItem);
Navigate(scrAppointmentDetail, ScreenTransition.Fade)
```

---

## Phase 7: Booking Screen (scrBooking)

### 7.1 Create Screen
1. **Insert** → **New screen** → **Blank**
2. Rename to `scrBooking`
3. Add Header + Nav bar

### 7.2 Form Layout

**Section Label:**
```
Text: "Book a Tutoring Session"
Font size: 24
Font weight: Bold
```

### 7.3 Tutor Selection (Students) / Student Selection (Tutors)

**Dropdown - Select Tutor:** (for students)
```
Items: Filter(Tutors, TutorStatus.Value = "Active")
Visible: varIsStudent
DisplayFields: ["FullName"]
OnChange:
    Set(varSelectedTutor, Self.Selected);
    // Filter available times
    ClearCollect(colAvailableSlots,
        ForAll(Sequence(10, 8, 1),
            {TimeSlot: Value & ":00", Available: true}
        )
    )
```

**Dropdown - Select Student:** (for tutors)
```
Items: Filter(Students, StudentStatus.Value = "Active")
Visible: varIsTutor
DisplayFields: ["FullName"]
OnChange: Set(varSelectedStudent, Self.Selected)
```

**Label - Tutor Languages:**
```
Text: "Languages: " & varSelectedTutor.Languages.Value
Visible: varIsStudent && !IsBlank(varSelectedTutor)
```

### 7.4 Date Picker

**Date Picker:**
```
DefaultDate: Today()
OnChange: Set(varBookingDate, Self.SelectedDate)
MinDate: Today()
MaxDate: DateAdd(Today(), 30, Days)
```

### 7.5 Time Slot Gallery

1. **Insert** → **Horizontal gallery**
2. Rename: `galTimeSlots`
3. Items:
```
["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"]
```

**Time Button:**
```
Text: ThisItem.Value
OnSelect: Set(varSelectedTime, ThisItem.Value)
Fill: If(varSelectedTime = ThisItem.Value,
    RGBA(0, 112, 192, 1),
    RGBA(240, 240, 240, 1)
)
Color: If(varSelectedTime = ThisItem.Value, White, Black)
DisplayMode: If(
    // Check if slot is already booked
    !IsBlank(LookUp(Appointments,
        DateValue(AppointmentDate) = varBookingDate &&
        Text(DateTimeValue(AppointmentDate), "hh:mm") = ThisItem.Value &&
        (TutorLookup.Value = varSelectedTutor.FullName || TutorLookup.Value = varTutorRecord.FullName)
    )),
    DisplayMode.Disabled,
    DisplayMode.Edit
)
```

### 7.6 Duration Selection

**Dropdown - Duration:**
```
Items: [30, 45, 60, 90]
Default: 60
OnChange: Set(varBookingDuration, Self.Selected.Value)
```

### 7.7 Focus Area Selection

**Combo Box - Focus Areas:**
```
Items: ["Vocab", "Grammar", "Listening", "Reading", "Speaking", "Writing", "DLPT Prep"]
SelectMultiple: true
OnChange: Set(varBookingFocus, Concat(Self.SelectedItems, Value, ";"))
```

### 7.8 Location Selection

**Dropdown - Location:**
```
Items: ["Tutoring Center", "Online", "Classroom", "Other"]
Default: "Tutoring Center"
OnChange: Set(varBookingLocation, Self.Selected.Value)
```

### 7.9 Notes Field

**Text Input:**
```
Mode: TextMode.MultiLine
HintText: "Any notes for the tutor..."
OnChange: Set(varBookingNotes, Self.Text)
```

### 7.10 Submit Button

```
Text: "Book Appointment"
OnSelect:
    // Create appointment record
    Patch(Appointments,
        Defaults(Appointments),
        {
            Title: "APT-" & Text(Now(), "yyyymmddhhmmss"),
            AppointmentDate: DateAdd(varBookingDate, Value(Left(varSelectedTime, 2)), Hours),
            Duration: varBookingDuration,
            AppointmentStatus: {Value: "Scheduled"},
            Location: {Value: varBookingLocation},
            FocusArea: {Value: varBookingFocus},
            BookingNotes: varBookingNotes,
            CreatedByStudent: varIsStudent,
            ReminderSent: false,
            TutorLookup: If(varIsStudent,
                varSelectedTutor.ID,
                varTutorRecord.ID
            ),
            StudentLookup: If(varIsTutor,
                varSelectedStudent.ID,
                varStudentRecord.ID
            )
        }
    );

    // Show confirmation
    Notify("Appointment booked successfully!", NotificationType.Success);

    // Reset form
    Reset(dpDatePicker);
    Set(varSelectedTime, Blank());
    Set(varBookingNotes, "");

    // Navigate to schedule
    Navigate(scrSchedule, ScreenTransition.Fade)

Fill: RGBA(0, 112, 192, 1)
Color: White
DisabledFill: Gray
DisplayMode: If(
    IsBlank(varSelectedTime) ||
    IsBlank(varBookingDate) ||
    (varIsStudent && IsBlank(varSelectedTutor)) ||
    (varIsTutor && IsBlank(varSelectedStudent)),
    DisplayMode.Disabled,
    DisplayMode.Edit
)
```

---

## Phase 8: Session Notes Screen (scrSessionNotes)

### 8.1 Create Screen
1. **Insert** → **New screen** → **Blank**
2. Rename to `scrSessionNotes`
3. Add Header + Nav bar
4. **Visible:** `varIsTutor` (tutors only)

### 8.2 Select Completed Appointment

**Gallery - Completed Sessions Needing Notes:**
```
Items: Sort(
    Filter(Appointments,
        AppointmentStatus.Value = "Completed" &&
        TutorLookup.Value = varTutorRecord.FullName &&
        !(Title in ShowColumns(SessionNotes, "AppointmentLookup"))
    ),
    AppointmentDate,
    Descending
)
```

**Card OnSelect:**
```
Set(varSelectedAppointment, ThisItem);
Set(varNoteStudent, LookUp(Students, FullName = ThisItem.StudentLookup.Value))
```

### 8.3 Session Notes Form

**Performance Dropdown:**
```
Items: ["Excellent", "Good", "Satisfactory", "Needs Improvement"]
OnChange: Set(varNotePerformance, Self.Selected.Value)
```

**Participation Dropdown:**
```
Items: ["Engaged", "Average", "Distracted"]
OnChange: Set(varNoteParticipation, Self.Selected.Value)
```

**Materials Covered (Rich Text):**
```
Mode: TextMode.MultiLine
HintText: "What materials/topics were covered..."
OnChange: Set(varNoteMaterials, Self.Text)
```

**Challenges Observed:**
```
Mode: TextMode.MultiLine
HintText: "Any challenges or struggles observed..."
OnChange: Set(varNoteChallenges, Self.Text)
```

**Homework Assigned:**
```
Mode: TextMode.MultiLine
HintText: "Homework or practice assigned..."
OnChange: Set(varNoteHomework, Self.Text)
```

**Next Session Goals:**
```
Mode: TextMode.MultiLine
HintText: "Goals for next session..."
OnChange: Set(varNoteGoals, Self.Text)
```

**Recommendations:**
```
Mode: TextMode.MultiLine
HintText: "Recommendations for student..."
OnChange: Set(varNoteRecommendations, Self.Text)
```

### 8.4 Save Notes Button

```
Text: "Save Session Notes"
OnSelect:
    Patch(SessionNotes,
        Defaults(SessionNotes),
        {
            Title: "NOTE-" & Text(Now(), "yyyymmddhhmmss"),
            SessionDate: varSelectedAppointment.AppointmentDate,
            ActualDuration: varSelectedAppointment.Duration,
            StudentPerformance: {Value: varNotePerformance},
            StudentParticipation: {Value: varNoteParticipation},
            MaterialsCovered: varNoteMaterials,
            ChallengesObserved: varNoteChallenges,
            HomeworkAssigned: varNoteHomework,
            NextSessionGoals: varNoteGoals,
            Recommendations: varNoteRecommendations,
            AppointmentLookup: varSelectedAppointment.ID
        }
    );

    Notify("Session notes saved!", NotificationType.Success);

    // Clear form
    Set(varSelectedAppointment, Blank());
    Reset(dpPerformance);
    Reset(txtMaterials);

    Navigate(scrDashboard, ScreenTransition.Fade)

Fill: RGBA(0, 176, 80, 1)
Color: White
DisplayMode: If(
    IsBlank(varSelectedAppointment) ||
    IsBlank(varNotePerformance) ||
    IsBlank(varNoteMaterials),
    DisplayMode.Disabled,
    DisplayMode.Edit
)
```

---

## Phase 9: Students Screen (scrStudents) - Tutors Only

### 9.1 Create Screen
1. **Insert** → **New screen** → **Blank**
2. Rename to `scrStudents`
3. Add Header + Nav bar
4. **Visible:** `varIsTutor`

### 9.2 Student Search

**Search Box:**
```
HintText: "Search students..."
OnChange: Set(varStudentSearch, Self.Text)
```

### 9.3 Students Gallery

```
Items: Sort(
    Filter(Students,
        StudentStatus.Value = "Active" &&
        (
            IsBlank(varStudentSearch) ||
            varStudentSearch in FullName ||
            varStudentSearch in Class
        )
    ),
    FullName,
    Ascending
)
```

**Student Card:**
- Name: `ThisItem.FullName`
- Rank/Class: `ThisItem.Rank.Value & " • " & ThisItem.Class`
- Language: `ThisItem.Language.Value`
- Company: `ThisItem.Company.Value`

**OnSelect:**
```
Set(varSelectedStudent, ThisItem);
Navigate(scrStudentDetail, ScreenTransition.Fade)
```

### 9.4 Student Detail Screen (scrStudentDetail)

**Student Header:**
```
Text: varSelectedStudent.FullName
Font size: 28
```

**Info Grid:**
```
Rank: varSelectedStudent.Rank.Value
Language: varSelectedStudent.Language.Value
Class: varSelectedStudent.Class.Value
Company: varSelectedStudent.Company.Value
Email: varSelectedStudent.Email
Phone: varSelectedStudent.PhoneNumber
```

**Progress Section - Latest Snapshot:**
```
Set formula on screen OnVisible:
Set(varStudentProgress,
    First(
        Sort(
            Filter(ProgressTracking, StudentLookup.Value = varSelectedStudent.FullName),
            SnapshotDate,
            Descending
        )
    )
)
```

**Progress Display:**
```
Current Grade: varStudentProgress.CurrentGrade
DLPT Listening: varStudentProgress.DLPTListening.Value
DLPT Reading: varStudentProgress.DLPTReading.Value
Trend: varStudentProgress.Trends.Value
Tutoring Hours: varStudentProgress.TutoringHours
```

**Session History Gallery:**
```
Items: Sort(
    Filter(Appointments,
        StudentLookup.Value = varSelectedStudent.FullName
    ),
    AppointmentDate,
    Descending
)
```

---

## Phase 10: Resources Screen (scrResources)

### 10.1 Create Screen
1. **Insert** → **New screen** → **Blank**
2. Rename to `scrResources`
3. Add Header + Nav bar

### 10.2 Filter Controls

**Language Dropdown:**
```
Items: ["All", "Arabic", "Russian", "Chinese", "Korean", "Farsi", "Spanish", "French", "Indonesian", "Japanese"]
Default: "All"
OnChange: Set(varResourceLang, Self.Selected.Value)
```

**Type Dropdown:**
```
Items: ["All", "Vocab", "Grammar", "Listening", "Reading", "Speaking", "Writing", "DLPT Practice"]
Default: "All"
OnChange: Set(varResourceType, Self.Selected.Value)
```

### 10.3 Resources Gallery

```
Items: Sort(
    Filter(Resources,
        Active = true &&
        (varResourceLang = "All" || Language.Value = varResourceLang) &&
        (varResourceType = "All" || ResourceType.Value = varResourceType)
    ),
    Featured,
    Descending
)
```

**Resource Card:**
```
Title: ThisItem.Title
Type Badge: ThisItem.ResourceType.Value
Language Badge: ThisItem.Language.Value
Difficulty: ThisItem.DifficultyLevel.Value
Description: ThisItem.Description
Featured Star: If(ThisItem.Featured, "⭐", "")
```

**Open Resource Button:**
```
Text: "Open Resource"
OnSelect: Launch(ThisItem.URL.Url)
Fill: RGBA(0, 112, 192, 1)
Color: White
```

---

## Phase 11: Appointment Detail Screen (scrAppointmentDetail)

### 11.1 Create Screen
1. **Insert** → **New screen** → **Blank**
2. Rename to `scrAppointmentDetail`
3. Add Header + Nav bar

### 11.2 Detail Display

**Back Button:**
```
Text: "< Back"
OnSelect: Back()
```

**Appointment Info:**
```
Date/Time: Text(DateTimeValue(varSelectedAppointment.AppointmentDate), "dddd, mmmm d, yyyy 'at' h:mm AM/PM")
Duration: varSelectedAppointment.Duration & " minutes"
Location: varSelectedAppointment.Location.Value
Status: varSelectedAppointment.AppointmentStatus.Value
Focus Areas: varSelectedAppointment.FocusArea.Value
Notes: varSelectedAppointment.BookingNotes
```

**With Person:**
```
Text: If(varIsTutor,
    "Student: " & varSelectedAppointment.StudentLookup.Value,
    "Tutor: " & varSelectedAppointment.TutorLookup.Value
)
```

### 11.3 Action Buttons

**Cancel Appointment:** (only if scheduled and in future)
```
Text: "Cancel Appointment"
Visible: varSelectedAppointment.AppointmentStatus.Value = "Scheduled" &&
         DateTimeValue(varSelectedAppointment.AppointmentDate) > Now()
OnSelect:
    UpdateIf(Appointments,
        ID = varSelectedAppointment.ID,
        {AppointmentStatus: {Value: "Cancelled"}}
    );
    Notify("Appointment cancelled", NotificationType.Warning);
    Back()
Fill: RGBA(192, 0, 0, 1)
Color: White
```

**Mark Complete:** (tutors only, scheduled appointments)
```
Text: "Mark Complete"
Visible: varIsTutor &&
         varSelectedAppointment.AppointmentStatus.Value = "Scheduled"
OnSelect:
    UpdateIf(Appointments,
        ID = varSelectedAppointment.ID,
        {AppointmentStatus: {Value: "Completed"}}
    );
    Notify("Marked as complete!", NotificationType.Success);
    Navigate(scrSessionNotes, ScreenTransition.Fade)
Fill: RGBA(0, 176, 80, 1)
Color: White
```

**Mark No-Show:** (tutors only)
```
Text: "Mark No-Show"
Visible: varIsTutor &&
         varSelectedAppointment.AppointmentStatus.Value = "Scheduled" &&
         DateTimeValue(varSelectedAppointment.AppointmentDate) < Now()
OnSelect:
    UpdateIf(Appointments,
        ID = varSelectedAppointment.ID,
        {AppointmentStatus: {Value: "NoShow"}}
    );
    Notify("Marked as no-show", NotificationType.Warning);
    Back()
Fill: RGBA(255, 192, 0, 1)
Color: Black
```

---

## Phase 12: Final Polish

### 12.1 Loading Indicators

On any gallery, add a loading indicator:
```
Visible: galGalleryName.Loading
```

### 12.2 Empty State Messages

When galleries are empty:
```
Text: "No appointments found"
Visible: IsEmpty(galUpcoming.AllItems)
```

### 12.3 Error Handling

Wrap Patch operations:
```
IfError(
    Patch(...),
    Notify("Error saving. Please try again.", NotificationType.Error)
)
```

### 12.4 Color Constants

Add to App.OnStart for consistent theming:
```
Set(varColorPrimary, RGBA(0, 51, 102, 1));      // Navy
Set(varColorSecondary, RGBA(0, 112, 192, 1));   // Blue
Set(varColorSuccess, RGBA(0, 176, 80, 1));      // Green
Set(varColorWarning, RGBA(255, 192, 0, 1));     // Yellow
Set(varColorDanger, RGBA(192, 0, 0, 1));        // Red
Set(varColorLight, RGBA(240, 240, 240, 1));     // Light gray
```

Then reference: `Fill: varColorPrimary`

### 12.5 Screen Navigation Map

```
scrDashboard (Home)
├── scrSchedule
│   └── scrAppointmentDetail
├── scrBooking
├── scrStudents (Tutors only)
│   └── scrStudentDetail
├── scrSessionNotes (Tutors only)
└── scrResources
```

---

## Quick Reference: All Screens

| Screen | Purpose | Access |
|--------|---------|--------|
| scrDashboard | Stats, upcoming, quick actions | All |
| scrSchedule | Weekly calendar view | All |
| scrBooking | Book new appointment | All |
| scrAppointmentDetail | View/manage single appointment | All |
| scrStudents | Browse student roster | Tutors |
| scrStudentDetail | Individual student info + progress | Tutors |
| scrSessionNotes | Add notes after session | Tutors |
| scrResources | Study materials library | All |

---

## Troubleshooting

**"Column not found" errors:**
- Check exact column internal names in SharePoint
- Use `ThisItem.ColumnName` not `ThisItem.'Column Name'`

**Lookup columns not working:**
- Lookups return objects, use `.Value` or `.Id`
- Example: `ThisItem.TutorLookup.Value`

**Filtering not working:**
- Choice columns need `.Value`: `Status.Value = "Active"`
- Dates need conversion: `DateValue(AppointmentDate)`

**Save/Patch failing:**
- Check required fields in SharePoint list
- Lookups need ID not name for Patch

---

## Done!

After completing all phases:
1. Click **File** → **Save**
2. Click **Publish**
3. Share with users via link or embed in Teams

Total build time: ~2-3 hours following this guide.
