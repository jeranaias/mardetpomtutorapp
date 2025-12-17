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
| 1 | Appointment Reminder | Daily 6 AM | 10 min |
| 2 | Session Notes Nudge | On status → Completed | 8 min |
| 3 | Stats Sync to GitHub | Daily 5 AM | 15 min |
| 4 | Weekly Tutor Digest | Monday 7 AM | 10 min |
| 5 | No-Show Alert | On status → NoShow | 8 min |
| 6 | 1-Hour Reminder | Hourly | 8 min |
| 7 | Cancellation Notification | On status → Cancelled | 8 min |
| 8 | Teams Daily Summary | Daily 7 AM | 8 min |
| 9 | Monthly Progress Report | 1st of month 8 AM | 12 min |
| 10 | Student Registration | Form submission | 10 min |
| 11 | Tutor Registration | Form submission | 10 min |
| 12 | Auto-Deactivation | Daily 1 AM | 12 min |
| 13 | Inactivity Warning | Daily 2 AM | 8 min |

**Total build time:** ~120 minutes

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
To: ncoic@dliflc.edu (replace with actual NCOIC email)
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

## Flow 6: 1-Hour Reminder

**Purpose:** Send a reminder 1 hour before each appointment.

### Step 1: Create Flow

1. **+ Create** → **Scheduled cloud flow**
2. Name: `MARDET - 1 Hour Reminder`
3. Run: **Every hour**
4. Click **Create**

### Step 2: Calculate Time Window

**Action: Compose - Start Time**
```
Name: ComposeStartTime
Inputs: @{addMinutes(utcNow(), 55)}
```

**Action: Compose - End Time**
```
Name: ComposeEndTime
Inputs: @{addMinutes(utcNow(), 65)}
```

### Step 3: Get Appointments in Next Hour

**Action: Get items (SharePoint)**
```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: Appointments
Filter Query: AppointmentStatus eq 'Scheduled'
```

### Step 4: Filter to Next Hour Window

**Action: Filter array**
```
From: @{outputs('Get_items')?['body/value']}
Filter:
  @and(
    greaterOrEquals(item()?['AppointmentDate'], outputs('ComposeStartTime')),
    lessOrEquals(item()?['AppointmentDate'], outputs('ComposeEndTime'))
  )
```

### Step 5: Loop Through Appointments

**Action: Apply to each**
```
Select output: @{body('Filter_array')}
```

Inside loop:

### Step 6: Get Tutor and Student

**Action: Get item - Tutor**
```
List: Tutors
Id: @{items('Apply_to_each')?['TutorLookupId']}
```

**Action: Get item - Student**
```
List: Students
Id: @{items('Apply_to_each')?['StudentLookupId']}
```

### Step 7: Send Reminder to Student

**Action: Send an email (V2)**
```
To: @{outputs('Get_item_-_Student')?['body/Email']}
Subject: ⏰ Tutoring Session in 1 Hour!
Body:
```

```html
<p>Reminder: Your tutoring session starts in about 1 hour!</p>

<table style="border-collapse: collapse; margin: 20px 0;">
  <tr>
    <td style="padding: 8px; font-weight: bold;">Time:</td>
    <td style="padding: 8px;">@{formatDateTime(items('Apply_to_each')?['AppointmentDate'], 'h:mm tt')}</td>
  </tr>
  <tr>
    <td style="padding: 8px; font-weight: bold;">Tutor:</td>
    <td style="padding: 8px;">@{outputs('Get_item_-_Tutor')?['body/FullName']}</td>
  </tr>
  <tr>
    <td style="padding: 8px; font-weight: bold;">Location:</td>
    <td style="padding: 8px;">@{items('Apply_to_each')?['Location/Value']}</td>
  </tr>
</table>

<p>Please arrive on time. If you cannot attend, notify your tutor immediately.</p>

<p>- MARDET Tutoring System</p>
```

### Step 8: Send Reminder to Tutor

**Action: Send an email (V2)**
```
To: @{outputs('Get_item_-_Tutor')?['body/Email']}
Subject: ⏰ Session with @{outputs('Get_item_-_Student')?['body/FullName']} in 1 Hour
Body:
```

```html
<p>Reminder: Your tutoring session starts in about 1 hour!</p>

<table style="border-collapse: collapse; margin: 20px 0;">
  <tr>
    <td style="padding: 8px; font-weight: bold;">Time:</td>
    <td style="padding: 8px;">@{formatDateTime(items('Apply_to_each')?['AppointmentDate'], 'h:mm tt')}</td>
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
    <td style="padding: 8px; font-weight: bold;">Focus:</td>
    <td style="padding: 8px;">@{items('Apply_to_each')?['FocusArea/Value']}</td>
  </tr>
</table>

<p>- MARDET Tutoring System</p>
```

