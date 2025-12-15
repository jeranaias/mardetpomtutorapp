# PowerApp Configuration & Deployment Guide

## Prerequisites

Before building the PowerApp, ensure:

- ✅ All 6 SharePoint lists created (Segment 2)
- ✅ Sample test data added to lists
- ✅ Service account `pa.svc.mardet.tutoring` created by DCSIT
- ✅ PowerApp license assigned to service account
- ✅ Access to https://make.powerapps.com

---

## Initial Setup

### Step 1: Create New Canvas App

1. Navigate to https://make.powerapps.com
2. Click **+ Create** → **Canvas app from blank**
3. Enter app name: `MARDET - Language Tutoring System`
4. Choose format: **Tablet** (better for desktop/mobile hybrid)
5. Click **Create**

### Step 2: Connect Data Sources

1. Click **Data** icon in left panel
2. Click **+ Add data**
3. Search for **SharePoint**
4. Enter SharePoint site URL: `https://dliflc.sharepoint.com/sites/MarDet`
5. Select all 6 lists:
   - Tutors
   - Students
   - Appointments
   - SessionNotes
   - ProgressTracking
   - Resources
6. Click **Connect**

Verify all lists appear in Data panel with green checkmarks.

---

## App Settings Configuration

### General Settings

**File** → **Settings** → **General**

- **App name**: MARDET - Language Tutoring System
- **Description**: Appointment scheduling and session tracking for Marine Corps language tutors and students at DLI
- **Icon**: Upload Marine Corps logo or use default
- **Background color**: `RGBA(0, 62, 81, 1)` (DLI Navy)

### Display Settings

**File** → **Settings** → **Display**

- **Orientation**: Both (Portrait and Landscape)
- **Scale to fit**: On
- **Lock aspect ratio**: Off
- **Lock orientation**: Off

### Advanced Settings

**File** → **Settings** → **Advanced settings**

- **Data row limit for non-delegable queries**: 2000
- **Use non-delegable functions and operations**: Show warning
- **Enhanced delegation**: On (if available)

### App Checker

**Tools** → **App checker**

- Run before saving/publishing
- Fix all errors
- Address warnings (especially delegation)

---

## Theme Configuration

### Color Palette

Create global color variables in App.OnStart:

```powerFx
Set(colorPrimary, ColorValue("#003E51"));      // DLI Navy
Set(colorSecondary, ColorValue("#C5A572"));    // DLI Gold
Set(colorAccent, ColorValue("#B31B1B"));       // DLI Red
Set(colorSuccess, ColorValue("#4CAF50"));      // Green
Set(colorWarning, ColorValue("#FF9800"));      // Orange
Set(colorDanger, ColorValue("#F44336"));       // Red
Set(colorInfo, ColorValue("#2196F3"));         // Blue
Set(colorLight, ColorValue("#F5F5F5"));        // Light gray
Set(colorDark, ColorValue("#333333"));         // Dark gray
Set(colorWhite, ColorValue("#FFFFFF"));
```

### Typography

```powerFx
Set(fontMain, Font.'Segoe UI');
Set(fontHeading, Font.'Segoe UI' Semibold);
Set(fontMono, Font.'Courier New');

Set(fontSize12, 12);
Set(fontSize14, 14);
Set(fontSize16, 16);
Set(fontSize20, 20);
Set(fontSize24, 24);
Set(fontSize32, 32);
```

### Apply Theme to All Screens

Create a header component used across all screens:
- Background: colorPrimary
- Text color: colorWhite
- Font: fontHeading, fontSize20
- Padding: 16px

---

## Security & Permissions

### Row-Level Security

**Students see only their own data:**

```powerFx
// In galleries showing appointments
Items = Filter(
    Appointments,
    StudentID.Email = User().Email,
    Status <> "Cancelled"
)
```

**Tutors see only assigned appointments:**

