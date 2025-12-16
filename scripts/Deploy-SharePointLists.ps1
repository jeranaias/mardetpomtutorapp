#Requires -Modules PnP.PowerShell
<#
.SYNOPSIS
    Deploys all SharePoint lists for MARDET Tutoring System
.DESCRIPTION
    Creates 6 SharePoint lists with all columns, lookups, and sample data.
    Run time: ~5 minutes
.PARAMETER SiteUrl
    Your SharePoint site URL (e.g., https://dliflc.sharepoint.com/sites/MarDet)
.PARAMETER IncludeSampleData
    Add sample test data after creating lists (default: true)
.EXAMPLE
    .\Deploy-SharePointLists.ps1 -SiteUrl "https://dliflc.sharepoint.com/sites/MarDet"
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$SiteUrl,

    [Parameter(Mandatory=$false)]
    [bool]$IncludeSampleData = $true
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MARDET Tutoring System - SharePoint Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Connect to SharePoint
Write-Host "Connecting to SharePoint..." -ForegroundColor Yellow
try {
    Connect-PnPOnline -Url $SiteUrl -Interactive
    Write-Host "Connected successfully!" -ForegroundColor Green
} catch {
    Write-Host "Failed to connect: $_" -ForegroundColor Red
    exit 1
}

# ============================================
# LIST 1: TUTORS
# ============================================
Write-Host ""
Write-Host "[1/6] Creating Tutors list..." -ForegroundColor Yellow

try {
    # Create list
    New-PnPList -Title "Tutors" -Template GenericList -Url "Lists/Tutors" -ErrorAction Stop

    # Add columns
    Add-PnPField -List "Tutors" -DisplayName "TutorID" -InternalName "TutorID" -Type Number -AddToDefaultView
    Add-PnPField -List "Tutors" -DisplayName "FullName" -InternalName "FullName" -Type Text -Required -AddToDefaultView
    Add-PnPField -List "Tutors" -DisplayName "Email" -InternalName "Email" -Type Text -Required -AddToDefaultView
    Add-PnPField -List "Tutors" -DisplayName "Rank" -InternalName "Rank" -Type Choice -Choices "SSgt","GySgt","MSgt","MGySgt","Civilian" -Required -AddToDefaultView
    Add-PnPField -List "Tutors" -DisplayName "Languages" -InternalName "Languages" -Type MultiChoice -Choices "Arabic","Russian","Chinese","Korean","Farsi","Spanish","French","Indonesian","Japanese" -Required -AddToDefaultView
    Add-PnPField -List "Tutors" -DisplayName "MaxHoursPerWeek" -InternalName "MaxHoursPerWeek" -Type Number -Required
    Add-PnPField -List "Tutors" -DisplayName "Status" -InternalName "TutorStatus" -Type Choice -Choices "Active","Inactive","On Leave" -Required -AddToDefaultView
    Add-PnPField -List "Tutors" -DisplayName "CAC_EDIPI" -InternalName "CAC_EDIPI" -Type Text -Required
    Add-PnPField -List "Tutors" -DisplayName "PhoneNumber" -InternalName "PhoneNumber" -Type Text
    Add-PnPField -List "Tutors" -DisplayName "OfficeLocation" -InternalName "OfficeLocation" -Type Text
    Add-PnPField -List "Tutors" -DisplayName "Specializations" -InternalName "Specializations" -Type Note
    Add-PnPField -List "Tutors" -DisplayName "Bio" -InternalName "Bio" -Type Note -RichText
    Add-PnPField -List "Tutors" -DisplayName "HireDate" -InternalName "HireDate" -Type DateTime -Required
    Add-PnPField -List "Tutors" -DisplayName "Notes" -InternalName "Notes" -Type Note

    Write-Host "  Tutors list created!" -ForegroundColor Green
} catch {
    if ($_.Exception.Message -like "*already exists*") {
        Write-Host "  Tutors list already exists, skipping..." -ForegroundColor Yellow
    } else {
        Write-Host "  Error: $_" -ForegroundColor Red
    }
}

# ============================================
# LIST 2: STUDENTS
# ============================================
Write-Host "[2/6] Creating Students list..." -ForegroundColor Yellow

try {
    New-PnPList -Title "Students" -Template GenericList -Url "Lists/Students" -ErrorAction Stop

    Add-PnPField -List "Students" -DisplayName "StudentID" -InternalName "StudentID" -Type Number -AddToDefaultView
    Add-PnPField -List "Students" -DisplayName "FullName" -InternalName "FullName" -Type Text -Required -AddToDefaultView
    Add-PnPField -List "Students" -DisplayName "Email" -InternalName "Email" -Type Text -Required -AddToDefaultView
    Add-PnPField -List "Students" -DisplayName "Rank" -InternalName "Rank" -Type Choice -Choices "Pvt","PFC","LCpl","Cpl","Sgt","SSgt","GySgt","MSgt" -Required -AddToDefaultView
    Add-PnPField -List "Students" -DisplayName "Language" -InternalName "Language" -Type Choice -Choices "Arabic","Russian","Chinese","Korean","Farsi","Spanish","French","Indonesian","Japanese" -Required -AddToDefaultView
    Add-PnPField -List "Students" -DisplayName "Class" -InternalName "Class" -Type Text -Required -AddToDefaultView
    Add-PnPField -List "Students" -DisplayName "CurrentGrade" -InternalName "CurrentGrade" -Type Text
    Add-PnPField -List "Students" -DisplayName "CAC_EDIPI" -InternalName "CAC_EDIPI" -Type Text -Required
    Add-PnPField -List "Students" -DisplayName "PhoneNumber" -InternalName "PhoneNumber" -Type Text
    Add-PnPField -List "Students" -DisplayName "Company" -InternalName "Company" -Type Choice -Choices "Alpha","Bravo","Charlie","Delta","Echo","HQ" -Required -AddToDefaultView
    Add-PnPField -List "Students" -DisplayName "Platoon" -InternalName "Platoon" -Type Number
    Add-PnPField -List "Students" -DisplayName "Squad" -InternalName "Squad" -Type Number
    Add-PnPField -List "Students" -DisplayName "EnrollmentDate" -InternalName "EnrollmentDate" -Type DateTime -Required
    Add-PnPField -List "Students" -DisplayName "GraduationDate" -InternalName "GraduationDate" -Type DateTime
    Add-PnPField -List "Students" -DisplayName "Status" -InternalName "StudentStatus" -Type Choice -Choices "Active","Graduated","Dropped","On Leave" -Required -AddToDefaultView
    Add-PnPField -List "Students" -DisplayName "Notes" -InternalName "Notes" -Type Note

    Write-Host "  Students list created!" -ForegroundColor Green
} catch {
    if ($_.Exception.Message -like "*already exists*") {
        Write-Host "  Students list already exists, skipping..." -ForegroundColor Yellow
    } else {
        Write-Host "  Error: $_" -ForegroundColor Red
    }
}

# ============================================
# LIST 3: APPOINTMENTS
# ============================================
Write-Host "[3/6] Creating Appointments list..." -ForegroundColor Yellow

try {
    New-PnPList -Title "Appointments" -Template GenericList -Url "Lists/Appointments" -ErrorAction Stop

    Add-PnPField -List "Appointments" -DisplayName "AppointmentID" -InternalName "AppointmentID" -Type Number -AddToDefaultView
    Add-PnPField -List "Appointments" -DisplayName "AppointmentDate" -InternalName "AppointmentDate" -Type DateTime -Required -AddToDefaultView
    Add-PnPField -List "Appointments" -DisplayName "Duration" -InternalName "Duration" -Type Number -Required -AddToDefaultView
    Add-PnPField -List "Appointments" -DisplayName "Status" -InternalName "AppointmentStatus" -Type Choice -Choices "Scheduled","Completed","Cancelled","NoShow" -Required -AddToDefaultView
    Add-PnPField -List "Appointments" -DisplayName "Location" -InternalName "Location" -Type Choice -Choices "Tutoring Center","Online","Classroom","Other" -AddToDefaultView
    Add-PnPField -List "Appointments" -DisplayName "MeetingLink" -InternalName "MeetingLink" -Type URL
    Add-PnPField -List "Appointments" -DisplayName "RecurringPattern" -InternalName "RecurringPattern" -Type Text
    Add-PnPField -List "Appointments" -DisplayName "RecurringSeriesID" -InternalName "RecurringSeriesID" -Type Text
    Add-PnPField -List "Appointments" -DisplayName "FocusArea" -InternalName "FocusArea" -Type MultiChoice -Choices "Vocab","Grammar","Listening","Reading","Speaking","Writing","DLPT Prep"
    Add-PnPField -List "Appointments" -DisplayName "CancellationReason" -InternalName "CancellationReason" -Type Note
    Add-PnPField -List "Appointments" -DisplayName "CreatedByStudent" -InternalName "CreatedByStudent" -Type Boolean
    Add-PnPField -List "Appointments" -DisplayName "ReminderSent" -InternalName "ReminderSent" -Type Boolean
    Add-PnPField -List "Appointments" -DisplayName "BookingNotes" -InternalName "BookingNotes" -Type Note

    Write-Host "  Appointments list created!" -ForegroundColor Green
} catch {
    if ($_.Exception.Message -like "*already exists*") {
        Write-Host "  Appointments list already exists, skipping..." -ForegroundColor Yellow
    } else {
        Write-Host "  Error: $_" -ForegroundColor Red
    }
}

# ============================================
# LIST 4: SESSION NOTES
# ============================================
Write-Host "[4/6] Creating SessionNotes list..." -ForegroundColor Yellow

try {
    New-PnPList -Title "SessionNotes" -Template GenericList -Url "Lists/SessionNotes" -ErrorAction Stop

    Add-PnPField -List "SessionNotes" -DisplayName "NoteID" -InternalName "NoteID" -Type Number -AddToDefaultView
    Add-PnPField -List "SessionNotes" -DisplayName "SessionDate" -InternalName "SessionDate" -Type DateTime -Required -AddToDefaultView
    Add-PnPField -List "SessionNotes" -DisplayName "ActualDuration" -InternalName "ActualDuration" -Type Number -Required
    Add-PnPField -List "SessionNotes" -DisplayName "MaterialsCovered" -InternalName "MaterialsCovered" -Type Note -RichText -Required
    Add-PnPField -List "SessionNotes" -DisplayName "StudentPerformance" -InternalName "StudentPerformance" -Type Choice -Choices "Excellent","Good","Satisfactory","Needs Improvement" -Required -AddToDefaultView
    Add-PnPField -List "SessionNotes" -DisplayName "FocusAreas" -InternalName "FocusAreas" -Type MultiChoice -Choices "Vocab","Grammar","Listening","Reading","Speaking","Writing","DLPT Prep"
    Add-PnPField -List "SessionNotes" -DisplayName "HomeworkAssigned" -InternalName "HomeworkAssigned" -Type Note -RichText
    Add-PnPField -List "SessionNotes" -DisplayName "NextSessionGoals" -InternalName "NextSessionGoals" -Type Note
    Add-PnPField -List "SessionNotes" -DisplayName "StudentParticipation" -InternalName "StudentParticipation" -Type Choice -Choices "Engaged","Average","Distracted" -Required
    Add-PnPField -List "SessionNotes" -DisplayName "ChallengesObserved" -InternalName "ChallengesObserved" -Type Note
    Add-PnPField -List "SessionNotes" -DisplayName "Recommendations" -InternalName "Recommendations" -Type Note
    Add-PnPField -List "SessionNotes" -DisplayName "AttachedResources" -InternalName "AttachedResources" -Type Note

    Write-Host "  SessionNotes list created!" -ForegroundColor Green
} catch {
    if ($_.Exception.Message -like "*already exists*") {
        Write-Host "  SessionNotes list already exists, skipping..." -ForegroundColor Yellow
    } else {
        Write-Host "  Error: $_" -ForegroundColor Red
    }
}

# ============================================
# LIST 5: PROGRESS TRACKING
# ============================================
Write-Host "[5/6] Creating ProgressTracking list..." -ForegroundColor Yellow

try {
    New-PnPList -Title "ProgressTracking" -Template GenericList -Url "Lists/ProgressTracking" -ErrorAction Stop

    Add-PnPField -List "ProgressTracking" -DisplayName "ProgressID" -InternalName "ProgressID" -Type Number -AddToDefaultView
    Add-PnPField -List "ProgressTracking" -DisplayName "SnapshotDate" -InternalName "SnapshotDate" -Type DateTime -Required -AddToDefaultView
    Add-PnPField -List "ProgressTracking" -DisplayName "CurrentGrade" -InternalName "CurrentGrade" -Type Text -AddToDefaultView
    Add-PnPField -List "ProgressTracking" -DisplayName "DLPTListening" -InternalName "DLPTListening" -Type Choice -Choices "0","0+","1","1+","2","2+","3","3+" -AddToDefaultView
    Add-PnPField -List "ProgressTracking" -DisplayName "DLPTReading" -InternalName "DLPTReading" -Type Choice -Choices "0","0+","1","1+","2","2+","3","3+" -AddToDefaultView
    Add-PnPField -List "ProgressTracking" -DisplayName "ModularExams" -InternalName "ModularExams" -Type Note
    Add-PnPField -List "ProgressTracking" -DisplayName "OPIScore" -InternalName "OPIScore" -Type Choice -Choices "0","0+","1","1+","2","2+","3","3+"
    Add-PnPField -List "ProgressTracking" -DisplayName "AttendanceRate" -InternalName "AttendanceRate" -Type Number
    Add-PnPField -List "ProgressTracking" -DisplayName "TutoringHours" -InternalName "TutoringHours" -Type Number
    Add-PnPField -List "ProgressTracking" -DisplayName "Trends" -InternalName "Trends" -Type Choice -Choices "Improving","Stable","Declining" -AddToDefaultView
    Add-PnPField -List "ProgressTracking" -DisplayName "Goals" -InternalName "Goals" -Type Note
    Add-PnPField -List "ProgressTracking" -DisplayName "Notes" -InternalName "Notes" -Type Note

    Write-Host "  ProgressTracking list created!" -ForegroundColor Green
} catch {
    if ($_.Exception.Message -like "*already exists*") {
        Write-Host "  ProgressTracking list already exists, skipping..." -ForegroundColor Yellow
    } else {
        Write-Host "  Error: $_" -ForegroundColor Red
    }
}

# ============================================
# LIST 6: RESOURCES
# ============================================
Write-Host "[6/6] Creating Resources list..." -ForegroundColor Yellow

try {
    New-PnPList -Title "Resources" -Template GenericList -Url "Lists/Resources" -ErrorAction Stop

    Add-PnPField -List "Resources" -DisplayName "ResourceID" -InternalName "ResourceID" -Type Number -AddToDefaultView
    Add-PnPField -List "Resources" -DisplayName "Language" -InternalName "Language" -Type Choice -Choices "Arabic","Russian","Chinese","Korean","Farsi","Spanish","French","Indonesian","Japanese" -Required -AddToDefaultView
    Add-PnPField -List "Resources" -DisplayName "ResourceType" -InternalName "ResourceType" -Type Choice -Choices "Vocab","Grammar","Listening","Reading","Speaking","Writing","DLPT Practice","Other" -Required -AddToDefaultView
    Add-PnPField -List "Resources" -DisplayName "Description" -InternalName "Description" -Type Note -RichText
    Add-PnPField -List "Resources" -DisplayName "URL" -InternalName "ResourceURL" -Type URL -Required -AddToDefaultView
    Add-PnPField -List "Resources" -DisplayName "DifficultyLevel" -InternalName "DifficultyLevel" -Type Choice -Choices "Beginner","Intermediate","Advanced" -AddToDefaultView
    Add-PnPField -List "Resources" -DisplayName "Tags" -InternalName "Tags" -Type Note
    Add-PnPField -List "Resources" -DisplayName "ViewCount" -InternalName "ViewCount" -Type Number
    Add-PnPField -List "Resources" -DisplayName "Featured" -InternalName "Featured" -Type Boolean
    Add-PnPField -List "Resources" -DisplayName "Active" -InternalName "Active" -Type Boolean

    Write-Host "  Resources list created!" -ForegroundColor Green
} catch {
    if ($_.Exception.Message -like "*already exists*") {
        Write-Host "  Resources list already exists, skipping..." -ForegroundColor Yellow
    } else {
        Write-Host "  Error: $_" -ForegroundColor Red
    }
}

# ============================================
# ADD LOOKUP COLUMNS
# ============================================
Write-Host ""
Write-Host "Adding lookup relationships..." -ForegroundColor Yellow

try {
    # Appointments -> Tutors
    $tutorsList = Get-PnPList -Identity "Tutors"
    Add-PnPField -List "Appointments" -DisplayName "Tutor" -InternalName "TutorLookup" -Type Lookup -LookupListId $tutorsList.Id -LookupField "FullName" -AddToDefaultView

    # Appointments -> Students
    $studentsList = Get-PnPList -Identity "Students"
    Add-PnPField -List "Appointments" -DisplayName "Student" -InternalName "StudentLookup" -Type Lookup -LookupListId $studentsList.Id -LookupField "FullName" -AddToDefaultView

    # SessionNotes -> Appointments
    $appointmentsList = Get-PnPList -Identity "Appointments"
    Add-PnPField -List "SessionNotes" -DisplayName "Appointment" -InternalName "AppointmentLookup" -Type Lookup -LookupListId $appointmentsList.Id -LookupField "Title" -AddToDefaultView

    # ProgressTracking -> Students
    Add-PnPField -List "ProgressTracking" -DisplayName "Student" -InternalName "StudentLookup" -Type Lookup -LookupListId $studentsList.Id -LookupField "FullName" -AddToDefaultView

    Write-Host "  Lookups created!" -ForegroundColor Green
} catch {
    Write-Host "  Warning: Some lookups may not have been created: $_" -ForegroundColor Yellow
}

# ============================================
# ADD SAMPLE DATA
# ============================================
if ($IncludeSampleData) {
    Write-Host ""
    Write-Host "Adding sample test data..." -ForegroundColor Yellow

    # Sample Tutors
    $tutors = @(
        @{Title="T001"; FullName="John Smith"; Email="john.smith@mail.mil"; Rank="SSgt"; Languages="Arabic;Farsi"; MaxHoursPerWeek=25; TutorStatus="Active"; CAC_EDIPI="1234567890"; HireDate="2023-01-15"},
        @{Title="T002"; FullName="Maria Garcia"; Email="maria.garcia@mail.mil"; Rank="GySgt"; Languages="Spanish;French"; MaxHoursPerWeek=20; TutorStatus="Active"; CAC_EDIPI="1234567891"; HireDate="2022-06-01"},
        @{Title="T003"; FullName="Wei Chen"; Email="wei.chen@mail.mil"; Rank="Civilian"; Languages="Chinese;Japanese"; MaxHoursPerWeek=30; TutorStatus="Active"; CAC_EDIPI="1234567892"; HireDate="2021-09-15"},
        @{Title="T004"; FullName="Kim Park"; Email="kim.park@mail.mil"; Rank="MSgt"; Languages="Korean"; MaxHoursPerWeek=15; TutorStatus="Active"; CAC_EDIPI="1234567893"; HireDate="2020-03-01"},
        @{Title="T005"; FullName="Ivan Petrov"; Email="ivan.petrov@mail.mil"; Rank="SSgt"; Languages="Russian"; MaxHoursPerWeek=25; TutorStatus="Active"; CAC_EDIPI="1234567894"; HireDate="2023-08-15"}
    )

    foreach ($tutor in $tutors) {
        try {
            Add-PnPListItem -List "Tutors" -Values $tutor -ErrorAction SilentlyContinue
        } catch {}
    }

    # Sample Students
    $students = @(
        @{Title="S001"; FullName="James Wilson"; Email="james.wilson@mail.mil"; Rank="LCpl"; Language="Arabic"; Class="ARA-001-2025"; StudentStatus="Active"; CAC_EDIPI="2234567890"; Company="Alpha"; EnrollmentDate="2025-01-06"},
        @{Title="S002"; FullName="Emily Brown"; Email="emily.brown@mail.mil"; Rank="Cpl"; Language="Russian"; Class="RUS-002-2025"; StudentStatus="Active"; CAC_EDIPI="2234567891"; Company="Bravo"; EnrollmentDate="2025-01-06"},
        @{Title="S003"; FullName="Michael Davis"; Email="michael.davis@mail.mil"; Rank="PFC"; Language="Chinese"; Class="CMN-001-2025"; StudentStatus="Active"; CAC_EDIPI="2234567892"; Company="Charlie"; EnrollmentDate="2025-01-06"},
        @{Title="S004"; FullName="Sarah Johnson"; Email="sarah.johnson@mail.mil"; Rank="LCpl"; Language="Korean"; Class="KOR-001-2025"; StudentStatus="Active"; CAC_EDIPI="2234567893"; Company="Alpha"; EnrollmentDate="2025-01-06"},
        @{Title="S005"; FullName="David Lee"; Email="david.lee@mail.mil"; Rank="Sgt"; Language="Farsi"; Class="FAS-001-2025"; StudentStatus="Active"; CAC_EDIPI="2234567894"; Company="Delta"; EnrollmentDate="2025-01-06"}
    )

    foreach ($student in $students) {
        try {
            Add-PnPListItem -List "Students" -Values $student -ErrorAction SilentlyContinue
        } catch {}
    }

    Write-Host "  Sample data added!" -ForegroundColor Green
}

# ============================================
# SUMMARY
# ============================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Lists created:" -ForegroundColor White
Write-Host "  1. Tutors        - $SiteUrl/Lists/Tutors"
Write-Host "  2. Students      - $SiteUrl/Lists/Students"
Write-Host "  3. Appointments  - $SiteUrl/Lists/Appointments"
Write-Host "  4. SessionNotes  - $SiteUrl/Lists/SessionNotes"
Write-Host "  5. ProgressTracking - $SiteUrl/Lists/ProgressTracking"
Write-Host "  6. Resources     - $SiteUrl/Lists/Resources"
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Verify lists in SharePoint"
Write-Host "  2. Configure permissions"
Write-Host "  3. Build PowerApp (Segment 3)"
Write-Host ""

# Disconnect
Disconnect-PnPOnline
