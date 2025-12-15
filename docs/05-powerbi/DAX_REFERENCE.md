# DAX Formulas Reference - PowerBI Dashboards

## Quick Reference Guide

All DAX measures for the MARDET Tutoring System PowerBI dashboards.

---

## Basic Metrics

### Count Measures

```DAX
TotalAppointments = 
COUNTROWS(Appointments)
```

```DAX
TotalStudents = 
COUNTROWS(Students)
```

```DAX
TotalTutors = 
COUNTROWS(Tutors)
```

```DAX
ActiveStudents = 
CALCULATE(
    COUNTROWS(Students),
    Students[Status] = "Active"
)
```

```DAX
ActiveTutors = 
CALCULATE(
    COUNTROWS(Tutors),
    Tutors[Status] = "Active"
)
```

---

## Appointment Metrics

### By Status

```DAX
CompletedSessions = 
CALCULATE(
    COUNTROWS(Appointments),
    Appointments[Status] = "Completed"
)
```

```DAX
ScheduledSessions = 
CALCULATE(
    COUNTROWS(Appointments),
    Appointments[Status] = "Scheduled"
)
```

```DAX
CancelledSessions = 
CALCULATE(
    COUNTROWS(Appointments),
    Appointments[Status] = "Cancelled"
)
```

```DAX
NoShowSessions = 
CALCULATE(
    COUNTROWS(Appointments),
    Appointments[Status] = "NoShow"
)
```

### Rates & Percentages

```DAX
CompletionRate = 
VAR TotalNonScheduled = 
    CALCULATE(
        COUNTROWS(Appointments),
        Appointments[Status] <> "Scheduled"
    )
VAR Completed = [CompletedSessions]
RETURN
    DIVIDE(Completed, TotalNonScheduled, 0) * 100
```

```DAX
NoShowRate = 
DIVIDE(
    [NoShowSessions],
    [TotalAppointments],
    0
) * 100
```

```DAX
CancellationRate = 
DIVIDE(
    [CancelledSessions],
    [TotalAppointments],
    0
) * 100
```

```DAX
ShowRate = 
VAR Total = [TotalAppointments]
VAR NoShows = [NoShowSessions]
VAR Cancelled = [CancelledSessions]
RETURN
    DIVIDE(Total - NoShows - Cancelled, Total, 0) * 100
```

---

## Time-Based Metrics

### Period Comparisons

```DAX
SessionsThisMonth = 
CALCULATE(
    [TotalAppointments],
    DATESMTD(DateTable[Date])
)
```

```DAX
SessionsLastMonth = 
CALCULATE(
    [TotalAppointments],
    DATEADD(DateTable[Date], -1, MONTH)
)
```

```DAX
SessionsThisWeek = 
CALCULATE(
    [TotalAppointments],
    DATESYTD(DateTable[Date])
)
```

```DAX
MoMGrowth = 
VAR CurrentMonth = [SessionsThisMonth]
VAR PreviousMonth = [SessionsLastMonth]
RETURN
    DIVIDE(CurrentMonth - PreviousMonth, PreviousMonth, 0) * 100
```

```DAX
YoYGrowth = 
VAR CurrentYear = [TotalAppointments]
VAR PreviousYear = 
    CALCULATE(
        [TotalAppointments],
        DATEADD(DateTable[Date], -1, YEAR)
    )
RETURN
    DIVIDE(CurrentYear - PreviousYear, PreviousYear, 0) * 100
```

### Moving Averages

```DAX
SessionsMovingAvg7Day = 
AVERAGEX(
    DATESINPERIOD(
        DateTable[Date],
        LASTDATE(DateTable[Date]),
        -7,
        DAY
    ),
    [TotalAppointments]
)
```

```DAX
SessionsMovingAvg30Day = 
AVERAGEX(
    DATESINPERIOD(
        DateTable[Date],
        LASTDATE(DateTable[Date]),
        -30,
        DAY
    ),
    [TotalAppointments]
)
```

---

## Tutor Metrics

### Hours & Utilization

```DAX
TutorTotalHours = 
SUMX(
    FILTER(
        Appointments,
        Appointments[Status] = "Completed"
    ),
    Appointments[Duration]
) / 60
```

```DAX
TutorUtilizationRate = 
VAR ActualHours = [TutorTotalHours]
VAR MaxHours = SUM(Tutors[MaxHoursPerWeek])
RETURN
    DIVIDE(ActualHours, MaxHours, 0) * 100
```

```DAX
TutorAvgSessionsPerWeek = 
VAR WeeksInPeriod = 
    DATEDIFF(
        MIN(Appointments[AppointmentDate]),
        MAX(Appointments[AppointmentDate]),
        WEEK
    )
VAR TotalSessions = [TotalAppointments]
RETURN
    DIVIDE(TotalSessions, WeeksInPeriod, 0)
```

