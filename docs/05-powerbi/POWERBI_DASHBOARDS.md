# PowerBI Dashboards - MARDET Tutoring System

## Overview

This document defines PowerBI dashboards for analytics and reporting on the MARDET Language Tutoring System. Dashboards provide insights into tutor utilization, student progress, appointment trends, and system effectiveness.

---

## Dashboard Architecture

### 3 Primary Dashboards

```
1. EXECUTIVE DASHBOARD (Leadership View)
   - High-level KPIs
   - Trend summaries
   - System health overview

2. OPERATIONS DASHBOARD (Tutor Chiefs)
   - Tutor workload and utilization
   - Appointment statistics
   - No-show tracking
   - Resource allocation

3. STUDENT PROGRESS DASHBOARD (Instructors/Tutors)
   - Individual student tracking
   - DLPT score trends
   - Session effectiveness
   - Intervention alerts
```

---

## Data Model

### Data Sources (SharePoint Lists)

**Connection Type**: Direct Query or Import

1. **Appointments** - Primary fact table
2. **Students** - Student dimension
3. **Tutors** - Tutor dimension
4. **SessionNotes** - Session documentation
5. **ProgressTracking** - Academic performance
6. **Resources** - Resource library usage

### Relationships

```
Students (1) ──────> (*) Appointments
Tutors (1) ──────> (*) Appointments
Appointments (1) ──> (1) SessionNotes
Students (1) ──────> (*) ProgressTracking
```

### Date Table (Create in PowerBI)

```DAX
DateTable = 
ADDCOLUMNS(
    CALENDAR(
        DATE(2024, 1, 1),
        DATE(2026, 12, 31)
    ),
    "Year", YEAR([Date]),
    "Quarter", "Q" & QUARTER([Date]),
    "Month", MONTH([Date]),
    "MonthName", FORMAT([Date], "MMMM"),
    "Week", WEEKNUM([Date]),
    "DayOfWeek", WEEKDAY([Date]),
    "DayName", FORMAT([Date], "dddd"),
    "IsWeekend", WEEKDAY([Date]) IN {1, 7}
)
```

---

## Dashboard 1: Executive Dashboard

### Page Layout

```
┌─────────────────────────────────────────────────────────┐
│  MARDET Language Tutoring - Executive Dashboard          │
│  [Date Range Filter: Last 30 Days ▼]                     │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  KPI Cards (Row 1)                                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │  Total   │ │Completion│ │ No-Show  │ │  Active  │   │
│  │Sessions  │ │   Rate   │ │   Rate   │ │ Students │   │
│  │   287    │ │   94%    │ │    4%    │ │   382    │   │
│  │  ▲ 12%   │ │  ▲ 2%    │ │  ▼ 1%    │ │  ▲ 5%    │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│                                                           │
│  Appointment Trends (Line Chart)                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │                                                     │  │
│  │     [Line chart showing appointments over time]    │  │
│  │     Split by: Completed, Scheduled, Cancelled      │  │
│  │                                                     │  │
│  └───────────────────────────────────────────────────┘  │
│                                                           │
│  Language Distribution        Top Tutors by Hours        │
│  ┌─────────────────────┐    ┌────────────────────────┐  │
│  │                      │    │ SSgt Smith    45 hrs  │  │
│  │  [Pie chart showing  │    │ GySgt Jones   42 hrs  │  │
│  │   appointments by    │    │ MSgt Lee      38 hrs  │  │
│  │   language]          │    │ SSgt Brown    35 hrs  │  │
│  │                      │    │ GySgt Wilson  32 hrs  │  │
│  └─────────────────────┘    └────────────────────────┘  │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Key Metrics

#### Total Sessions
```DAX
TotalSessions = 
COUNTROWS(Appointments)
```

#### Completion Rate
```DAX
CompletionRate = 
DIVIDE(
    COUNTROWS(FILTER(Appointments, Appointments[Status] = "Completed")),
    COUNTROWS(FILTER(Appointments, Appointments[Status] <> "Scheduled")),
    0
) * 100
```

#### No-Show Rate
```DAX
NoShowRate = 
DIVIDE(
    COUNTROWS(FILTER(Appointments, Appointments[Status] = "NoShow")),
    COUNTROWS(Appointments),
    0
) * 100
```

#### Active Students
```DAX
ActiveStudents = 
COUNTROWS(FILTER(Students, Students[Status] = "Active"))
```

#### Month-over-Month Growth
```DAX
MoMGrowth = 
VAR CurrentMonth = [TotalSessions]
VAR PreviousMonth = 
    CALCULATE(
        [TotalSessions],
        DATEADD(DateTable[Date], -1, MONTH)
    )
