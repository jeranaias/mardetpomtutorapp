# SharePoint Lists Data Model - MARDET Tutoring System

## Overview

This document defines the complete SharePoint list structure for the MARDET Language Tutoring Operations Manager PowerApp. All lists will be created in the Marine Corps Detachment SharePoint site.

**SharePoint Site**: Marine Corps Detachment  
**Site Collection**: DLIFLC  
**Lists Location**: `/sites/MarDet/Lists/`

---

## List 1: Tutors

**Purpose**: Store tutor information, availability, and workload capacity

### Columns

| Column Name | Type | Required | Settings |
|------------|------|----------|----------|
| Title | Single line of text | Yes | Display name (auto-created) |
| TutorID | Number | Yes | Auto-increment, unique identifier |
| FullName | Single line of text | Yes | Max 100 chars |
| Email | Single line of text | Yes | Email format validation |
| Rank | Choice | Yes | Choices: SSgt, GySgt, MSgt, MGySgt, Civilian |
| Languages | Choice | Yes | Multi-select: Arabic, Russian, Chinese, Korean, Farsi, Spanish, French, Indonesian, Japanese |
| MaxHoursPerWeek | Number | Yes | Default: 20, Min: 0, Max: 40 |
| Status | Choice | Yes | Active, Inactive, On Leave. Default: Active |
| CAC_EDIPI | Single line of text | Yes | 10 digits, unique |
| PhoneNumber | Single line of text | No | Format: (XXX) XXX-XXXX |
| OfficeLocation | Single line of text | No | Building and room number |
| Specializations | Multiple lines of text | No | Plain text, areas of expertise |
| Bio | Multiple lines of text | No | Rich text, tutor background |
| HireDate | Date | Yes | Date only |
| Notes | Multiple lines of text | No | Plain text, admin notes |

### Permissions
- **Students**: Read only (view tutor list, no PII)
- **Tutors**: Read own record, update Specializations/Bio
- **Tutor Chiefs**: Full control
- **Admin**: Full control

### Views
- **Active Tutors**: Filter Status = Active, sort by FullName
- **By Language**: Group by Languages
- **Availability**: Show MaxHoursPerWeek, current week appointments

---

## List 2: Students

**Purpose**: Store student enrollment and contact information

### Columns

| Column Name | Type | Required | Settings |
|------------|------|----------|----------|
| Title | Single line of text | Yes | Display name |
| StudentID | Number | Yes | Auto-increment |
| FullName | Single line of text | Yes | Max 100 chars |
| Email | Single line of text | Yes | DLI email format |
| Rank | Choice | Yes | Choices: Pvt, PFC, LCpl, Cpl, Sgt, SSgt, GySgt, MSgt |
| Language | Choice | Yes | Single select: Arabic, Russian, Chinese, Korean, Farsi, Spanish, French, Indonesian, Japanese |
| Class | Single line of text | Yes | Format: ARA-001-2025 |
| CurrentGrade | Single line of text | No | Letter grade or percentage |
| CAC_EDIPI | Single line of text | Yes | 10 digits, unique |
| PhoneNumber | Single line of text | No | Format: (XXX) XXX-XXXX |
| Company | Choice | Yes | Alpha, Bravo, Charlie, Delta, Echo, HQ |
| Platoon | Number | No | 1-4 |
| Squad | Number | No | 1-4 |
| EnrollmentDate | Date | Yes | Date only |
| GraduationDate | Date | No | Expected graduation |
| Status | Choice | Yes | Active, Graduated, Dropped, On Leave. Default: Active |
| Notes | Multiple lines of text | No | Plain text, admin notes |

### Permissions
- **Students**: Read/write own record only
- **Tutors**: Read all active students in their languages
- **Tutor Chiefs**: Full control
- **Admin**: Full control

### Views
- **Active Students**: Filter Status = Active, sort by Class
- **By Language**: Group by Language
- **My Students** (for tutors): Filter by Language, Status = Active
- **Graduating Soon**: Filter GraduationDate < 30 days from today

---

## List 3: Appointments

**Purpose**: Track all tutoring appointments, past and future

### Columns

