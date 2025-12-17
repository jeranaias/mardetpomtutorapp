# Power Automate Configuration Guide

## Quick Reference

**5 Workflows to Build:**
1. Appointment Confirmation (Instant)
2. 24-Hour Reminder (Daily 0800)
3. No-Show Detection (Daily 1700)
4. Status Change Notification (Instant)
5. Weekly Digest (Sunday 1800)

**Service Account**: `pa.svc.mardet.tutoring`

---

## Prerequisites

- ✅ All 6 SharePoint lists created (Segment 2)
- ✅ PowerApp deployed (Segment 3)
- ✅ Service account created by DCSIT
- ✅ Power Automate license assigned
- ✅ Email send permissions configured

---

## Workflow Creation

### Method 1: Build Manually (Recommended for Learning)

Follow POWER_AUTOMATE_WORKFLOWS.md step-by-step for each workflow.

**Time estimate**: 2-3 hours for all 5 workflows

### Method 2: Import Solutions (Faster)

*Note: Solution files not included - would need to be exported after manual creation*

---

## Detailed Setup: Workflow 1 (Confirmation Email)

### Step-by-Step

1. **Go to Power Automate**
   - Navigate to https://make.powerautomate.com
   - Ensure you're in the correct environment

2. **Create Flow**
   - Click **+ Create**
   - Select **Automated cloud flow**
   - Name: "MARDET - Appointment Confirmation"
   - Trigger: **When an item is created** (SharePoint)
   - Click **Create**

3. **Configure Trigger**
   - Site Address: `https://dliflc.sharepoint.com/sites/MarDet`
   - List Name: **Appointments**
   - Click **+ New step**

4. **Get Student Details**
   - Action: **Get item** (SharePoint)
   - Site Address: Same as above
   - List Name: **Students**
   - Id: `Appointments.StudentID` (from dynamic content)
   - Click **+ New step**

5. **Get Tutor Details**
   - Action: **Get item** (SharePoint)
   - Site Address: Same
   - List Name: **Tutors**
   - Id: `Appointments.TutorID`
   - Click **+ New step**

6. **Add Condition**
   - Action: **Condition**
   - If: `Status` equals `Scheduled`
   - If yes branch → continue
   - If no branch → do nothing

7. **Send Email to Student**
   - Action: **Send an email (V2)** (Office 365 Outlook)
   - To: `Student.Email` (from Get item)
   - Subject: `Tutoring Appointment Confirmed - @{Student.Language}`
   - Body: Paste HTML template from POWER_AUTOMATE_WORKFLOWS.md
   - Use dynamic content to populate:
     - `@{Student.Rank}`
     - `@{Student.FullName}`
     - `@{formatDateTime(Appointments.AppointmentDate, 'dddd, MMMM dd, yyyy')}`
     - etc.

8. **Send Email to Tutor**
   - Action: **Send an email (V2)**
   - To: `Tutor.Email`
   - Subject: `New Tutoring Appointment - @{Student.FullName}`
   - Body: Paste tutor template

9. **Update Appointment**
   - Action: **Update item** (SharePoint)
   - Site Address: Same
   - List Name: **Appointments**
   - Id: `Appointments.ID`
   - Title: Keep existing
   - NotificationSent: `Yes`

10. **Save and Test**
    - Click **Save**
    - Click **Test** → **Manually**
    - Create test appointment in PowerApp
    - Verify emails received

---

## Detailed Setup: Workflow 2 (24hr Reminder)

### Step-by-Step

1. **Create Scheduled Flow**
   - Click **+ Create** → **Scheduled cloud flow**
   - Name: "MARDET - 24hr Appointment Reminder"
   - Starting: Tomorrow (any date)
   - Repeat every: **1 Day**
   - At these times: **08:00**
   - Click **Create**

2. **Get Appointments Needing Reminders**
   - Action: **Get items** (SharePoint)
   - Site Address: `https://dliflc.sharepoint.com/sites/MarDet`
   - List Name: **Appointments**
   - Filter Query:
     ```
     Status eq 'Scheduled' and ReminderSent eq false
     ```
   - Advanced options → Limit to: `100`

3. **Apply to Each Appointment**
   - Action: **Apply to each**
   - Select output from previous step: `value` (array of appointments)

4. **Check if Appointment is Tomorrow**
   - Action: **Condition**
   - Get appointment date: `AppointmentDate` (from current item)
   - Check if between 23-25 hours from now:
     ```
     @{currentItem()?['AppointmentDate']}
     greater than or equal
     @{addHours(utcNow(), 23)}
     
     AND
     
     @{currentItem()?['AppointmentDate']}
     less than or equal
     @{addHours(utcNow(), 25)}
     ```

