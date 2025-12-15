# SEGMENT 4: Power Automate Workflows

## What's Included

Complete automation workflows to support the MARDET Tutoring System with email notifications and administrative tasks.

### Files

1. **POWER_AUTOMATE_WORKFLOWS.md** (33KB)
   - 5 complete workflow designs
   - Detailed flow diagrams
   - Full HTML email templates
   - Testing procedures
   - Monitoring guidelines

2. **CONFIGURATION_GUIDE.md** (14KB)
   - Step-by-step setup instructions
   - Email template customization
   - Troubleshooting guide
   - Performance optimization
   - Security considerations

---

## The 5 Workflows

### 1. **Appointment Confirmation** (Instant Trigger)
**When**: New appointment created in SharePoint  
**What**: Send confirmation email to student and notification to tutor  
**Frequency**: Every new booking

**Key Features:**
- Validates appointment details
- Sends formatted HTML emails
- Updates NotificationSent flag
- Includes meeting links for online sessions

---

### 2. **24-Hour Reminder** (Scheduled Daily at 0800)
**When**: Every morning at 0800  
**What**: Find appointments tomorrow, send reminders  
**Frequency**: Daily

**Key Features:**
- Checks appointments 23-25 hours out
- Sends to both student and tutor
- Updates ReminderSent flag
- Includes preparation tips for students

---

### 3. **No-Show Detection** (Scheduled Daily at 1700)
**When**: Every evening at 1700  
**What**: Mark unupdated past appointments as no-shows  
**Frequency**: Daily

**Key Features:**
- Finds appointments from yesterday still "Scheduled"
- Auto-updates status to "NoShow"
- Sends notification to student
- Escalates to Tutor Chief if 3+ no-shows

---

### 4. **Status Change Notification** (Instant Trigger)
**When**: Appointment status modified  
**What**: Send appropriate notification based on new status  
**Frequency**: Each status change

**Cases:**
- **Cancelled** → Send cancellation confirmation
- **Completed** → Remind tutor to complete session notes
- **NoShow** → Handled by Workflow 3

---

### 5. **Weekly Digest** (Scheduled Sunday 1800)
**When**: Every Sunday evening at 1800  
**What**: Generate summary report for Tutor Chiefs  
**Frequency**: Weekly

**Includes:**
- Total appointments (Completed, Cancelled, No-show, Scheduled)
- Tutor utilization rates
- Session notes completion percentage
- Action items for leadership
- HTML table of statistics

---

## Email Templates

### Professional HTML Design

All emails include:
- **Header**: DLI Navy blue background with white text
- **Body**: Clean layout with appointment details in highlighted boxes
- **Action Buttons**: Links to PowerApp
- **Footer**: Contact information

### Color Coding

