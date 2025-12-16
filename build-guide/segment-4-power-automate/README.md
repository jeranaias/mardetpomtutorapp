# Segment 4: Power Automate Flows

Complete copy-paste guide for all automated workflows.

---

## Prerequisites

Before starting:
- [ ] SharePoint lists created (Segment 2)
- [ ] Power Automate access (included in M365)
- [ ] GitHub Personal Access Token (for Stats Sync only)

---

## Flow Overview

| # | Flow Name | Trigger | Build Time |
|---|-----------|---------|------------|
| 1 | Appointment Reminder | Scheduled (Daily 6 AM) | 10 min |
| 2 | Session Notes Nudge | When Appointment status → Completed | 8 min |
| 3 | Stats Sync to GitHub | Scheduled (Daily) or Manual | 15 min |
| 4 | Weekly Tutor Digest | Scheduled (Monday 7 AM) | 10 min |
| 5 | No-Show Alert | When Appointment status → NoShow | 8 min |

**Total build time:** ~50 minutes

---

## Flow 1: Appointment Reminder

**Purpose:** Email students and tutors about their appointments today.

### Step 1: Create Flow

1. Go to https://make.powerautomate.com
2. Click **+ Create** → **Scheduled cloud flow**
3. Name: `MARDET - Appointment Reminder`
4. Run: **Every day** at **6:00 AM**
5. Click **Create**

### Step 2: Initialize Variables

**Action: Initialize variable (Tutor Email)**
```
Name: varTutorEmail
Type: String
Value: (leave empty)
```

**Action: Initialize variable (Student Email)**
```
Name: varStudentEmail
Type: String
Value: (leave empty)
```

### Step 3: Get Today's Appointments

**Action: Get items (SharePoint)**
```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: Appointments
Filter Query: AppointmentStatus eq 'Scheduled'
```

### Step 4: Filter to Today Only

**Action: Filter array**
```
From: @{outputs('Get_items')?['body/value']}
Filter: @startsWith(item()?['AppointmentDate'], formatDateTime(utcNow(), 'yyyy-MM-dd'))
```

### Step 5: Loop Through Appointments

**Action: Apply to each**
```
Select output from previous steps: @{body('Filter_array')}
```

Inside the loop:

### Step 6: Get Tutor Details

**Action: Get item (SharePoint)**
```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: Tutors
Id: @{items('Apply_to_each')?['TutorLookupId']}
```

**Action: Set variable**
```
Name: varTutorEmail
Value: @{outputs('Get_item_-_Tutor')?['body/Email']}
```

### Step 7: Get Student Details

**Action: Get item (SharePoint)**
```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: Students
Id: @{items('Apply_to_each')?['StudentLookupId']}
```

**Action: Set variable**
```
Name: varStudentEmail
Value: @{outputs('Get_item_-_Student')?['body/Email']}
```

### Step 8: Send Email to Student

**Action: Send an email (V2) - Office 365 Outlook**
```
To: @{variables('varStudentEmail')}
Subject: Tutoring Session Today - @{formatDateTime(items('Apply_to_each')?['AppointmentDate'], 'h:mm tt')}
Body:
```

```html
<p>You have a tutoring session scheduled for today:</p>

<table style="border-collapse: collapse; margin: 20px 0;">
  <tr>
    <td style="padding: 8px; font-weight: bold;">Date:</td>
    <td style="padding: 8px;">@{formatDateTime(items('Apply_to_each')?['AppointmentDate'], 'dddd, MMMM d, yyyy')}</td>
  </tr>
  <tr>
    <td style="padding: 8px; font-weight: bold;">Time:</td>
    <td style="padding: 8px;">@{formatDateTime(items('Apply_to_each')?['AppointmentDate'], 'h:mm tt')}</td>
  </tr>
  <tr>
    <td style="padding: 8px; font-weight: bold;">Duration:</td>
    <td style="padding: 8px;">@{items('Apply_to_each')?['Duration']} minutes</td>
  </tr>
  <tr>
    <td style="padding: 8px; font-weight: bold;">Tutor:</td>
    <td style="padding: 8px;">@{outputs('Get_item_-_Tutor')?['body/FullName']}</td>
  </tr>
  <tr>
    <td style="padding: 8px; font-weight: bold;">Location:</td>
    <td style="padding: 8px;">@{items('Apply_to_each')?['Location/Value']}</td>
  </tr>
  <tr>
    <td style="padding: 8px; font-weight: bold;">Focus Area:</td>
    <td style="padding: 8px;">@{items('Apply_to_each')?['FocusArea/Value']}</td>
  </tr>
</table>

<p>If you need to cancel, please do so through the app or contact your tutor directly.</p>

<p>- MARDET Tutoring System</p>
```

