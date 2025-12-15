# SEGMENT 5: PowerBI Dashboards & Analytics

## What's Included

Complete PowerBI dashboard designs and DAX formulas for comprehensive analytics on the MARDET Tutoring System.

### Files

1. **POWERBI_DASHBOARDS.md** (26KB)
   - 3 complete dashboard designs with layouts
   - Data model architecture
   - Visualization specifications
   - Color scheme (DLI branding)
   - Security & RLS configuration
   - Deployment steps

2. **DAX_REFERENCE.md** (20KB)
   - 100+ DAX formulas
   - Calculated measures for all metrics
   - Calculated columns
   - Time intelligence functions
   - Ranking and Top N queries
   - Best practices

---

## The 3 Dashboards

### 1. **Executive Dashboard** (Leadership View)
**Audience**: E-9, commanding officers, senior leadership

**Key Metrics:**
- Total sessions with MoM growth
- Completion rate
- No-show rate
- Active students count

**Visualizations:**
- Appointment trends (line chart)
- Language distribution (pie chart)
- Top tutors by hours (table)

**Use Case**: Quick overview of system health and utilization

---

### 2. **Operations Dashboard** (Tutor Management)
**Audience**: Tutor Chiefs, operations staff

**Key Metrics:**
- Tutor utilization rates (color-coded)
- Weekly appointment volume by day
- No-show analysis (students & tutors)
- Session notes completion rate

**Visualizations:**
- Tutor utilization (horizontal bar chart)
- Weekly volume (column chart)
- No-show leaders (tables)
- Notes completion (progress bar)

**Use Case**: Day-to-day management, workload balancing, quality assurance

---

### 3. **Student Progress Dashboard** (Academic Tracking)
**Audience**: Instructors, tutors, academic advisors

**Key Metrics:**
- Average grade across languages
- DLPT-ready student count
- Average tutoring hours per student
- Students at risk

**Visualizations:**
- Grade trends over time (multi-line chart)
- DLPT score distribution (scatter plot)
- Students needing support (table with alerts)
- Performance by focus area (stacked bar)

**Use Case**: Academic intervention, progress monitoring, DLPT preparation

---

## Data Model

### Fact Table
- **Appointments** - Primary fact table with appointment details

### Dimension Tables
- **Students** - Student demographics and status
- **Tutors** - Tutor information and capacity
- **SessionNotes** - Session documentation
- **ProgressTracking** - Academic snapshots
- **Resources** - Resource library
- **DateTable** - Calendar dimension (created in DAX)

### Relationships
```
Students (1) ──> (*) Appointments
Tutors (1) ──> (*) Appointments
Appointments (1) ──> (1) SessionNotes
Students (1) ──> (*) ProgressTracking
DateTable (1) ──> (*) Appointments
```

---

## Key DAX Measures

### Critical Metrics

**Tutor Utilization:**
```DAX
TutorUtilizationRate = 
VAR ActualHours = [TutorTotalHours]
VAR MaxHours = SUM(Tutors[MaxHoursPerWeek])
RETURN DIVIDE(ActualHours, MaxHours, 0) * 100
```

**No-Show Rate:**
```DAX
NoShowRate = 
DIVIDE([NoShowSessions], [TotalAppointments], 0) * 100
```

**Notes Completion:**
```DAX
NotesCompletionRate = 
DIVIDE([SessionNotesCount], [CompletedSessions], 0) * 100
```

**Students At Risk:**
```DAX
StudentsAtRisk = 
CALCULATE(
    COUNTROWS(ProgressTracking),
    ProgressTracking[Trends] = "Declining" ||
    ProgressTracking[AttendanceRate] < 80
)
```

See **DAX_REFERENCE.md** for 100+ formulas.

---

## Color Scheme (DLI Branding)

**Primary Colors:**
- Navy: #003E51 (headers, primary elements)
- Gold: #C5A572 (accents, highlights)
- Red: #B31B1B (alerts, critical items)

**Status Colors:**
- Success (Green): #4CAF50
- Warning (Orange): #FF9800
- Danger (Red): #F44336
- Info (Blue): #2196F3

**Conditional Formatting:**
- Tutor utilization: Green (>70%), Yellow (50-70%), Red (<50%)
- Performance trends: Up arrow (improving), down (declining)
- Notes completion: Check mark (≥95%), warning (< 95%)

---

## Implementation Time

| Task | Time Estimate |
|------|---------------|
| Setup workspace & connect data | 30 min |
| Build data model & relationships | 45 min |
| Create DAX measures | 2 hours |
| Design Dashboard 1 (Executive) | 1 hour |
| Design Dashboard 2 (Operations) | 1.5 hours |
| Design Dashboard 3 (Progress) | 1.5 hours |
| Configure RLS & security | 30 min |
| Testing & optimization | 1 hour |
| **TOTAL** | **8-9 hours** |

---

## Quick Start

### For Developers

