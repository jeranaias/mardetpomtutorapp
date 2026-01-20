# SharePoint Site Design Guide: MARDET_Admins

## Purpose
This guide helps you customize the SharePoint team site for the **MARDET_Admins** group (~3 users). Follow the step-by-step instructions or use an AI assistant for help.

---

## Target Audience
- Detachment administrative staff
- Full system access
- Need: user management, data operations, system monitoring, all approvals

---

## Current State (Default SharePoint)
- Bland default team site
- No admin tools or quick access
- No system health visibility
- No user management shortcuts

---

## Desired Design

### Page Layout (Top to Bottom)

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER - Minimal                                                │
│  Title: "System Administration"                                  │
│  Subtitle: "MARDET Tutoring System - Admin Portal"               │
│  [Open PowerApp Admin View]                                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  FOUR-COLUMN SECTION - System Stats                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ STUDENTS │ │ TUTORS   │ │ PENDING  │ │ SYSTEM   │           │
│  │          │ │          │ │ ACTIONS  │ │          │           │
│  │   412    │ │    30    │ │    5     │ │ ✓ OK     │           │
│  │  active  │ │  active  │ │  items   │ │          │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  TWO-COLUMN SECTION                                              │
│  ┌───────────────────────────┐  ┌───────────────────────────┐   │
│  │  USER MANAGEMENT          │  │  DATA OPERATIONS          │   │
│  │                           │  │                           │   │
│  │  👤 Add Student           │  │  📥 Import Students CSV   │   │
│  │  👤 Add Tutor             │  │  📥 Import Tutors CSV     │   │
│  │  📋 View All Students     │  │  📤 Export All Data       │   │
│  │  📋 View All Tutors       │  │  🗑️ Archive Old Records   │   │
│  │  🔄 Bulk Status Update    │  │  🔄 Sync to Public Site   │   │
│  │  ❌ Deactivate User       │  │                           │   │
│  └───────────────────────────┘  └───────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  FULL WIDTH SECTION - All Lists Quick Access                     │
│  Title: "Data Management"                                        │
│  [Tabs or Icons linking to each SharePoint list]                 │
│                                                                  │
│  📋 Students | 📋 Tutors | 📅 Appointments | 📝 SessionNotes    │
│  📊 ProgressTracking | 📚 Resources | ✅ ApprovalRequests        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  TWO-COLUMN SECTION                                              │
│  ┌───────────────────────────┐  ┌───────────────────────────┐   │
│  │  PENDING ACTIONS          │  │  SYSTEM HEALTH            │   │
│  │                           │  │                           │   │
│  │  [ApprovalRequests List   │  │  SharePoint: ✓ Online     │   │
│  │   showing ALL pending     │  │  Power Automate: ✓ 13/13  │   │
│  │   items regardless of     │  │  Last Backup: Today 0300  │   │
│  │   approver]               │  │  Storage: 45 MB used      │   │
│  │                           │  │                           │   │
│  │                           │  │  [M365 Admin Center]      │   │
│  │                           │  │  [Power Platform Admin]   │   │
│  └───────────────────────────┘  └───────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  FULL WIDTH SECTION - Recent Activity / Audit                    │
│  Title: "Recent System Activity"                                 │
│  [Site usage analytics or recent modifications list]             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  TWO-COLUMN SECTION                                              │
│  ┌───────────────────────────┐  ┌───────────────────────────┐   │
│  │  DOCUMENTATION            │  │  SUPPORT & CONTACTS       │   │
│  │                           │  │                           │   │
│  │  📖 Admin Guide           │  │  🎫 DCSIT Helpdesk        │   │
│  │  📖 User Management SOP   │  │  📧 Service Account Info  │   │
│  │  📖 Troubleshooting       │  │  📞 Cybersecurity Office  │   │
│  │  📖 Data Retention Policy │  │  🔗 Azure AD Portal       │   │
│  └───────────────────────────┘  └───────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Instructions

### Step 1: Enter Edit Mode
1. Go to the Admins site home page
2. Click **Edit**

### Step 2: Clear Default Content
1. Remove all default web parts
2. Start fresh

### Step 3: Add Header Section
1. Click **+** → **Text** web part (or minimal Hero)
2. Configure:
   - Heading 1: "System Administration"
   - Body: "MARDET Tutoring System - Admin Portal"
