# SharePoint Lists - Manual Adjustments

After CSV import, make these adjustments to optimize each list.

---

## 1. Appointments ✅ Uploaded

### Convert to Choice Columns
| Column | Type | Options |
|--------|------|---------|
| Status | Choice | Scheduled, Completed, Cancelled, NoShow |
| Location | Choice | Tutoring Center, Classroom, Online |

### Add Missing Columns
| Column | Type | Default | Purpose |
|--------|------|---------|---------|
| ReminderSent | Yes/No | No | Power Automate 24hr reminder tracking |
| NotificationSent | Yes/No | No | Power Automate confirmation email tracking |
| RecurringSeriesID | Single line of text | (blank) | Links recurring appointment series |

### Optional: Lookup Columns
- Add `StudentID` → Lookup to Students list
- Add `TutorID` → Lookup to Tutors list

---

## 2. Students ✅ Uploaded

### Convert to Choice Columns
| Column | Type | Options |
|--------|------|---------|
| Status | Choice | Active, Inactive, Graduated |
| Rank | Choice | PFC, LCpl, Cpl, Sgt, SSgt, GySgt, MSgt, MGySgt |
| Language | Choice | Arabic, Chinese, Farsi, French, Indonesian, Japanese, Korean, Russian, Spanish |
| Company | Choice | Alpha, Bravo, Charlie, Delta |

### Convert to Number Columns
| Column | Type | Notes |
|--------|------|-------|
| Platoon | Number | Whole number only |
| Squad | Number | Whole number only |

### Optional Additions
| Column | Type | Purpose |
|--------|------|---------|
| ProfilePhoto | Image | Student photo |

---

## 3. Tutors ✅ Uploaded

### Convert to Choice Columns
| Column | Type | Options |
|--------|------|---------|
| Status | Choice | Active, Inactive, OnLeave |
| Rank | Choice | SSgt, GySgt, MSgt, MGySgt, Civilian |

### Convert to Number Columns
| Column | Type | Notes |
|--------|------|-------|
| MaxHoursPerWeek | Number | Whole number only |

### Note on Email Column
- Email resolved to real person (Wei Chen) - this is correct behavior
- For other tutors, add their real @dliflc.edu emails

---

## 4. SessionNotes ✅ Uploaded

### Convert to Choice Columns
| Column | Type | Options |
|--------|------|---------|
| StudentPerformance | Choice | Excellent, Good, Satisfactory, NeedsImprovement, Poor |
| StudentParticipation | Choice | Engaged, Average, Distracted, Minimal |
| FocusAreas | Choice (multi-select) | Listening, Reading, Speaking, Writing, Grammar, Vocab |

### Convert to Number Columns
| Column | Type | Notes |
|--------|------|-------|
| ActualDuration | Number | Minutes as whole number |

### Optional: Lookup Columns
- Add `AppointmentID` → Lookup to Appointments list
- Add `StudentID` → Lookup to Students list
- Add `TutorID` → Lookup to Tutors list

---

## 5. ProgressTracking ✅ Uploaded

### Convert to Choice Columns
| Column | Type | Options |
|--------|------|---------|
| Trends | Choice | Improving, Stable, Declining |
| OverallGrade | Choice | A, A-, B+, B, B-, C+, C, C-, D, F |
| ListeningGrade | Choice | A, A-, B+, B, B-, C+, C, C-, D, F |
| ReadingGrade | Choice | A, A-, B+, B, B-, C+, C, C-, D, F |
| SpeakingGrade | Choice | A, A-, B+, B, B-, C+, C, C-, D, F |
| WritingGrade | Choice | A, A-, B+, B, B-, C+, C, C-, D, F |

### Convert to Number Columns
| Column | Type | Notes |
|--------|------|-------|
| AttendanceRate | Number | Percentage (0-100) |
| TutoringHours | Number | Decimal allowed |

### Optional: Lookup Columns
- Add `StudentID` → Lookup to Students list

---

## 6. Resources ✅ Uploaded

### Convert to Choice Columns
| Column | Type | Options |
|--------|------|---------|
| Language | Choice | Arabic, Chinese, Farsi, French, Indonesian, Japanese, Korean, Russian, Spanish |
| ResourceType | Choice | Vocab, Grammar, Listening, Reading, Speaking, Writing, DLPT Practice |
| DifficultyLevel | Choice | Beginner, Intermediate, Advanced |

### Convert to Yes/No Columns
| Column | Type | Notes |
|--------|------|-------|
| Featured | Yes/No | Highlight on main page |
| Active | Yes/No | Show/hide resource |

### Convert to Number Columns
| Column | Type | Notes |
|--------|------|-------|
| ViewCount | Number | Whole number only |

---

## How to Make Adjustments

### Convert Text to Choice Column
1. Click column header → **Column settings** → **Edit**
2. Change **Type** to "Choice"
3. Enter each option on a new line
4. For multi-select, toggle "Allow multiple selections"
5. Save

### Convert Text to Number Column
1. Click column header → **Column settings** → **Edit**
2. Change **Type** to "Number"
3. Set decimal places (0 for whole numbers)
4. Save

### Convert Text to Yes/No Column
1. Click column header → **Column settings** → **Edit**
2. Change **Type** to "Yes/No"
3. Set default value
4. Save

### Add Lookup Column
1. Click **+ Add column** → **Look up**
2. Select the target list
3. Choose which column to display
4. Save

---

## Index Columns (Performance)

After all adjustments, add indexes to frequently filtered columns:

| List | Columns to Index |
|------|------------------|
| Appointments | AppointmentDate, Status, StudentName, TutorName |
| Students | Email, Status, Language |
| Tutors | Email, Status, Languages |
| SessionNotes | SessionDate, StudentName |
| ProgressTracking | StudentName, SnapshotDate |
| Resources | Language, ResourceType, Active |

**How to index:** List Settings → Indexed columns → Create new index

---

## Priority Order

Do these first (most important):
1. **Appointments** - Status, Location as Choice + add ReminderSent/NotificationSent
2. **Students** - Status, Rank, Language as Choice
3. **Tutors** - Status as Choice

Do these later (nice to have):
4. SessionNotes - Performance/Participation as Choice
5. ProgressTracking - Grade columns as Choice
6. Resources - Language, ResourceType as Choice

---

## Permissions Setup

After adjustments, configure list permissions per **PERMISSIONS_GUIDE.md**:
- Break inheritance on: Tutors, Students, SessionNotes
- Remove MCD Visitors from those 3 lists

---

*Last updated: January 2026*
