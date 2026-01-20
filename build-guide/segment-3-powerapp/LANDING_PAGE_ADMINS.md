# Admin Landing Page Design Guide

## Role: MARDET_Admins (~3 users)

### User Profile
- Detachment administrative staff
- Full system access for management and troubleshooting
- Handles user management, system configuration, data maintenance
- Desktop-primary, needs comprehensive views

---

## Landing Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│  MARDET Language Tutoring                   [Admin] [Logout]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  System Administration Dashboard                            │
│  Last login: Jan 14, 2025 0730                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌─────────────┐ │
│  │ USERS     │ │ TODAY     │ │ PENDING   │ │ SYSTEM      │ │
│  │           │ │           │ │           │ │             │ │
│  │  Tutors:30│ │    45     │ │    5      │ │ ✓ Healthy   │ │
│  │Students:   │ │ Sessions  │ │ Actions   │ │             │ │
│  │    412    │ │           │ │           │ │ 0 Errors    │ │
│  └───────────┘ └───────────┘ └───────────┘ └─────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ADMIN ACTIONS QUEUE                                 │   │
│  │                                                      │   │
│  │  ⚡ 2 New student registrations awaiting setup       │   │
│  │  ⚡ 1 Tutor deactivation request                     │   │
│  │  ⚡ 1 Data correction request                        │   │
│  │  ⚡ 1 Permission change request                      │   │
│  │                                                      │   │
│  │  [Process Queue]                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────────────────┐ ┌────────────────────────┐   │
│  │  QUICK ACTIONS           │ │  SYSTEM HEALTH         │   │
│  │                          │ │                        │   │
│  │  [+ Add Student]         │ │  SharePoint: ✓ Online  │   │
│  │  [+ Add Tutor]           │ │  Flows: ✓ 13/13 Active │   │
│  │  [Manage Users]          │ │  Last Backup: Today    │   │
│  │  [View Audit Log]        │ │  Storage: 45/100 MB    │   │
│  │  [Export Data]           │ │                        │   │
│  │  [System Settings]       │ │  [View Details]        │   │
│  └──────────────────────────┘ └────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  RECENT ACTIVITY LOG                                 │   │
│  │                                                      │   │
│  │  Time     User           Action                     │   │
│  │  ─────────────────────────────────────────────────  │   │
│  │  0845     SSgt Smith     Completed session note     │   │
│  │  0842     LCpl Wilson    Booked appointment         │   │
│  │  0830     GySgt Jones    Marked no-show             │   │
│  │  0815     System         Daily reminder emails sent │   │
│  │  0800     Admin          User import completed      │   │
│  │                                                      │   │
│  │  [View Full Audit Log]                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  DATA MANAGEMENT                                     │   │
│  │                                                      │   │
│  │  [Import Students CSV]  [Import Tutors CSV]         │   │
│  │  [Bulk Update Status]   [Archive Old Records]       │   │
│  │  [Generate Reports]     [Backup Data]               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ [Dashboard] [Users] [Data] [Approvals] [Reports] [Settings]│
└─────────────────────────────────────────────────────────────┘
```

---

## Key Components

### 1. Header Section
**Elements:**
- App logo/name
- Admin badge (distinguished from other roles)
- Last login timestamp
- Logout

**Power Fx:**
```
// Verify admin access
Set(varIsAdmin,
    User().Email in ["admin1@dliflc.edu", "admin2@dliflc.edu", "admin3@dliflc.edu"]
    // Or check against MARDET_Admins group membership
)

If(!varIsAdmin, Navigate(UnauthorizedScreen, ScreenTransition.None))
```

### 2. KPI Summary Cards
**Elements:**
- User counts (tutors, students)
- Today's session count
- Pending admin actions
- System health indicator

**Power Fx:**
```
// User counts
Set(varTutorCount, CountRows(Filter(Tutors, Status = "Active")))
Set(varStudentCount, CountRows(Filter(Students, Status = "Active")))

// Today's sessions
Set(varTodaySessions,
    CountRows(Filter(Appointments, DateValue(AppointmentDate) = Today()))
)

// Pending actions (various sources)
Set(varPendingActions,
    CountRows(Filter(ApprovalRequests, Status = "Pending")) +
    // Add other pending items
    0
)