### Step 9: Send Email to Tutor

**Action: Send an email (V2) - Office 365 Outlook**
```
To: @{variables('varTutorEmail')}
Subject: Tutoring Session Today with @{outputs('Get_item_-_Student')?['body/FullName']} - @{formatDateTime(items('Apply_to_each')?['AppointmentDate'], 'h:mm tt')}
Body:
```

```html
<p>You have a tutoring session scheduled for today:</p>

<table style="border-collapse: collapse; margin: 20px 0;">
  <tr>
    <td style="padding: 8px; font-weight: bold;">Date:</td>
    <td style="padding: 8px;">@{formatDateTime(items('Apply_to_each')?['AppointmentDate'], 'dddd, MMMM d, yyyy')}</td>
  </tr>
  <tr>
    <td style="padding: 8px; font-weight: bold;">Time:</td>
    <td style="padding: 8px;">@{formatDateTime(items('Apply_to_each')?['AppointmentDate'], 'h:mm tt')}</td>
  </tr>
  <tr>
    <td style="padding: 8px; font-weight: bold;">Duration:</td>
    <td style="padding: 8px;">@{items('Apply_to_each')?['Duration']} minutes</td>
  </tr>
  <tr>
    <td style="padding: 8px; font-weight: bold;">Student:</td>
    <td style="padding: 8px;">@{outputs('Get_item_-_Student')?['body/FullName']} (@{outputs('Get_item_-_Student')?['body/Rank/Value']})</td>
  </tr>
  <tr>
    <td style="padding: 8px; font-weight: bold;">Language:</td>
    <td style="padding: 8px;">@{outputs('Get_item_-_Student')?['body/Language/Value']}</td>
  </tr>
  <tr>
    <td style="padding: 8px; font-weight: bold;">Location:</td>
    <td style="padding: 8px;">@{items('Apply_to_each')?['Location/Value']}</td>
  </tr>
  <tr>
    <td style="padding: 8px; font-weight: bold;">Focus Area:</td>
    <td style="padding: 8px;">@{items('Apply_to_each')?['FocusArea/Value']}</td>
  </tr>
  <tr>
    <td style="padding: 8px; font-weight: bold;">Notes:</td>
    <td style="padding: 8px;">@{items('Apply_to_each')?['BookingNotes']}</td>
  </tr>
</table>

<p>Remember to mark attendance and add session notes after completing the session.</p>

<p>- MARDET Tutoring System</p>
```

### Step 10: Save and Test

1. Click **Save**
2. Click **Test** → **Manually** → **Test**
3. Check email inboxes for test appointments

---

## Flow 2: Session Notes Nudge

**Purpose:** Remind tutors to add session notes after completing a session.

### Step 1: Create Flow

1. **+ Create** → **Automated cloud flow**
2. Name: `MARDET - Session Notes Nudge`
3. Trigger: **When an item is created or modified (SharePoint)**
4. Click **Create**

### Step 2: Configure Trigger

```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: Appointments
```

### Step 3: Add Condition

**Action: Condition**
```
Condition: @{triggerOutputs()?['body/AppointmentStatus/Value']} is equal to Completed
```

**If yes branch:**

### Step 4: Get Tutor Details

