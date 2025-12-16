# Segment 6: Approval System

Chain-of-command approval workflows for special requests.

---

## Prerequisites

- [ ] SharePoint lists created (Segment 2)
- [ ] Power Automate access with Approvals connector
- [ ] Approver email addresses (NCOIC, OIC, Budget, etc.)

---

## Overview

| # | Approval Type | Approver | Trigger |
|---|---------------|----------|---------|
| 1 | Extended Session (>90 min) | NCOIC | New request in list |
| 2 | Off-Hours Tutoring | NCOIC → OIC | New request in list |
| 3 | Special Accommodation | OIC | New request in list |
| 4 | Resource Request | Budget Approver | New request in list |

**Build time:** ~30 minutes

---

## Step 1: Import ApprovalRequests List

### 1.1 Import CSV

1. Go to SharePoint site: `https://dliflc01.sharepoint.com/sites/MCD`
2. **New** → **List** → **From Excel**
3. Upload `ApprovalRequests.csv` from this folder
4. Review columns → **Create**
5. Delete sample data rows (keep structure)

### 1.2 Verify Columns

Your list should have these columns:

| Column | Type | Purpose |
|--------|------|---------|
| RequestID | Number | Auto-increment ID |
| Title | Text | Request title |
| RequestType | Choice | Extended Session, Off-Hours Session, Special Accommodation, Resource Request |
| RequestedBy | Text | Requester's name |
| RequestedByEmail | Text | Requester's email |
| RequestDate | Date | When submitted |
| Description | Multi-line text | Details of request |
| RelatedAppointmentID | Number | Link to appointment (if applicable) |
| RelatedStudentID | Number | Link to student (if applicable) |
| Status | Choice | Pending, Approved, Rejected, Cancelled |
| ApproverEmail | Text | Who needs to approve |
| ApproverName | Text | Approver's name |
| ApproverResponse | Choice | Approve, Reject |
| ApproverComments | Multi-line text | Approver's notes |
| ResponseDate | Date | When approved/rejected |
| Priority | Choice | Normal, High, Urgent |

---

## Step 2: Configure Approver Emails

Before building flows, define your approvers:

```
NCOIC Email: [YOUR_NCOIC_EMAIL]
OIC Email: [YOUR_OIC_EMAIL]
Budget Approver: [YOUR_BUDGET_EMAIL]
```

Replace these in the flows below.

---

## Flow 1: Extended Session Approval

**Purpose:** Route extended session requests (>90 min) to NCOIC for approval.

### Step 1: Create Flow

1. Go to https://make.powerautomate.com
2. **+ Create** → **Automated cloud flow**
3. Name: `MARDET - Extended Session Approval`
4. Trigger: **When an item is created (SharePoint)**
5. Click **Create**

### Step 2: Configure Trigger

```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: ApprovalRequests
```

### Step 3: Add Condition - Check Request Type

**Action: Condition**
```
@{triggerOutputs()?['body/RequestType/Value']} is equal to Extended Session
```

**If yes:**

### Step 4: Start Approval

**Action: Start and wait for an approval**
```
Approval type: Approve/Reject - First to respond
Title: Extended Session Request - @{triggerOutputs()?['body/Title']}
Assigned to: ncoic@mail.mil (replace with actual NCOIC email)
Details:
```

```html
<h3>Extended Session Request</h3>

<p><strong>Requested By:</strong> @{triggerOutputs()?['body/RequestedBy']}</p>
<p><strong>Date:</strong> @{formatDateTime(triggerOutputs()?['body/RequestDate'], 'dddd, MMMM d, yyyy')}</p>
<p><strong>Priority:</strong> @{triggerOutputs()?['body/Priority/Value']}</p>

<h4>Description:</h4>
<p>@{triggerOutputs()?['body/Description']}</p>

<p>Please approve or reject this request.</p>
```

```
Item link: @{triggerOutputs()?['body/{Link}']}
```

### Step 5: Condition - Check Response

**Action: Condition**
```
@{outputs('Start_and_wait_for_an_approval')?['body/outcome']} is equal to Approve
```

### Step 6A: If Approved