// System health (simplified - would check actual services)
Set(varSystemHealth, "Healthy")
```

### 3. Admin Actions Queue
**Elements:**
- List of pending administrative tasks
- Registration approvals
- Deactivation requests
- Data correction requests
- Permission changes

**Power Fx:**
```
// Combine various pending items
ClearCollect(colAdminQueue,
    // Registration requests
    AddColumns(
        Filter(ApprovalRequests,
            Status = "Pending" &&
            RequestType in ["Student Registration", "Tutor Registration"]
        ),
        "QueueType", "Registration",
        "Description", "New " & RequestType & " - " & Title
    ),
    // Other admin tasks from a dedicated AdminTasks list if exists
)

// Display
ForAll(colAdminQueue, /* render item */)
```

### 4. Quick Actions Panel
**Elements:**
- Add Student button
- Add Tutor button
- Manage Users button
- View Audit Log button
- Export Data button
- System Settings button

**Power Fx:**
```
// Add Student - navigate to form
Navigate(AddStudentScreen, ScreenTransition.Cover)

// Add Tutor - navigate to form
Navigate(AddTutorScreen, ScreenTransition.Cover)

// Manage Users - navigate to user management
Navigate(UserManagementScreen, ScreenTransition.Cover)

// Export Data - trigger Power Automate flow
// Flow generates Excel file and emails to admin
```

### 5. System Health Panel
**Elements:**
- SharePoint connection status
- Power Automate flows status
- Last backup date
- Storage usage

**Power Fx:**
```
// These would typically be monitored via Azure/M365 admin center
// For in-app display, can check basic connectivity:

// Test SharePoint connection
Set(varSPConnected,
    !IsError(First(Tutors))  // Simple connectivity test
)

// Flow status would need to be tracked in a separate list
// or queried via Power Automate admin connector (premium)

// Storage estimate
Set(varStorageUsed,
    (CountRows(Appointments) * 0.001) +  // ~1KB per appointment
    (CountRows(SessionNotes) * 0.003) +  // ~3KB per note
    (CountRows(Students) * 0.001) +
    (CountRows(Tutors) * 0.001)
) & " MB (estimated)"
```

### 6. Recent Activity Log
**Elements:**
- Recent system activity
- Timestamp, user, action
- Link to full audit log

**Power Fx:**
```
// If tracking activity in SharePoint audit logs:
// This would require Power Automate to periodically pull audit data
// into a SharePoint list for display

// Simplified: Show recent modifications
Sort(
    Union(
        AddColumns(
            TopN(Filter(Appointments, Modified >= DateAdd(Now(), -24, TimeUnit.Hours)), 10, Modified, SortOrder.Descending),
            "ActivityType", "Appointment",
            "ActivityUser", 'Modified By'.DisplayName,
            "ActivityTime", Modified
        ),
        AddColumns(
            TopN(Filter(SessionNotes, Modified >= DateAdd(Now(), -24, TimeUnit.Hours)), 10, Modified, SortOrder.Descending),
            "ActivityType", "Session Note",
            "ActivityUser", 'Modified By'.DisplayName,
            "ActivityTime", Modified
        )
    ),
    ActivityTime,
    SortOrder.Descending
)
```

### 7. Data Management Panel
**Elements:**
- Import Students CSV
- Import Tutors CSV
- Bulk Update Status
- Archive Old Records
- Generate Reports
- Backup Data

**Power Fx:**
```
// Import CSV - would use Power Automate flow
// Button triggers flow that:
// 1. Creates Form to upload file
// 2. Processes CSV
// 3. Creates/updates records

// Archive Old Records
// Trigger flow to move old appointments to archive list
Set(varShowArchiveDialog, true);
// Dialog confirms date range
// Flow moves records older than X days

// Generate Reports
// Open Power BI dashboard or trigger report generation flow
Launch("https://app.powerbi.com/groups/[workspace]/reports/[report]")
```

### 8. Bottom Navigation
**Elements:**
- Dashboard (current)
- Users (user management)
- Data (data operations)
- Approvals (all approval requests)
- Reports (Power BI)
- Settings (system configuration)

---

## Admin-Only Functions

### User Management
```
// Add user manually
Patch(Students,
    Defaults(Students),
    {
        StudentID: Max(Students, StudentID) + 1,
        FullName: varNewStudentName,
        Email: varNewStudentEmail,
        // ... other fields
    }
)

