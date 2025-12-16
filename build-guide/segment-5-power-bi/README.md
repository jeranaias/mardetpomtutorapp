# Segment 5: Power BI Dashboard

Copy-paste guide for building the analytics dashboard.

---

## Prerequisites

- [ ] Power BI Desktop installed (free download from Microsoft)
- [ ] SharePoint lists created and populated (Segment 2)
- [ ] Power BI Pro license (for sharing) OR publish to workspace

---

## Build Time: ~45 minutes

| Step | Task | Time |
|------|------|------|
| 1 | Connect to SharePoint lists | 10 min |
| 2 | Create DAX measures | 10 min |
| 3 | Build Executive Dashboard | 10 min |
| 4 | Build Tutor Performance page | 8 min |
| 5 | Build Student Progress page | 7 min |

---

## Step 1: Create New Report

1. Open **Power BI Desktop**
2. **File** → **New**
3. **Save As** → `MARDET_Tutoring_Dashboard.pbix`

---

## Step 2: Connect to SharePoint Lists

### 2.1 Open Power Query

1. **Home** → **Transform data** → **Transform data**
2. Power Query Editor opens

### 2.2 Connect to Tutors List

1. **Home** → **New Source** → **More...**
2. Search **SharePoint Online List** → **Connect**
3. Enter site URL: `https://dliflc01.sharepoint.com/sites/MCD`
4. Click **OK**
5. Select **Microsoft Account** → **Sign In**
6. Select **Tutors** list → **Transform Data**
7. Right-click query → **Advanced Editor**
8. Replace ALL code with:

```powerquery
let
    Source = SharePoint.Tables("https://dliflc01.sharepoint.com/sites/MCD", [Implementation="2.0"]),
    Tutors = Source{[Title="Tutors"]}[Items],
    #"Selected Columns" = Table.SelectColumns(Tutors, {
        "ID", "Title", "FullName", "Email", "Rank", "Languages",
        "MaxHoursPerWeek", "TutorStatus", "HireDate", "OfficeLocation"
    }),
    #"Renamed Columns" = Table.RenameColumns(#"Selected Columns", {
        {"TutorStatus", "Status"},
        {"ID", "TutorID"}
    }),
    #"Filtered Active" = Table.SelectRows(#"Renamed Columns", each [Status] = "Active")
in
    #"Filtered Active"
```

9. Click **Done**

### 2.3 Connect to Students List

1. **Home** → **New Source** → **SharePoint Online List**
2. Same site URL
3. Select **Students** → **Transform Data**
4. **Advanced Editor** → Replace with:

```powerquery
let
    Source = SharePoint.Tables("https://dliflc01.sharepoint.com/sites/MCD", [Implementation="2.0"]),
    Students = Source{[Title="Students"]}[Items],
    #"Selected Columns" = Table.SelectColumns(Students, {
        "ID", "Title", "FullName", "Email", "Rank", "Language", "Class",
        "CurrentGrade", "Company", "Platoon", "EnrollmentDate", "GraduationDate", "StudentStatus"
    }),
    #"Renamed Columns" = Table.RenameColumns(#"Selected Columns", {
        {"StudentStatus", "Status"},
        {"ID", "StudentID"}
    }),
    #"Filtered Active" = Table.SelectRows(#"Renamed Columns", each [Status] = "Active")
in
    #"Filtered Active"
```

### 2.4 Connect to Appointments List

```powerquery
let
    Source = SharePoint.Tables("https://dliflc01.sharepoint.com/sites/MCD", [Implementation="2.0"]),
    Appointments = Source{[Title="Appointments"]}[Items],
    #"Selected Columns" = Table.SelectColumns(Appointments, {
        "ID", "Title", "AppointmentDate", "Duration", "AppointmentStatus",
        "Location", "FocusArea", "TutorLookupId", "StudentLookupId", "Created"
    }),
    #"Renamed Columns" = Table.RenameColumns(#"Selected Columns", {
        {"AppointmentStatus", "Status"},
        {"ID", "AppointmentID"},
        {"TutorLookupId", "TutorID"},
        {"StudentLookupId", "StudentID"}
    }),
    #"Added Date Column" = Table.AddColumn(#"Renamed Columns", "Date", each Date.From([AppointmentDate]), type date),
    #"Added Month" = Table.AddColumn(#"Added Date Column", "Month", each Date.MonthName([Date]), type text),
    #"Added Year" = Table.AddColumn(#"Added Month", "Year", each Date.Year([Date]), Int64.Type),
    #"Added WeekNum" = Table.AddColumn(#"Added Year", "WeekNumber", each Date.WeekOfYear([Date]), Int64.Type),
    #"Added Hours" = Table.AddColumn(#"Added WeekNum", "Hours", each [Duration] / 60, type number)
in
    #"Added Hours"
```