### Step 9: Save

---

## Flow 7: Cancellation Notification

**Purpose:** Notify the other party when an appointment is cancelled.

### Step 1: Create Flow

1. **+ Create** → **Automated cloud flow**
2. Name: `MARDET - Cancellation Notification`
3. Trigger: **When an item is created or modified (SharePoint)**
4. Click **Create**

### Step 2: Configure Trigger

```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: Appointments
```

### Step 3: Condition - Check for Cancellation

**Action: Condition**
```
@{triggerOutputs()?['body/AppointmentStatus/Value']} is equal to Cancelled
```

**If yes:**

### Step 4: Get Tutor and Student

**Action: Get item - Tutor**
```
List: Tutors
Id: @{triggerOutputs()?['body/TutorLookupId']}
```

**Action: Get item - Student**
```
List: Students
Id: @{triggerOutputs()?['body/StudentLookupId']}
```

### Step 5: Check Who Cancelled

**Action: Condition**
```
@{triggerOutputs()?['body/CreatedByStudent']} is equal to true
```

### Step 6A: If Student Cancelled - Notify Tutor

**Action: Send an email (V2)**
```
To: @{outputs('Get_item_-_Tutor')?['body/Email']}
Subject: Appointment Cancelled - @{outputs('Get_item_-_Student')?['body/FullName']}
Body:
```

```html
<p>A tutoring session has been cancelled:</p>

<table style="border-collapse: collapse; margin: 20px 0;">
  <tr>
    <td style="padding: 8px; font-weight: bold;">Student:</td>
    <td style="padding: 8px;">@{outputs('Get_item_-_Student')?['body/FullName']}</td>
  </tr>
  <tr>
    <td style="padding: 8px; font-weight: bold;">Original Date:</td>
    <td style="padding: 8px;">@{formatDateTime(triggerOutputs()?['body/AppointmentDate'], 'dddd, MMMM d, yyyy')}</td>
  </tr>
  <tr>
    <td style="padding: 8px; font-weight: bold;">Original Time:</td>
    <td style="padding: 8px;">@{formatDateTime(triggerOutputs()?['body/AppointmentDate'], 'h:mm tt')}</td>
  </tr>
  <tr>
    <td style="padding: 8px; font-weight: bold;">Reason:</td>
    <td style="padding: 8px;">@{triggerOutputs()?['body/CancellationReason']}</td>
  </tr>
</table>

<p>This time slot is now available for other students.</p>

<p>- MARDET Tutoring System</p>
```

### Step 6B: If Tutor Cancelled - Notify Student

**Action: Send an email (V2)**
```
To: @{outputs('Get_item_-_Student')?['body/Email']}
Subject: Your Tutoring Session Has Been Cancelled
Body:
```

```html
<p>Your tutoring session has been cancelled:</p>

<table style="border-collapse: collapse; margin: 20px 0;">
  <tr>
    <td style="padding: 8px; font-weight: bold;">Tutor:</td>
    <td style="padding: 8px;">@{outputs('Get_item_-_Tutor')?['body/FullName']}</td>
  </tr>
  <tr>
    <td style="padding: 8px; font-weight: bold;">Original Date:</td>
    <td style="padding: 8px;">@{formatDateTime(triggerOutputs()?['body/AppointmentDate'], 'dddd, MMMM d, yyyy')}</td>
  </tr>
  <tr>
    <td style="padding: 8px; font-weight: bold;">Original Time:</td>
    <td style="padding: 8px;">@{formatDateTime(triggerOutputs()?['body/AppointmentDate'], 'h:mm tt')}</td>
  </tr>
  <tr>
    <td style="padding: 8px; font-weight: bold;">Reason:</td>
    <td style="padding: 8px;">@{triggerOutputs()?['body/CancellationReason']}</td>
  </tr>
</table>

<p>Please book a new session through the app.</p>

<p>- MARDET Tutoring System</p>
```

### Step 7: Save

---

## Flow 8: Teams Notifications

**Purpose:** Post appointment notifications to a Teams channel for visibility.

### Step 1: Create Flow

1. **+ Create** → **Automated cloud flow**
2. Name: `MARDET - Teams Daily Summary`
3. Trigger: **Recurrence** - Daily at 7:00 AM
4. Click **Create**