**Action: Update item (SharePoint)**
```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: ApprovalRequests
Id: @{triggerOutputs()?['body/ID']}
Status: Approved
ApproverResponse: Approve
ApproverComments: @{first(outputs('Start_and_wait_for_an_approval')?['body/responses'])?['comments']}
ResponseDate: @{utcNow()}
ApproverName: @{first(outputs('Start_and_wait_for_an_approval')?['body/responses'])?['responder/displayName']}
```

**Action: Send an email (V2) - Notify Requester**
```
To: @{triggerOutputs()?['body/RequestedByEmail']}
Subject: ✅ Extended Session Request Approved
Body:
```

```html
<p>Good news! Your extended session request has been approved.</p>

<p><strong>Request:</strong> @{triggerOutputs()?['body/Title']}</p>
<p><strong>Approved by:</strong> @{first(outputs('Start_and_wait_for_an_approval')?['body/responses'])?['responder/displayName']}</p>
<p><strong>Comments:</strong> @{first(outputs('Start_and_wait_for_an_approval')?['body/responses'])?['comments']}</p>

<p>You may now schedule the extended session.</p>

<p>- MARDET Tutoring System</p>
```

### Step 6B: If Rejected

**Action: Update item (SharePoint)**
```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: ApprovalRequests
Id: @{triggerOutputs()?['body/ID']}
Status: Rejected
ApproverResponse: Reject
ApproverComments: @{first(outputs('Start_and_wait_for_an_approval')?['body/responses'])?['comments']}
ResponseDate: @{utcNow()}
ApproverName: @{first(outputs('Start_and_wait_for_an_approval')?['body/responses'])?['responder/displayName']}
```

**Action: Send an email (V2) - Notify Requester**
```
To: @{triggerOutputs()?['body/RequestedByEmail']}
Subject: ❌ Extended Session Request Not Approved
Body:
```

```html
<p>Your extended session request was not approved.</p>

<p><strong>Request:</strong> @{triggerOutputs()?['body/Title']}</p>
<p><strong>Reviewed by:</strong> @{first(outputs('Start_and_wait_for_an_approval')?['body/responses'])?['responder/displayName']}</p>
<p><strong>Comments:</strong> @{first(outputs('Start_and_wait_for_an_approval')?['body/responses'])?['comments']}</p>

<p>Please contact the tutoring office if you have questions.</p>

<p>- MARDET Tutoring System</p>
```

### Step 7: Save

---

## Flow 2: Off-Hours Tutoring Approval

**Purpose:** Two-level approval for off-hours sessions (NCOIC → OIC).

### Step 1: Create Flow

1. **+ Create** → **Automated cloud flow**
2. Name: `MARDET - Off-Hours Approval`
3. Trigger: **When an item is created (SharePoint)**

### Step 2: Configure Trigger

```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: ApprovalRequests
```

### Step 3: Condition - Check Request Type

**Action: Condition**
```
@{triggerOutputs()?['body/RequestType/Value']} is equal to Off-Hours Session
```

**If yes:**

### Step 4: First Approval (NCOIC)

**Action: Start and wait for an approval**
```
Approval type: Approve/Reject - First to respond
Title: [Level 1] Off-Hours Request - @{triggerOutputs()?['body/Title']}
Assigned to: ncoic@mail.mil
Details:
```

```html
<h3>Off-Hours Tutoring Request - Level 1 Review</h3>

<p><strong>Requested By:</strong> @{triggerOutputs()?['body/RequestedBy']}</p>
<p><strong>Priority:</strong> @{triggerOutputs()?['body/Priority/Value']}</p>

<h4>Description:</h4>
<p>@{triggerOutputs()?['body/Description']}</p>

<p><em>If approved, this will be routed to OIC for final approval.</em></p>
```

### Step 5: Condition - NCOIC Approved?

**Action: Condition**
```
@{outputs('Start_and_wait_for_an_approval')?['body/outcome']} is equal to Approve
```

**If no (NCOIC rejected):** Update list as Rejected, notify requester (same as Flow 1)

**If yes (NCOIC approved):**

### Step 6: Second Approval (OIC)