3. Add **Button** web part:
   - Text: "Open PowerApp Admin View"
   - Link: [PowerApp URL with admin context]

### Step 4: Add System Stats Section
1. Click **+** → **Section** → **Four columns**
2. In each column, add **Call to action** or **Text** web part:

   **Card 1 - Students:**
   - Title: "Students"
   - Number: "412" (or placeholder)
   - Subtitle: "active"
   - Link: [Students list]

   **Card 2 - Tutors:**
   - Title: "Tutors"
   - Number: "30"
   - Subtitle: "active"
   - Link: [Tutors list]

   **Card 3 - Pending Actions:**
   - Title: "Pending"
   - Number: Shows count
   - Subtitle: "actions"
   - Link: [ApprovalRequests filtered to Pending]

   **Card 4 - System:**
   - Title: "System"
   - Number: "✓ OK" or status indicator
   - Subtitle: "health"
   - Link: [Site settings or health page]

### Step 5: Add User Management & Data Operations Section
1. Click **+** → **Section** → **Two columns**
2. LEFT column - User Management: Add **Quick Links**
   - Title: "User Management"
   - Layout: **List**
   - Links:
     | Title | Icon | Link |
     |-------|------|------|
     | Add Student | Add | [Students list new form] |
     | Add Tutor | Add | [Tutors list new form] |
     | View All Students | List | [Students list] |
     | View All Tutors | List | [Tutors list] |
     | Bulk Status Update | Sync | [PowerApp or instructions] |
     | Deactivate User | Block | [Instructions or form] |

3. RIGHT column - Data Operations: Add **Quick Links**
   - Title: "Data Operations"
   - Layout: **List**
   - Links:
     | Title | Link |
     |-------|------|
     | Import Students CSV | [Power Automate flow or instructions] |
     | Import Tutors CSV | [Power Automate flow or instructions] |
     | Export All Data | [Export instructions or flow] |
     | Archive Old Records | [Archive flow trigger] |
     | Sync to Public Site | [GitHub Actions or manual process] |

### Step 6: Add Data Management Section (All Lists)
1. Click **+** → **Section** → **Full width**
2. Add **Text** web part:
   - Heading 2: "Data Management"
3. Add **Quick Links** web part:
   - Layout: **Tiles** or **Icons**
   - Links to all 7 SharePoint lists:
     | Title | Icon | Link |
     |-------|------|------|
     | Students | People | [Students list URL] |
     | Tutors | People | [Tutors list URL] |
     | Appointments | Calendar | [Appointments list URL] |
     | SessionNotes | Document | [SessionNotes list URL] |
     | ProgressTracking | Chart | [ProgressTracking list URL] |
     | Resources | Library | [Resources list URL] |
     | ApprovalRequests | Approve | [ApprovalRequests list URL] |

### Step 7: Add Pending Actions & System Health Section
1. Click **+** → **Section** → **Two columns**
2. LEFT column: Add **List** web part
   - Title: "All Pending Actions"
   - Select: **ApprovalRequests** list
   - View: "All Pending" (no approver filter - admins see all)
     - Filter: Status = Pending
     - Columns: Type, RequestedBy, Date, AssignedTo

3. RIGHT column: Add **Text** web part
   - Title: "System Health"
   - Content (update manually or link to monitoring):
   ```
   **Status Check**

   ✓ SharePoint: Online
   ✓ Power Automate: 13/13 flows active
   ✓ Last Backup: [Auto-updated by M365]
   ✓ Storage: ~45 MB of 25 GB used

   **Admin Links**
   - [M365 Admin Center](https://admin.microsoft.com)
   - [Power Platform Admin](https://admin.powerplatform.microsoft.com)
   - [Azure AD Portal](https://portal.azure.com)
   - [SharePoint Admin](https://dliflc01-admin.sharepoint.com)
   ```

### Step 8: Add Activity Section
1. Click **+** → **Section** → **Full width**
2. Add **Text** web part:
   - Heading 2: "Recent System Activity"
3. Options:
   - Add **Site analytics** web part (shows page views, visitors)
   - Add **Recent documents** web part
   - Link to audit logs: "View full audit log in Microsoft Purview"