**Action: Get item (SharePoint)**
```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: Tutors
Id: @{triggerOutputs()?['body/TutorLookupId']}
```

### Step 5: Get Student Details

**Action: Get item (SharePoint)**
```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: Students
Id: @{triggerOutputs()?['body/StudentLookupId']}
```

### Step 6: Check if Notes Already Exist

**Action: Get items (SharePoint)**
```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: SessionNotes
Filter Query: AppointmentLookupId eq @{triggerOutputs()?['body/ID']}
Top Count: 1
```

### Step 7: Condition - No Notes Yet

**Action: Condition**
```
Condition: @{length(outputs('Get_items_-_Check_Notes')?['body/value'])} is equal to 0
```

**If yes (no notes exist):**

### Step 8: Send Reminder Email

**Action: Send an email (V2)**
```
To: @{outputs('Get_item_-_Tutor')?['body/Email']}
Subject: Please Add Session Notes - @{outputs('Get_item_-_Student')?['body/FullName']}
Body:
```

```html
<p>Hi @{outputs('Get_item_-_Tutor')?['body/FullName']},</p>

<p>You recently completed a tutoring session. Please add your session notes:</p>

<table style="border-collapse: collapse; margin: 20px 0;">
  <tr>
    <td style="padding: 8px; font-weight: bold;">Student:</td>
    <td style="padding: 8px;">@{outputs('Get_item_-_Student')?['body/FullName']}</td>
  </tr>
  <tr>
    <td style="padding: 8px; font-weight: bold;">Date:</td>
    <td style="padding: 8px;">@{formatDateTime(triggerOutputs()?['body/AppointmentDate'], 'dddd, MMMM d, yyyy')}</td>
  </tr>
  <tr>
    <td style="padding: 8px; font-weight: bold;">Duration:</td>
    <td style="padding: 8px;">@{triggerOutputs()?['body/Duration']} minutes</td>
  </tr>
</table>

<p><strong>Please open the PowerApp and add your session notes.</strong></p>

<p>Session notes help track student progress and inform future tutoring sessions.</p>

<p>- MARDET Tutoring System</p>
```

### Step 9: Save and Test

1. Click **Save**
2. Test by changing an appointment status to "Completed" in SharePoint

---

## Flow 3: Stats Sync to GitHub

**Purpose:** Update the public website stats by pushing to GitHub.

### Step 1: Create GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click **Generate new token (classic)**
3. Name: `MARDET Stats Sync`
4. Expiration: 90 days (or no expiration)
5. Scopes: Check **repo** (full control)
6. Click **Generate token**
7. **COPY THE TOKEN NOW** - you won't see it again!

### Step 2: Create Flow

1. **+ Create** → **Scheduled cloud flow**
2. Name: `MARDET - Stats Sync to GitHub`
3. Run: **Every day** at **5:00 AM** (before reminder emails)
4. Click **Create**

### Step 3: Get All Counts

**Action: Get items - Tutors**
```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: Tutors
Filter Query: TutorStatus eq 'Active'
```

**Action: Get items - Students**
```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: Students
Filter Query: StudentStatus eq 'Active'
```

**Action: Get items - Appointments This Week**
```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: Appointments
Filter Query: AppointmentStatus eq 'Scheduled'
```

### Step 4: Compose Stats JSON

**Action: Compose**
```
Name: ComposeStats
Inputs:
```

```json
{
  "lastUpdated": "@{utcNow()}",
  "summary": {
    "totalStudents": @{length(outputs('Get_items_-_Students')?['body/value'])},
    "totalTutors": @{length(outputs('Get_items_-_Tutors')?['body/value'])},
    "activeAppointments": @{length(outputs('Get_items_-_Appointments')?['body/value'])},
    "languagesSupported": 9
  },
  "tutorsByLanguage": {
    "Arabic": 8,
    "Russian": 6,
    "Chinese": 7,
    "Korean": 5,
    "Farsi": 4,
    "Spanish": 3,
    "French": 3,
    "Indonesian": 2,
    "Japanese": 3
  }
}
```

