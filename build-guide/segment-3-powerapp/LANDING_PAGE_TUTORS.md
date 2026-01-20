# SharePoint Site Design Guide: MARDET_Tutors

## Purpose
This guide helps you customize the SharePoint team site for the **MARDET_Tutors** group (~30 users). Follow the step-by-step instructions or use an AI assistant for help.

---

## Target Audience
- Senior NCOs (SSgt - MGySgt) and Civilians
- Language instructors
- Need quick access to: daily schedule, session notes, student info, resources

---

## Current State (Default SharePoint)
- Bland default team site
- Generic News web part
- Default Quick Links
- No tutor-specific tools or information

---

## Desired Design

### Page Layout (Top to Bottom)

```
┌─────────────────────────────────────────────────────────────────┐
│  HERO SECTION - Full Width                                       │
│  Background: Professional teaching/education themed              │
│  Title: "Tutor Portal"                                           │
│  Subtitle: "Manage your schedule. Document sessions. Support     │
│            student success."                                     │
│  Button: "Open Tutor App" → Links to PowerApp                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  THREE-COLUMN SECTION - Quick Stats Cards                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ TODAY'S     │  │ PENDING     │  │ THIS WEEK   │              │
│  │ SESSIONS    │  │ NOTES       │  │             │              │
│  │    [#]      │  │   [#]       │  │  [#] hrs    │              │
│  │ View Today  │  │ Complete    │  │  scheduled  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│  (Note: Static cards - link to PowerApp for live data)          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  TWO-COLUMN SECTION                                              │
│  ┌───────────────────────────┐  ┌───────────────────────────┐   │
│  │  QUICK ACTIONS            │  │  TODAY'S SCHEDULE         │   │
│  │                           │  │                           │   │
│  │  📅 View My Schedule      │  │  [Appointments List -     │   │
│  │  📝 Add Session Notes     │  │   filtered to today]      │   │
│  │  👥 My Students           │  │                           │   │
│  │  📚 Resource Library      │  │  or                       │   │
│  │  📊 My Stats              │  │                           │   │
│  │  ⚙️ Update Availability   │  │  [Calendar view embed]    │   │
│  └───────────────────────────┘  └───────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  FULL WIDTH SECTION - Document Session Notes                     │
│  Title: "Session Documentation"                                  │
│  [Embedded SessionNotes list - recent entries or form link]      │
│  Button: "Add New Session Note"                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  TWO-COLUMN SECTION                                              │
│  ┌───────────────────────────┐  ┌───────────────────────────┐   │
│  │  ANNOUNCEMENTS            │  │  TUTOR RESOURCES          │   │
│  │  [News web part]          │  │                           │   │
│  │                           │  │  📖 Tutor Handbook        │   │
│  │                           │  │  📋 Session Note Guide    │   │
│  │                           │  │  📞 Contact Tutor Chief   │   │
│  │                           │  │  🔗 DLPT Resources        │   │
│  └───────────────────────────┘  └───────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Instructions

### Step 1: Enter Edit Mode
1. Go to the Tutors site home page
2. Click **Edit** in the top right corner

### Step 2: Delete Default Content
1. Remove default News web part
2. Remove default Quick Links
3. Clear any other placeholder content

### Step 3: Add Hero Section
1. Click **+** → **Hero** web part
2. Configure:
   - Layout: **Full width**
   - **Change image**: Professional education/teaching theme
     - Suggested: Classroom setting, language learning imagery
   - **Title**: "Tutor Portal"
   - **Subtitle**: "Manage your schedule. Document sessions. Support student success."
   - **Call to action button**:
     - Text: "Open Tutor App"
     - Link: [PowerApp URL]

### Step 4: Add Quick Stats Section (Call to Action Cards)
1. Click **+** → **Section** → **Three columns**
2. In each column, add **Call to action** web part:

   **Column 1 - Today's Sessions:**
   - Title: "Today's Sessions"
   - Description: "View your schedule"
   - Button: "View Today" → [PowerApp URL]
   - Background: Use accent color

   **Column 2 - Pending Notes:**
   - Title: "Session Notes"
   - Description: "Document completed sessions"
   - Button: "Add Notes" → [PowerApp URL or SessionNotes form]
   - Background: Warning color if pending

   **Column 3 - Weekly Hours:**
   - Title: "This Week"
   - Description: "Track your hours"
   - Button: "View Stats" → [PowerApp URL]
   - Background: Use accent color

### Step 5: Add Quick Actions & Schedule Section
1. Click **+** → **Section** → **Two columns** (1/3 + 2/3 split if available)
2. LEFT column: Add **Quick Links** web part
   - Layout: **List** or **Compact**
   - Add links:
     | Title | Icon | Link |
     |-------|------|------|
     | View My Schedule | Calendar | [PowerApp] |
     | Add Session Notes | Edit | [PowerApp or SP form] |
     | My Students | People | [PowerApp] |
     | Resource Library | Library | [Resources page] |
     | My Stats | Chart | [PowerApp] |
     | Update Availability | Settings | [Tutors list edit form] |

3. RIGHT column: Add **List** web part
   - Select: **Appointments** list
   - Create view: "Today's Schedule"
     - Filter: Date = [Today]
     - Sort: Time ascending
     - Columns: Time, Student, Language, Focus Area, Status
   - Alternative: Add **Calendar** web part if preferred

### Step 6: Add Session Documentation Section
1. Click **+** → **Section** → **Full width**
2. Add **Text** web part:
   - Heading 2: "Session Documentation"
   - Body: "Complete session notes within 24 hours of each tutoring session."
3. Add **Button** web part:
   - Text: "Add New Session Note"
   - Link: [SessionNotes new item form URL]
4. Optional: Add **List** web part showing recent SessionNotes

### Step 7: Add Announcements & Resources Section
1. Click **+** → **Section** → **Two columns**
2. LEFT column: Add **News** web part
   - Layout: **List**
   - Source: This site
   - Show: 5 items
3. RIGHT column: Add **Quick Links** web part
   - Title: "Tutor Resources"
   - Layout: **List**
   - Links:
     | Title | Link |
     |-------|------|
     | Tutor Handbook | [Document library link] |
     | Session Note Best Practices | [Document link] |
     | Contact Tutor Chief | mailto:tutorchief@dliflc.edu |
     | DLPT Prep Materials | [Resources link] |
     | Report an Issue | [Helpdesk or form link] |

### Step 8: Update Navigation
1. Edit left navigation
2. Configure:
   - Home
   - My Schedule → [PowerApp]
   - Session Notes → [SessionNotes list]
   - My Students → [PowerApp]
   - Resources → [Document library]
   - Announcements → [News page]

### Step 9: Apply Theme
1. **Settings** → **Change the look** → **Theme**
2. Primary color: **#CC0000** (Scarlet)
3. Or use a professional blue/gray theme for tutor distinction:
   - Primary: **#003366** (Navy blue) - differentiates from student site

### Step 10: Publish
1. Click **Publish**
2. Verify all links
3. Test on different devices

---

## Color Reference

| Element | Color | Hex |
|---------|-------|-----|
| Primary/Header | Marine Scarlet OR Navy | #CC0000 or #003366 |
| Accent | Gold | #FFD700 |
| Pending/Warning | Orange | #FFC107 |
| Success | Green | #28A745 |
| Background | Light Gray | #F5F5F5 |

---

## Assets Needed

1. **Hero Banner Image** (1920x600px)
   - Professional education theme
   - Classroom or language learning imagery

2. **Tutor Handbook** (PDF)
   - Upload to Documents library

3. **Session Note Guide** (PDF or page)
   - Best practices for documentation

---

## AI Assistant Prompts

**Initial Setup:**
> "I'm customizing a SharePoint site for language tutors. I need a hero section, quick action cards showing today's sessions, a place to access session notes, and tutor-specific resources. Guide me through each web part."

**Call to Action Cards:**
> "How do I add Call to Action web parts in SharePoint to create clickable stat cards for 'Today's Sessions', 'Pending Notes', and 'Weekly Hours'?"

**List Filtering:**
> "I want to display only today's appointments from the Appointments list on the tutor home page. How do I create and apply a filtered view?"

**Two-Column Layout:**
> "How do I add a two-column section in SharePoint with different column widths (narrow left, wide right)?"

**Session Notes Form:**
> "How do I create a direct link to the SharePoint list new item form for SessionNotes?"

---

## Testing Checklist

- [ ] Hero displays with correct title and button
- [ ] Quick action cards link to correct destinations
- [ ] Today's schedule list displays and filters correctly
- [ ] Session notes link/section works
- [ ] Resources links are accessible
- [ ] Navigation updated for tutor workflow
- [ ] Theme applied (scarlet or navy)
- [ ] News/announcements show relevant content
- [ ] Mobile view acceptable
- [ ] Published and accessible to MARDET_Tutors group
