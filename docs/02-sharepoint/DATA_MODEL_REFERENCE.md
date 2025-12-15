# SharePoint Data Model - Quick Reference

## Entity Relationship Diagram

```
┌─────────────────┐
│    TUTORS       │
├─────────────────┤
│ TutorID (PK)    │
│ FullName        │
│ Email           │
│ Languages [M]   │
│ MaxHoursPerWeek │
│ Status          │
│ CAC_EDIPI       │
└────────┬────────┘
         │
         │ 1:N
         │
         ▼
┌─────────────────┐        ┌─────────────────┐
│  APPOINTMENTS   │───────▶│  SESSIONNOTES   │
├─────────────────┤  1:1   ├─────────────────┤
│ AppointmentID   │        │ NoteID (PK)     │
│ TutorID (FK)    │        │ AppointmentID   │
│ StudentID (FK)  │        │ SessionDate     │
│ AppointmentDate │        │ Duration        │
│ Duration        │        │ Performance     │
│ Status          │        │ Materials       │
│ Location        │        │ Homework        │
│ FocusArea [M]   │        │ Recommendations │
└────────┬────────┘        └─────────────────┘
         │
         │ N:1
         │
         ▼
┌─────────────────┐        ┌─────────────────┐
│    STUDENTS     │───────▶│ PROGRESS        │
├─────────────────┤  1:N   │   TRACKING      │
│ StudentID (PK)  │        ├─────────────────┤
│ FullName        │        │ ProgressID (PK) │
│ Email           │        │ StudentID (FK)  │
│ Language        │        │ SnapshotDate    │
│ Class           │        │ CurrentGrade    │
│ Rank            │        │ DLPTListening   │
│ Company         │        │ DLPTReading     │
│ Status          │        │ Trends          │
│ CAC_EDIPI       │        │ TutoringHours   │
└─────────────────┘        └─────────────────┘


┌─────────────────┐
│   RESOURCES     │
├─────────────────┤
│ ResourceID (PK) │
│ Language        │
│ ResourceType    │
│ URL             │
│ DifficultyLevel │
│ Featured        │
│ Active          │
└─────────────────┘

[M] = Multi-select field
(PK) = Primary Key
(FK) = Foreign Key (Lookup)
```

---

## Field Type Legend

| Symbol | SharePoint Type | Example |
|--------|----------------|---------|
| 🔢 | Number | TutorID, Duration |
| 📝 | Single line text | FullName, Email |
| 📄 | Multiple lines | Notes, Description |
| ☑️ | Choice | Status, Rank |
| ☑️☑️ | Multi-Choice | Languages, FocusArea |
| 📅 | Date/DateTime | AppointmentDate |
| ✅ | Yes/No | Featured, Active |
| 🔗 | Lookup | TutorID → Tutors |
| 🌐 | Hyperlink | MeetingLink, URL |
| 👤 | Person | CreatedBy |
| 🧮 | Calculated | EndTime, IsUpcoming |

---

## Core Lists Summary

### 1. **Tutors** (Staff Management)
- **Primary Key**: TutorID
- **Key Fields**: Languages [multi], MaxHoursPerWeek, Status
- **Purpose**: Tutor roster and availability
- **Users**: 30-40 tutors across 9 languages

### 2. **Students** (Enrollment)
- **Primary Key**: StudentID
- **Key Fields**: Language [single], Class, Company, Status
- **Purpose**: Student registry and contact info
- **Users**: ~400 active students

### 3. **Appointments** (Scheduling)
- **Primary Key**: AppointmentID
- **Lookups**: TutorID, StudentID
- **Key Fields**: AppointmentDate, Duration, Status
- **Purpose**: Session booking and calendar
- **Records**: 50-100 per day, 2000+ per month

### 4. **SessionNotes** (Documentation)
- **Primary Key**: NoteID
- **Lookup**: AppointmentID
- **Key Fields**: MaterialsCovered, StudentPerformance
- **Purpose**: Post-session documentation
- **Records**: 1 per completed appointment

### 5. **ProgressTracking** (Analytics)
- **Primary Key**: ProgressID
- **Lookup**: StudentID
- **Key Fields**: DLPTListening, DLPTReading, Trends
- **Purpose**: Academic progress snapshots
- **Records**: Monthly per student (~400/month)

### 6. **Resources** (Library)
- **Primary Key**: ResourceID
- **Key Fields**: Language, ResourceType, URL
- **Purpose**: Link to public study materials
- **Records**: 100-500 resources total

---

## Choice Field Values

### Status (Universal)
```
✅ Active
⏸️ Inactive
🏖️ On Leave
🎓 Graduated (Students only)
❌ Dropped (Students only)
```

### Performance Levels
```
⭐⭐⭐ Excellent
⭐⭐ Good
⭐ Satisfactory
❗ Needs Improvement
```

### DLPT/OPI Scores
```
0   - No proficiency
0+  - Memorized proficiency
1   - Elementary
1+  - Elementary Plus
2   - Limited Working
2+  - Limited Working Plus
3   - Professional Working
3+  - Professional Working Plus
```

### Appointment Status
```
📅 Scheduled  - Future appointment
✅ Completed  - Session finished
❌ Cancelled  - Student/tutor cancelled
🚫 NoShow    - Student didn't attend
```

---

## Data Flow

### Booking Workflow
```
Student → Create Appointment (Status: Scheduled)
    ↓
System → Send reminder (ReminderSent: Yes)
    ↓
Session → Update Status (Completed/NoShow/Cancelled)
    ↓
Tutor → Create SessionNotes
    ↓
Monthly → Create ProgressTracking entry
```