```
1. Open Power BI Desktop
2. Get Data → SharePoint List
   - URL: https://dliflc.sharepoint.com/sites/MarDet
   - Select all 6 lists
3. Load to Power Query Editor
   - Clean column names
   - Set data types
4. Create Date table (DAX from POWERBI_DASHBOARDS.md)
5. Build relationships (1:Many from dimensions to facts)
6. Create measures (copy from DAX_REFERENCE.md)
7. Design 3 dashboard pages per layouts
8. Apply DLI color theme
9. Configure Row-Level Security
10. Publish to workspace
11. Schedule daily refresh (0600)
12. Share with security groups
```

### For Reviewers

```
1. Read POWERBI_DASHBOARDS.md for dashboard designs
2. Review DAX_REFERENCE.md for calculation logic
3. Verify metrics align with business requirements
4. Check color scheme matches DLI branding
5. Validate RLS rules for security
6. Approve for deployment
```

---

## Data Refresh Strategy

### Import Mode (Recommended)
- **Refresh schedule**: Daily at 0600 (before business hours)
- **Incremental refresh**: Keep 90 days active, archive older
- **Performance**: Fast dashboard loading

### Direct Query Mode (Optional)
- **Use case**: Real-time KPIs for Executive Dashboard
- **Trade-off**: Slower performance but always current
- **Recommendation**: Use for specific cards only

---

## Row-Level Security (RLS)

### Tutor Role
```DAX
TutorRLS = Tutors[Email] = USERPRINCIPALNAME()
```
- Sees only own appointments and students
- Limited to personal performance metrics

### Tutor Chief Role
```DAX
TutorChiefRLS = TRUE()  // Full access
```
- Sees all data across all tutors
- Access to all 3 dashboards

### Instructor Role
```DAX
InstructorRLS = Students[Language] IN {'Arabic', 'Russian'}
```
- Sees only students in assigned languages
- Access to Progress Dashboard only

---

## PowerApp Integration

Embed PowerBI reports in PowerApp admin screens:

```powerFx
// PowerBI visual control
PowerBIViewer.WorkspaceId = "abc123..."
PowerBIViewer.ReportId = "def456..."
PowerBIViewer.PageName = "Operations Dashboard"

// Dynamic filtering
PowerBIViewer.Filters = JSON({
    Language: ddlLanguageFilter.Selected.Value,
    TutorEmail: User().Email
})
```

---

## Key Features

### Interactive Filters
- Date range selector (last 7/30/90 days, custom)
- Language filter (all 9 languages)
- Status filter (Completed, Scheduled, Cancelled, NoShow)
- Tutor/Student dropdown selectors

### Drill-Through Pages
- Click tutor name → See detailed tutor performance
- Click student → See individual progress timeline
- Click date → See all appointments for that day

### Conditional Formatting
- Color-coded utilization bars
- Performance trend indicators (arrows)
- Alert icons for at-risk students
- Status badges for completion rates

### Mobile Optimization
- Responsive layouts for phone/tablet
- Simplified views for small screens
- Touch-friendly navigation

---

## Performance Optimization

### Best Practices Implemented

1. **Import mode for historical data** (fast queries)
2. **Filtered data at source** (Power Query)
3. **Calculated columns minimized** (prefer measures)
4. **Efficient DAX with variables** (no nested iterators)
5. **Limited visuals per page** (max 8-10)
6. **Indexed columns in SharePoint** (faster queries)
7. **Incremental refresh** (reduce processing time)

**Target Performance:**
- Dashboard load time: < 3 seconds
- Visual refresh: < 1 second
- Data refresh: < 5 minutes

---

## Testing Checklist

### Data Integrity
- [ ] All 6 SharePoint lists connected
- [ ] Relationships correctly defined (1:Many)
- [ ] Date table spans full date range
- [ ] No missing or null values in key fields

### DAX Measures
- [ ] All measures calculate without errors
- [ ] Filters apply correctly
- [ ] Time intelligence works (YTD, MoM)
- [ ] Division by zero handled (DIVIDE)
- [ ] Blank values handled appropriately

### Visualizations
- [ ] Charts display correct data
- [ ] Colors match DLI branding
- [ ] Tooltips show relevant details
- [ ] Legends clearly labeled
- [ ] Axis scales appropriate

### Security
- [ ] RLS roles created and tested
- [ ] "View as" feature validates access
- [ ] Tutors see only own data
- [ ] Tutor Chiefs see all data
- [ ] Workspace permissions configured

### Performance
- [ ] Dashboards load in < 3 seconds
- [ ] No performance analyzer warnings
- [ ] Query folding occurs in Power Query
- [ ] DAX Studio shows efficient queries

---

## Monitoring & KPIs

### Track These Metrics

**System Health:**
- Completion rate target: ≥ 90%
- No-show rate target: ≤ 5%
- Notes completion target: ≥ 95%

