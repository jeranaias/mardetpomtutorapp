# SEGMENT 2: SharePoint Lists & Data Model

## What's Included

This segment contains complete documentation for creating the SharePoint backend for the MARDET Tutoring System PowerApp.

### Files

1. **SHAREPOINT_LISTS_SCHEMA.md** - Complete technical specification
   - All 6 SharePoint lists with detailed column definitions
   - Permissions matrix
   - PowerShell automation script
   - Sample test data
   - Indexing and performance recommendations

2. **MANUAL_LIST_CREATION.md** - Step-by-step GUI instructions
   - For users who prefer web interface over PowerShell
   - Click-by-click instructions for each list
   - ~2 hour time estimate
   - Troubleshooting guide

3. **DATA_MODEL_REFERENCE.md** - Quick reference card
   - Visual entity relationship diagram
   - Field type legend
   - Validation rules
   - Size estimates
   - PowerBI connection examples

---

## The 6 SharePoint Lists

### 1. **Tutors**
Staff roster with languages, availability, and contact info
- **Fields**: 14 columns
- **Records**: 30-40 tutors

### 2. **Students**  
Student enrollment with class assignment and status
- **Fields**: 16 columns
- **Records**: ~400 active students

### 3. **Appointments**
Scheduling system with conflict detection support
- **Fields**: 18 columns (includes lookups and calculated)
- **Records**: 20,000-30,000 per year

### 4. **SessionNotes**
Post-session documentation and performance tracking
- **Fields**: 13 columns
- **Records**: 15,000-20,000 per year

### 5. **ProgressTracking**
Periodic academic snapshots (DLPT scores, grades, trends)
- **Fields**: 13 columns
- **Records**: ~400 per month

### 6. **Resources**
Links to public site study materials
- **Fields**: 12 columns
- **Records**: 100-500 total

---

## Implementation Options

### Option A: PowerShell Script (5 minutes)
```powershell
# Requires PnP PowerShell module
Connect-PnPOnline -Url "https://dliflc.sharepoint.com/sites/MarDet" -Interactive
# Run script from SHAREPOINT_LISTS_SCHEMA.md
```

**Pros:**
- Fast and automated
- Less prone to typos
- Consistent results

**Cons:**
- Requires PnP PowerShell module
- Need site admin permissions
- May need DCSIT help

---

### Option B: Manual GUI (2 hours)
Follow **MANUAL_LIST_CREATION.md** step-by-step

**Pros:**
- No PowerShell needed
- Learn SharePoint interface
- Full control over each step

**Cons:**
- Time-consuming
- Manual entry risks typos
- Tedious for 6 lists

---

## Quick Start

### 1. Choose Your Method
- **Fast**: Use PowerShell script
- **Manual**: Follow GUI guide

### 2. Prerequisites
- Access to https://dliflc.sharepoint.com/sites/MarDet
- Site Owner or Full Control permissions
- For PowerShell: Install PnP module
  ```powershell
  Install-Module -Name PnP.PowerShell
  ```

### 3. Create Lists
- Run script OR follow manual steps
- Create all 6 lists
- Add all columns per schema

### 4. Verify
- Check relationships (lookups working)
- Test calculated columns
- Add sample test data
- Verify permissions

---

## Data Relationships

```
Students ←──(1:N)──→ Appointments ←──(N:1)──→ Tutors
                          │
                         (1:1)
                          │
                          ▼
                    SessionNotes

Students ←──(1:N)──→ ProgressTracking
```

---

## Key Features

### Security
- CAC/SSO authentication via M365
- Role-based permissions (Student/Tutor/Admin)
- PII protected in SharePoint tenant
- Service account for automation

### Scalability
- Indexed columns for performance
- Supports 400+ concurrent users
- 30K+ appointments per year
- PowerBI-ready data model

### Integration Points
- **PowerApp**: Direct SharePoint connector
- **Power Automate**: List triggers and actions
- **PowerBI**: Direct query or import
- **Public Site**: Links via Resources list