### Step 2: Get Today's Appointments

**Action: Get items (SharePoint)**
```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: Appointments
Filter Query: AppointmentStatus eq 'Scheduled'
```

### Step 3: Filter to Today

**Action: Filter array**
```
From: @{outputs('Get_items')?['body/value']}
Filter: @startsWith(item()?['AppointmentDate'], formatDateTime(utcNow(), 'yyyy-MM-dd'))
```

### Step 4: Create Summary Table

**Action: Select**
```
From: @{body('Filter_array')}
Map:
  Time: @{formatDateTime(item()?['AppointmentDate'], 'h:mm tt')}
  Duration: @{item()?['Duration']}min
  Location: @{item()?['Location/Value']}
```

**Action: Create HTML table**
```
From: @{body('Select')}
Columns: Automatic
```

### Step 5: Post to Teams

**Action: Post message in a chat or channel**
```
Post as: Flow bot
Post in: Channel
Team: MARDET Tutoring (select your team)
Channel: General (or create a "Daily Schedule" channel)
Message:
```

```
📅 **Today's Tutoring Schedule** - @{formatDateTime(utcNow(), 'dddd, MMMM d')}

**Total Sessions:** @{length(body('Filter_array'))}

@{body('Create_HTML_table')}

_Posted automatically by MARDET Tutoring System_
```

### Step 6: Save

---

## Flow 9: Monthly Progress Report

**Purpose:** Send tutors a monthly summary of their students' progress.

### Step 1: Create Flow

1. **+ Create** → **Scheduled cloud flow**
2. Name: `MARDET - Monthly Progress Report`
3. Run: **Monthly** on **1st** at **8:00 AM**
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

Inside loop:

### Step 4: Get Tutor's Completed Sessions Last Month

**Action: Get items - Sessions**
```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: Appointments
Filter Query: TutorLookupId eq @{items('Apply_to_each')?['ID']} and AppointmentStatus eq 'Completed'
```

**Action: Filter array - Last Month Only**
```
From: @{outputs('Get_items_-_Sessions')?['body/value']}
Filter: @greaterOrEquals(item()?['AppointmentDate'], addMonths(startOfMonth(utcNow()), -1))
```

### Step 5: Get Unique Students

**Action: Select - Extract Student IDs**
```
From: @{body('Filter_array_-_Last_Month_Only')}
Map: @{item()?['StudentLookupId']}
```

**Action: Compose - Unique Students**
```
@{union(body('Select_-_Extract_Student_IDs'), body('Select_-_Extract_Student_IDs'))}
```

### Step 6: Calculate Stats

**Action: Compose - Total Hours**
```
@{div(sum(body('Filter_array_-_Last_Month_Only'), 'Duration'), 60)}
```

**Action: Compose - Session Count**
```
@{length(body('Filter_array_-_Last_Month_Only'))}
```

### Step 7: Get Session Notes for These Sessions

**Action: Get items - Notes**
```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: SessionNotes
Filter Query: (filter by date range similar to above)
```

### Step 8: Build Performance Summary

**Action: Compose - Performance Breakdown**
```
{
  "excellent": @{length(filter(body('Get_items_-_Notes')?['body/value'], item()?['StudentPerformance/Value'], 'Excellent'))},
  "good": @{length(filter(body('Get_items_-_Notes')?['body/value'], item()?['StudentPerformance/Value'], 'Good'))},
  "satisfactory": @{length(filter(body('Get_items_-_Notes')?['body/value'], item()?['StudentPerformance/Value'], 'Satisfactory'))},
  "needsImprovement": @{length(filter(body('Get_items_-_Notes')?['body/value'], item()?['StudentPerformance/Value'], 'Needs Improvement'))}
}
```

### Step 9: Send Monthly Report

**Action: Send an email (V2)**
```
To: @{items('Apply_to_each')?['Email']}
Subject: Monthly Tutoring Report - @{formatDateTime(addMonths(utcNow(), -1), 'MMMM yyyy')}
Body:
```