**Action: Start and wait for an approval**
```
Approval type: Approve/Reject - First to respond
Title: [Level 2] Off-Hours Request - @{triggerOutputs()?['body/Title']}
Assigned to: oic@mail.mil
Details:
```

```html
<h3>Off-Hours Tutoring Request - Final Approval</h3>

<p><strong>Requested By:</strong> @{triggerOutputs()?['body/RequestedBy']}</p>
<p><strong>Priority:</strong> @{triggerOutputs()?['body/Priority/Value']}</p>

<h4>Description:</h4>
<p>@{triggerOutputs()?['body/Description']}</p>

<p><strong>NCOIC Recommendation:</strong> Approved</p>
<p><strong>NCOIC Comments:</strong> @{first(outputs('Start_and_wait_for_an_approval')?['body/responses'])?['comments']}</p>
```

### Step 7: Condition - OIC Approved?

**If yes:**

**Action: Update item**
```
Status: Approved
ApproverResponse: Approve
ApproverComments: NCOIC: @{first(outputs('Start_and_wait_for_an_approval')?['body/responses'])?['comments']} | OIC: @{first(outputs('Start_and_wait_for_an_approval_2')?['body/responses'])?['comments']}
ResponseDate: @{utcNow()}
ApproverName: @{first(outputs('Start_and_wait_for_an_approval_2')?['body/responses'])?['responder/displayName']}
```

**Action: Send approval email to requester**

**If no (OIC rejected):**

**Action: Update item as Rejected, notify requester**

### Step 8: Save

---

## Flow 3: Special Accommodation Approval

**Purpose:** Route accommodation requests directly to OIC.

### Step 1: Create Flow

1. **+ Create** → **Automated cloud flow**
2. Name: `MARDET - Special Accommodation Approval`
3. Trigger: **When an item is created (SharePoint)**

### Step 2: Configure Trigger

```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: ApprovalRequests
```

### Step 3: Condition - Check Request Type

```
@{triggerOutputs()?['body/RequestType/Value']} is equal to Special Accommodation
```

**If yes:**

### Step 4: Start Approval

**Action: Start and wait for an approval**
```
Approval type: Approve/Reject - First to respond
Title: Special Accommodation Request - @{triggerOutputs()?['body/Title']}
Assigned to: oic@mail.mil
Details:
```

```html
<h3>Special Accommodation Request</h3>

<p><strong>Requested By:</strong> @{triggerOutputs()?['body/RequestedBy']}</p>
<p><strong>Priority:</strong> @{triggerOutputs()?['body/Priority/Value']}</p>

<h4>Accommodation Details:</h4>
<p>@{triggerOutputs()?['body/Description']}</p>

<p><em>Please review for compliance with accommodation policies.</em></p>
```

### Step 5: Process Response

Same pattern as Flow 1:
- If Approved: Update list, email requester with approval
- If Rejected: Update list, email requester with rejection

### Step 6: Save

---

## Flow 4: Resource Request Approval

**Purpose:** Route resource/purchase requests to budget approver.

### Step 1: Create Flow

1. **+ Create** → **Automated cloud flow**
2. Name: `MARDET - Resource Request Approval`
3. Trigger: **When an item is created (SharePoint)**

### Step 2: Configure Trigger

```
Site Address: https://dliflc01.sharepoint.com/sites/MCD
List Name: ApprovalRequests
```

### Step 3: Condition - Check Request Type

```
@{triggerOutputs()?['body/RequestType/Value']} is equal to Resource Request
```

**If yes:**

### Step 4: Start Approval

**Action: Start and wait for an approval**
```
Approval type: Approve/Reject - First to respond
Title: Resource Request - @{triggerOutputs()?['body/Title']}
Assigned to: budget@mail.mil (replace with actual budget approver)
Details:
```

```html
<h3>Resource/Material Request</h3>

<p><strong>Requested By:</strong> @{triggerOutputs()?['body/RequestedBy']}</p>
<p><strong>Date:</strong> @{formatDateTime(triggerOutputs()?['body/RequestDate'], 'MMMM d, yyyy')}</p>

<h4>Request Details:</h4>
<p>@{triggerOutputs()?['body/Description']}</p>

<p><em>Please review for budget availability and necessity.</em></p>
```