---

## Validation Rules

### Built-in Constraints
- Unique CAC_EDIPI (10 digits)
- Email format validation
- Date range checks
- Required field enforcement

### Business Logic (in PowerApp)
- No overlapping appointments
- Tutor workload limits
- Student booking restrictions
- Cancellation policies

---

## Sample Data

Each list schema includes sample test records. Use these to:
1. Verify list creation
2. Test PowerApp connections
3. Build PowerBI dashboards
4. Train users

---

## Next Steps After Creation

1. ✅ Create all 6 lists
2. ✅ Add sample test data
3. ⏭️ Connect PowerApp (Segment 3)
4. ⏭️ Configure Power Automate (Segment 4)
5. ⏭️ Build PowerBI dashboards (Segment 5)

---

## Troubleshooting

### "Can't create lookup column"
- Ensure target list exists first
- Refresh browser
- Check list permissions

### "Calculated column errors"
- Verify formula syntax
- Check referenced column names
- Test with sample data

### "PowerShell connection fails"
- Check PnP module installed
- Verify site URL
- Confirm admin permissions
- Try: `Connect-PnPOnline -Url [URL] -Interactive`

### Need Help?
- Reference: MANUAL_LIST_CREATION.md (Troubleshooting section)
- Contact: DCSIT helpdesk
- SharePoint docs: https://docs.microsoft.com/sharepoint

---

## Time Estimates

| Task | PowerShell | Manual |
|------|-----------|--------|
| Setup | 5 min | 0 min |
| Create lists | 2 min | 100 min |
| Add test data | 10 min | 20 min |
| Verify | 10 min | 15 min |
| **TOTAL** | **27 min** | **135 min** |

---

## Maintenance Notes

### Weekly
- Monitor list growth
- Check for orphaned records

### Monthly
- Review permissions
- Archive old appointments (>90 days)
- Update resource links

### Quarterly
- Performance optimization
- Index maintenance
- Full data audit

---

## Integration with Segment 1 (Public Site)

The **Resources** list in SharePoint will contain URLs pointing to the public GitHub Pages site created in Segment 1. This creates a clean separation:

- **Public Site**: Educational content (no PII)
- **SharePoint**: Operational data (PII protected)
- **Resources List**: Bridge between the two

---

## Compliance

### DLIFLC PowerApp Policy
- ✅ All PII in M365 tenant (SharePoint)
- ✅ CAC/SSO authentication
- ✅ Role-based permissions
- ✅ Audit logging enabled
- ✅ Service account for automation (configured in Segment 3)

### Data Retention
- Active appointments: Indefinite
- Completed appointments: Archive after 90 days
- Session notes: Keep 2 years
- Progress tracking: Keep all records
- Student records: Archive after graduation + 1 year

---

## Success Criteria

Before moving to Segment 3 (PowerApp), verify:

- [ ] All 6 lists created
- [ ] All columns added with correct types
- [ ] Lookup relationships working
- [ ] Calculated columns displaying values
- [ ] Permissions configured
- [ ] Sample test data added and visible
- [ ] Views created and filtering correctly
- [ ] No errors in list settings
- [ ] Lists accessible at correct URLs

---

## File Structure

```
segment2-sharepoint/
├── README.md (this file)
├── SHAREPOINT_LISTS_SCHEMA.md
├── MANUAL_LIST_CREATION.md
└── DATA_MODEL_REFERENCE.md
```

---

## Pass to Claude Code

This entire segment can be handed to Claude Code for reference when building the PowerApp in Segment 3. The data model is now fully documented and ready for app development.

**Command for Claude Code:**
```
I have SharePoint lists defined in SHAREPOINT_LISTS_SCHEMA.md. 
Use this data model to build the PowerApp screens and formulas 
for the MARDET tutoring system.
```

---

**Last Updated**: December 2025  
**Version**: 1.0.0  
**Status**: Complete - Ready for PowerApp Development