| Column Name | Type | Required | Settings |
|------------|------|----------|----------|
| Title | Single line of text | Yes | Auto-generated: "[Student] with [Tutor]" |
| AppointmentID | Number | Yes | Auto-increment |
| TutorID | Lookup | Yes | Lookup to Tutors list, show FullName |
| StudentID | Lookup | Yes | Lookup to Students list, show FullName |
| AppointmentDate | Date | Yes | Date and time |
| Duration | Number | Yes | Minutes. Default: 60. Choices: 30, 60, 90, 120 |
| Status | Choice | Yes | Scheduled, Completed, Cancelled, NoShow. Default: Scheduled |
| Location | Choice | No | Tutoring Center, Online, Building 637, Other |
| MeetingLink | Hyperlink | No | For online sessions |
| RecurringPattern | Single line of text | No | JSON: {"frequency": "weekly", "end": "2025-06-01"} |
| RecurringSeriesID | Single line of text | No | GUID for grouping recurring appointments |
| FocusArea | Choice | No | Multi-select: Vocab, Grammar, Listening, Reading, Speaking, Writing, DLPT Prep |
| CancellationReason | Multiple lines of text | No | Plain text |
| CreatedByStudent | Yes/No | Yes | Default: No |
| ReminderSent | Yes/No | Yes | Default: No. For automation tracking |
| BookingNotes | Multiple lines of text | No | Plain text, student's notes when booking |
| Created | Date | Yes | Auto-populated |
| Modified | Date | Yes | Auto-updated |

### Calculated Columns
- **EndTime**: =[AppointmentDate] + ([Duration]/1440)
- **IsUpcoming**: =IF([AppointmentDate]>NOW(),"Yes","No")
- **WeekOf**: =TEXT([AppointmentDate],"YYYY-MM-DD (Week WW)")

### Permissions
- **Students**: Create new, read/write own appointments only
- **Tutors**: Read all assigned appointments, update Status/FocusArea
- **Tutor Chiefs**: Full control
- **Admin**: Full control

### Views
- **My Appointments** (students): Filter by current user
- **My Schedule** (tutors): Filter by TutorID = current user
- **Today**: Filter AppointmentDate = Today, Status = Scheduled
- **Upcoming**: Filter Status = Scheduled, AppointmentDate > Today
- **Calendar View**: Standard calendar grouped by tutor
- **No Shows**: Filter Status = NoShow, last 30 days

---

## List 4: SessionNotes

**Purpose**: Document what occurred during each tutoring session

### Columns

| Column Name | Type | Required | Settings |
|------------|------|----------|----------|
| Title | Single line of text | Yes | Auto: "Session - [AppointmentID]" |
| NoteID | Number | Yes | Auto-increment |
| AppointmentID | Lookup | Yes | Lookup to Appointments list |
| SessionDate | Date | Yes | Date and time from appointment |
| Duration | Number | Yes | Actual minutes spent |
| MaterialsCovered | Multiple lines of text | Yes | Rich text, detailed notes |
| StudentPerformance | Choice | Yes | Excellent, Good, Satisfactory, Needs Improvement |
| FocusAreas | Choice | No | Multi-select: Vocab, Grammar, Listening, Reading, Speaking, Writing, DLPT Prep |
| HomeworkAssigned | Multiple lines of text | No | Rich text |
| NextSessionGoals | Multiple lines of text | No | Plain text |
| StudentParticipation | Choice | Yes | Engaged, Average, Distracted |
| ChallengesObserved | Multiple lines of text | No | Plain text |
| Recommendations | Multiple lines of text | No | Plain text |
| AttachedResources | Multiple lines of text | No | Links to materials |
| Created | Date | Yes | Auto-populated |
| CreatedBy | Person | Yes | Auto-populated |

### Permissions
- **Students**: Read own session notes only
- **Tutors**: Create/edit notes for own sessions only
- **Tutor Chiefs**: Read all
- **Admin**: Full control

### Views
- **My Notes** (tutor): Filter by current user's appointments
- **Student History**: Filter by StudentID, sort by date desc
- **Recent Sessions**: Last 30 days
- **Needs Follow-Up**: Filter StudentPerformance = Needs Improvement

---

## List 5: ProgressTracking

**Purpose**: Periodic snapshots of student academic progress

### Columns