5. **If Yes → Get Student & Tutor**
   - Same as Workflow 1 steps 4-5

6. **Send Reminder Emails**
   - Same as Workflow 1 steps 7-8
   - Use reminder email templates

7. **Update ReminderSent Flag**
   - Action: **Update item**
   - ReminderSent: `Yes`

8. **Save and Test**
   - Create appointment for tomorrow
   - Manually run flow
   - Verify reminder sent

---

## Detailed Setup: Workflow 3 (No-Show Detection)

### Step-by-Step

1. **Create Scheduled Flow**
   - Scheduled cloud flow
   - Name: "MARDET - No-Show Detection"
   - Repeat every: **1 Day**
   - At: **17:00**

2. **Get Past Appointments Still Scheduled**
   - Action: **Get items** (SharePoint)
   - List: **Appointments**
   - Filter Query:
     ```
     Status eq 'Scheduled'
     ```
   - Top Count: `100`

3. **Apply to Each**
   - Action: **Apply to each**
   - For each appointment in results

4. **Check if Appointment Was Yesterday**
   - Action: **Condition**
   - Check if AppointmentDate < Now AND > 24 hours ago:
     ```
     @{currentItem()?['AppointmentDate']}
     less than
     @{utcNow()}
     
     AND
     
     @{currentItem()?['AppointmentDate']}
     greater than
     @{addDays(utcNow(), -1)}
     ```

5. **If Yes → Get Details and Update**
   - Get Student & Tutor
   - Update Status to "NoShow"
   - Set CancellationReason: "Auto-marked as no-show"
   - Send no-show emails

6. **Check Total No-Shows**
   - Action: **Get items** (SharePoint)
   - List: **Appointments**
   - Filter: `StudentID eq @{Student.ID} and Status eq 'NoShow'`

7. **If >= 3 No-Shows → Escalate**
   - Action: **Condition**
   - Count >= 3
   - Send escalation email to Tutor Chief

---

## Detailed Setup: Workflow 4 (Status Change)

### Step-by-Step

1. **Create Automated Flow**
   - Trigger: **When an item is modified** (SharePoint)
   - Name: "MARDET - Status Change Notification"
   - List: **Appointments**

2. **Trigger Settings**
   - In trigger settings → **Trigger Conditions**
   - Add expression to only trigger on Status changes:
     ```
     @not(equals(triggerOutputs()?['body/Status/Value'], triggerBody()?['Status/Value']))
     ```

3. **Get Student & Tutor**
   - Same as other workflows

4. **Switch on Status**
   - Action: **Switch**
   - On: `Status` (current value)
   - Case 1: `Cancelled` → Send cancellation emails
   - Case 2: `Completed` → Send session notes reminder to tutor
   - Case 3: `NoShow` → Do nothing (handled by Workflow 3)
   - Default: Do nothing

---

## Detailed Setup: Workflow 5 (Weekly Digest)

### Step-by-Step

1. **Create Scheduled Flow**
   - Name: "MARDET - Weekly Digest"
   - Repeat every: **1 Week**
   - On: **Sunday**
   - At: **18:00**

2. **Initialize Variables**
   - Action: **Initialize variable**
   - Name: `varWeekStart`
   - Type: String
   - Value: `@{addDays(utcNow(), -7)}`
   
   - Repeat for `varWeekEnd` = `@{utcNow()}`

3. **Get Week's Appointments**
   - Action: **Get items**
   - List: **Appointments**
   - Filter: 
     ```
     AppointmentDate ge '@{variables('varWeekStart')}' and 
     AppointmentDate le '@{variables('varWeekEnd')}'
     ```
   - Top Count: `500`

4. **Calculate Statistics**
   - Action: **Compose** (multiple)
   - Total: `@{length(body('Get_appointments'))}`
   - Completed: `@{length(filter(body('Get_appointments'), equals(item()?['Status'], 'Completed')))}`
   - Cancelled: Filter and count
   - NoShows: Filter and count
   - Scheduled: Filter and count

5. **Get Tutors**
   - Action: **Get items**
   - List: **Tutors**
   - Filter: `Status eq 'Active'`

6. **Build Tutor Stats**
   - Action: **Apply to each** tutor
   - For each tutor:
     - Get their appointments this week
     - Calculate hours
     - Calculate utilization rate
     - Append to HTML table variable