- **Confirmation**: Marine blue (#003E51)
- **Reminder**: Warning orange (#FF9800)
- **No-Show**: Alert red (#F44336)
- **Cancellation**: Medium red (#FF5722)
- **Digest**: Professional navy (#003E51)

### Responsive Design

- Works on desktop and mobile
- Tables for data presentation
- Readable fonts (Segoe UI)
- Adequate padding and spacing

---

## Implementation Time

| Workflow | Build Time | Test Time |
|----------|-----------|-----------|
| 1. Confirmation | 30 min | 10 min |
| 2. 24hr Reminder | 45 min | 15 min |
| 3. No-Show Detection | 45 min | 15 min |
| 4. Status Change | 30 min | 10 min |
| 5. Weekly Digest | 60 min | 20 min |
| **TOTAL** | **3.5 hours** | **1 hour** |

**Complete deployment**: 4-5 hours

---

## Quick Start

### For Developers

```
1. Navigate to https://make.powerautomate.com
2. For each of 5 workflows:
   a. Create flow (Automated or Scheduled)
   b. Follow POWER_AUTOMATE_WORKFLOWS.md design
   c. Copy email HTML templates
   d. Configure dynamic content
   e. Save and test
3. Export all as solution
4. Import to service account
5. Turn ON all workflows
```

### For Reviewers

```
1. Read POWER_AUTOMATE_WORKFLOWS.md for workflow logic
2. Review email templates for tone and content
3. Check CONFIGURATION_GUIDE.md for setup steps
4. Verify triggers and schedules align with requirements
5. Approve for deployment
```

---

## Key Features

### Intelligent Scheduling

- **0800**: 24-hour reminders (gives time to cancel if needed)
- **1700**: No-show detection (after business hours)
- **Sunday 1800**: Weekly digest (weekend review)

### Conditional Logic

- Only sends emails for relevant status changes
- Checks ReminderSent flag to prevent duplicates
- Escalates to leadership only when needed
- Validates appointment data before processing

### Error Handling

- Try-catch patterns for API calls
- Fallback messages if lookups fail
- Logging for troubleshooting
- Graceful degradation

### Performance Optimization

- Batch queries where possible
- Limits on Apply-to-each loops
- Efficient filter queries
- Minimal API calls

---

## Email Volume Estimates

### Daily
- **Confirmations**: 20-30 per day
- **24hr Reminders**: 20-30 per day (2x recipients)
- **No-Shows**: 2-5 per day
- **Status Changes**: 10-15 per day

**Total daily emails**: 70-110

### Weekly
- **Weekly Digest**: 1 per week to ~5 recipients

**Annual email volume**: ~25,000-30,000 emails

---

## Integration Points

### With PowerApp (Segment 3)
- Reads Appointments list for trigger data
- Updates NotificationSent, ReminderSent flags
- Status changes initiate workflows
- Provides email notifications for app actions

### With SharePoint Lists (Segment 2)
- Direct trigger on list item changes
- Reads from all 6 lists as needed
- Updates status and flags
- Queries for statistical calculations

### With PowerBI (Segment 5)
- Email delivery metrics can be tracked
- Workflow run history provides audit trail
- Statistics feed into analytics dashboards

---

## Testing Strategy

### Unit Tests (Individual Workflows)
1. Create test appointment
2. Verify trigger fires
3. Check email received
4. Validate data updates
5. Review run history

### Integration Tests (Cross-Workflow)
1. Book appointment → Confirmation sent
2. Wait 24 hours → Reminder sent
3. Attend session → Status change notification
4. Complete notes → No follow-up needed
5. Miss session → No-show detection

### Load Tests
1. Create 50 appointments at once
2. Verify all confirmations sent
3. Check for throttling issues
4. Monitor performance

---

## Monitoring Dashboard

Track these metrics in Power Automate:

### Reliability
- **Success rate**: Target 99%+
- **Failed runs**: < 1% per week
- **Error types**: API timeouts, permission issues

### Performance
- **Avg run time**: < 30 seconds per workflow
- **Peak load**: < 2 minutes during bulk operations
- **Queue depth**: Never > 10 pending

### Business Metrics
- **Email delivery rate**: 98%+
- **Reminder timeliness**: Within 15 min of trigger
- **No-show detection accuracy**: 100%

---

## Troubleshooting

### Common Issues

**"Flow didn't run at scheduled time"**
- Check if flow is ON
- Verify trigger schedule
- Review run history for errors

**"Email not received"**
- Check spam folder
- Verify recipient email address
- Confirm send permissions
- Test with personal email

**"Dynamic content shows error"**
- Verify field names match SharePoint
- Check for null/empty values
- Add null-checks in expressions

**"Too many API calls"**
- Optimize filter queries
- Reduce Apply-to-each loops
- Batch operations where possible

---

## Security & Compliance

### Data Handling
- Emails contain only necessary information
- No sensitive PII beyond names/ranks
- Links to PowerApp (CAC-protected)
- Encrypted in transit (TLS)

### Access Control
- Service account has minimum required permissions
- Email recipients determined by SharePoint data
- No email addresses hardcoded
- Distribution lists managed by DCSIT

### Audit Trail
- All workflow runs logged
- Email sent timestamps recorded
- Error logs retained 90 days
- Compliance with DoD email policies

---

## Maintenance

### Weekly
- [ ] Review failed runs
- [ ] Check email delivery metrics
- [ ] Verify scheduled triggers fired
- [ ] Monitor error logs

### Monthly
- [ ] Update email templates if needed
- [ ] Review trigger schedules
- [ ] Optimize slow workflows
- [ ] Archive old run history

### Quarterly
- [ ] Full security audit
- [ ] Permission review
- [ ] Load testing
- [ ] User feedback review

---

## Success Criteria

Before considering Segment 4 complete:

- [ ] All 5 workflows created and tested
- [ ] Email templates reviewed and approved
- [ ] Service account configured
- [ ] All workflows turned ON in production
- [ ] Test emails sent successfully
- [ ] No errors in first 24 hours
- [ ] Weekly digest generates correctly
- [ ] User feedback collected

---

## Known Limitations

### Power Automate Constraints
- Email send limit: 1000/day per user (should be sufficient)
- Flow run limit: 3000/month per flow (well within limits)
- Attachment size: 5MB max (not applicable)
- Execution time: 30 min timeout (not an issue)

### Workarounds
- If volume exceeds limits, split into multiple flows
- Use premium connectors if needed (requires license upgrade)
- Implement retry logic for transient failures

---

## Future Enhancements

### Phase 2 (Potential)
- SMS notifications via Twilio
- Teams channel notifications
- Calendar invites (.ics attachments)
- Recurring appointment automation
- AI-powered no-show prediction
- Automated session note reminders

### Phase 3 (Future)
- Integration with DLPT scheduling system
- Automatic progress tracking updates
- Resource recommendation engine
- Student performance alerts

---

## Dependencies

**Required:**
- Segment 2: SharePoint lists must exist
- Segment 3: PowerApp provides URL for emails
- Service account: DCSIT must create and configure
- Email permissions: Exchange admin approval

**Optional:**
- PowerBI (Segment 5): For email metrics dashboard
- Teams: For channel notifications (future)

---

## Next Steps

After completing Segment 4:

1. **Segment 5**: Build PowerBI dashboards
   - Connect to SharePoint lists
   - Create visualizations
   - Tutor utilization metrics
   - Student progress trends
   - No-show analytics

2. **Segment 6**: Prepare CS approval package
   - Security documentation
   - Compliance checklist
   - Helpdesk ticket template

3. **Segment 7**: Develop user training
   - Quick start guide
   - Video tutorials
   - FAQ document

---

## File Structure

```
segment4-automate/
├── README.md (this file)
├── POWER_AUTOMATE_WORKFLOWS.md
└── CONFIGURATION_GUIDE.md
```

---

## Pass to Claude Code

**Command:**
```
I need to build Power Automate workflows for the MARDET tutoring system.
Follow the designs in POWER_AUTOMATE_WORKFLOWS.md and use the setup 
steps in CONFIGURATION_GUIDE.md. All workflows run as service account 
pa.svc.mardet.tutoring.
```

---

**Last Updated**: December 2025  
**Version**: 1.0.0  
**Status**: Ready for Implementation  
**Estimated Build Time**: 4-5 hours