```html
<p>Hi @{items('Apply_to_each')?['FullName']},</p>

<p>Here's your tutoring summary for <strong>@{formatDateTime(addMonths(utcNow(), -1), 'MMMM yyyy')}</strong>:</p>

<h3>📊 Your Stats</h3>
<table style="border-collapse: collapse; margin: 20px 0; border: 1px solid #ddd;">
  <tr style="background: #f5f5f5;">
    <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Total Sessions</td>
    <td style="padding: 12px; border: 1px solid #ddd; font-size: 24px; font-weight: bold;">@{outputs('Compose_-_Session_Count')}</td>
  </tr>
  <tr>
    <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Total Hours</td>
    <td style="padding: 12px; border: 1px solid #ddd; font-size: 24px; font-weight: bold;">@{outputs('Compose_-_Total_Hours')}</td>
  </tr>
  <tr style="background: #f5f5f5;">
    <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Unique Students</td>
    <td style="padding: 12px; border: 1px solid #ddd; font-size: 24px; font-weight: bold;">@{length(outputs('Compose_-_Unique_Students'))}</td>
  </tr>
</table>

<h3>📈 Student Performance</h3>
<table style="border-collapse: collapse; margin: 20px 0; border: 1px solid #ddd;">
  <tr style="background: #d4edda;">
    <td style="padding: 10px; border: 1px solid #ddd;">Excellent</td>
    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">@{json(outputs('Compose_-_Performance_Breakdown'))['excellent']}</td>
  </tr>
  <tr style="background: #cce5ff;">
    <td style="padding: 10px; border: 1px solid #ddd;">Good</td>
    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">@{json(outputs('Compose_-_Performance_Breakdown'))['good']}</td>
  </tr>
  <tr style="background: #fff3cd;">
    <td style="padding: 10px; border: 1px solid #ddd;">Satisfactory</td>
    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">@{json(outputs('Compose_-_Performance_Breakdown'))['satisfactory']}</td>
  </tr>
  <tr style="background: #f8d7da;">
    <td style="padding: 10px; border: 1px solid #ddd;">Needs Improvement</td>
    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">@{json(outputs('Compose_-_Performance_Breakdown'))['needsImprovement']}</td>
  </tr>
</table>

<p>Thank you for your dedication to our Marines' language development!</p>

<p>- MARDET Tutoring System</p>
```

### Step 10: Save

---

## Flow 10: Student Registration

**Purpose:** Allow students to self-register via Microsoft Forms with NCOIC approval.

### Prerequisites: Create Microsoft Form

1. Go to https://forms.office.com
2. **+ New Form**
3. Name: `MARDET Tutoring - Student Registration`
4. Add fields:

| Field | Type | Required |
|-------|------|----------|
| First Name | Text | Yes |
| Last Name | Text | Yes |
| Email | Text | Yes |
| Phone | Text | Yes |
| Unit | Text | Yes |
| Language | Choice (Arabic, Chinese-Mandarin, Korean, Russian, Spanish, Japanese, French, Farsi, Indonesian) | Yes |
| Current Proficiency Level | Choice (0, 0+, 1, 1+, 2, 2+, 3) | Yes |
| Expected Graduation Date | Date | Yes |
| Reason for Tutoring | Long Text | No |

5. Click **Share** → Copy the form link for students

### Step 1: Create Flow

1. **+ Create** → **Automated cloud flow**
2. Name: `MARDET - Student Registration`
3. Trigger: **When a new response is submitted (Microsoft Forms)**
4. Click **Create**

### Step 2: Configure Trigger

```
Form Id: (select your Student Registration form)
```

### Step 3: Get Response Details

**Action: Get response details (Microsoft Forms)**
```
Form Id: (same form)
Response Id: @{triggerOutputs()?['body/resourceData/responseId']}
```

### Step 4: Start Approval

**Action: Start and wait for an approval**
```
Approval type: Approve/Reject - First to respond
Title: New Student Registration - @{outputs('Get_response_details')?['body/First_Name']} @{outputs('Get_response_details')?['body/Last_Name']}
Assigned to: ncoic@dliflc.edu (replace with actual NCOIC email)
Details:
```

```html
<h3>New Student Registration Request</h3>

<table style="border-collapse: collapse; margin: 20px 0;">
  <tr>
    <td style="padding: 8px; font-weight: bold;">Name:</td>
    <td style="padding: 8px;">@{outputs('Get_response_details')?['body/First_Name']} @{outputs('Get_response_details')?['body/Last_Name']}</td>
  </tr>
  <tr>
    <td style="padding: 8px; font-weight: bold;">Email:</td>
    <td style="padding: 8px;">@{outputs('Get_response_details')?['body/Email']}</td>
  </tr>
  <tr>
    <td style="padding: 8px; font-weight: bold;">Unit:</td>
    <td style="padding: 8px;">@{outputs('Get_response_details')?['body/Unit']}</td>
  </tr>
  <tr>
    <td style="padding: 8px; font-weight: bold;">Language:</td>
    <td style="padding: 8px;">@{outputs('Get_response_details')?['body/Language']}</td>
  </tr>
  <tr>
    <td style="padding: 8px; font-weight: bold;">Proficiency:</td>
    <td style="padding: 8px;">@{outputs('Get_response_details')?['body/Current_Proficiency_Level']}</td>
  </tr>
  <tr>
    <td style="padding: 8px; font-weight: bold;">Graduation:</td>
    <td style="padding: 8px;">@{outputs('Get_response_details')?['body/Expected_Graduation_Date']}</td>
  </tr>
  <tr>
    <td style="padding: 8px; font-weight: bold;">Reason:</td>
    <td style="padding: 8px;">@{outputs('Get_response_details')?['body/Reason_for_Tutoring']}</td>
  </tr>
</table>

<p>Approve to add this student to the tutoring system.</p>
```