```powerFx
Items = Filter(
    Appointments,
    TutorID.Email = User().Email,
    Status <> "Cancelled"
)
```

**Admins see everything:**

```powerFx
Items = If(
    varUserRole = "Admin" || varUserRole = "TutorChief",
    Appointments,
    Filter(Appointments, /* role-specific filter */)
)
```

### Hide Admin Features

```powerFx
// Admin button visible only to admins
btnAdminPanel.Visible = (varUserRole = "Admin" || varUserRole = "TutorChief");

// Edit tutor info only for tutor chiefs
btnEditTutor.DisplayMode = If(
    varUserRole = "TutorChief" || varUserRole = "Admin",
    DisplayMode.Edit,
    DisplayMode.Disabled
);
```

---

## Performance Optimization

### Delegation Strategy

**Always delegable:**
- Simple Filter() with direct column comparisons
- LookUp() single record
- Sort() on indexed columns
- Search() on searchable text columns

**Not delegable (use sparingly):**
- CountRows() with complex filters
- AddColumns() in galleries
- Calculated columns in filters
- Contains() on choice fields

### Use Collections

Cache frequently accessed data on screen load:

```powerFx
// Screen.OnVisible
ClearCollect(
    colMyAppointments,
    Filter(
        Appointments,
        StudentID.Email = User().Email,
        Status = "Scheduled"
    )
);

// Gallery.Items - use collection, not direct query
galAppointments.Items = colMyAppointments
```

### Lazy Loading

Only load data when needed:

```powerFx
// Don't load on App.OnStart
// Load on Screen.OnVisible instead
scrSchedule.OnVisible = 
    ClearCollect(colSchedule, Filter(...));
```

### Concurrent Calls

Load multiple data sources simultaneously:

```powerFx
Concurrent(
    Set(varTutors, Filter(Tutors, Status = "Active")),
    Set(varStudents, Filter(Students, Status = "Active")),
    Set(varToday, Filter(Appointments, DateDiff(AppointmentDate, Today(), Days) = 0))
);
```

---

## Testing Procedures

### Pre-Deployment Testing

**Test with each role:**

1. **As Student:**
   - [ ] Can book appointments
   - [ ] Can see only own schedule
   - [ ] Cannot see other students' data
   - [ ] Can cancel own appointments
   - [ ] Can view own progress

2. **As Tutor:**
   - [ ] Can see assigned appointments
   - [ ] Can create session notes
   - [ ] Can view student progress (assigned only)
   - [ ] Cannot book appointments for students
   - [ ] Can update appointment status

3. **As Admin/Tutor Chief:**
   - [ ] Can see all appointments
   - [ ] Can manage tutors and students
   - [ ] Can access analytics
   - [ ] Can override bookings

**Conflict Detection:**
- [ ] Student cannot double-book
- [ ] Tutor cannot double-book
- [ ] System prevents booking in past
- [ ] System checks tutor weekly capacity

**Data Integrity:**
- [ ] Appointments create successfully
- [ ] Session notes link correctly
- [ ] Progress tracking updates
- [ ] Lookups resolve properly

**Performance:**
- [ ] No delegation warnings in critical screens
- [ ] Galleries load < 3 seconds
- [ ] Search responds instantly
- [ ] No errors in App Checker

---

## Service Account Setup

### Why Service Account?

Per DLI policy, production PowerApps must run under a dedicated service account, not personal accounts.

### DCSIT Will Create:

**Account details:**
- Username: `pa.svc.mardet.tutoring`
- Email: `pa.svc.mardet.tutoring@dliflc.edu`
- Password: 25+ character strong password
- MFA: Exempt (service account)

**Permissions:**
- PowerApps license (included with M365)
- SharePoint: Read/Write on all 6 lists
- Power Automate: License for workflows
- Email: Send on behalf of `mardet@dliflc.edu`

### Transfer App to Service Account

