# SharePoint Site Design Guide: MARDET_Students

## Purpose
This guide helps you customize the SharePoint team site for the **MARDET_Students** group (~400 users). Use this with Claude for Chrome to get step-by-step assistance modifying the page.

---

## Target Audience
- Junior Marines (Pvt - Sgt)
- Learning languages at DLI
- Need quick access to: booking, schedule, resources, progress

---

## Current State (Default SharePoint)
- Bland default team site
- Generic News web part
- Default Quick Links
- No branding or role-specific content

---

## Desired Design

### Page Layout (Top to Bottom)

```
┌─────────────────────────────────────────────────────────────────┐
│  HERO SECTION - Full Width                                       │
│  Background: Marine Corps themed image (EGA, scarlet/gold)       │
│  Title: "MARDET Language Tutoring"                               │
│  Subtitle: "Schedule sessions. Track progress. Succeed."         │
│  Button: "Book a Session" → Links to PowerApp                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  TWO-COLUMN SECTION                                              │
│  ┌─────────────────────────┐  ┌─────────────────────────────┐   │
│  │  QUICK LINKS (Tiles)    │  │  MY SCHEDULE                │   │
│  │                         │  │                             │   │
│  │  📅 Book Session        │  │  [Embedded List/Calendar    │   │
│  │  📊 My Progress         │  │   showing upcoming          │   │
│  │  📚 Study Resources     │  │   appointments]             │   │
│  │  ❓ Get Help            │  │                             │   │
│  └─────────────────────────┘  └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  FULL WIDTH SECTION                                              │
│  Title: "Study Resources"                                        │
│  [Document Library or Links to external resources by language]   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  TWO-COLUMN SECTION                                              │
│  ┌─────────────────────────┐  ┌─────────────────────────────┐   │
│  │  ANNOUNCEMENTS          │  │  CONTACT INFO               │   │
│  │  [News web part -       │  │                             │   │
│  │   compact list view]    │  │  Tutoring Center Hours      │   │
│  │                         │  │  Location: Bldg 614         │   │
│  │                         │  │  Phone: (831) 242-XXXX      │   │
│  │                         │  │  Email: mardet@dliflc.edu   │   │
│  └─────────────────────────┘  └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Instructions

### Step 1: Enter Edit Mode
1. Go to the Students site home page
2. Click **Edit** in the top right corner

### Step 2: Delete Default Content
1. Hover over the default News web part → Click trash icon
2. Hover over the default Quick Links → Click trash icon
3. Remove any other default web parts

### Step 3: Add Hero Section
1. Click **+** at the top of the page
2. Select **Hero** web part
3. Configure:
   - Layout: **Full width** (1 layer)
   - Click on the hero to edit
   - **Change image**: Upload Marine Corps themed banner
     - Suggested: EGA on scarlet background, or DLI campus photo
   - **Title**: "MARDET Language Tutoring"
   - **Call to action button**:
     - Text: "Book a Session"
     - Link: [PowerApp URL - add when available]

### Step 4: Add Two-Column Section
1. Below hero, click **+** → **Section**
2. Choose **Two columns** layout
3. In LEFT column, add **Quick Links** web part:
   - Layout: **Tiles** or **Grid**
   - Add these links:
     | Title | Icon | Link |
     |-------|------|------|
     | Book Session | Calendar | [PowerApp URL] |
     | My Progress | Chart | [PowerApp URL - Progress screen] |
     | Study Resources | Book | #resources (anchor on page) |
     | Get Help | Help | [FAQ page or email link] |

4. In RIGHT column, add **List** web part:
   - Select: **Appointments** list
   - View: Create filtered view "My Upcoming"
     - Filter: Status = Scheduled AND Date >= Today
     - Show: Date, Time, Tutor, Focus Area
   - Note: This shows all appointments; for user-specific filtering, use PowerApp embed instead

### Step 5: Add Resources Section
1. Click **+** → **Section** → **Full width**
2. Add **Text** web part:
   - Heading 2: "Study Resources"
3. Add **Quick Links** web part below:
   - Layout: **Compact** or **List**
   - Add links by language:
     | Title | Link |
     |-------|------|
     | Arabic Resources | [Public site URL]/arabic |
     | Russian Resources | [Public site URL]/russian |
     | Chinese Resources | [Public site URL]/chinese |
     | Korean Resources | [Public site URL]/korean |
     | [etc for all 9 languages] | |

### Step 6: Add Announcements & Contact Section
1. Click **+** → **Section** → **Two columns**
2. LEFT column: Add **News** web part
   - Layout: **List** (compact)
   - Source: This site
   - Show: 3-5 items
3. RIGHT column: Add **Text** web part
   - Content:
   ```
   ## Tutoring Center Info

   **Hours**: Mon-Fri 0730-1630
   **Location**: Building 614, Room 201
   **Phone**: (831) 242-XXXX
   **Email**: mardet@dliflc.edu

   Walk-ins welcome when tutors are available.
   ```

### Step 7: Update Navigation (Left Menu)
1. Click **Edit** on the left navigation
2. Remove default links (Conversations, Notebook if not needed)
3. Add/keep:
   - Home
   - Book Session → [PowerApp URL]
   - My Progress → [PowerApp URL]
   - Resources → [Resources page]
   - Documents (if keeping)
   - Site contents (for admins only - consider hiding)

### Step 8: Apply Theme
1. Click **Settings** (gear icon) → **Change the look**
2. Select **Theme**:
   - Primary color: **#CC0000** (Marine Corps Scarlet)
   - If custom themes available, use scarlet/gold combo
3. **Header**:
   - Layout: Compact
   - Background: Site theme color

### Step 9: Publish
1. Click **Publish** or **Republish** in top right
2. Verify all links work
3. Test on mobile view (Preview → Mobile)

---

## Color Reference

| Element | Color | Hex |
|---------|-------|-----|
| Primary/Header | Marine Corps Scarlet | #CC0000 |
| Accent/Buttons | Gold | #FFD700 |
| Background | Light Gray | #F5F5F5 |
| Text | Dark Gray | #333333 |

---

## Assets Needed

1. **Hero Banner Image** (1920x600px recommended)
   - Marine Corps themed
   - EGA or DLI imagery
   - Scarlet/gold colors

2. **Icons** for Quick Links
   - Use built-in SharePoint icons or upload custom

---

## Mobile Considerations

- Hero image should look good cropped for mobile
- Quick links tiles stack vertically on mobile
- Test all sections in mobile preview before publishing

---

## Prompts for Claude (Chrome Extension)

Use these prompts when working with Claude for Chrome:

**Initial Setup:**
> "I'm customizing a SharePoint team site for Marine students. I need to add a hero section with a scarlet/gold Marine Corps theme, quick links for booking tutoring sessions, and a resources section. Walk me through each step."

**Hero Section:**
> "How do I add and configure a full-width hero web part in SharePoint Online with a custom background image and call-to-action button?"

**Quick Links:**
> "I want to add a Quick Links web part with tile layout showing 4 links: Book Session, My Progress, Study Resources, and Get Help. How do I configure icons and links for each?"

**Filtering Lists:**
> "Can I embed a SharePoint list on the home page that automatically filters to show only the current user's appointments? If not, what's the alternative?"

**Theme:**
> "How do I change the SharePoint site theme to use #CC0000 (scarlet) as the primary color?"

---

## Testing Checklist

- [ ] Hero displays correctly with image and button
- [ ] Quick links all navigate to correct destinations
- [ ] Appointments list shows (or PowerApp embed works)
- [ ] Resources section has all 9 languages
- [ ] News/announcements displays recent items
- [ ] Contact info is accurate
- [ ] Navigation menu updated
- [ ] Theme colors applied (scarlet header)
- [ ] Mobile view looks acceptable
- [ ] Page published and accessible to MARDET_Students group