### Step 5: Condition - Check Response

**Action: Condition**
```
@{outputs('Start_and_wait_for_an_approval')?['body/outcome']} is equal to Approve
```

### Step 6A: If Approved - Create Student Record

**Action: Create item (SharePoint)**
```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: Students
Title: @{outputs('Get_response_details')?['body/First_Name']} @{outputs('Get_response_details')?['body/Last_Name']}
FirstName: @{outputs('Get_response_details')?['body/First_Name']}
LastName: @{outputs('Get_response_details')?['body/Last_Name']}
Email: @{outputs('Get_response_details')?['body/Email']}
Phone: @{outputs('Get_response_details')?['body/Phone']}
Unit: @{outputs('Get_response_details')?['body/Unit']}
Language: @{outputs('Get_response_details')?['body/Language']}
ProficiencyLevel: @{outputs('Get_response_details')?['body/Current_Proficiency_Level']}
EnrollmentDate: @{utcNow()}
GraduationDate: @{outputs('Get_response_details')?['body/Expected_Graduation_Date']}
Status: Active
```

**Action: Send an email (V2) - Welcome Email**
```
To: @{outputs('Get_response_details')?['body/Email']}
Subject: Welcome to MARDET Tutoring!
Body:
```

```html
<p>Welcome to the MARDET Language Tutoring Program!</p>

<p>Your registration has been approved. You can now:</p>
<ul>
  <li>Book tutoring sessions through the PowerApp</li>
  <li>Access language learning resources</li>
  <li>Track your progress</li>
</ul>

<p><strong>Getting Started:</strong></p>
<ol>
  <li>Go to the SharePoint site</li>
  <li>Open the MARDET Tutoring App</li>
  <li>Log in with your @dliflc.edu credentials</li>
  <li>Book your first session!</li>
</ol>

<p>Questions? Contact your tutoring coordinator.</p>

<p>- MARDET Tutoring System</p>
```

### Step 6B: If Rejected - Notify Applicant

**Action: Send an email (V2)**
```
To: @{outputs('Get_response_details')?['body/Email']}
Subject: MARDET Tutoring Registration Status
Body:
```

```html
<p>Thank you for your interest in the MARDET Tutoring Program.</p>

<p>Unfortunately, your registration was not approved at this time.</p>

<p><strong>Comments:</strong> @{first(outputs('Start_and_wait_for_an_approval')?['body/responses'])?['comments']}</p>

<p>If you have questions, please contact your chain of command.</p>

<p>- MARDET Tutoring System</p>
```

### Step 7: Save

---

## Flow 11: Tutor Registration

**Purpose:** Allow tutors to self-register via Microsoft Forms with NCOIC approval.

### Prerequisites: Create Microsoft Form

1. Go to https://forms.office.com
2. **+ New Form**
3. Name: `MARDET Tutoring - Tutor Registration`
4. Add fields:

| Field | Type | Required |
|-------|------|----------|
| First Name | Text | Yes |
| Last Name | Text | Yes |
| Rank | Choice (Cpl, Sgt, SSgt, GySgt, MSgt, 1stSgt, MGySgt, Civilian) | Yes |
| Email | Text | Yes |
| Phone | Text | Yes |
| Language(s) | Choice (multi-select: Arabic, Chinese-Mandarin, Korean, Russian, Spanish, Japanese, French, Farsi, Indonesian) | Yes |
| Max Hours Per Week | Number | Yes |
| General Availability | Long Text | Yes |

5. Click **Share** → Copy the form link for potential tutors

### Step 1: Create Flow

1. **+ Create** → **Automated cloud flow**
2. Name: `MARDET - Tutor Registration`
3. Trigger: **When a new response is submitted (Microsoft Forms)**
4. Click **Create**

### Step 2: Configure Trigger