Note: For accurate tutorsByLanguage counts, you'd need additional queries. The above uses placeholder values - update manually or add more Get Items actions filtered by language.

### Step 5: Get Current File SHA

**Action: HTTP**
```
Method: GET
URI: https://api.github.com/repos/jeranaias/mardetpomtutorapp/contents/public/stats.json
Headers:
  Authorization: Bearer YOUR_GITHUB_TOKEN_HERE
  Accept: application/vnd.github.v3+json
  User-Agent: PowerAutomate
```

### Step 6: Parse SHA Response

**Action: Parse JSON**
```
Content: @{outputs('HTTP_-_Get_Current_File')?['body']}
Schema:
{
  "type": "object",
  "properties": {
    "sha": { "type": "string" }
  }
}
```

### Step 7: Update File on GitHub

**Action: HTTP**
```
Method: PUT
URI: https://api.github.com/repos/jeranaias/mardetpomtutorapp/contents/public/stats.json
Headers:
  Authorization: Bearer YOUR_GITHUB_TOKEN_HERE
  Accept: application/vnd.github.v3+json
  User-Agent: PowerAutomate
  Content-Type: application/json
Body:
```

```json
{
  "message": "Update stats from Power Automate",
  "content": "@{base64(outputs('ComposeStats'))}",
  "sha": "@{body('Parse_JSON')?['sha']}"
}
```

### Step 8: Save and Test

1. Click **Save**
2. Click **Test** → **Manually**
3. Check GitHub repo - `public/stats.json` should be updated
4. Check live site stats after gh-pages rebuild (~2 min)

### Troubleshooting Stats Sync

**401 Unauthorized:** Token expired or wrong. Generate new one.

**404 Not Found:** File path wrong. Check exact path in repo.

**409 Conflict:** SHA mismatch. File was modified. Re-run flow.

**422 Unprocessable:** JSON syntax error. Check Compose step.

---

## Flow 4: Weekly Tutor Digest

**Purpose:** Send each tutor their weekly schedule every Monday.

### Step 1: Create Flow

1. **+ Create** → **Scheduled cloud flow**
2. Name: `MARDET - Weekly Tutor Digest`
3. Run: **Weekly** on **Monday** at **7:00 AM**
4. Click **Create**

### Step 2: Get All Active Tutors

**Action: Get items (SharePoint)**
```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: Tutors
Filter Query: TutorStatus eq 'Active'
```

### Step 3: Loop Through Tutors

**Action: Apply to each**
```
Select output: @{outputs('Get_items')?['body/value']}
```

Inside the loop:

### Step 4: Get This Tutor's Appointments

**Action: Get items (SharePoint)**
```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: Appointments
Filter Query: TutorLookupId eq @{items('Apply_to_each')?['ID']} and AppointmentStatus eq 'Scheduled'
Order By: AppointmentDate asc
```

### Step 5: Filter to This Week

**Action: Select**
```
From: @{outputs('Get_items_-_Tutor_Appointments')?['body/value']}
Map:
  Date: @{formatDateTime(item()?['AppointmentDate'], 'dddd, MMM d')}
  Time: @{formatDateTime(item()?['AppointmentDate'], 'h:mm tt')}
  Duration: @{item()?['Duration']} min
  StudentId: @{item()?['StudentLookupId']}
  Location: @{item()?['Location/Value']}
```

### Step 6: Create HTML Table

**Action: Create HTML table**
```
From: @{body('Select')}
Columns: Automatic
```

### Step 7: Send Digest Email

**Action: Send an email (V2)**
```
To: @{items('Apply_to_each')?['Email']}
Subject: Your Weekly Tutoring Schedule - Week of @{formatDateTime(utcNow(), 'MMM d, yyyy')}
Body:
```