1. **Export from development account:**
   - File → Export package
   - Name: `MARDET_Tutoring_v1.0`
   - Click **Export**
   - Save `.zip` file

2. **Import to service account:**
   - Sign in as `pa.svc.mardet.tutoring`
   - Apps → Import canvas app
   - Upload `.zip` file
   - Click **Import**

3. **Verify connections:**
   - Open imported app
   - Data → Verify all SharePoint connections
   - Fix broken connections if needed

4. **Publish:**
   - File → Publish
   - Publish this version

---

## Sharing the App

### Create Security Groups (DCSIT)

Request DCSIT create these Azure AD groups:

1. **MARDET_Students**
   - All active Marine students
   - Read/Execute permissions

2. **MARDET_Tutors**
   - All language tutors
   - Read/Execute + limited write

3. **MARDET_TutorChiefs**
   - Tutor leadership
   - Read/Execute + full write

4. **MARDET_Admins**
   - Detachment admin staff
   - Owner permissions

### Share with Groups

1. Click **Share** in PowerApps
2. Enter group name: `MARDET_Students`
3. Set permission: **User** (can use)
4. Uncheck "Send email notification"
5. Click **Share**
6. Repeat for other groups

### Direct SharePoint Permissions

Ensure groups have SharePoint access:

1. Navigate to SharePoint site
2. Settings → Site permissions
3. Grant permissions:
   - MARDET_Students: Read on Students list, Read/Write on Appointments (own only)
   - MARDET_Tutors: Read on Tutors/Students, Read/Write on Appointments/SessionNotes
   - MARDET_TutorChiefs: Full control on all lists
   - MARDET_Admins: Full control

---

## Deployment Checklist

### Pre-Deployment

- [ ] All screens built per design document
- [ ] All formulas implemented and tested
- [ ] No App Checker errors
- [ ] Delegation warnings addressed
- [ ] Test data successfully processed
- [ ] All user roles tested
- [ ] Conflict detection working
- [ ] Performance acceptable (< 3s load)

### Service Account Setup

- [ ] Service account created by DCSIT
- [ ] PowerApp license assigned
- [ ] SharePoint permissions granted
- [ ] Email "send on behalf" configured
- [ ] App exported from dev account
- [ ] App imported to service account
- [ ] Connections verified in production
- [ ] Published successfully

### Access Control

- [ ] Azure AD groups created
- [ ] App shared with security groups
- [ ] SharePoint permissions configured
- [ ] Row-level security implemented
- [ ] Admin features hidden from students

### Documentation

- [ ] User guide created (Segment 7)
- [ ] Training materials prepared
- [ ] Support contact info published
- [ ] Known issues documented

### Communication

- [ ] E-9 informed of go-live date
- [ ] Tutors notified and trained
- [ ] Students notified via email
- [ ] Public site updated with PowerApp link

---

## Post-Deployment Monitoring

### Week 1

- [ ] Monitor usage analytics daily
- [ ] Check for errors in App Insights
- [ ] Respond to user feedback quickly
- [ ] Fix critical bugs immediately

### Week 2-4

- [ ] Review booking patterns
- [ ] Check no-show rates
- [ ] Verify session notes completion
- [ ] Address user complaints

### Monthly

- [ ] Review performance metrics
- [ ] Optimize slow screens
- [ ] Update based on feedback
- [ ] Train new users

---

## Troubleshooting

### App Won't Load

**Symptoms:** Blank screen or infinite spinner

**Fixes:**
1. Check internet connection
2. Clear browser cache
3. Try different browser
4. Verify SharePoint site accessible
5. Check service account hasn't expired

### Data Not Showing

**Symptoms:** Galleries empty, dropdowns blank

**Fixes:**
1. Verify data connections: Data panel shows green checks
2. Check SharePoint permissions for current user
3. Review filter formulas for errors
4. Check delegation warnings
5. Refresh data sources

### Conflict Detection Not Working