### 2.5 Connect to SessionNotes List

```powerquery
let
    Source = SharePoint.Tables("https://dliflc01.sharepoint.com/sites/MCD", [Implementation="2.0"]),
    SessionNotes = Source{[Title="SessionNotes"]}[Items],
    #"Selected Columns" = Table.SelectColumns(SessionNotes, {
        "ID", "Title", "SessionDate", "ActualDuration", "StudentPerformance",
        "StudentParticipation", "FocusAreas", "AppointmentLookupId"
    }),
    #"Renamed Columns" = Table.RenameColumns(#"Selected Columns", {
        {"ID", "NoteID"},
        {"AppointmentLookupId", "AppointmentID"},
        {"StudentPerformance", "Performance"},
        {"StudentParticipation", "Participation"}
    }),
    #"Added Date" = Table.AddColumn(#"Renamed Columns", "Date", each Date.From([SessionDate]), type date)
in
    #"Added Date"
```

### 2.6 Connect to ProgressTracking List

```powerquery
let
    Source = SharePoint.Tables("https://dliflc01.sharepoint.com/sites/MCD", [Implementation="2.0"]),
    Progress = Source{[Title="ProgressTracking"]}[Items],
    #"Selected Columns" = Table.SelectColumns(Progress, {
        "ID", "Title", "SnapshotDate", "CurrentGrade", "DLPTListening", "DLPTReading",
        "OPIScore", "AttendanceRate", "TutoringHours", "Trends", "StudentLookupId"
    }),
    #"Renamed Columns" = Table.RenameColumns(#"Selected Columns", {
        {"ID", "ProgressID"},
        {"StudentLookupId", "StudentID"}
    }),
    #"Added Date" = Table.AddColumn(#"Renamed Columns", "Date", each Date.From([SnapshotDate]), type date)
in
    #"Added Date"
```

### 2.7 Create Date Table

**Home** → **New Source** → **Blank Query** → **Advanced Editor**:

```powerquery
let
    StartDate = #date(2024, 1, 1),
    EndDate = #date(2026, 12, 31),
    NumberOfDays = Duration.Days(EndDate - StartDate) + 1,
    DateList = List.Dates(StartDate, NumberOfDays, #duration(1, 0, 0, 0)),
    DateTable = Table.FromList(DateList, Splitter.SplitByNothing(), {"Date"}, null, ExtraValues.Error),
    #"Changed Type" = Table.TransformColumnTypes(DateTable, {{"Date", type date}}),
    #"Added Year" = Table.AddColumn(#"Changed Type", "Year", each Date.Year([Date]), Int64.Type),
    #"Added Month" = Table.AddColumn(#"Added Year", "Month", each Date.Month([Date]), Int64.Type),
    #"Added MonthName" = Table.AddColumn(#"Added Month", "MonthName", each Date.MonthName([Date]), type text),
    #"Added Quarter" = Table.AddColumn(#"Added MonthName", "Quarter", each "Q" & Text.From(Date.QuarterOfYear([Date])), type text),
    #"Added WeekNum" = Table.AddColumn(#"Added Quarter", "WeekNumber", each Date.WeekOfYear([Date]), Int64.Type),
    #"Added DayName" = Table.AddColumn(#"Added WeekNum", "DayName", each Date.DayOfWeekName([Date]), type text),
    #"Added IsWeekend" = Table.AddColumn(#"Added DayName", "IsWeekend", each Date.DayOfWeek([Date]) >= 5, type logical)
in
    #"Added IsWeekend"
```

Rename query to `DateTable`.

### 2.8 Apply Changes

1. **Home** → **Close & Apply**
2. Wait for data to load

---

## Step 3: Create Relationships

1. Go to **Model** view (left sidebar)
2. Create these relationships (drag and drop):

