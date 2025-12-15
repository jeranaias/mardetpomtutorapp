# SEGMENT 3: PowerApp Canvas Design & Development

## What's Included

Complete documentation for building the MARDET Tutoring System PowerApp Canvas application.

### Files

1. **POWERAPP_DESIGN.md** (27KB)
   - Complete screen-by-screen layouts
   - 5 core screens with wireframes
   - User role matrix
   - PowerFx formulas for each screen
   - Naming conventions
   - Performance optimization tips

2. **FORMULAS_REFERENCE.md** (19KB)
   - Reusable PowerFx formula library
   - User authentication & role detection
   - Date/time calculations
   - Conflict detection logic
   - Appointment management (single + recurring)
   - Filtering & searching patterns
   - Statistics & analytics formulas
   - Error handling & validation
   - Best practices

3. **CONFIGURATION_DEPLOYMENT.md** (15KB)
   - Initial setup instructions
   - Data source connections
   - Theme configuration (DLI colors)
   - Security & permissions
   - Testing procedures
   - Service account setup
   - Deployment checklist
   - Post-deployment monitoring
   - Troubleshooting guide

---

## The 5 Core Screens

### 1. Dashboard (Home)
- Quick stats tiles (Next appt, Weekly count, Monthly hours)
- Upcoming appointments gallery
- Quick action buttons
- Role-based display

### 2. Book Appointment (Students)
- Language selection
- Focus area checkboxes
- Tutor dropdown (filtered by language)
- Date/time picker
- Duration radio buttons
- Location selection
- Conflict detection indicator
- Recurring appointment option

### 3. My Schedule (Calendar)
- Week view navigation
- Appointments grouped by date
- Time formatting (military 24hr)
- View/Cancel actions per appointment
- Filter and status dropdowns

### 4. Session Notes (Tutors)
- Appointment details display
- Actual duration input
- Rich text editor for materials covered
- Performance rating radio group
- Focus areas checkboxes
- Homework assignment field
- Next session goals
- Recommendations

### 5. Progress Tracker (Students)
- Current status card (Grade, Trend, DLPT scores)
- Progress chart (grade over time)
- Tutoring summary stats
- Recent session notes gallery

---

## Key Features Implemented

### Conflict Detection
- **Student conflicts**: Cannot book overlapping appointments
- **Tutor conflicts**: System checks tutor availability
- **Capacity check**: Validates tutor weekly hour limits
- **Visual feedback**: Green checkmark or red X with message

### Recurring Appointments
- Weekly pattern with end date
- Generates multiple appointments with shared SeriesID
- Cancel individual or entire series
- JSON storage for pattern data

### Role-Based Security
- **Student**: Book appointments, view own schedule/progress
- **Tutor**: Manage schedule, create session notes, view assigned students
- **Tutor Chief**: Full access, analytics, manage all
- **Admin**: System configuration, all permissions

### Performance Optimizations
- Collections for caching frequently accessed data
- Concurrent() for parallel data loading
- Delegation-aware formulas
- Lazy loading (OnVisible, not OnStart)

---

## Data Connections

**Required SharePoint Lists** (from Segment 2):
1. Tutors
2. Students  
3. Appointments
4. SessionNotes
5. ProgressTracking
6. Resources

**Connection Setup:**
- Site URL: `https://dliflc.sharepoint.com/sites/MarDet`
- All lists added via PowerApps Data panel
- No premium connectors required (Seeded license only)

---

## Development Workflow

### Phase 1: Setup (30 min)
1. Create blank canvas app
2. Connect to SharePoint lists
3. Configure app settings
4. Set up theme colors and fonts

### Phase 2: Build Screens (4-6 hours)
1. Dashboard → Quick stats and upcoming appointments
2. Book Appointment → Full booking form with conflict detection
3. My Schedule → Calendar view with filters
4. Session Notes → Rich documentation form
5. Progress Tracker → Charts and history

### Phase 3: Formulas & Logic (3-4 hours)
1. App.OnStart → User detection and role assignment
2. Conflict detection → Overlap checking algorithms
3. Data filtering → Role-based queries
4. Validation → Required fields, date ranges, formats