| Column Name | Type | Required | Settings |
|------------|------|----------|----------|
| Title | Single line of text | Yes | Auto: "[Student] - [Date]" |
| ProgressID | Number | Yes | Auto-increment |
| StudentID | Lookup | Yes | Lookup to Students list |
| SnapshotDate | Date | Yes | Date only |
| CurrentGrade | Single line of text | No | Letter grade or percentage |
| DLPTListening | Choice | No | 0, 0+, 1, 1+, 2, 2+, 3, 3+ |
| DLPTReading | Choice | No | 0, 0+, 1, 1+, 2, 2+, 3, 3+ |
| ModularExams | Multiple lines of text | No | JSON array of exam results |
| OPIScore | Choice | No | 0, 0+, 1, 1+, 2, 2+, 3, 3+ |
| AttendanceRate | Number | No | Percentage 0-100 |
| TutoringHours | Number | No | Total hours received |
| Trends | Choice | No | Improving, Stable, Declining |
| Goals | Multiple lines of text | No | Plain text |
| Notes | Multiple lines of text | No | Plain text |

### Permissions
- **Students**: Read own progress only
- **Tutors**: Read students in their languages
- **Tutor Chiefs**: Full control
- **Admin**: Full control

### Views
- **My Progress** (student): Filter by current user
- **Declining Students**: Filter Trends = Declining
- **DLPT Ready**: Filter both DLPT scores >= 2
- **By Month**: Group by month of SnapshotDate

---

## List 6: Resources

**Purpose**: Link library to public site resources

### Columns

| Column Name | Type | Required | Settings |
|------------|------|----------|----------|
| Title | Single line of text | Yes | Resource name |
| ResourceID | Number | Yes | Auto-increment |
| Language | Choice | Yes | Arabic, Russian, Chinese, Korean, Farsi, Spanish, French, Indonesian, Japanese |
| ResourceType | Choice | Yes | Vocab, Grammar, Listening, Reading, Speaking, Writing, DLPT Practice, Other |
| Description | Multiple lines of text | No | Rich text |
| URL | Hyperlink | Yes | Link to public site or external |
| DifficultyLevel | Choice | No | Beginner, Intermediate, Advanced |
| Tags | Multiple lines of text | No | Comma-separated |
| UploadedBy | Person | Yes | Auto-populated |
| UploadDate | Date | Yes | Auto-populated |
| ViewCount | Number | No | Incremented via Power Automate |
| Featured | Yes/No | No | Default: No |
| Active | Yes/No | Yes | Default: Yes |

### Permissions
- **All Users**: Read only
- **Tutors**: Suggest resources (limited add)
- **Tutor Chiefs**: Full control
- **Admin**: Full control

### Views
- **All Active**: Filter Active = Yes
- **By Language**: Group by Language
- **Featured**: Filter Featured = Yes
- **Most Viewed**: Sort by ViewCount desc

---

## Relationships

```
Students (1) ──→ (Many) Appointments
Tutors (1) ──→ (Many) Appointments
Appointments (1) ──→ (1) SessionNotes
Students (1) ──→ (Many) ProgressTracking
```

---

## Creation Scripts

### PowerShell Script to Create Lists