### Recurring Appointments
```
Student → Book with RecurringPattern
    ↓
Power Automate → Generate series with RecurringSeriesID
    ↓
Multiple Appointments → Linked by GUID
    ↓
Cancel one → Others remain
Cancel series → Update all with same SeriesID
```

---

## Critical Relationships

### One-to-Many (1:N)
- **Tutor → Appointments**: Each tutor has many appointments
- **Student → Appointments**: Each student has many appointments
- **Student → ProgressTracking**: Each student has many snapshots

### One-to-One (1:1)
- **Appointment → SessionNotes**: Each appointment has one note set

### Many-to-Many (M:N)
- **Tutors ↔ Students**: Via Appointments table (junction)
- One tutor can teach many students
- One student can have many tutors

---

## Indexing Strategy

### High-Priority Indexes
```
Appointments.AppointmentDate    - For calendar queries
Appointments.Status             - Filter scheduled vs completed
Appointments.TutorID            - Tutor schedule views
Appointments.StudentID          - Student history views
Students.CAC_EDIPI              - Authentication lookup
Students.Language               - Filter by language
Tutors.CAC_EDIPI                - Authentication lookup
SessionNotes.AppointmentID      - Link to appointments
```

---

## Size Estimates (1 Year)

| List | Records/Year | Storage |
|------|-------------|---------|
| Tutors | 30-40 | <1 MB |
| Students | 400-600 | <5 MB |
| Appointments | 20,000-30,000 | 15-20 MB |
| SessionNotes | 15,000-20,000 | 50-75 MB |
| ProgressTracking | 4,000-5,000 | 5-10 MB |
| Resources | 100-500 | <1 MB |
| **TOTAL** | **~50,000** | **~100 MB** |

---

## Permissions Matrix

| Role | Tutors | Students | Appointments | SessionNotes | Progress | Resources |
|------|--------|----------|--------------|--------------|----------|-----------|
| **Student** | Read | R/W Own | R/W Own | Read Own | Read Own | Read |
| **Tutor** | Read + Edit Own | Read (lang) | R/W Assigned | R/W Own | Read (lang) | Read + Suggest |
| **Tutor Chief** | Full | Full | Full | Full | Full | Full |
| **Admin** | Full | Full | Full | Full | Full | Full |

---

## Validation Rules

### Appointments
- AppointmentDate >= Today (for new bookings)
- Duration ∈ {30, 60, 90, 120}
- No overlapping appointments for same tutor
- No overlapping appointments for same student

### Students/Tutors
- CAC_EDIPI = exactly 10 digits
- Email ends with @dli.edu or .mil
- PhoneNumber matches (XXX) XXX-XXXX

### SessionNotes
- SessionDate matches AppointmentID.AppointmentDate
- Duration <= 2× scheduled duration
- Can only create for Completed appointments

---

## PowerBI Connection Points

### Key Metrics to Track
1. **Utilization Rate**: Appointments / MaxHoursPerWeek per tutor
2. **No-Show Rate**: NoShow appointments / Total appointments
3. **Student Progress**: DLPT score trends over time
4. **Language Demand**: Appointments grouped by language
5. **Tutor Workload**: Hours per tutor per week
6. **Session Duration**: Actual vs scheduled time

### Data Sources
- Primary: SharePoint Lists (direct connection)
- Refresh: Daily overnight
- Filters: Date range, Language, Company, Status

---

## Maintenance Schedule

### Daily
- Monitor appointment creation/cancellations
- Check no-show flags

### Weekly
- Review tutor workload distribution
- Archive completed appointments >90 days

### Monthly
- Generate progress snapshots for all students
- Update resource library
- Clean inactive records

### Quarterly
- Full data audit
- Permission review
- Performance optimization
- Generate reports for leadership

---

## Quick Commands

### Find Student's Next Appointment
```
Filter: StudentID = [Current User]
       AND Status = "Scheduled"
       AND AppointmentDate > Today
Sort: AppointmentDate ASC
Limit: 1
```

### Tutor's Weekly Schedule
```
Filter: TutorID = [Current User]
       AND AppointmentDate >= [Monday]
       AND AppointmentDate <= [Sunday]
       AND Status != "Cancelled"
Sort: AppointmentDate ASC
```

### Students Needing Help
```
Filter: Trends = "Declining"
       AND Status = "Active"
Join: Latest SessionNotes where Performance = "Needs Improvement"
```

---

## Export for PowerBI

### Sample DAX Measure
```dax
TutoringHoursThisWeek = 
CALCULATE(
    SUM(Appointments[Duration]) / 60,
    Appointments[Status] = "Completed",
    Appointments[AppointmentDate] >= TODAY() - 7,
    Appointments[AppointmentDate] <= TODAY()
)
```

### Sample Query
```sql
SELECT 
    s.FullName as StudentName,
    s.Language,
    COUNT(a.AppointmentID) as TotalSessions,
    AVG(sn.Duration) as AvgSessionLength,
    MAX(pt.DLPTListening) as HighestListening,
    MAX(pt.DLPTReading) as HighestReading
FROM Students s
LEFT JOIN Appointments a ON s.StudentID = a.StudentID
LEFT JOIN SessionNotes sn ON a.AppointmentID = sn.AppointmentID
LEFT JOIN ProgressTracking pt ON s.StudentID = pt.StudentID
WHERE s.Status = 'Active'
GROUP BY s.StudentID
```
