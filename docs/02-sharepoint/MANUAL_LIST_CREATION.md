# Manual SharePoint List Creation Guide

## For users who prefer GUI over PowerShell scripts

This guide walks through creating each SharePoint list manually through the web interface.

---

## Prerequisites

1. Navigate to: `https://dliflc.sharepoint.com/sites/MarDet`
2. Ensure you have Site Owner or Full Control permissions
3. Have the SHAREPOINT_LISTS_SCHEMA.md document open for reference

---

## General List Creation Steps

For each list:

1. Click **Site Contents** (gear icon → Site contents)
2. Click **+ New** → **List**
3. Choose **Blank list**
4. Enter list name
5. Click **Create**
6. Add columns as specified below
7. Configure views and permissions

---

## List 1: Tutors

### Step 1: Create List
- Name: **Tutors**
- Description: Tutor information and availability

### Step 2: Add Columns

**Click "+ Add column" for each:**

1. **TutorID**
   - Type: Number
   - Required: Yes
   - Unique values: Yes

2. **FullName**
   - Type: Single line of text
   - Required: Yes
   - Max length: 100

3. **Email**
   - Type: Single line of text
   - Required: Yes
   
4. **Rank**
   - Type: Choice
   - Required: Yes
   - Choices (one per line):
     ```
     SSgt
     GySgt
     MSgt
     MGySgt
     Civilian
     ```

5. **Languages**
   - Type: Choice
   - Allow multiple selections: **YES**
   - Required: Yes
   - Choices:
     ```
     Arabic
     Russian
     Chinese
     Korean
     Farsi
     Spanish
     French
     Indonesian
     Japanese
     ```

6. **MaxHoursPerWeek**
   - Type: Number
   - Required: Yes
   - Min value: 0
   - Max value: 40
   - Default: 20

7. **Status**
   - Type: Choice
   - Required: Yes
   - Choices:
     ```
     Active
     Inactive
     On Leave
     ```
   - Default: Active

8. **PhoneNumber**
   - Type: Single line of text
   - Required: No
   - Max length: 20

9. **OfficeLocation**
    - Type: Single line of text
    - Required: No

10. **Specializations**
    - Type: Multiple lines of text
    - Required: No
    - Type: Plain text

11. **Bio**
    - Type: Multiple lines of text
    - Required: No
    - Type: Enhanced rich text

12. **HireDate**
    - Type: Date and time
    - Required: Yes
    - Include time: No

13. **Notes**
    - Type: Multiple lines of text
    - Required: No
    - Type: Plain text

### Step 3: Create Views

**Active Tutors View:**
- Filter: Status equals Active
- Sort: FullName ascending
- Make default

**By Language View:**
- Group by: Languages
- Sort: FullName

---

## List 2: Students

### Step 1: Create List
- Name: **Students**
- Description: Student enrollment information

### Step 2: Add Columns

1. **StudentID** - Number, Required, Unique
2. **FullName** - Single line text, Required
3. **Email** - Single line text, Required
4. **Rank** - Choice, Required
   ```
   Pvt
   PFC
   LCpl
   Cpl
   Sgt
   SSgt
   GySgt
   MSgt
   ```
5. **Language** - Choice, Required (single select)
   ```
   Arabic
   Russian
   Chinese
   Korean
   Farsi
   Spanish
   French
   Indonesian
   Japanese
   ```
6. **Class** - Single line text, Required
7. **CurrentGrade** - Single line text
8. **PhoneNumber** - Single line text
9. **Company** - Choice, Required
    ```
    Alpha
    Bravo
    Charlie
    Delta
    Echo
    HQ
    ```
10. **Platoon** - Number (1-4)
11. **Squad** - Number (1-4)
12. **EnrollmentDate** - Date, Required
13. **GraduationDate** - Date
14. **Status** - Choice, Required, Default: Active
    ```
    Active
    Graduated
    Dropped
    On Leave
    ```
15. **Notes** - Multiple lines text, Plain

### Step 3: Create Views

**Active Students:**
- Filter: Status equals Active
- Sort: Class
- Make default

**By Language:**
- Group by: Language

---

## List 3: Appointments

### Step 1: Create List
- Name: **Appointments**
- Description: Tutoring session scheduling

### Step 2: Add Columns

1. **AppointmentID** - Number, Required, Unique
2. **AppointmentDate** - Date and time, Required, Include time: Yes
3. **Duration** - Number, Required, Default: 60
4. **Status** - Choice, Required, Default: Scheduled
   ```
   Scheduled
   Completed
   Cancelled
   NoShow
   ```
5. **Location** - Choice
   ```
   Tutoring Center
   Online
   Building 637
   Other
   ```
6. **MeetingLink** - Hyperlink
7. **RecurringPattern** - Single line text
8. **RecurringSeriesID** - Single line text
9. **FocusArea** - Choice, Multi-select
   ```
   Vocab
   Grammar
   Listening
   Reading
   Speaking
   Writing
   DLPT Prep
   ```
10. **CancellationReason** - Multiple lines text, Plain
11. **CreatedByStudent** - Yes/No, Default: No
12. **ReminderSent** - Yes/No, Default: No
13. **BookingNotes** - Multiple lines text, Plain

### Step 3: Add Lookup Columns

**After Students and Tutors lists exist:**

14. **TutorID**
    - Type: Lookup
    - Get information from: **Tutors**
    - In this column: **FullName**
    - Required: Yes

15. **StudentID**
    - Type: Lookup
    - Get information from: **Students**
    - In this column: **FullName**
    - Required: Yes