```
Form Id: (select your Tutor Registration form)
```

### Step 3: Get Response Details

**Action: Get response details (Microsoft Forms)**
```
Form Id: (same form)
Response Id: @{triggerOutputs()?['body/resourceData/responseId']}
```

### Step 4: Start Approval

**Action: Start and wait for an approval**
```
Approval type: Approve/Reject - First to respond
Title: New Tutor Registration - @{outputs('Get_response_details')?['body/Rank']} @{outputs('Get_response_details')?['body/Last_Name']}
Assigned to: ncoic@dliflc.edu (replace with actual NCOIC email)
Details:
```

```html
<h3>New Tutor Registration Request</h3>

<table style="border-collapse: collapse; margin: 20px 0;">
  <tr>
    <td style="padding: 8px; font-weight: bold;">Name:</td>
    <td style="padding: 8px;">@{outputs('Get_response_details')?['body/Rank']} @{outputs('Get_response_details')?['body/First_Name']} @{outputs('Get_response_details')?['body/Last_Name']}</td>
  </tr>
  <tr>
    <td style="padding: 8px; font-weight: bold;">Email:</td>
    <td style="padding: 8px;">@{outputs('Get_response_details')?['body/Email']}</td>
  </tr>
  <tr>
    <td style="padding: 8px; font-weight: bold;">Language(s):</td>
    <td style="padding: 8px;">@{outputs('Get_response_details')?['body/Language(s)']}</td>
  </tr>
  <tr>
    <td style="padding: 8px; font-weight: bold;">Max Hours/Week:</td>
    <td style="padding: 8px;">@{outputs('Get_response_details')?['body/Max_Hours_Per_Week']}</td>
  </tr>
  <tr>
    <td style="padding: 8px; font-weight: bold;">Availability:</td>
    <td style="padding: 8px;">@{outputs('Get_response_details')?['body/General_Availability']}</td>
  </tr>
</table>

<p>Approve to add this tutor to the system.</p>
```

### Step 5: Condition - Check Response

**Action: Condition**
```
@{outputs('Start_and_wait_for_an_approval')?['body/outcome']} is equal to Approve
```

### Step 6A: If Approved - Create Tutor Record

**Action: Create item (SharePoint)**
```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: Tutors
Title: @{outputs('Get_response_details')?['body/First_Name']} @{outputs('Get_response_details')?['body/Last_Name']}
FirstName: @{outputs('Get_response_details')?['body/First_Name']}
LastName: @{outputs('Get_response_details')?['body/Last_Name']}
Rank: @{outputs('Get_response_details')?['body/Rank']}
Email: @{outputs('Get_response_details')?['body/Email']}
Phone: @{outputs('Get_response_details')?['body/Phone']}
Language: @{outputs('Get_response_details')?['body/Language(s)']}
MaxHoursPerWeek: @{outputs('Get_response_details')?['body/Max_Hours_Per_Week']}
Availability: @{outputs('Get_response_details')?['body/General_Availability']}
Status: Active
```

**Action: Send an email (V2) - Welcome Email**
```
To: @{outputs('Get_response_details')?['body/Email']}
Subject: Welcome to MARDET Tutoring - Tutor Access Granted
Body:
```

```html
<p>Welcome to the MARDET Language Tutoring Program as a tutor!</p>

<p>Your registration has been approved. You can now:</p>
<ul>
  <li>Receive and confirm tutoring appointments</li>
  <li>Add session notes for students</li>
  <li>Access tutoring resources</li>
</ul>

<p><strong>Getting Started:</strong></p>
<ol>
  <li>Go to the SharePoint site</li>
  <li>Open the MARDET Tutoring App</li>
  <li>Log in with your @dliflc.edu credentials</li>
  <li>Update your availability settings</li>
</ol>

<p>Questions? Contact your tutoring coordinator.</p>

<p>- MARDET Tutoring System</p>
```

### Step 6B: If Rejected - Notify Applicant

**Action: Send an email (V2)**
```
To: @{outputs('Get_response_details')?['body/Email']}
Subject: MARDET Tutoring Registration Status
Body:
```

```html
<p>Thank you for your interest in becoming a tutor.</p>

<p>Unfortunately, your registration was not approved at this time.</p>

<p><strong>Comments:</strong> @{first(outputs('Start_and_wait_for_an_approval')?['body/responses'])?['comments']}</p>

<p>If you have questions, please contact your chain of command.</p>

<p>- MARDET Tutoring System</p>
```

### Step 7: Save

---