**Symptoms:** Can book overlapping appointments

**Fixes:**
1. Review conflict formula logic
2. Check AppointmentDate field format
3. Verify Duration field is number
4. Test with known conflicting times
5. Add debug labels to show calculated values

### Session Notes Won't Save

**Symptoms:** Error when clicking Save Notes

**Fixes:**
1. Check SessionNotes SharePoint permissions
2. Verify AppointmentID lookup is valid
3. Ensure all required fields filled
4. Check for field type mismatches
5. Review Patch() formula syntax

### Slow Performance

**Symptoms:** Screens take >5 seconds to load

**Fixes:**
1. Check delegation warnings
2. Reduce data row limit queries
3. Use collections for repeated queries
4. Remove AddColumns() from galleries
5. Optimize OnVisible formulas
6. Use Concurrent() for multiple loads

---

## Maintenance Schedule

### Daily (Automatic)

- SharePoint list backups
- App usage logging
- Error tracking

### Weekly (Admin)

- Review error logs
- Check for broken connections
- Monitor capacity usage
- Respond to support tickets

### Monthly (Admin)

- Review analytics dashboard
- Optimize performance
- Update documentation
- Archive old appointments (>90 days)

### Quarterly (Admin + DCSIT)

- Full security audit
- Permission review
- Service account password rotation
- License compliance check

---

## Backup & Recovery

### Export App Package

**Monthly backup:**

1. Sign in as service account
2. Apps → Select app → Export package
3. Save as `MARDET_Tutoring_YYYYMMDD.zip`
4. Store in SharePoint: `/sites/MarDet/Backups/`

### SharePoint Data Backup

**Handled by DCSIT:**
- Daily incremental backups
- 90-day retention
- Point-in-time restore available

### Disaster Recovery

**If app corrupted:**

1. Import most recent backup package
2. Verify data connections
3. Test with admin account
4. Republish to production
5. Notify users of any downtime

---

## Version Control

### Version Naming

- **Major.Minor.Patch** format
- Example: `1.2.3`
  - Major (1): Significant features or redesign
  - Minor (2): New features, screen additions
  - Patch (3): Bug fixes, minor updates

### Change Log

**v1.0.0** (Initial Release)
- Dashboard with quick stats
- Appointment booking with conflict detection
- Calendar schedule view
- Session notes documentation
- Progress tracking display
- User role detection

**v1.1.0** (Planned)
- Recurring appointments
- Email notifications via Power Automate
- Advanced analytics dashboard
- Resource library integration

**v1.2.0** (Future)
- Mobile-optimized layouts
- Offline mode support
- File attachments for session notes
- Integration with DLPT testing system

---

## Success Metrics

### Track These KPIs

1. **Adoption Rate**
   - Target: 80% of students book via app within 30 days
   - Measure: Unique users / Total eligible students

2. **Booking Rate**
   - Target: 200 appointments/week
   - Measure: Average weekly bookings

3. **No-Show Rate**
   - Target: <10%
   - Measure: NoShow appointments / Total appointments

4. **Session Notes Completion**
   - Target: 95% of completed sessions have notes
   - Measure: Sessions with notes / Completed appointments

5. **User Satisfaction**
   - Target: 4.0/5.0 average rating
   - Measure: Survey after first month

---

## Support & Contact

**Technical Issues:**
- DCSIT Helpdesk: `helpdesk@dliflc.edu`
- Ticket reference: "MARDET Tutoring System"

**Feature Requests:**
- Submit via: `mardet_admin@dliflc.edu`
- Include screenshots and detailed description

**Training:**
- User guide: See Segment 7
- Video tutorials: [Link TBD]
- In-person training: Contact Tutor Chief

**Feedback:**
- Anonymous form: [Link TBD]
- Direct to [System Developer] (through contract end)
- E-9 Detachment leadership

---

**App is now production-ready. Proceed to Segment 4 for Power Automate workflows.**