**Tutor Performance:**
- Utilization rate: 60-80% (optimal range)
- Avg sessions per week: 15-20
- Student satisfaction: ≥ 4.0/5.0

**Student Progress:**
- DLPT-ready rate: ≥ 80% by graduation
- Grade improvement: Upward trend
- At-risk students: ≤ 5%

**Operational Efficiency:**
- Cancellation rate: ≤ 10%
- Same-day bookings: < 30%
- Resource utilization: ≥ 60%

---

## Maintenance Schedule

### Daily
- Check data refresh status
- Review any errors in refresh log
- Monitor dashboard usage metrics

### Weekly
- Review KPI trends with Tutor Chiefs
- Address any performance issues
- Update filters if needed

### Monthly
- Full data model optimization
- Archive old data (>90 days)
- User feedback review
- Update DAX if requirements change

### Quarterly
- Security audit (RLS validation)
- Performance tuning
- Dashboard redesign if needed
- User training refresher

---

## Common Issues & Solutions

### "Relationships not working"
**Cause**: Cardinality incorrect or filter direction wrong  
**Fix**: Check 1:Many vs Many:Many, set proper filter direction

### "DAX measure returns blank"
**Cause**: No data in filter context or division by zero  
**Fix**: Add DIVIDE with default value, check filter conditions

### "Visuals loading slowly"
**Cause**: Too many visuals or complex DAX  
**Fix**: Reduce visuals per page, optimize DAX with variables

### "Data not refreshing"
**Cause**: Permissions issue or SharePoint timeout  
**Fix**: Verify service account permissions, check gateway connection

### "Colors not matching DLI branding"
**Cause**: Default theme applied  
**Fix**: Create custom theme JSON with DLI colors

---

## Success Criteria

Before considering Segment 5 complete:

- [ ] All 3 dashboards designed and functional
- [ ] Data model optimized with correct relationships
- [ ] 50+ DAX measures created and tested
- [ ] DLI color scheme applied throughout
- [ ] RLS configured and validated
- [ ] Performance meets targets (<3s load)
- [ ] Published to workspace
- [ ] Daily refresh scheduled
- [ ] Shared with security groups
- [ ] User acceptance testing passed

---

## Integration Points

### With SharePoint Lists (Segment 2)
- Direct connection to all 6 lists
- Queries optimized with filters
- Incremental refresh reduces load

### With PowerApp (Segment 3)
- Embed dashboards in admin screens
- Pass filters dynamically
- Single sign-on (SSO) with Azure AD

### With Power Automate (Segment 4)
- Workflow metrics can be tracked
- Email delivery rates monitored
- Run history provides audit trail

---

## Future Enhancements

### Phase 2
- Predictive analytics (ML models for no-show prediction)
- AI-powered insights (Q&A natural language)
- Real-time streaming for live KPIs
- Mobile app with push notifications

### Phase 3
- Integration with DLPT testing system
- Automated intervention alerts
- Resource recommendation engine
- Student success predictive models

---

## Dependencies

**Required:**
- Segment 2: All 6 SharePoint lists must exist
- Power BI Desktop: Latest version
- Power BI Pro license: For sharing (service account)
- SharePoint permissions: Read access to all lists

**Optional:**
- Power BI Premium: For larger datasets (>1GB)
- Power BI Embedded: For white-label integration
- Gateway: For on-premises data sources (not needed)

---

## Next Steps

After completing Segment 5:

1. **Segment 6**: Prepare CS approval package
   - Security documentation
   - Compliance checklist
   - Data handling procedures
   - Helpdesk ticket template
   - Risk assessment

2. **Segment 7**: Develop user training materials
   - Quick start guide for students
   - Tutor handbook
   - Admin procedures
   - Video tutorials
   - FAQ document

---

## File Structure

```
segment5-powerbi/
├── README.md (this file)
├── POWERBI_DASHBOARDS.md
└── DAX_REFERENCE.md
```

---

## Pass to Claude Code

**Command:**
```
I need to build PowerBI dashboards for the MARDET tutoring system.
Connect to SharePoint lists from Segment 2, follow dashboard designs in 
POWERBI_DASHBOARDS.md, and use DAX formulas from DAX_REFERENCE.md.
Apply DLI color scheme and configure RLS.
```

---

**Last Updated**: December 2025  
**Version**: 1.0.0  
**Status**: Ready for Development  
**Estimated Build Time**: 8-9 hours

---

**Status: 5/7 Segments Complete** 🎯
- ✅ Segment 1: Public Site (React + GitHub Pages)
- ✅ Segment 2: SharePoint Lists (6 lists, data model)
- ✅ Segment 3: PowerApp Canvas (5 screens, formulas)
- ✅ Segment 4: Power Automate (5 workflows, emails)
- ✅ Segment 5: PowerBI Dashboards (3 dashboards, 100+ DAX)
- ⏭️ Segment 6: CS Approval Package
- ⏭️ Segment 7: User Training Guide