| From | To | Cardinality |
|------|-----|-------------|
| Appointments[TutorID] | Tutors[TutorID] | Many-to-One |
| Appointments[StudentID] | Students[StudentID] | Many-to-One |
| Appointments[Date] | DateTable[Date] | Many-to-One |
| SessionNotes[AppointmentID] | Appointments[AppointmentID] | Many-to-One |
| ProgressTracking[StudentID] | Students[StudentID] | Many-to-One |

---

## Step 4: Create DAX Measures

Go to **Report** view. Select the **Appointments** table. For each measure:
**Home** → **New Measure** → Paste formula → Press Enter

### Core Metrics

```dax
Total Appointments = COUNTROWS(Appointments)
```

```dax
Completed Sessions =
CALCULATE(
    COUNTROWS(Appointments),
    Appointments[Status] = "Completed"
)
```

```dax
Scheduled Sessions =
CALCULATE(
    COUNTROWS(Appointments),
    Appointments[Status] = "Scheduled"
)
```

```dax
Cancelled Sessions =
CALCULATE(
    COUNTROWS(Appointments),
    Appointments[Status] = "Cancelled"
)
```

```dax
No Shows =
CALCULATE(
    COUNTROWS(Appointments),
    Appointments[Status] = "NoShow"
)
```

```dax
Total Hours =
SUM(Appointments[Hours])
```

```dax
Completed Hours =
CALCULATE(
    SUM(Appointments[Hours]),
    Appointments[Status] = "Completed"
)
```

### Rate Calculations

```dax
Completion Rate =
DIVIDE(
    [Completed Sessions],
    [Completed Sessions] + [No Shows] + [Cancelled Sessions],
    0
)
```

```dax
No Show Rate =
DIVIDE(
    [No Shows],
    [Completed Sessions] + [No Shows],
    0
)
```

```dax
Cancellation Rate =
DIVIDE(
    [Cancelled Sessions],
    [Total Appointments],
    0
)
```

### Counts

```dax
Active Tutors =
COUNTROWS(
    FILTER(Tutors, Tutors[Status] = "Active")
)
```

```dax
Active Students =
COUNTROWS(
    FILTER(Students, Students[Status] = "Active")
)
```

```dax
Unique Students Tutored =
DISTINCTCOUNT(Appointments[StudentID])
```

### Time Intelligence

```dax
Sessions This Month =
CALCULATE(
    [Completed Sessions],
    DATESMTD(DateTable[Date])
)
```

```dax
Sessions Last Month =
CALCULATE(
    [Completed Sessions],
    DATEADD(DATESMTD(DateTable[Date]), -1, MONTH)
)
```

```dax
Sessions MoM Change =
VAR CurrentMonth = [Sessions This Month]
VAR LastMonth = [Sessions Last Month]
RETURN
DIVIDE(CurrentMonth - LastMonth, LastMonth, 0)
```

```dax
Hours This Month =
CALCULATE(
    [Completed Hours],
    DATESMTD(DateTable[Date])
)
```

```dax
Hours YTD =
CALCULATE(
    [Completed Hours],
    DATESYTD(DateTable[Date])
)
```

### Averages

```dax
Avg Session Duration =
AVERAGE(Appointments[Duration])
```

```dax
Avg Sessions Per Student =
DIVIDE(
    [Completed Sessions],
    [Unique Students Tutored],
    0
)
```

```dax
Avg Hours Per Tutor =
DIVIDE(
    [Completed Hours],
    [Active Tutors],
    0
)
```

### Performance Metrics (from SessionNotes)

```dax
Excellent Sessions =
CALCULATE(
    COUNTROWS(SessionNotes),
    SessionNotes[Performance] = "Excellent"
)
```

```dax
Good Sessions =
CALCULATE(
    COUNTROWS(SessionNotes),
    SessionNotes[Performance] = "Good"
)
```

```dax
Satisfactory Sessions =
CALCULATE(
    COUNTROWS(SessionNotes),
    SessionNotes[Performance] = "Satisfactory"
)
```

```dax
Needs Improvement Sessions =
CALCULATE(
    COUNTROWS(SessionNotes),
    SessionNotes[Performance] = "Needs Improvement"
)
```

```dax
Performance Score =
VAR Excellent = [Excellent Sessions] * 4
VAR Good = [Good Sessions] * 3
VAR Satisfactory = [Satisfactory Sessions] * 2
VAR NeedsImprovement = [Needs Improvement Sessions] * 1
VAR TotalSessions = COUNTROWS(SessionNotes)
RETURN
DIVIDE(Excellent + Good + Satisfactory + NeedsImprovement, TotalSessions, 0)
```