### Phase 4: Testing (2-3 hours)
1. Test each user role
2. Verify conflict detection
3. Test data integrity
4. Performance check
5. Run App Checker

### Phase 5: Deploy (1 hour)
1. Export from development account
2. Import to service account
3. Share with security groups
4. Publish and notify users

**Total Time Estimate: 10-15 hours**

---

## Quick Start

### For Developers

```
1. Navigate to https://make.powerapps.com
2. Create → Canvas app from blank (Tablet layout)
3. Add data → SharePoint lists (all 6 from Segment 2)
4. Follow POWERAPP_DESIGN.md for each screen
5. Use FORMULAS_REFERENCE.md for PowerFx code
6. Configure per CONFIGURATION_DEPLOYMENT.md
7. Test with each user role
8. Export and import to service account
9. Share with security groups
10. Publish!
```

### For Reviewers

```
1. Read POWERAPP_DESIGN.md to understand architecture
2. Review screen layouts and user flows
3. Examine FORMULAS_REFERENCE.md for logic
4. Check CONFIGURATION_DEPLOYMENT.md for deployment plan
5. Provide feedback on design decisions
```

---

## Naming Conventions

### Screens
- `scrDashboard`
- `scrBookAppointment`
- `scrSchedule`
- `scrSessionNotes`
- `scrProgressTracker`

### Controls
- **Gallery**: `gal[Name]` - e.g., `galAppointments`
- **Button**: `btn[Action]` - e.g., `btnBook`, `btnCancel`
- **Dropdown**: `ddl[Name]` - e.g., `ddlLanguage`, `ddlTutor`
- **Text Input**: `txt[Name]` - e.g., `txtNotes`, `txtDuration`
- **Date Picker**: `dat[Name]` - e.g., `datAppointment`
- **Label**: `lbl[Name]` - e.g., `lblWelcome`, `lblConflict`

### Variables
- **Global**: `var[Name]` - e.g., `varCurrentUser`, `varUserRole`
- **Collection**: `col[Name]` - e.g., `colAppointments`, `colTutors`
- **Context**: `ctx[Name]` - e.g., `ctxSelectedTutor`

---

## Formula Highlights

### Conflict Detection Algorithm
```powerFx
// Check if new appointment overlaps with existing
Set(varConflict,
    !IsEmpty(
        Filter(
            Appointments,
            // Same person (student or tutor)
            StudentID = varCurrentStudent OR TutorID = varSelectedTutor,
            Status = "Scheduled",
            // Overlap logic: new start < existing end AND new end > existing start
            varNewStart < DateAdd(AppointmentDate, Duration, Minutes),
            DateAdd(varNewStart, varDuration, Minutes) > AppointmentDate
        )
    )
);
```

### Role Detection
```powerFx
Set(varUserRole,
    Switch(
        true,
        !IsBlank(LookUp(Tutors, Email = User().Email)), "Tutor",
        !IsBlank(LookUp(Students, Email = User().Email)), "Student",
        User().Email = "admin@dliflc.edu", "Admin",
        "Guest"
    )
);
```

### Recurring Appointments Generation
```powerFx
ForAll(
    Sequence(DateDiff(Today(), varRecurringEnd, Days) / 7) As Week,
    Patch(
        Appointments,
        Defaults(Appointments),
        {
            // Core fields
            StudentID: varCurrentStudent,
            TutorID: varSelectedTutor,
            AppointmentDate: DateAdd(varStartDate, Week.Value * 7, Days),
            Duration: varDuration,
            Status: "Scheduled",
            RecurringSeriesID: varSeriesGUID
        }
    )
);
```

---

## Testing Checklist

### Functional Tests
- [ ] Students can book appointments
- [ ] Conflict detection prevents double-booking
- [ ] Tutors can view assigned schedule
- [ ] Session notes save correctly
- [ ] Progress tracker displays data
- [ ] Recurring appointments create properly
- [ ] Cancellation works (single & series)
- [ ] Filters and search function correctly