### Step 4: Add Calculated Columns

16. **EndTime**
    - Type: Calculated
    - Formula: `=[AppointmentDate]+([Duration]/1440)`
    - Return type: Date and Time

17. **IsUpcoming**
    - Type: Calculated
    - Formula: `=IF([AppointmentDate]>NOW(),"Yes","No")`
    - Return type: Single line of text

18. **WeekOf**
    - Type: Calculated
    - Formula: `=TEXT([AppointmentDate],"YYYY-MM-DD (Week WW)")`
    - Return type: Single line of text

### Step 5: Create Views

**Today:**
- Filter: AppointmentDate equals [Today] AND Status equals Scheduled
- Sort: AppointmentDate

**Upcoming:**
- Filter: Status equals Scheduled AND AppointmentDate is greater than [Today]
- Sort: AppointmentDate

**Calendar View:**
- View Format: Calendar
- Begin/End dates: AppointmentDate / EndTime
- Group by: TutorID

---

## List 4: SessionNotes

### Step 1: Create List
- Name: **SessionNotes**
- Description: Post-session documentation

### Step 2: Add Columns

1. **NoteID** - Number, Required, Unique
2. **AppointmentID** - Lookup to Appointments → Title, Required
3. **SessionDate** - Date and time, Required
4. **Duration** - Number, Required (actual time spent)
5. **MaterialsCovered** - Multiple lines, Rich text, Required
6. **StudentPerformance** - Choice, Required
   ```
   Excellent
   Good
   Satisfactory
   Needs Improvement
   ```
7. **FocusAreas** - Choice, Multi-select
   ```
   Vocab
   Grammar
   Listening
   Reading
   Speaking
   Writing
   DLPT Prep
   ```
8. **HomeworkAssigned** - Multiple lines, Rich text
9. **NextSessionGoals** - Multiple lines, Plain
10. **StudentParticipation** - Choice, Required
    ```
    Engaged
    Average
    Distracted
    ```
11. **ChallengesObserved** - Multiple lines, Plain
12. **Recommendations** - Multiple lines, Plain
13. **AttachedResources** - Multiple lines, Plain

---

## List 5: ProgressTracking

### Step 1: Create List
- Name: **ProgressTracking**
- Description: Student progress snapshots

### Step 2: Add Columns

1. **ProgressID** - Number, Required, Unique
2. **StudentID** - Lookup to Students → FullName, Required
3. **SnapshotDate** - Date, Required
4. **CurrentGrade** - Single line text
5. **DLPTListening** - Choice
   ```
   0
   0+
   1
   1+
   2
   2+
   3
   3+
   ```
6. **DLPTReading** - Choice (same as above)
7. **ModularExams** - Multiple lines, Plain
8. **OPIScore** - Choice (same as DLPT)
9. **AttendanceRate** - Number (0-100)
10. **TutoringHours** - Number
11. **Trends** - Choice
    ```
    Improving
    Stable
    Declining
    ```
12. **Goals** - Multiple lines, Plain
13. **Notes** - Multiple lines, Plain

---

## List 6: Resources

### Step 1: Create List
- Name: **Resources**
- Description: Study material links

### Step 2: Add Columns

1. **ResourceID** - Number, Required, Unique
2. **Language** - Choice, Required (same 9 languages)
3. **ResourceType** - Choice, Required
   ```
   Vocab
   Grammar
   Listening
   Reading
   Speaking
   Writing
   DLPT Practice
   Other
   ```
4. **Description** - Multiple lines, Rich text
5. **URL** - Hyperlink, Required
6. **DifficultyLevel** - Choice
   ```
   Beginner
   Intermediate
   Advanced
   ```
7. **Tags** - Multiple lines, Plain
8. **UploadedBy** - Person (auto-populated)
9. **UploadDate** - Date (auto-populated)
10. **ViewCount** - Number, Default: 0
11. **Featured** - Yes/No, Default: No
12. **Active** - Yes/No, Default: Yes

---

## Post-Creation Configuration

### Enable Versioning
For all lists:
1. List Settings → Versioning settings
2. Enable version history: Yes
3. Create major versions

### Create Indexed Columns
List Settings → Indexed columns → Create new index:
- **Appointments**: AppointmentDate, Status
- **Students**: Email, Language
- **Tutors**: Email
- **SessionNotes**: AppointmentID

### Configure Permissions
1. List Settings → Permissions for this list
2. Stop inheriting permissions
3. Create permission levels per schema document

---

## Testing Checklist

- [ ] All 6 lists created
- [ ] All columns added with correct types
- [ ] Lookup relationships working
- [ ] Calculated columns displaying correctly
- [ ] Views created and filtering properly
- [ ] Permissions configured
- [ ] Sample test data added
- [ ] No errors in list settings

---

## Troubleshooting

**Lookup column not showing target list:**
- Ensure target list exists first
- Refresh browser
- Check permissions on target list

**Calculated column showing errors:**
- Double-check formula syntax
- Ensure referenced columns exist
- Test with sample data

**Can't add certain column types:**
- Some require site collection admin
- Use PowerShell script instead
- Contact DCSIT for assistance

---

## Time Estimate

- List 1 (Tutors): 15 minutes
- List 2 (Students): 20 minutes
- List 3 (Appointments): 25 minutes (includes lookups/calculated)
- List 4 (SessionNotes): 15 minutes
- List 5 (ProgressTracking): 15 minutes
- List 6 (Resources): 10 minutes
- **Total: ~100 minutes (1.5-2 hours)**

PowerShell script: ~5 minutes