### Step 9: Add Documentation & Support Section
1. Click **+** → **Section** → **Two columns**
2. LEFT column - Documentation: Add **Quick Links**
   - Links:
     | Title | Link |
     |-------|------|
     | Admin Guide | [Document in library] |
     | User Management SOP | [Document] |
     | Troubleshooting Guide | [Document] |
     | Data Retention Policy | [Document] |
     | Build Guide (GitHub) | https://github.com/jeranaias/mardetpomtutorapp |

3. RIGHT column - Support: Add **Quick Links**
   - Links:
     | Title | Link |
     |-------|------|
     | DCSIT Helpdesk | https://dliflc.service-now.com |
     | Service Account Info | [Internal doc with pa.svc details] |
     | Cybersecurity Office | mailto:ia@dliflc.edu |
     | Azure AD Portal | https://portal.azure.com |
     | Report Security Issue | [Security incident form] |

### Step 10: Update Navigation
1. Edit left navigation:
   - Home
   - Users (submenu: Students, Tutors)
   - Data (submenu: All Lists, Import, Export)
   - Approvals
   - Reports → [Power BI]
   - Settings
   - Documentation
   - Site contents

### Step 11: Apply Theme
1. **Settings** → **Change the look**
2. Admin theme options:
   - **Dark theme** for distinction: #1a1a2e primary
   - Or **Scarlet**: #CC0000
3. Consider adding "ADMIN" badge/indicator in header

### Step 12: Publish
1. Click **Publish**
2. Verify all list links work
3. Test admin-specific functions

---

## Color Reference

| Element | Color | Hex |
|---------|-------|-----|
| Primary/Header | Dark Navy or Black | #1a1a2e or #000000 |
| Accent | Gold | #FFD700 |
| System OK | Green | #28A745 |
| Warning/Pending | Orange | #FFC107 |
| Error/Critical | Red | #DC3545 |
| Admin Badge | Purple or Gold | #6f42c1 or #FFD700 |

---

## Assets Needed

1. **Admin documentation** (upload to Documents library):
   - Admin Guide.pdf
   - User Management SOP.pdf
   - Troubleshooting Guide.pdf
   - Data Retention Policy.pdf

2. **Service account reference** document (internal only)

3. **Import templates** (CSV files for bulk import)

---

## AI Assistant Prompts

**Initial Setup:**
> "I'm building an admin portal in SharePoint for system administrators. I need quick access to all data lists, user management functions, system health status, and pending approval items. Help me design this dashboard."

**All Lists Access:**
> "How do I create a Quick Links web part in SharePoint that displays all my lists as clickable tiles with icons?"

**System Health Section:**
> "I want to display system health information on my SharePoint admin page including links to M365 Admin Center, Power Platform Admin, and Azure Portal. What's the best web part for this?"

**Pending Actions Across Approvers:**
> "I have an ApprovalRequests list. As an admin, I need to see ALL pending items regardless of who the assigned approver is. How do I create this view?"

**Admin Links:**
> "What are the direct URLs for M365 Admin Center, Power Platform Admin Center, Azure AD Portal, and SharePoint Admin Center that I should add to my admin dashboard?"

---

## Key Admin URLs Reference

```
M365 Admin Center:      https://admin.microsoft.com
Power Platform Admin:   https://admin.powerplatform.microsoft.com
Azure AD Portal:        https://portal.azure.com
SharePoint Admin:       https://dliflc01-admin.sharepoint.com
Power Automate:         https://make.powerautomate.com
Power BI Service:       https://app.powerbi.com
Microsoft Purview:      https://compliance.microsoft.com
```

---

## Testing Checklist

- [ ] Header displays with admin context
- [ ] Stats cards show (placeholder numbers OK)
- [ ] User management links work (add forms open)
- [ ] Data operations links functional
- [ ] All 7 list tiles link correctly
- [ ] Pending actions shows ALL pending items
- [ ] System health section has correct links
- [ ] Activity/analytics displays
- [ ] Documentation links work
- [ ] Support links correct
- [ ] Navigation updated for admin workflow
- [ ] Theme applied (dark or distinctive)
- [ ] Mobile view acceptable
- [ ] Published and accessible to MARDET_Admins group only
