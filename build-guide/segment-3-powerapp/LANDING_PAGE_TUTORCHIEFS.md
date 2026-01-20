# SharePoint Site Design Guide: MARDET_TutorChiefs

## Purpose
This guide helps you customize the SharePoint team site for the **MARDET_TutorChiefs** group (~7 users). Follow the step-by-step instructions or use an AI assistant for help.

---

## Target Audience
- Senior leadership (MSgt, MGySgt, senior civilians)
- Oversee tutors and students in their language section
- Need: operational visibility, approval queue, tutor workload, reports

---

## Current State (Default SharePoint)
- Bland default team site
- No leadership dashboard
- No approval workflow visibility
- No operational metrics

---

## Desired Design

### Page Layout (Top to Bottom)

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER SECTION - Compact Hero                                   │
│  Title: "Tutor Chief Dashboard"                                  │
│  Subtitle: "Operations Overview - [Today's Date]"                │
│  Button: "Open Admin App" → Links to PowerApp                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  FOUR-COLUMN SECTION - KPI Cards                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ TODAY    │ │ THIS     │ │ PENDING  │ │ ALERTS   │           │
│  │   [#]    │ │ WEEK     │ │ APPROVAL │ │          │           │
│  │ sessions │ │  [#]     │ │   [#]    │ │   [#]    │           │
│  │          │ │ sessions │ │ requests │ │ issues   │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  FULL WIDTH SECTION - Pending Approvals                          │
│  Title: "⚠️ Pending Approvals" (highlighted if count > 0)        │
│  [ApprovalRequests List - filtered to Status = Pending]          │
│  Columns: Type, Requester, Date, Description, [Approve] [Deny]   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  TWO-COLUMN SECTION                                              │
│  ┌───────────────────────────┐  ┌───────────────────────────┐   │
│  │  TODAY'S OPERATIONS       │  │  TUTOR STATUS             │   │
│  │                           │  │                           │   │
│  │  [Appointments List -     │  │  [Tutors List showing     │   │
│  │   Today's sessions        │  │   status and weekly hrs]  │   │
│  │   all tutors]             │  │                           │   │
│  │                           │  │  Name | Status | Hours    │   │
│  │  Time|Tutor|Student|Status│  │  SSgt Smith | ✓ | 18/20   │   │
│  └───────────────────────────┘  └───────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  TWO-COLUMN SECTION                                              │
│  ┌───────────────────────────┐  ┌───────────────────────────┐   │
│  │  QUICK ACTIONS            │  │  REPORTS                  │   │
│  │                           │  │                           │   │
│  │  📊 View Full Dashboard   │  │  📈 Weekly Operations     │   │
│  │  👥 Manage Tutors         │  │  📊 Tutor Performance     │   │
│  │  🎓 View All Students     │  │  📉 Student Progress      │   │
│  │  📋 Session Notes Review  │  │  📑 Export Data           │   │
│  │  ⚙️ System Settings       │  │                           │   │
│  └───────────────────────────┘  └───────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  FULL WIDTH SECTION - Alerts & Issues                            │
│  Title: "Attention Needed"                                       │
│  [List or text showing: No-shows today, Pending notes,           │
│   Inactive students, Overloaded tutors]                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Instructions

### Step 1: Enter Edit Mode
1. Go to the TutorChiefs site home page
2. Click **Edit**

### Step 2: Clear Default Content
1. Remove all default web parts
2. Start with blank canvas

### Step 3: Add Compact Hero
1. Click **+** → **Hero** web part
2. Configure:
   - Layout: **Full width** but with minimal height
   - Or use **Text** web part with large heading instead
   - **Title**: "Tutor Chief Dashboard"
   - **Subtitle**: "Operations Overview"
   - **Button**: "Open Admin App" → [PowerApp URL]
   - Background: Dark scarlet or navy

### Step 4: Add KPI Cards Section
1. Click **+** → **Section** → **Four columns** (or use Vertical section)
2. In each column, add **Call to action** or **Text** web part:

   **Card 1 - Today:**
   - Use Call to action web part
   - Title: "Today"
   - Add number placeholder (or link to PowerApp for live data)
   - Button: "View Schedule"

   **Card 2 - This Week:**
   - Title: "This Week"
   - Shows weekly session count
   - Button: "View Calendar"

   **Card 3 - Pending Approvals:**
   - Title: "Pending"
   - IMPORTANT: Make this stand out (different color if > 0)
   - Button: "Review Approvals"

   **Card 4 - Alerts:**
   - Title: "Alerts"
   - Shows count of issues needing attention
   - Button: "View Alerts"

**Alternative:** Use **Highlighted content** or **Countdown** web parts if available for dynamic numbers.

### Step 5: Add Pending Approvals Section
1. Click **+** → **Section** → **Full width**
2. Add **Text** web part:
   - Heading 2: "⚠️ Pending Approvals"
3. Add **List** web part:
   - Select: **ApprovalRequests** list
   - Create view: "Pending for Chief"
     - Filter: Status = Pending
     - Sort: RequestDate descending
     - Columns: RequestType, RequestedBy, RequestDate, Description
   - Enable Quick Edit if you want inline approve/deny (limited in SP)

**Note:** For actual Approve/Deny buttons, you'll need to link to PowerApp or use Power Automate with approval actions.

### Step 6: Add Operations & Tutor Status Section
1. Click **+** → **Section** → **Two columns**
2. LEFT column: Add **List** web part
   - Title: "Today's Operations"
   - Select: **Appointments** list
   - View: "Today All Tutors"
     - Filter: Date = [Today]
     - Sort: Time ascending
     - Columns: Time, TutorID, StudentID, Status

3. RIGHT column: Add **List** web part
   - Title: "Tutor Status"
   - Select: **Tutors** list
   - View: "Active with Hours"
     - Filter: Status = Active
     - Columns: FullName, Status, MaxHoursPerWeek
   - Note: Weekly hours calculation requires PowerApp/Power BI

### Step 7: Add Quick Actions & Reports Section
1. Click **+** → **Section** → **Two columns**
2. LEFT column: Add **Quick Links** web part
   - Title: "Quick Actions"
   - Layout: **List**
   - Links:
     | Title | Icon | Link |
     |-------|------|------|
     | View Full Dashboard | ViewAll | [PowerApp] |
     | Manage Tutors | People | [Tutors list] |
     | View All Students | People | [Students list] |
     | Session Notes Review | Document | [SessionNotes list] |
     | System Settings | Settings | [Site settings or config] |

3. RIGHT column: Add **Quick Links** web part
   - Title: "Reports"
   - Layout: **List**
   - Links:
     | Title | Link |
     |-------|------|
     | Weekly Operations Report | [Power BI URL] |
     | Tutor Performance | [Power BI URL] |
     | Student Progress | [Power BI URL] |
     | Export Data | [Export flow or manual instructions] |

### Step 8: Add Alerts Section
1. Click **+** → **Section** → **Full width**
2. Add **Text** web part:
   - Heading 2: "Attention Needed"
3. Options:
   - **Static text** with links to investigate each alert type
   - **Highlighted content** web part showing items needing attention
   - **Embed** Power BI visual showing alerts

   Sample static content:
   ```
   Review these areas regularly:
   • [No-shows Today] - Appointments marked NoShow
   • [Pending Session Notes] - Sessions without documentation
   • [Inactive Students] - No sessions in 3+ weeks
   • [Tutor Workload] - Tutors over 90% capacity
   ```

### Step 9: Update Navigation
1. Edit left navigation:
   - Home
   - Approvals → [ApprovalRequests list or PowerApp]
   - Tutors → [Tutors list]
   - Students → [Students list]
   - Schedule → [Appointments list]
   - Reports → [Power BI]
   - Settings

### Step 10: Apply Theme
1. **Settings** → **Change the look**
2. Consider a distinguished theme for leadership:
   - Primary: **#003366** (Navy) or **#1a1a2e** (Dark)
   - Accent: **#FFD700** (Gold)
3. Or maintain scarlet: **#CC0000**

### Step 11: Publish
1. Click **Publish**
2. Verify all list views work
3. Test approval workflow links

---

## Color Reference

| Element | Color | Hex |
|---------|-------|-----|
| Primary/Header | Navy or Dark | #003366 or #1a1a2e |
| Accent | Gold | #FFD700 |
| Alert/Urgent | Red | #DC3545 |
| Warning | Orange | #FFC107 |
| Success | Green | #28A745 |
| KPI Card BG | White/Light | #FFFFFF |

---

## Assets Needed

1. **Hero Banner** (optional - can use solid color)
2. **Power BI Dashboard URLs** for embedding
3. **Approval workflow** configured in Power Automate

---

## AI Assistant Prompts

**Initial Setup:**
> "I'm setting up a SharePoint dashboard for leadership/managers. I need KPI summary cards at the top, a pending approvals list in the middle, and quick access to team status and reports. Walk me through this layout."

**KPI Cards:**
> "How can I create visual KPI cards in SharePoint that display counts from my lists? I want to show Today's Sessions, Pending Approvals, and Alert counts."

**Approval List:**
> "I have an ApprovalRequests SharePoint list. How do I embed it on my home page filtered to only show items where Status equals 'Pending'?"

**Multiple List Views:**
> "I need to show two different SharePoint lists side by side - one showing today's appointments and another showing tutor status. How do I set this up in a two-column section?"

**Power BI Embed:**
> "How do I embed a Power BI report into a SharePoint page for my leadership dashboard?"

---

## Testing Checklist

- [ ] Hero/header displays correctly
- [ ] KPI cards visible (even if static placeholders)
- [ ] Pending approvals list shows filtered data
- [ ] Today's operations displays correctly
- [ ] Tutor status list shows active tutors
- [ ] Quick action links work
- [ ] Report links open Power BI
- [ ] Navigation updated for chief workflow
- [ ] Theme applied (navy/gold or scarlet/gold)
- [ ] Mobile view acceptable
- [ ] Published and accessible to MARDET_TutorChiefs group