## Flow 12: Auto-Deactivation

**Purpose:** Automatically deactivate students past graduation or users inactive for 30+ days.

### Step 1: Create Flow

1. **+ Create** → **Scheduled cloud flow**
2. Name: `MARDET - Auto Deactivation`
3. Run: **Every day** at **1:00 AM**
4. Click **Create**

### Step 2: Deactivate Graduated Students

**Action: Get items (SharePoint)**
```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: Students
Filter Query: Status eq 'Active'
```

**Action: Filter array - Past Graduation**
```
From: @{outputs('Get_items_-_Active_Students')?['body/value']}
Filter: @less(item()?['GraduationDate'], utcNow())
```

**Action: Apply to each - Deactivate Graduated**
```
Select output: @{body('Filter_array_-_Past_Graduation')}
```

Inside loop:

**Action: Update item**
```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: Students
Id: @{items('Apply_to_each_-_Deactivate_Graduated')?['ID']}
Status: Inactive
```

**Action: Send an email (V2)**
```
To: @{items('Apply_to_each_-_Deactivate_Graduated')?['Email']}
Subject: MARDET Tutoring Account Deactivated - Graduation
Body:
```

```html
<p>Your MARDET Tutoring account has been deactivated as your graduation date has passed.</p>

<p>Thank you for using the tutoring program. Best of luck in your future assignments!</p>

<p>If this was in error, please contact the tutoring office.</p>

<p>- MARDET Tutoring System</p>
```

### Step 3: Find Inactive Users (No Activity 30+ Days)

**Action: Get items - All Appointments**
```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: Appointments
```

**Action: Compose - 30 Days Ago**
```
@{addDays(utcNow(), -30)}
```

**Action: Get items - Active Students**
```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: Students
Filter Query: Status eq 'Active'
```

**Action: Apply to each - Check Student Activity**
```
Select output: @{outputs('Get_items_-_Active_Students')?['body/value']}
```

Inside loop:

**Action: Filter array - Student's Recent Appointments**
```
From: @{outputs('Get_items_-_All_Appointments')?['body/value']}
Filter: @and(
  equals(item()?['StudentLookupId'], items('Apply_to_each_-_Check_Student_Activity')?['ID']),
  greaterOrEquals(item()?['AppointmentDate'], outputs('Compose_-_30_Days_Ago'))
)
```

**Action: Condition - No Recent Activity**
```
@{length(body('Filter_array_-_Student''s_Recent_Appointments'))} is equal to 0
```

**If yes (no appointments in 30 days):**

**Action: Update item**
```
List: Students
Id: @{items('Apply_to_each_-_Check_Student_Activity')?['ID']}
Status: Inactive
```

**Action: Send an email (V2)**
```
To: @{items('Apply_to_each_-_Check_Student_Activity')?['Email']}
Subject: MARDET Tutoring Account Deactivated - Inactivity
Body:
```

```html
<p>Your MARDET Tutoring account has been deactivated due to 30 days of inactivity.</p>

<p>If you still need tutoring services, you can re-register through the tutoring registration form.</p>

<p>- MARDET Tutoring System</p>
```

### Step 4: Repeat for Tutors (Optional)

Duplicate the inactive user check logic for the Tutors list if you want to auto-deactivate inactive tutors as well.

### Step 5: Save

---

## Flow 13: Inactivity Warning

**Purpose:** Warn users at 21 days of inactivity before auto-deactivation at 30 days.

### Step 1: Create Flow

1. **+ Create** → **Scheduled cloud flow**
2. Name: `MARDET - Inactivity Warning`
3. Run: **Every day** at **2:00 AM**
4. Click **Create**

### Step 2: Calculate Date Range

**Action: Compose - 21 Days Ago**
```
@{addDays(utcNow(), -21)}
```

**Action: Compose - 22 Days Ago**
```
@{addDays(utcNow(), -22)}
```

### Step 3: Get Active Students

**Action: Get items (SharePoint)**
```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: Students
Filter Query: Status eq 'Active'
```

### Step 4: Get All Recent Appointments

**Action: Get items - Appointments**
```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: Appointments
```

### Step 5: Loop Through Students

**Action: Apply to each**
```
Select output: @{outputs('Get_items_-_Active_Students')?['body/value']}
```

Inside loop:

**Action: Filter array - Student's Last 21 Days**
```
From: @{outputs('Get_items_-_Appointments')?['body/value']}
Filter: @and(
  equals(item()?['StudentLookupId'], items('Apply_to_each')?['ID']),
  greaterOrEquals(item()?['AppointmentDate'], outputs('Compose_-_21_Days_Ago'))
)
```