### Security Tests
- [ ] Students see only own data
- [ ] Tutors see only assigned appointments
- [ ] Admins have full access
- [ ] Unauthorized users redirected/blocked
- [ ] Row-level security enforced

### Performance Tests
- [ ] Dashboard loads < 3 seconds
- [ ] Galleries responsive with 100+ records
- [ ] No delegation warnings on critical screens
- [ ] Search responds instantly
- [ ] App Checker shows no errors

### User Experience Tests
- [ ] Mobile layout functional
- [ ] Desktop layout optimized
- [ ] Buttons clearly labeled
- [ ] Error messages helpful
- [ ] Success notifications appear
- [ ] Navigation intuitive

---

## Common Issues & Solutions

### Issue: "Unable to connect to data source"
**Solution**: Verify SharePoint site URL, check permissions, re-add data source

### Issue: "Delegation warning: This Filter() may not return all records"
**Solution**: Simplify filter logic, use collections for complex queries, increase data row limit

### Issue: Gallery shows no items
**Solution**: Check Items formula, verify data exists in SharePoint, review filter conditions

### Issue: Conflict detection always shows conflict
**Solution**: Verify date/time formats match, check Duration field is numeric, review overlap logic

### Issue: App slow to load
**Solution**: Move queries from OnStart to OnVisible, use Concurrent(), cache data in collections

---

## Integration Points

### With Public Site (Segment 1)
- Resources list contains URLs to GitHub Pages materials
- "Browse Resources" button opens public site in new tab
- Link back to PowerApp from public site navigation

### With Power Automate (Segment 4)
- Appointment.ReminderSent flag triggers email workflow
- Status changes trigger notifications
- Recurring appointments created via workflow (alternative to ForAll)

### With PowerBI (Segment 5)
- Direct connection to SharePoint lists
- Dashboards embedded in Admin screens
- Analytics for tutor workload, student progress, no-show rates

---

## Deployment Timeline

### Week 1: Development
- Days 1-2: Setup and Dashboard screen
- Days 3-4: Book Appointment and Schedule screens
- Day 5: Session Notes and Progress screens

### Week 2: Testing & Refinement
- Days 1-2: Role-based testing
- Days 3-4: Performance optimization
- Day 5: Bug fixes and polish

### Week 3: Deployment
- Day 1: Export and service account import
- Day 2: Security group configuration
- Day 3: User acceptance testing
- Days 4-5: Training and go-live

**Total: 3 weeks from start to production**

---

## Success Criteria

Before considering Segment 3 complete:

- [ ] All 5 screens built and functional
- [ ] Core formulas implemented correctly
- [ ] User roles tested and working
- [ ] Conflict detection validated
- [ ] Performance acceptable (<3s loads)
- [ ] No App Checker errors
- [ ] Delegation warnings addressed
- [ ] App exported and documented
- [ ] Ready for service account deployment

---

## Next Steps

After completing Segment 3:

1. **Segment 4**: Build Power Automate workflows
   - Email reminders 24hrs before appointments
   - No-show notifications
   - Recurring appointment generation
   - Status change notifications

2. **Segment 5**: Create PowerBI dashboards
   - Tutor utilization rates
   - Student progress trends
   - No-show analytics
   - Language demand patterns

3. **Segment 6**: Prepare CS approval package
   - Security justification
   - Compliance documentation
   - Helpdesk ticket template

4. **Segment 7**: Develop user training materials
   - Quick start guide
   - Video tutorials
   - FAQ document
   - Support procedures

---

## File Structure

```
segment3-powerapp/
├── README.md (this file)
├── POWERAPP_DESIGN.md
├── FORMULAS_REFERENCE.md
└── CONFIGURATION_DEPLOYMENT.md
```

---

## Pass to Claude Code

**Command:**
```
I need to build a PowerApp using the SharePoint lists from Segment 2.
Follow the screen designs in POWERAPP_DESIGN.md and use the formulas 
from FORMULAS_REFERENCE.md. Deploy per CONFIGURATION_DEPLOYMENT.md.
```

---

**Last Updated**: December 2025  
**Version**: 1.0.0  
**Status**: Ready for Development  
**Estimated Build Time**: 10-15 hours