### Language Metrics

```dax
Students by Language =
CALCULATE(
    COUNTROWS(Students),
    ALLEXCEPT(Students, Students[Language])
)
```

---

## Step 5: Build Executive Dashboard (Page 1)

### 5.1 Rename Page
- Right-click "Page 1" → Rename → `Executive Summary`

### 5.2 Add Title
- **Insert** → **Text box**
- Text: `MARDET Tutoring Dashboard`
- Font: 28pt, Bold
- Position: Top left

### 5.3 Add KPI Cards (Top Row)

Create 4 **Card** visuals across the top:

**Card 1:**
- Field: `Active Students`
- Title: "Active Students"

**Card 2:**
- Field: `Active Tutors`
- Title: "Active Tutors"

**Card 3:**
- Field: `Completed Hours` (formatted as whole number)
- Title: "Hours This Period"

**Card 4:**
- Field: `Completion Rate` (formatted as percentage)
- Title: "Completion Rate"

### 5.4 Add Sessions Over Time Chart

**Line Chart:**
- X-axis: `DateTable[MonthName]`
- Y-axis: `Completed Sessions`
- Title: "Sessions by Month"
- Size: Half width

### 5.5 Add Students by Language Chart

**Donut Chart:**
- Legend: `Students[Language]`
- Values: Count of `Students[StudentID]`
- Title: "Students by Language"
- Size: Quarter width

### 5.6 Add Sessions by Status Chart

**Stacked Bar Chart:**
- Y-axis: `Appointments[Status]`
- X-axis: Count of `Appointments[AppointmentID]`
- Title: "Sessions by Status"

### 5.7 Add Performance Breakdown

**Stacked Column Chart:**
- X-axis: `DateTable[MonthName]`
- Y-axis: `Excellent Sessions`, `Good Sessions`, `Satisfactory Sessions`, `Needs Improvement Sessions`
- Legend: Performance level
- Title: "Student Performance Over Time"

### 5.8 Add Date Slicer

**Slicer:**
- Field: `DateTable[Date]`
- Style: Between (date range)
- Position: Top right

---

## Step 6: Build Tutor Performance (Page 2)

### 6.1 Add New Page
- Click **+** at bottom → Rename to `Tutor Performance`

### 6.2 Add Tutor Slicer

**Slicer:**
- Field: `Tutors[FullName]`
- Style: Dropdown
- Position: Top left
- Enable "Select All"

### 6.3 Add Tutor KPIs

**Card** visuals:
- `Completed Sessions` (filtered by slicer)
- `Completed Hours`
- `Unique Students Tutored`
- `Avg Session Duration`

### 6.4 Add Sessions by Day of Week

**Column Chart:**
- X-axis: `DateTable[DayName]`
- Y-axis: `Completed Sessions`
- Title: "Sessions by Day of Week"

### 6.5 Add Tutor Comparison Table

**Table** visual:
- Columns:
  - `Tutors[FullName]`
  - `Completed Sessions`
  - `Completed Hours`
  - `Unique Students Tutored`
  - `Performance Score`
- Sort by: `Completed Hours` descending

### 6.6 Add Hours Trend

**Line Chart:**
- X-axis: `DateTable[Date]`
- Y-axis: `Completed Hours`
- Title: "Tutoring Hours Over Time"

---

## Step 7: Build Student Progress (Page 3)

### 7.1 Add New Page
- Click **+** → Rename to `Student Progress`

### 7.2 Add Student Slicer

**Slicer:**
- Field: `Students[FullName]`
- Style: Dropdown

### 7.3 Add Language Slicer

**Slicer:**
- Field: `Students[Language]`
- Style: Tile

### 7.4 Add Company Slicer

**Slicer:**
- Field: `Students[Company]`
- Style: Dropdown

### 7.5 Add Student Detail Cards

**Cards:**
- Current student's `Language`
- Current student's `Class`
- Current student's `Company`
- `Avg Sessions Per Student`

### 7.6 Add DLPT Scores Table

**Table** visual (from ProgressTracking):
- Columns:
  - `ProgressTracking[SnapshotDate]`
  - `ProgressTracking[DLPTListening]`
  - `ProgressTracking[DLPTReading]`
  - `ProgressTracking[OPIScore]`
  - `ProgressTracking[Trends]`