```DAX
TutorAvgSessionDuration = 
AVERAGE(
    FILTER(
        Appointments,
        Appointments[Status] = "Completed"
    )[Duration]
)
```

### Per Tutor Calculations

```DAX
TutorSessionCount = 
CALCULATE(
    COUNTROWS(Appointments),
    USERELATIONSHIP(Appointments[TutorID], Tutors[ID])
)
```

```DAX
TutorHoursThisWeek = 
CALCULATE(
    SUMX(
        FILTER(
            Appointments,
            Appointments[Status] IN {"Completed", "Scheduled"}
        ),
        Appointments[Duration]
    ) / 60,
    DATESYTD(DateTable[Date])
)
```

```DAX
TutorCapacityRemaining = 
VAR Scheduled = [TutorHoursThisWeek]
VAR MaxHours = SELECTEDVALUE(Tutors[MaxHoursPerWeek])
RETURN
    MaxHours - Scheduled
```

```DAX
TutorUtilizationColor = 
VAR UtilRate = [TutorUtilizationRate]
RETURN
    SWITCH(
        TRUE(),
        UtilRate >= 70, "#4CAF50",  // Green
        UtilRate >= 50, "#FF9800",  // Orange
        "#F44336"                    // Red
    )
```

---

## Student Metrics

### Academic Performance

```DAX
AvgCurrentGrade = 
AVERAGE(ProgressTracking[CurrentGradeNumeric])
```

```DAX
AvgDLPTListening = 
AVERAGE(ProgressTracking[DLPTListeningNumeric])
```

```DAX
AvgDLPTReading = 
AVERAGE(ProgressTracking[DLPTReadingNumeric])
```

```DAX
DLPTReadyCount = 
CALCULATE(
    COUNTROWS(ProgressTracking),
    ProgressTracking[DLPTListeningNumeric] >= 2,
    ProgressTracking[DLPTReadingNumeric] >= 2
)
```

```DAX
DLPTReadyRate = 
DIVIDE(
    [DLPTReadyCount],
    [ActiveStudents],
    0
) * 100
```

### Tutoring Engagement

```DAX
AvgSessionsPerStudent = 
VAR TotalSessions = [CompletedSessions]
VAR TotalStudents = [ActiveStudents]
RETURN
    DIVIDE(TotalSessions, TotalStudents, 0)
```

```DAX
AvgHoursPerStudent = 
VAR TotalMinutes = 
    SUM(
        FILTER(
            Appointments,
            Appointments[Status] = "Completed"
        )[Duration]
    )
VAR TotalStudents = [ActiveStudents]
RETURN
    DIVIDE(TotalMinutes / 60, TotalStudents, 0)
```

```DAX
StudentAttendanceRate = 
VAR Scheduled = 
    CALCULATE(
        COUNTROWS(Appointments),
        Appointments[Status] IN {"Scheduled", "Completed"}
    )
VAR Attended = [CompletedSessions]
RETURN
    DIVIDE(Attended, Scheduled, 0) * 100
```

### At-Risk Identification

```DAX
StudentsAtRisk = 
CALCULATE(
    COUNTROWS(ProgressTracking),
    ProgressTracking[Trends] = "Declining" ||
    ProgressTracking[AttendanceRate] < 80
)
```

```DAX
StudentsWith3PlusNoShows = 
COUNTROWS(
    FILTER(
        SUMMARIZE(
            FILTER(Appointments, [Status] = "NoShow"),
            Students[ID],
            Students[FullName],
            "NoShowCount", COUNTROWS(Appointments)
        ),
        [NoShowCount] >= 3
    )
)
```

```DAX
LowPerformingStudents = 
CALCULATE(
    COUNTROWS(ProgressTracking),
    ProgressTracking[CurrentGradeNumeric] < 70
)
```

---

## Session Notes Metrics

### Completion & Quality

```DAX
SessionNotesCount = 
COUNTROWS(SessionNotes)
```

```DAX
NotesCompletionRate = 
DIVIDE(
    [SessionNotesCount],
    [CompletedSessions],
    0
) * 100
```

```DAX
MissingNotes = 
[CompletedSessions] - [SessionNotesCount]
```

```DAX
AvgNoteDuration = 
AVERAGE(SessionNotes[Duration])
```

### Performance Distribution

```DAX
ExcellentPerformance = 
CALCULATE(
    COUNTROWS(SessionNotes),
    SessionNotes[StudentPerformance] = "Excellent"
)
```

```DAX
GoodPerformance = 
CALCULATE(
    COUNTROWS(SessionNotes),
    SessionNotes[StudentPerformance] = "Good"
)
```