7. **Send Digest**
   - Action: **Send an email (V2)**
   - To: Tutor Chief distribution list
   - Subject: "Weekly Tutoring Summary - Week of [Date]"
   - Body: HTML template with all variables

---

## Email Template Customization

### Variables Available in All Templates

```
Student fields:
- @{Student.Rank}
- @{Student.FullName}
- @{Student.Email}
- @{Student.Language}
- @{Student.Class}
- @{Student.Company}

Tutor fields:
- @{Tutor.Rank}
- @{Tutor.FullName}
- @{Tutor.Email}
- @{Tutor.Languages}

Appointment fields:
- @{Appointments.AppointmentDate}
- @{Appointments.Duration}
- @{Appointments.Location}
- @{Appointments.MeetingLink}
- @{Appointments.FocusArea}
- @{Appointments.Status}
```

### Date Formatting Examples

```
Full date: @{formatDateTime(Appointments.AppointmentDate, 'dddd, MMMM dd, yyyy')}
→ "Monday, December 15, 2025"

Military time: @{formatDateTime(Appointments.AppointmentDate, 'HHmm')}
→ "1400"

Short date: @{formatDateTime(Appointments.AppointmentDate, 'MM/dd/yyyy')}
→ "12/15/2025"
```

---

## Troubleshooting

### Email Not Sending

**Check:**
1. Service account has send permissions
2. Email action uses correct account
3. Recipient email is valid
4. Flow run history shows success

**Fix:**
- Verify "Send on behalf of" permissions in Exchange
- Test with personal email first
- Check spam folder

### Trigger Not Firing

**Check:**
1. Flow is turned ON
2. Trigger conditions are correct
3. SharePoint list has activity

**Fix:**
- Manually run flow to test
- Check trigger settings
- Review run history

### Appointment Not Found

**Check:**
1. Lookup ID fields correct
2. SharePoint list permissions
3. Item actually exists

**Fix:**
- Add try-catch with error handling
- Log IDs in compose action
- Verify filter queries

### Wrong Emails Being Sent

**Check:**
1. Conditional logic
2. Dynamic content mappings
3. Email template syntax

**Fix:**
- Test with sample data
- Add debug compose actions
- Review HTML rendering

---

## Performance Tips

### Reduce API Calls

**Bad:**
```
For each appointment:
  Get Student
  Get Tutor
  Send email
```

**Good:**
```
Get all appointments (batch)
Get all students (batch)
Get all tutors (batch)
For each appointment:
  Lookup from cached data
  Send email
```

### Use Filters Wisely

**Bad:**
```
Get ALL appointments
Filter in flow
```

**Good:**
```
Get items with OData filter
Process only relevant items
```

### Limit Loops

- Use Top Count to prevent runaway loops
- Add terminate actions after X iterations
- Monitor flow runs for excessive executions

---

## Maintenance Schedule

### Daily
- Check flow run history
- Monitor error rate
- Verify email delivery

### Weekly
- Review no-show trends
- Check reminder success rate
- Verify digest generation

### Monthly
- Update email templates
- Review trigger schedules
- Optimize performance
- Archive old run history

---

## Security Considerations

### Service Account

- Never share credentials
- Rotate password quarterly
- MFA exempt (service account exception)
- Audit access logs

### Email Content

- Never include sensitive PII beyond what's necessary
- No grade details in plain text
- Use secure links to PowerApp

### Data Access

- Flows only access data user has permissions to see
- Service account has read/write on all lists
- Email recipients determined by SharePoint data

---

## Deployment Checklist

### Pre-Deployment

- [ ] All 5 workflows created
- [ ] Each workflow tested individually
- [ ] Email templates reviewed
- [ ] Dynamic content verified
- [ ] Error handling added
- [ ] Run history shows success

### Service Account Setup

- [ ] Workflows exported as solution
- [ ] Imported to service account environment
- [ ] All connections verified
- [ ] Email permissions confirmed
- [ ] Workflows turned ON

### Post-Deployment

- [ ] Monitor first 48 hours closely
- [ ] Verify confirmations sending
- [ ] Check 24hr reminders at 0800
- [ ] Confirm no-show detection at 1700
- [ ] Review first weekly digest
- [ ] Collect user feedback

---

## Support Contacts

**Technical Issues:**
- Power Automate errors: DCSIT Helpdesk
- Email delivery: Exchange admin
- SharePoint permissions: Site admin

**Workflow Logic:**
- Tutor Chief: Business process owner
- [System Developer]: Technical lead (through contract end)

---

**Workflows complete. Ready for Segment 5: PowerBI Dashboards.**