### 7.7 Add At-Risk Students Table

**Table** visual:
- Columns:
  - `Students[FullName]`
  - `Students[Language]`
  - `Students[Company]`
  - Latest `Trends` from ProgressTracking
- Filter: `Trends` = "Declining"
- Title: "At-Risk Students (Declining Trends)"

### 7.8 Add Session History

**Table** visual:
- Columns:
  - `Appointments[Date]`
  - `Tutors[FullName]` (via relationship)
  - `Appointments[Duration]`
  - `SessionNotes[Performance]`
- Sort by: Date descending
- Title: "Session History"

---

## Step 8: Formatting & Polish

### 8.1 Apply Theme

1. **View** → **Themes** → **Browse for themes**
2. Or use built-in: "Executive" or "Innovate"

### 8.2 Add Logo (Optional)

1. **Insert** → **Image**
2. Upload MARDET or USMC logo
3. Position top-left corner of each page

### 8.3 Format Cards

For each card:
- **Format** → **Callout value** → Font size 28-36
- **Category label** → Font size 12
- **Background** → Subtle gray or transparent

### 8.4 Format Charts

For each chart:
- Enable **Data labels** where appropriate
- Adjust colors to match theme
- Add clear titles

### 8.5 Mobile Layout (Optional)

1. **View** → **Mobile layout**
2. Drag visuals to mobile canvas
3. Prioritize KPIs at top

---

## Step 9: Publish

### 9.1 Save

1. **File** → **Save**

### 9.2 Publish to Power BI Service

1. **Home** → **Publish**
2. Select workspace (or "My Workspace")
3. Wait for upload

### 9.3 Set Up Refresh Schedule

In Power BI Service:
1. Go to the dataset
2. **Settings** → **Scheduled refresh**
3. Configure: Daily at 6:00 AM
4. Add credentials for SharePoint connection

### 9.4 Share Dashboard

1. Open the report in Power BI Service
2. **Share** → Enter email addresses
3. Or: **File** → **Embed** for Teams/SharePoint

---

## Quick Reference: All Measures

| Measure | Purpose |
|---------|---------|
| Total Appointments | All appointments |
| Completed Sessions | Status = Completed |
| Scheduled Sessions | Status = Scheduled |
| Cancelled Sessions | Status = Cancelled |
| No Shows | Status = NoShow |
| Total Hours | Sum of all hours |
| Completed Hours | Hours for completed only |
| Completion Rate | Completed / (Completed + NoShow + Cancelled) |
| No Show Rate | NoShow / (Completed + NoShow) |
| Cancellation Rate | Cancelled / Total |
| Active Tutors | Count where Status = Active |
| Active Students | Count where Status = Active |
| Unique Students Tutored | Distinct count |
| Sessions This Month | MTD completed |
| Sessions Last Month | Prior MTD |
| Sessions MoM Change | Month-over-month % |
| Hours This Month | MTD hours |
| Hours YTD | Year-to-date hours |
| Avg Session Duration | Average minutes |
| Avg Sessions Per Student | Sessions / unique students |
| Avg Hours Per Tutor | Hours / tutors |
| Excellent Sessions | Performance = Excellent |
| Good Sessions | Performance = Good |
| Satisfactory Sessions | Performance = Satisfactory |
| Needs Improvement Sessions | Performance = Needs Improvement |
| Performance Score | Weighted average (4,3,2,1) |

---

## Troubleshooting

### "Cannot connect to SharePoint"
- Verify you're signed in with correct account
- Check site URL is exact
- Ensure you have at least Read access to lists

### "Relationship not detected"
- Manually create in Model view
- Check column names match exactly
- Verify data types match (both Number or both Text)

### "Measure returns blank"
- Check for divide by zero (use DIVIDE function)
- Verify relationships are active
- Check filter context

### "Refresh fails in Service"
- Re-enter SharePoint credentials in dataset settings
- Check if password changed
- Verify gateway if using on-premises

### "Slow performance"
- Add date filters to limit data
- Use Import mode instead of DirectQuery
- Reduce visual count per page

---

## Files

After completing this guide, you'll have:
- `MARDET_Tutoring_Dashboard.pbix` - The Power BI file

Save this file and commit to the repo if desired (note: .pbix files are binary and don't diff well in Git).