**Action: Condition - No Activity in 21 Days**
```
@{length(body('Filter_array_-_Student''s_Last_21_Days'))} is equal to 0
```

**If yes:**

**Action: Filter array - Activity 22 Days Ago**
(This prevents sending the warning every day - only send once when they hit 21 days)
```
From: @{outputs('Get_items_-_Appointments')?['body/value']}
Filter: @and(
  equals(item()?['StudentLookupId'], items('Apply_to_each')?['ID']),
  greaterOrEquals(item()?['AppointmentDate'], outputs('Compose_-_22_Days_Ago')),
  less(item()?['AppointmentDate'], outputs('Compose_-_21_Days_Ago'))
)
```

**Action: Condition - Had Activity 22 Days Ago**
```
@{length(body('Filter_array_-_Activity_22_Days_Ago'))} is greater than 0
```

**If yes (just hit 21 day mark):**

**Action: Send an email (V2)**
```
To: @{items('Apply_to_each')?['Email']}
Subject: Action Required: Your MARDET Tutoring Account
Body:
```

```html
<p>Your MARDET Tutoring account has been inactive for 21 days.</p>

<p><strong>Important:</strong> If you don't book a tutoring session within the next 9 days, your account will be automatically deactivated.</p>

<p>To keep your account active:</p>
<ol>
  <li>Log into the MARDET Tutoring App</li>
  <li>Book a tutoring session</li>
</ol>

<p>If you no longer need tutoring services, no action is needed and your account will be deactivated automatically.</p>

<p>Questions? Contact your tutoring coordinator.</p>

<p>- MARDET Tutoring System</p>
```

### Step 6: Save

---

## Microsoft Forms Links

After creating the registration forms, share these links with students and tutors:

| Form | Purpose | Share With |
|------|---------|------------|
| Student Registration | New students self-register | All Marines in language training |
| Tutor Registration | New tutors volunteer | Qualified personnel |

**Tip:** Add these form links to your SharePoint site homepage and/or Teams channel for easy access.

---

## Flow Summary

After building all flows, you should have:

| # | Flow | Trigger | Status |
|---|------|---------|--------|
| 1 | Appointment Reminder | Daily 6 AM | ☐ Built |
| 2 | Session Notes Nudge | On status → Completed | ☐ Built |
| 3 | Stats Sync to GitHub | Daily 5 AM | ☐ Built |
| 4 | Weekly Tutor Digest | Monday 7 AM | ☐ Built |
| 5 | No-Show Alert | On status → NoShow | ☐ Built |
| 6 | 1-Hour Reminder | Hourly | ☐ Built |
| 7 | Cancellation Notification | On status → Cancelled | ☐ Built |
| 8 | Teams Daily Summary | Daily 7 AM | ☐ Built |
| 9 | Monthly Progress Report | 1st of month 8 AM | ☐ Built |
| 10 | Student Registration | Form submission | ☐ Built |
| 11 | Tutor Registration | Form submission | ☐ Built |
| 12 | Auto-Deactivation | Daily 1 AM | ☐ Built |
| 13 | Inactivity Warning | Daily 2 AM | ☐ Built |

---

## Testing Checklist

- [ ] Create test appointment for today, verify reminder emails sent
- [ ] Mark appointment as Completed, verify notes nudge sent
- [ ] Run Stats Sync manually, verify GitHub file updated
- [ ] Run Weekly Digest manually, verify tutor receives schedule
- [ ] Mark appointment as NoShow, verify NCOIC receives alert
- [ ] Create appointment in ~1 hour, verify 1-hour reminder sent
- [ ] Cancel appointment, verify other party notified
- [ ] Check Teams channel for daily summary
- [ ] Run Monthly Report manually to test

---

## Troubleshooting

### "The workflow has been suspended"
- Usually a connection issue. Open flow and re-authenticate SharePoint/Outlook connections.

### Emails not sending
- Check spam/junk folders
- Verify email addresses in SharePoint lists are correct
- Check "Send an email" action for errors

### Teams messages not posting
- Verify Teams connection is authenticated
- Check you have permission to post to the channel
- Verify Team and Channel names are correct

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

## Connection References

When you first add actions, Power Automate will ask you to sign in to:

- **SharePoint** - Use your @dliflc01.sharepoint.com account
- **Office 365 Outlook** - Same account
- **Microsoft Teams** - Same account
- **HTTP** - No sign-in needed (for GitHub API)

These connections are saved and reused across flows.