```powershell
# Connect to SharePoint
Connect-PnPOnline -Url "https://dliflc.sharepoint.com/sites/MarDet" -Interactive

# Create Tutors List
New-PnPList -Title "Tutors" -Template GenericList -Url "Lists/Tutors"
Add-PnPField -List "Tutors" -DisplayName "TutorID" -InternalName "TutorID" -Type Number -Required
Add-PnPField -List "Tutors" -DisplayName "FullName" -InternalName "FullName" -Type Text -Required
Add-PnPField -List "Tutors" -DisplayName "Email" -InternalName "Email" -Type Text -Required
Add-PnPField -List "Tutors" -DisplayName "Rank" -InternalName "Rank" -Type Choice -Choices "SSgt","GySgt","MSgt","MGySgt","Civilian" -Required
Add-PnPField -List "Tutors" -DisplayName "Languages" -InternalName "Languages" -Type MultiChoice -Choices "Arabic","Russian","Chinese","Korean","Farsi","Spanish","French","Indonesian","Japanese" -Required
Add-PnPField -List "Tutors" -DisplayName "MaxHoursPerWeek" -InternalName "MaxHoursPerWeek" -Type Number -Required
Add-PnPField -List "Tutors" -DisplayName "Status" -InternalName "Status" -Type Choice -Choices "Active","Inactive","On Leave" -Required -DefaultValue "Active"
Add-PnPField -List "Tutors" -DisplayName "CAC_EDIPI" -InternalName "CAC_EDIPI" -Type Text -Required

# Create Students List
New-PnPList -Title "Students" -Template GenericList -Url "Lists/Students"
Add-PnPField -List "Students" -DisplayName "StudentID" -InternalName "StudentID" -Type Number -Required
Add-PnPField -List "Students" -DisplayName "FullName" -InternalName "FullName" -Type Text -Required
Add-PnPField -List "Students" -DisplayName "Email" -InternalName "Email" -Type Text -Required
Add-PnPField -List "Students" -DisplayName "Rank" -InternalName "Rank" -Type Choice -Choices "Pvt","PFC","LCpl","Cpl","Sgt","SSgt","GySgt","MSgt" -Required
Add-PnPField -List "Students" -DisplayName "Language" -InternalName "Language" -Type Choice -Choices "Arabic","Russian","Chinese","Korean","Farsi","Spanish","French","Indonesian","Japanese" -Required
Add-PnPField -List "Students" -DisplayName "Class" -InternalName "Class" -Type Text -Required
Add-PnPField -List "Students" -DisplayName "CAC_EDIPI" -InternalName "CAC_EDIPI" -Type Text -Required
Add-PnPField -List "Students" -DisplayName "Company" -InternalName "Company" -Type Choice -Choices "Alpha","Bravo","Charlie","Delta","Echo","HQ" -Required
Add-PnPField -List "Students" -DisplayName "Status" -InternalName "Status" -Type Choice -Choices "Active","Graduated","Dropped","On Leave" -Required -DefaultValue "Active"

# Create Appointments List
New-PnPList -Title "Appointments" -Template GenericList -Url "Lists/Appointments"
Add-PnPField -List "Appointments" -DisplayName "AppointmentID" -InternalName "AppointmentID" -Type Number -Required
Add-PnPField -List "Appointments" -DisplayName "AppointmentDate" -InternalName "AppointmentDate" -Type DateTime -Required
Add-PnPField -List "Appointments" -DisplayName "Duration" -InternalName "Duration" -Type Number -Required
Add-PnPField -List "Appointments" -DisplayName "Status" -InternalName "Status" -Type Choice -Choices "Scheduled","Completed","Cancelled","NoShow" -Required -DefaultValue "Scheduled"
Add-PnPField -List "Appointments" -DisplayName "Location" -InternalName "Location" -Type Choice -Choices "Tutoring Center","Online","Building 637","Other"
Add-PnPField -List "Appointments" -DisplayName "FocusArea" -InternalName "FocusArea" -Type MultiChoice -Choices "Vocab","Grammar","Listening","Reading","Speaking","Writing","DLPT Prep"

# Add Lookups (must be done after lists exist)
Add-PnPField -List "Appointments" -DisplayName "TutorID" -InternalName "TutorID" -Type Lookup -Required -LookupList "Tutors" -LookupField "FullName"
Add-PnPField -List "Appointments" -DisplayName "StudentID" -InternalName "StudentID" -Type Lookup -Required -LookupList "Students" -LookupField "FullName"

# Create SessionNotes List
New-PnPList -Title "SessionNotes" -Template GenericList -Url "Lists/SessionNotes"
Add-PnPField -List "SessionNotes" -DisplayName "NoteID" -InternalName "NoteID" -Type Number -Required
Add-PnPField -List "SessionNotes" -DisplayName "AppointmentID" -InternalName "AppointmentID" -Type Lookup -Required -LookupList "Appointments" -LookupField "Title"
Add-PnPField -List "SessionNotes" -DisplayName "SessionDate" -InternalName "SessionDate" -Type DateTime -Required
Add-PnPField -List "SessionNotes" -DisplayName "Duration" -InternalName "Duration" -Type Number -Required
Add-PnPField -List "SessionNotes" -DisplayName "StudentPerformance" -InternalName "StudentPerformance" -Type Choice -Choices "Excellent","Good","Satisfactory","Needs Improvement" -Required
Add-PnPField -List "SessionNotes" -DisplayName "StudentParticipation" -InternalName "StudentParticipation" -Type Choice -Choices "Engaged","Average","Distracted" -Required

# Create ProgressTracking List
New-PnPList -Title "ProgressTracking" -Template GenericList -Url "Lists/ProgressTracking"
Add-PnPField -List "ProgressTracking" -DisplayName "ProgressID" -InternalName "ProgressID" -Type Number -Required
Add-PnPField -List "ProgressTracking" -DisplayName "StudentID" -InternalName "StudentID" -Type Lookup -Required -LookupList "Students" -LookupField "FullName"
Add-PnPField -List "ProgressTracking" -DisplayName "SnapshotDate" -InternalName "SnapshotDate" -Type DateTime -Required
Add-PnPField -List "ProgressTracking" -DisplayName "DLPTListening" -InternalName "DLPTListening" -Type Choice -Choices "0","0+","1","1+","2","2+","3","3+"
Add-PnPField -List "ProgressTracking" -DisplayName "DLPTReading" -InternalName "DLPTReading" -Type Choice -Choices "0","0+","1","1+","2","2+","3","3+"
Add-PnPField -List "ProgressTracking" -DisplayName "Trends" -InternalName "Trends" -Type Choice -Choices "Improving","Stable","Declining"

# Create Resources List
New-PnPList -Title "Resources" -Template GenericList -Url "Lists/Resources"
Add-PnPField -List "Resources" -DisplayName "ResourceID" -InternalName "ResourceID" -Type Number -Required
Add-PnPField -List "Resources" -DisplayName "Language" -InternalName "Language" -Type Choice -Choices "Arabic","Russian","Chinese","Korean","Farsi","Spanish","French","Indonesian","Japanese" -Required
Add-PnPField -List "Resources" -DisplayName "ResourceType" -InternalName "ResourceType" -Type Choice -Choices "Vocab","Grammar","Listening","Reading","Speaking","Writing","DLPT Practice","Other" -Required
Add-PnPField -List "Resources" -DisplayName "URL" -InternalName "URL" -Type URL -Required
Add-PnPField -List "Resources" -DisplayName "DifficultyLevel" -InternalName "DifficultyLevel" -Type Choice -Choices "Beginner","Intermediate","Advanced"
Add-PnPField -List "Resources" -DisplayName "Featured" -InternalName "Featured" -Type Boolean
Add-PnPField -List "Resources" -DisplayName "Active" -InternalName "Active" -Type Boolean -DefaultValue "Yes"

Write-Host "All lists created successfully!"
```