RETURN
    DIVIDE(CurrentMonth - PreviousMonth, PreviousMonth, 0) * 100
```

### Visualizations

**1. Appointment Trends (Line Chart)**
- X-axis: Date (by week)
- Y-axis: Count of Appointments
- Legend: Status (Completed, Cancelled, NoShow, Scheduled)
- Trend lines: Moving average

**2. Language Distribution (Pie Chart)**
- Values: Count of Appointments
- Legend: Student.Language
- Labels: Percentage

**3. Top Tutors (Table)**
- Columns: Tutor.FullName, TotalHours, SessionCount
- Sort: TotalHours descending
- Top N: 5

---

## Dashboard 2: Operations Dashboard

### Page Layout

```
┌─────────────────────────────────────────────────────────┐
│  Operations Dashboard - Tutor Management                  │
│  [Language Filter: All ▼] [Date: This Month ▼]           │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Tutor Utilization Overview                              │
│  ┌───────────────────────────────────────────────────┐  │
│  │  [Horizontal bar chart]                            │  │
│  │  SSgt Smith    ████████████░░░░  75% (30/40 hrs)  │  │
│  │  GySgt Jones   ███████████░░░░░  68% (27/40 hrs)  │  │
│  │  MSgt Lee      ██████████░░░░░░  62% (25/40 hrs)  │  │
│  │  SSgt Brown    ████████░░░░░░░░  48% (19/40 hrs)  │  │
│  │                                                     │  │
│  │  🟢 >70%   🟡 50-70%   🔴 <50%                      │  │
│  └───────────────────────────────────────────────────┘  │
│                                                           │
│  Weekly Appointment Volume     No-Show Analysis          │
│  ┌─────────────────────┐    ┌────────────────────────┐  │
│  │                      │    │ By Student:            │  │
│  │  [Column chart by    │    │ LCpl Doe      3 ❌     │  │
│  │   day of week]       │    │ Cpl Smith     2 ❌     │  │
│  │                      │    │ LCpl Jones    2 ❌     │  │
│  │  Mon: 45             │    │                        │  │
│  │  Tue: 52             │    │ By Tutor:              │  │
│  │  Wed: 48             │    │ SSgt Brown    4 ❌     │  │
│  │  Thu: 51             │    │ GySgt Wilson  3 ❌     │  │
│  │  Fri: 38             │    │                        │  │
│  └─────────────────────┘    └────────────────────────┘  │
│                                                           │
│  Session Notes Completion                                │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Completed Sessions: 287                           │  │
│  │  Notes Documented:   273  (95.1%)                  │  │
│  │  Missing Notes:       14  (4.9%)                   │  │
│  │                                                     │  │
│  │  [Progress bar]  ████████████████████░  95%        │  │
│  │                  ✅ Target: 95%+                    │  │
│  └───────────────────────────────────────────────────┘  │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Key Metrics

#### Tutor Utilization Rate
```DAX
TutorUtilization = 
VAR TutorHours = 
    SUMX(
        FILTER(
            Appointments,
            Appointments[TutorID] = EARLIER(Tutors[ID]) &&
            Appointments[Status] = "Completed"
        ),
        Appointments[Duration]
    ) / 60
VAR MaxHours = Tutors[MaxHoursPerWeek]
RETURN
    DIVIDE(TutorHours, MaxHours, 0) * 100
```