```html
<p>Hi @{items('Apply_to_each')?['FullName']},</p>

<p>Here's your tutoring schedule for this week:</p>

@{body('Create_HTML_table')}

<p><strong>Total Sessions:</strong> @{length(outputs('Get_items_-_Tutor_Appointments')?['body/value'])}</p>

<p>Remember to:</p>
<ul>
  <li>Mark attendance for each session</li>
  <li>Add session notes after completing</li>
  <li>Report any no-shows promptly</li>
</ul>

<p>- MARDET Tutoring System</p>
```

### Step 8: Save

---

## Flow 5: No-Show Alert

**Purpose:** Alert chain of command when a student no-shows.

### Step 1: Create Flow

1. **+ Create** → **Automated cloud flow**
2. Name: `MARDET - No-Show Alert`
3. Trigger: **When an item is created or modified (SharePoint)**
4. Click **Create**

### Step 2: Configure Trigger

```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: Appointments
```

### Step 3: Condition - Check for No-Show

**Action: Condition**
```
@{triggerOutputs()?['body/AppointmentStatus/Value']} is equal to NoShow
```

**If yes:**

### Step 4: Get Student Details

**Action: Get item (SharePoint)**
```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: Students
Id: @{triggerOutputs()?['body/StudentLookupId']}
```

### Step 5: Get Tutor Details

**Action: Get item (SharePoint)**
```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: Tutors
Id: @{triggerOutputs()?['body/TutorLookupId']}
```

### Step 6: Send Alert to NCOIC

**Action: Send an email (V2)**
```
To: ncoic@mail.mil (replace with actual NCOIC email)
CC: (optional - add OIC or others)
Subject: [NO-SHOW] Tutoring Session - @{outputs('Get_item_-_Student')?['body/FullName']}
Body:
```

```html
<p><strong>NO-SHOW REPORT</strong></p>

<p>A student failed to attend their scheduled tutoring session:</p>

<table style="border-collapse: collapse; margin: 20px 0; border: 1px solid #ccc;">
  <tr style="background: #f5f5f5;">
    <td style="padding: 10px; font-weight: bold; border: 1px solid #ccc;">Student:</td>
    <td style="padding: 10px; border: 1px solid #ccc;">@{outputs('Get_item_-_Student')?['body/FullName']} (@{outputs('Get_item_-_Student')?['body/Rank/Value']})</td>
  </tr>
  <tr>
    <td style="padding: 10px; font-weight: bold; border: 1px solid #ccc;">Company:</td>
    <td style="padding: 10px; border: 1px solid #ccc;">@{outputs('Get_item_-_Student')?['body/Company/Value']}</td>
  </tr>
  <tr style="background: #f5f5f5;">
    <td style="padding: 10px; font-weight: bold; border: 1px solid #ccc;">Language:</td>
    <td style="padding: 10px; border: 1px solid #ccc;">@{outputs('Get_item_-_Student')?['body/Language/Value']}</td>
  </tr>
  <tr>
    <td style="padding: 10px; font-weight: bold; border: 1px solid #ccc;">Class:</td>
    <td style="padding: 10px; border: 1px solid #ccc;">@{outputs('Get_item_-_Student')?['body/Class']}</td>
  </tr>
  <tr style="background: #f5f5f5;">
    <td style="padding: 10px; font-weight: bold; border: 1px solid #ccc;">Scheduled Date:</td>
    <td style="padding: 10px; border: 1px solid #ccc;">@{formatDateTime(triggerOutputs()?['body/AppointmentDate'], 'dddd, MMMM d, yyyy')}</td>
  </tr>
  <tr>
    <td style="padding: 10px; font-weight: bold; border: 1px solid #ccc;">Scheduled Time:</td>
    <td style="padding: 10px; border: 1px solid #ccc;">@{formatDateTime(triggerOutputs()?['body/AppointmentDate'], 'h:mm tt')}</td>
  </tr>
  <tr style="background: #f5f5f5;">
    <td style="padding: 10px; font-weight: bold; border: 1px solid #ccc;">Tutor:</td>
    <td style="padding: 10px; border: 1px solid #ccc;">@{outputs('Get_item_-_Tutor')?['body/FullName']}</td>
  </tr>
  <tr>
    <td style="padding: 10px; font-weight: bold; border: 1px solid #ccc;">Reported By:</td>
    <td style="padding: 10px; border: 1px solid #ccc;">@{outputs('Get_item_-_Tutor')?['body/FullName']} (Tutor)</td>
  </tr>
</table>

<p>This has been automatically logged in the tutoring system.</p>

<p>- MARDET Tutoring System</p>
```