### Step 5: Process Response

Same pattern:
- If Approved: Update list, email requester
- If Rejected: Update list, email requester with reason

### Step 6: Save

---

## Optional: Add Approval Screen to PowerApp

Add these screens to your existing PowerApp for users to submit and track requests.

### Submit Request Screen

**Form Fields:**

```
RequestType Dropdown:
Items: ["Extended Session", "Off-Hours Session", "Special Accommodation", "Resource Request"]
```

```
Description Text Input:
Mode: TextMode.MultiLine
HintText: "Describe your request in detail..."
```

```
Priority Dropdown:
Items: ["Normal", "High", "Urgent"]
Default: "Normal"
```

**Submit Button:**
```
Text: "Submit Request"
OnSelect:
    Patch(ApprovalRequests,
        Defaults(ApprovalRequests),
        {
            Title: drpRequestType.Selected.Value & " - " & Text(Today(), "mmm d"),
            RequestType: {Value: drpRequestType.Selected.Value},
            RequestedBy: varCurrentUser.FullName,
            RequestedByEmail: varUserEmail,
            RequestDate: Now(),
            Description: txtDescription.Text,
            Status: {Value: "Pending"},
            Priority: {Value: drpPriority.Selected.Value},
            RelatedStudentID: If(varIsStudent, varStudentRecord.ID, 0),
            ApproverEmail: Switch(drpRequestType.Selected.Value,
                "Extended Session", "ncoic@mail.mil",
                "Off-Hours Session", "ncoic@mail.mil",
                "Special Accommodation", "oic@mail.mil",
                "Resource Request", "budget@mail.mil"
            )
        }
    );
    Notify("Request submitted successfully!", NotificationType.Success);
    Navigate(scrMyRequests, ScreenTransition.Fade)
```

### My Requests Screen

**Gallery - My Requests:**
```
Items: Sort(
    Filter(ApprovalRequests,
        RequestedByEmail = varUserEmail
    ),
    RequestDate,
    Descending
)
```

**Request Card:**
```
Title: ThisItem.Title
Status Badge:
  Fill: Switch(ThisItem.Status.Value,
      "Pending", RGBA(255, 193, 7, 1),
      "Approved", RGBA(40, 167, 69, 1),
      "Rejected", RGBA(220, 53, 69, 1),
      Gray
  )
  Text: ThisItem.Status.Value
Date: Text(ThisItem.RequestDate, "mmm d, yyyy")
Comments: ThisItem.ApproverComments
```

---

## Flow Summary

| # | Flow | Approver(s) | Status |
|---|------|-------------|--------|
| 1 | Extended Session Approval | NCOIC | ☐ Built |
| 2 | Off-Hours Approval | NCOIC → OIC | ☐ Built |
| 3 | Special Accommodation | OIC | ☐ Built |
| 4 | Resource Request | Budget | ☐ Built |

---

## Testing Checklist

- [ ] Create Extended Session request, verify NCOIC receives approval in Teams/Outlook
- [ ] Approve request, verify list updates and requester notified
- [ ] Reject request, verify list updates and requester notified
- [ ] Create Off-Hours request, verify two-level approval flow
- [ ] Test all 4 request types

---

## Troubleshooting

### "Approval not received"
- Check approver email address is correct
- Verify approver has Teams/Outlook access
- Check spam/junk folders

### "Approval action times out"
- Default timeout is 30 days
- Add timeout configuration in flow settings if needed

### "Cannot update list item"
- Verify flow has permissions to the list
- Check column names match exactly

### "Two-level approval skips second level"
- Ensure condition checks first approval outcome correctly
- Verify second approval action is inside the "If yes" branch

---

## Approver Experience

When an approval is sent, approvers can respond via:

1. **Teams** - Notification with Approve/Reject buttons
2. **Outlook** - Email with actionable buttons
3. **Power Automate app** - Mobile app notifications
4. **Approvals app in Teams** - Dashboard of all pending approvals

Approvers can add comments before responding.

---

## Files in This Folder

- `README.md` - This guide
- `ApprovalRequests.csv` - SharePoint list template

Import the CSV first, then build the flows.