#### Average Session Duration
```DAX
AvgSessionDuration = 
AVERAGE(
    FILTER(Appointments, Appointments[Status] = "Completed")[Duration]
)
```

#### Sessions Per Day of Week
```DAX
SessionsByDayOfWeek = 
CALCULATE(
    COUNTROWS(Appointments),
    USERELATIONSHIP(Appointments[AppointmentDate], DateTable[Date])
)
```

#### Notes Completion Rate
```DAX
NotesCompletionRate = 
VAR CompletedSessions = 
    COUNTROWS(FILTER(Appointments, [Status] = "Completed"))
VAR SessionsWithNotes = 
    COUNTROWS(SessionNotes)
RETURN
    DIVIDE(SessionsWithNotes, CompletedSessions, 0) * 100
```

#### No-Shows by Student (Top 10)
```DAX
NoShowsByStudent = 
TOPN(
    10,
    SUMMARIZE(
        FILTER(Appointments, [Status] = "NoShow"),
        Students[FullName],
        "NoShowCount", COUNTROWS(Appointments)
    ),
    [NoShowCount],
    DESC
)
```

### Visualizations

**1. Tutor Utilization (Bar Chart)**
- X-axis: Tutor.FullName
- Y-axis: TutorUtilization
- Colors: Conditional (Green >70%, Yellow 50-70%, Red <50%)
- Data labels: Percentage and hours (e.g., "75% (30/40)")

**2. Weekly Volume (Column Chart)**
- X-axis: DayName
- Y-axis: Count of Appointments
- Sort: Monday to Friday

**3. No-Show Analysis (Tables)**
- Top students with no-shows
- Top tutors with student no-shows
- Drill-through to details

**4. Notes Completion (Gauge/Progress Bar)**
- Value: NotesCompletionRate
- Target: 95%
- Color: Green if >= 95%, Red if < 95%

---

## Dashboard 3: Student Progress Dashboard

### Page Layout

```
┌─────────────────────────────────────────────────────────┐
│  Student Progress Tracker                                 │
│  [Student Filter: All ▼] [Language: All ▼]               │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Progress Overview Cards                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │  Avg     │ │  DLPT    │ │Tutoring  │ │ Students │   │
│  │  Grade   │ │  Ready   │ │  Hours   │ │ At Risk  │   │
│  │   B+     │ │    47    │ │   6.2    │ │    12    │   │
│  │  (86%)   │ │  (12%)   │ │  /student│ │   (3%)   │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│                                                           │
│  Grade Distribution Over Time (Line Chart)                │
│  ┌───────────────────────────────────────────────────┐  │
│  │     [Multi-line showing grade trends by language]  │  │
│  │     Arabic, Russian, Chinese lines                 │  │
│  │                                                     │  │
│  └───────────────────────────────────────────────────┘  │
│                                                           │
│  DLPT Score Distribution      Students Needing Support   │
│  ┌─────────────────────┐    ┌────────────────────────┐  │
│  │                      │    │ Declining Performance: │  │
│  │  [Scatter plot]      │    │ • LCpl Doe (Arabic)   │  │
│  │   X: Listening       │    │ • Cpl Smith (Russian) │  │
│  │   Y: Reading         │    │ • LCpl Brown (Chinese)│  │
│  │   Size: Tutoring hrs │    │                        │  │
│  │   Color: Language    │    │ Low Attendance (<80%):│  │
│  │                      │    │ • Cpl Wilson (Arabic) │  │
│  └─────────────────────┘    └────────────────────────┘  │
│                                                           │
│  Session Performance by Focus Area                        │
│  ┌───────────────────────────────────────────────────┐  │
│  │  [Stacked bar chart]                               │  │
│  │  Grammar    ████ 85%  ███ 12%  █ 3%               │  │
│  │  Vocab      ███ 78%   ████ 18% █ 4%               │  │
│  │  Listening  ██ 72%    ████ 22% ██ 6%              │  │
│  │  Reading    ████ 88%  ██ 10%   █ 2%               │  │
│  │             [Excellent] [Good] [Needs Improvement] │  │
│  └───────────────────────────────────────────────────┘  │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Key Metrics

#### Average Grade
```DAX
AvgGrade = 
AVERAGE(
    ProgressTracking[CurrentGradeNumeric]
)
```

#### DLPT Ready Students
```DAX
DLPTReady = 
COUNTROWS(
    FILTER(
        ProgressTracking,
        ProgressTracking[DLPTListening] >= 2 &&
        ProgressTracking[DLPTReading] >= 2
    )
)
```

#### Average Tutoring Hours per Student
```DAX
AvgTutoringHours = 
VAR TotalHours = 
    SUMX(
        FILTER(Appointments, [Status] = "Completed"),
        [Duration]
    ) / 60