### Step 7: Optional - Send Notification to Student

**Action: Send an email (V2)**
```
To: @{outputs('Get_item_-_Student')?['body/Email']}
Subject: Missed Tutoring Session - @{formatDateTime(triggerOutputs()?['body/AppointmentDate'], 'MMM d, yyyy')}
Body:
```

```html
<p>@{outputs('Get_item_-_Student')?['body/FullName']},</p>

<p>You were marked as a no-show for your tutoring session:</p>

<ul>
  <li><strong>Date:</strong> @{formatDateTime(triggerOutputs()?['body/AppointmentDate'], 'dddd, MMMM d, yyyy')}</li>
  <li><strong>Time:</strong> @{formatDateTime(triggerOutputs()?['body/AppointmentDate'], 'h:mm tt')}</li>
  <li><strong>Tutor:</strong> @{outputs('Get_item_-_Tutor')?['body/FullName']}</li>
</ul>

<p>Your chain of command has been notified. If this was in error, please contact your tutor or the tutoring office immediately.</p>

<p>- MARDET Tutoring System</p>
```

### Step 8: Save

---

## Flow Summary

After building all flows, you should have:

| Flow | Trigger | Status |
|------|---------|--------|
| Appointment Reminder | Daily 6 AM | ☐ Built |
| Session Notes Nudge | On status change | ☐ Built |
| Stats Sync to GitHub | Daily 5 AM | ☐ Built |
| Weekly Tutor Digest | Monday 7 AM | ☐ Built |
| No-Show Alert | On status change | ☐ Built |

---

## Testing Checklist

- [ ] Create test appointment for today, verify reminder emails sent
- [ ] Mark appointment as Completed, verify notes nudge sent
- [ ] Run Stats Sync manually, verify GitHub file updated
- [ ] Run Weekly Digest manually, verify tutor receives schedule
- [ ] Mark appointment as NoShow, verify NCOIC receives alert

---

## Troubleshooting

### "The workflow has been suspended"
- Usually a connection issue. Open flow and re-authenticate SharePoint/Outlook connections.

### Emails not sending
- Check spam/junk folders
- Verify email addresses in SharePoint lists are correct
- Check "Send an email" action for errors

### Filter queries not working
- SharePoint filter syntax is OData. Use `eq` not `=`
- Text values need quotes: `Status eq 'Active'`
- No quotes for numbers: `ID eq 5`

### Date filtering issues
- SharePoint stores dates in UTC
- Use `formatDateTime()` to convert
- Filter on date part only: `startswith(DateColumn, '2025-01-15')`

### Loop running too many times
- Add Top Count to Get Items actions
- Add conditions to skip irrelevant items

---

## Optional Enhancements

### 1. Add Teams Notifications
Replace or supplement emails with Teams messages using "Post message in a chat or channel" action.

### 2. Add 1-Hour Reminder
Duplicate Flow 1, change schedule to run hourly, filter to appointments in next hour.

### 3. Add Cancellation Notification
Create new flow triggered on status change to "Cancelled", notify the other party.

### 4. Add Progress Report
Monthly flow that sends tutors a summary of their students' progress trends.

---

## Connection References

When you first add actions, Power Automate will ask you to sign in to:

- **SharePoint** - Use your @dliflc01.sharepoint.com account
- **Office 365 Outlook** - Same account
- **HTTP** - No sign-in needed (for GitHub API)

These connections are saved and reused across flows.