// Deactivate user
Patch(Students,
    LookUp(Students, ID = varSelectedStudent.ID),
    {Status: "Inactive"}
)

// Reactivate user
Patch(Students,
    LookUp(Students, ID = varSelectedStudent.ID),
    {Status: "Active"}
)
```

### Bulk Operations
```
// Bulk status update
ForAll(
    Filter(Students, Status = "Active" && GraduationDate < Today()),
    Patch(Students, ThisRecord, {Status: "Graduated"})
)

// Bulk import (via Power Automate)
// Admin uploads CSV → Flow processes → Creates records
```

### Data Correction
```
// Edit any record
Patch([ListName],
    LookUp([ListName], ID = varSelectedRecord.ID),
    {
        [FieldName]: varNewValue
    }
)

// Admin can edit records that regular users cannot
// No row-level security restrictions for admins
```

### System Configuration
```
// Settings stored in a Config list
Set(varSystemSettings,
    LookUp(SystemConfig, Key = "Settings")
)

// Update settings
Patch(SystemConfig,
    varSystemSettings,
    {
        Value: JSON(
            {
                MaxSessionDuration: varMaxDuration,
                DefaultReminderHours: varReminderHours,
                AllowStudentBooking: varAllowBooking
            }
        )
    }
)
```

---

## Data Access (Security)

Admins have FULL ACCESS to:
- All lists (Read, Write, Delete)
- All user records
- All appointments
- All session notes
- All progress tracking
- All approval requests
- System configuration

**No row-level filtering for admins.**

---

## Audit Trail

Admin actions should be logged:
```
// After any admin action, log it
Patch(AuditLog,
    Defaults(AuditLog),
    {
        Timestamp: Now(),
        User: User().Email,
        Action: varActionType,
        Details: varActionDetails,
        RecordID: varAffectedRecordID,
        ListName: varAffectedList
    }
)
```

---

## Data Import Templates

### Students CSV Template
```csv
FullName,Email,Rank,Language,Class,Company,Platoon,Squad,EnrollmentDate,Status
John Doe,john.doe@dliflc.edu,LCpl,Arabic,ARA-001-2025,Alpha,1,1,2025-01-06,Active
```

### Tutors CSV Template
```csv
FullName,Email,Rank,Languages,MaxHoursPerWeek,Status,OfficeLocation,HireDate
Jane Smith,jane.smith@dliflc.edu,SSgt,Arabic;Farsi,20,Active,Bldg 614,2023-01-15
```

---

## Emergency Actions

### Disable All Bookings
```
// Set system-wide flag
Patch(SystemConfig,
    LookUp(SystemConfig, Key = "BookingEnabled"),
    {Value: "false"}
)
// All booking screens check this flag before allowing new bookings
```

### Purge User Data (GDPR-style)
```
// Remove all records for a specific user
// Students
Remove(Students, LookUp(Students, Email = varUserEmail));

// Their appointments
RemoveIf(Appointments, StudentEmail = varUserEmail);

// Their progress
RemoveIf(ProgressTracking, StudentEmail = varUserEmail);

// Log the purge
Patch(AuditLog, Defaults(AuditLog), {
    Action: "Data Purge",
    Details: "All records for " & varUserEmail & " removed",
    // ...
})
```

### Force Password Reset (Service Account)
```
// This would be done through Azure AD admin center
// Link to admin portal:
Launch("https://portal.azure.com/#blade/Microsoft_AAD_IAM/UsersManagementMenuBlade/AllUsers")
```

---

## Color Scheme

| Element | Color | Hex |
|---------|-------|-----|
| Header | Marine Corps Scarlet | #CC0000 |
| Admin Badge | Dark Gold | #B8860B |
| System Healthy | Green | #28A745 |
| System Warning | Orange | #FFC107 |
| System Error | Red | #DC3545 |
| Action Button | Blue | #007BFF |
| Destructive Action | Red | #DC3545 |

---

## Testing Checklist

- [ ] Only admins can access this screen
- [ ] User counts display correctly
- [ ] Can add new student
- [ ] Can add new tutor
- [ ] Can deactivate user
- [ ] Can reactivate user
- [ ] Activity log shows recent changes
- [ ] System health indicators work
- [ ] Data export functions
- [ ] Audit logging captures admin actions
- [ ] Navigation works correctly
- [ ] Emergency disable booking works