VAR TotalStudents = [ActiveStudents]
RETURN
    DIVIDE(TotalHours, TotalStudents, 0)
```

#### Students At Risk
```DAX
StudentsAtRisk = 
COUNTROWS(
    FILTER(
        ProgressTracking,
        ProgressTracking[Trends] = "Declining" ||
        ProgressTracking[AttendanceRate] < 80
    )
)
```

#### Performance by Focus Area
```DAX
PerformanceByFocus = 
SUMMARIZE(
    SessionNotes,
    SessionNotes[FocusAreas],
    "Excellent", CALCULATE(COUNTROWS(SessionNotes), SessionNotes[StudentPerformance] = "Excellent"),
    "Good", CALCULATE(COUNTROWS(SessionNotes), SessionNotes[StudentPerformance] = "Good"),
    "Satisfactory", CALCULATE(COUNTROWS(SessionNotes), SessionNotes[StudentPerformance] = "Satisfactory"),
    "NeedsImprovement", CALCULATE(COUNTROWS(SessionNotes), SessionNotes[StudentPerformance] = "Needs Improvement")
)
```

### Visualizations

**1. Grade Trends (Line Chart)**
- X-axis: SnapshotDate
- Y-axis: Average CurrentGrade
- Legend: Language
- Tooltip: Student count, avg DLPT scores

**2. DLPT Scores (Scatter Plot)**
- X-axis: DLPTListening
- Y-axis: DLPTReading
- Size: TutoringHours
- Color: Language
- Quadrant lines at 2/2 (ready threshold)

**3. Students Needing Support (Table)**
- Filters: Trends = "Declining" OR AttendanceRate < 80%
- Columns: Student name, Language, Latest grade, Trend
- Sort: Most urgent first

**4. Performance by Focus (Stacked Bar)**
- Y-axis: FocusArea
- X-axis: Count of sessions
- Legend: StudentPerformance
- Colors: Green (Excellent), Blue (Good), Yellow (Satisfactory), Red (Needs Improvement)

---

## Color Scheme (DLI Branding)

```
Primary Colors:
- Navy:     #003E51
- Gold:     #C5A572
- Red:      #B31B1B

Status Colors:
- Success:  #4CAF50 (Green)
- Warning:  #FF9800 (Orange)
- Danger:   #F44336 (Red)
- Info:     #2196F3 (Blue)

Neutral:
- Dark:     #333333
- Gray:     #757575
- Light:    #F5F5F5
- White:    #FFFFFF
```

---

## Data Refresh Schedule

### Import Mode (Recommended for performance)
- **Daily refresh**: 0600 (before business hours)
- **Weekend refresh**: Saturday 0200
- **Incremental refresh**: Keep 90 days, archive older

### Direct Query Mode (Real-time)
- **Use case**: Executive dashboard for live KPIs
- **Performance**: Slower, but always current
- **Limit**: Apply filters to reduce query load

---

## Security & Permissions

### Row-Level Security (RLS)

**Tutor Role:**
```DAX
TutorRLS = 
    Tutors[Email] = USERPRINCIPALNAME()
```
- See only own appointments and students
- Access to own performance metrics

**Tutor Chief Role:**
```DAX
TutorChiefRLS = 
    TRUE()  // Full access