```DAX
SatisfactoryPerformance = 
CALCULATE(
    COUNTROWS(SessionNotes),
    SessionNotes[StudentPerformance] = "Satisfactory"
)
```

```DAX
NeedsImprovementPerformance = 
CALCULATE(
    COUNTROWS(SessionNotes),
    SessionNotes[StudentPerformance] = "Needs Improvement"
)
```

```DAX
AvgPerformanceScore = 
VAR ScoreMap = 
    SWITCH(
        SessionNotes[StudentPerformance],
        "Excellent", 4,
        "Good", 3,
        "Satisfactory", 2,
        "Needs Improvement", 1,
        0
    )
RETURN
    AVERAGEX(SessionNotes, ScoreMap)
```

---

## Language-Specific Metrics

```DAX
SessionsByLanguage = 
CALCULATE(
    COUNTROWS(Appointments),
    USERELATIONSHIP(Appointments[StudentID], Students[ID])
)
```

```DAX
TopLanguage = 
TOPN(
    1,
    SUMMARIZE(
        Students,
        Students[Language],
        "Count", COUNTROWS(Students)
    ),
    [Count],
    DESC
)
```

```DAX
LanguageDemandIndex = 
VAR TotalStudents = [ActiveStudents]
VAR LanguageStudents = 
    CALCULATE(
        COUNTROWS(Students),
        Students[Status] = "Active"
    )
RETURN
    DIVIDE(LanguageStudents, TotalStudents, 0) * 100
```

---

## Focus Area Analysis

```DAX
SessionsByFocusArea = 
// Note: FocusArea is multi-select, needs text parsing
VAR AllSessions = SessionNotes
RETURN
    COUNTROWS(
        FILTER(
            AllSessions,
            CONTAINSSTRING(SessionNotes[FocusAreas], "Vocab")
        )
    )
```

```DAX
VocabSessions = 
COUNTROWS(
    FILTER(
        SessionNotes,
        CONTAINSSTRING(SessionNotes[FocusAreas], "Vocab")
    )
)
```

```DAX
GrammarSessions = 
COUNTROWS(
    FILTER(
        SessionNotes,
        CONTAINSSTRING(SessionNotes[FocusAreas], "Grammar")
    )
)
```

```DAX
ListeningSessions = 
COUNTROWS(
    FILTER(
        SessionNotes,
        CONTAINSSTRING(SessionNotes[FocusAreas], "Listening")
    )
)
```

```DAX
DLPTPrepSessions = 
COUNTROWS(
    FILTER(
        SessionNotes,
        CONTAINSSTRING(SessionNotes[FocusAreas], "DLPT Prep")
    )
)
```

---

## Resource Metrics

```DAX
TotalResources = 
COUNTROWS(Resources)
```

```DAX
ActiveResources = 
CALCULATE(
    COUNTROWS(Resources),
    Resources[Active] = TRUE()
)
```

```DAX
FeaturedResources = 
CALCULATE(
    COUNTROWS(Resources),
    Resources[Featured] = TRUE()
)
```

```DAX
AvgResourceViews = 
AVERAGE(Resources[ViewCount])
```

```DAX
TopViewedResource = 
TOPN(
    1,
    Resources,
    Resources[ViewCount],
    DESC
)
```

---

## Calculated Columns

### In Appointments Table

```DAX
Appointments[WeekNumber] = 
WEEKNUM(Appointments[AppointmentDate])
```

```DAX
Appointments[MonthYear] = 
FORMAT(Appointments[AppointmentDate], "YYYY-MM")
```

```DAX
Appointments[DayOfWeek] = 
FORMAT(Appointments[AppointmentDate], "dddd")
```

```DAX
Appointments[TimeOfDay] = 
SWITCH(
    TRUE(),
    HOUR(Appointments[AppointmentDate]) < 12, "Morning",
    HOUR(Appointments[AppointmentDate]) < 17, "Afternoon",
    "Evening"
)
```

```DAX
Appointments[DurationHours] = 
Appointments[Duration] / 60
```

```DAX
Appointments[IsNoShow] = 
IF(Appointments[Status] = "NoShow", 1, 0)
```

### In Students Table

```DAX
Students[LanguageCategory] = 
SWITCH(
    Students[Language],
    "Arabic", "Middle East",
    "Farsi", "Middle East",
    "Russian", "Eastern Europe",
    "Chinese", "East Asia",
    "Korean", "East Asia",
    "Japanese", "East Asia",
    "Indonesian", "Southeast Asia",
    "Spanish", "Romance",
    "French", "Romance",
    "Other"
)
```