---

## Test Data

### Sample Tutor
```
FullName: SSgt John Smith
Email: john.smith@dli.edu
Rank: SSgt
Languages: Arabic, Farsi
MaxHoursPerWeek: 25
Status: Active
CAC_EDIPI: 1234567890
```

### Sample Student
```
FullName: LCpl Jane Doe
Email: jane.doe@dli.edu
Rank: LCpl
Language: Arabic
Class: ARA-001-2025
Status: Active
CAC_EDIPI: 0987654321
Company: Alpha
Platoon: 1
```

### Sample Appointment
```
TutorID: SSgt John Smith (lookup)
StudentID: LCpl Jane Doe (lookup)
AppointmentDate: 2025-12-16 14:00
Duration: 60
Status: Scheduled
Location: Tutoring Center
FocusArea: Grammar, Vocab
```

---

## Indexing for Performance

Create indexes on these columns:
- Appointments: AppointmentDate, Status, TutorID, StudentID
- Students: CAC_EDIPI, Language, Status
- Tutors: CAC_EDIPI, Status
- SessionNotes: AppointmentID
- ProgressTracking: StudentID, SnapshotDate

---

## Maintenance Tasks

### Weekly
- Archive completed appointments older than 90 days
- Check for orphaned session notes
- Review no-show rates

### Monthly
- Generate progress snapshots for all active students
- Update tutor availability based on workload
- Clean up inactive resources

### Quarterly
- Full data audit
- Permission review
- Performance optimization