```
- See all data
- All dashboards accessible

**Instructor Role:**
```DAX
InstructorRLS = 
    Students[Language] IN {'Arabic', 'Russian'}  // Example
```
- See students in assigned languages only
- Limited to progress dashboard

### Workspace Permissions

- **Admins**: Full control (edit reports, manage workspace)
- **Tutor Chiefs**: Can view all reports, no editing
- **Tutors**: Can view own data only (via RLS)
- **Students**: No direct access (data via PowerApp only)

---

## Embedded Dashboards

### PowerApp Integration

Embed PowerBI reports in PowerApp screens:

**Admin Screen:**
```powerFx
// PowerBI visual control
PowerBIViewer.WorkspaceId = "abc123..."
PowerBIViewer.ReportId = "def456..."
PowerBIViewer.PageName = "Operations Dashboard"
PowerBIViewer.Filters = JSON({
    Language: ddlLanguageFilter.Selected.Value,
    DateRange: {
        start: datStart.SelectedDate,
        end: datEnd.SelectedDate
    }
})
```

**Tutor Screen:**
```powerFx
// Filter to current tutor
PowerBIViewer.Filters = JSON({
    TutorEmail: User().Email
})
```

---

## Deployment Steps

### 1. Create Workspace
- Navigate to https://app.powerbi.com
- Create workspace: "MARDET Tutoring Analytics"
- Add service account as Admin

### 2. Connect Data Sources
- Get Data → SharePoint list
- Site URL: `https://dliflc.sharepoint.com/sites/MarDet`
- Select all 6 lists
- Load to Power Query Editor

### 3. Transform Data
- Clean column names
- Set data types
- Create calculated columns
- Build Date table

### 4. Build Data Model
- Create relationships
- Set cardinality (1:Many)
- Hide unnecessary columns
- Organize into Display folders

### 5. Create Measures
- Copy DAX from this document
- Test with sample data
- Organize in measure tables

### 6. Design Dashboards
- Create 3 report pages
- Add visualizations per layouts
- Apply DLI color theme
- Configure interactions

### 7. Configure RLS
- Manage roles → Create roles
- Define DAX filters
- Test with "View as" feature

### 8. Publish & Share
- Publish to workspace
- Share with security groups
- Embed in PowerApp if needed
- Schedule refresh

---

## Testing Checklist

- [ ] All data sources connected
- [ ] Relationships correctly defined
- [ ] DAX measures calculate properly
- [ ] Visualizations display correct data
- [ ] Filters work across pages
- [ ] Drill-through functioning
- [ ] RLS enforced (test with each role)
- [ ] Colors match DLI branding
- [ ] Performance acceptable (<3s load)
- [ ] Mobile layout optimized
- [ ] Data refresh succeeds

---

## Performance Optimization

### Best Practices

1. **Import vs Direct Query**
   - Import for historical data
   - Direct Query only for real-time KPIs
   - Aggregated DirectQuery for large datasets

2. **Reduce Data Volume**
   - Filter at source (Power Query)
   - Remove unused columns
   - Limit historical range (90 days active)

3. **Optimize DAX**
   - Use variables (VAR)
   - Avoid iterators in measures
   - Use CALCULATE instead of FILTER when possible

4. **Minimize Visuals per Page**
   - Max 8-10 visuals per page
   - Use bookmarks for detail views
   - Implement drill-through instead of crowding

5. **Incremental Refresh**
   - Keep 90 days in memory
   - Archive to storage
   - Refresh only new/changed data

---

## Monitoring & Maintenance

### Weekly
- Check refresh status
- Review dashboard performance
- Update date ranges if needed

### Monthly
- Review with Tutor Chiefs
- Gather feedback for improvements
- Update measures if requirements change

### Quarterly
- Full data model optimization
- Archive old data
- Performance tuning
- User training refresher

---

**PowerBI dashboards fully documented. Proceed to Segment 6 for CS approval package.**