```DAX
Students[GradeNumeric] = 
SWITCH(
    TRUE(),
    Students[CurrentGrade] >= "A", 95,
    Students[CurrentGrade] >= "B", 85,
    Students[CurrentGrade] >= "C", 75,
    Students[CurrentGrade] >= "D", 65,
    55
)
```

### In ProgressTracking Table

```DAX
ProgressTracking[DLPTListeningNumeric] = 
SWITCH(
    ProgressTracking[DLPTListening],
    "3+", 3.5,
    "3", 3.0,
    "2+", 2.5,
    "2", 2.0,
    "1+", 1.5,
    "1", 1.0,
    "0+", 0.5,
    "0", 0,
    BLANK()
)
```

```DAX
ProgressTracking[DLPTReadingNumeric] = 
SWITCH(
    ProgressTracking[DLPTReading],
    "3+", 3.5,
    "3", 3.0,
    "2+", 2.5,
    "2", 2.0,
    "1+", 1.5,
    "1", 1.0,
    "0+", 0.5,
    "0", 0,
    BLANK()
)
```

```DAX
ProgressTracking[IsDLPTReady] = 
IF(
    ProgressTracking[DLPTListeningNumeric] >= 2 &&
    ProgressTracking[DLPTReadingNumeric] >= 2,
    TRUE(),
    FALSE()
)
```

---

## Time Intelligence

### Year-to-Date

```DAX
SessionsYTD = 
TOTALYTD(
    [TotalAppointments],
    DateTable[Date]
)
```

```DAX
HoursYTD = 
TOTALYTD(
    [TutorTotalHours],
    DateTable[Date]
)
```

### Quarter-to-Date

```DAX
SessionsQTD = 
TOTALQTD(
    [TotalAppointments],
    DateTable[Date]
)
```

### Prior Period

```DAX
SessionsPriorYear = 
CALCULATE(
    [TotalAppointments],
    SAMEPERIODLASTYEAR(DateTable[Date])
)
```

```DAX
SessionsPriorQuarter = 
CALCULATE(
    [TotalAppointments],
    PARALLELPERIOD(DateTable[Date], -1, QUARTER)
)
```

---

## Ranking & Top N

```DAX
TutorRank = 
RANKX(
    ALL(Tutors[FullName]),
    [TutorSessionCount],
    ,
    DESC,
    DENSE
)
```

```DAX
Top5Tutors = 
TOPN(
    5,
    ALL(Tutors[FullName]),
    [TutorSessionCount],
    DESC
)
```

```DAX
Top10NoShowStudents = 
TOPN(
    10,
    ALL(Students[FullName]),
    [NoShowSessions],
    DESC
)
```

---

## Conditional Formatting

### Status Indicators

```DAX
UtilizationStatus = 
VAR Rate = [TutorUtilizationRate]
RETURN
    SWITCH(
        TRUE(),
        Rate >= 70, "🟢 Optimal",
        Rate >= 50, "🟡 Moderate",
        "🔴 Low"
    )
```

```DAX
PerformanceTrend = 
VAR Trend = SELECTEDVALUE(ProgressTracking[Trends])
RETURN
    SWITCH(
        Trend,
        "Improving", "⬆️ Improving",
        "Declining", "⬇️ Declining",
        "➡️ Stable"
    )
```

```DAX
NotesCompletionStatus = 
VAR Rate = [NotesCompletionRate]
RETURN
    IF(Rate >= 95, "✅ On Target", "⚠️ Below Target")
```

---

## Best Practices

### Use Variables
```DAX
// Good - uses VAR for clarity and performance
MeasureName = 
VAR Value1 = [Measure1]
VAR Value2 = [Measure2]
RETURN
    Value1 + Value2
```

### Avoid Iterators in Measures
```DAX
// Bad
TotalHours = SUMX(Appointments, [Duration] / 60)

// Good
TotalHours = SUM(Appointments[Duration]) / 60
```

### Use DIVIDE for Safety
```DAX
// Bad - can cause division by zero error
Rate = [Numerator] / [Denominator]

// Good - handles zero denominator
Rate = DIVIDE([Numerator], [Denominator], 0)
```

### Filter Context
```DAX
// Understand difference between FILTER and CALCULATE
Filtered = CALCULATE([Measure], Appointments[Status] = "Completed")
```

---

## Testing DAX Measures

### Quick Tests

1. **Blank Check**: Does measure return blank when no data?
2. **Filter Test**: Does it respond to slicers correctly?
3. **Context Test**: Works in card, table, and matrix?
4. **Performance**: Runs in < 1 second?

### Common Issues

**Circular dependency**: Check relationship filters  
**Wrong aggregation**: Verify SUM vs SUMX  
**Context transition**: Use CALCULATE when needed  
**Relationship issues**: Check cardinality and direction

---

**Use these DAX formulas as building blocks for PowerBI dashboards.**
