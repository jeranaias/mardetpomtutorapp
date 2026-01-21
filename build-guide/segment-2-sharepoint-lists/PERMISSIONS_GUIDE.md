# SharePoint List Permissions Guide

Configure list-level permissions to control who can view and edit each list.

---

## Permission Levels Reference

| Level | Can Do |
|-------|--------|
| **Full Control** | Everything - manage permissions, delete list |
| **Edit** | Add, edit, delete items |
| **Contribute** | Add and edit items (not delete) |
| **Read** | View only |

---

## Groups Reference

| SharePoint Group | Contains | Default Permission |
|------------------|----------|-------------------|
| MCD Owners | MARDET_Admins | Full Control |
| MCD Members | MARDET_TutorChiefs, MARDET_Tutors | Edit |
| MCD Visitors | MARDET_Students | Read |

---

## Recommended List Permissions

### Lists That Need Custom Permissions

| List | Break Inheritance? | Who Gets Access | Permission Level |
|------|-------------------|-----------------|------------------|
| **Tutors** | ✅ Yes | Admins, TutorChiefs, Tutors | Edit |
| | | Students | ❌ No Access |
| **Students** | ✅ Yes | Admins, TutorChiefs, Tutors | Edit |
| | | Students | ❌ No Access |
| **SessionNotes** | ✅ Yes | Admins, TutorChiefs, Tutors | Edit |
| | | Students | ❌ No Access |
| **Appointments** | ❌ No | All groups | Inherit (Read/Edit via app) |
| **ProgressTracking** | ❌ No | All groups | Inherit (filtered in app) |
| **Resources** | ❌ No | All groups | Inherit (everyone can view) |

---

## How to Set List Permissions

### Step 1: Open List Settings
1. Navigate to the list
2. Click **⚙️ Settings** (gear icon) → **List settings**
3. Under "Permissions and Management", click **Permissions for this list**

### Step 2: Break Inheritance
1. In the ribbon/toolbar, click **Stop Inheriting Permissions**
2. Click **OK** on the warning dialog
3. The list now has independent permissions

### Step 3: Remove Unwanted Groups
1. Check the box next to groups you want to remove (e.g., MCD Visitors)
2. Click **Remove User Permissions** in the toolbar
3. Confirm removal

### Step 4: Verify Remaining Permissions
After removal, verify these groups remain:

**For Tutors, Students, SessionNotes lists:**
- MCD Owners → Full Control
- MARDET_TutorChiefs → Edit
- MARDET_Tutors → Edit

---

## Step-by-Step: Tutors List

1. Go to **Tutors** list
2. **⚙️ Settings** → **List settings**
3. Click **Permissions for this list**
4. Click **Stop Inheriting Permissions** → OK
5. Check **MCD Visitors** → **Remove User Permissions**
6. Verify MCD Owners and MCD Members remain
7. Done - Students can no longer see tutor details

---

## Step-by-Step: Students List

1. Go to **Students** list
2. **⚙️ Settings** → **List settings**
3. Click **Permissions for this list**
4. Click **Stop Inheriting Permissions** → OK
5. Check **MCD Visitors** → **Remove User Permissions**
6. Verify MCD Owners and MCD Members remain
7. Done - Students can no longer see other students' PII

---

## Step-by-Step: SessionNotes List

1. Go to **SessionNotes** list
2. **⚙️ Settings** → **List settings**
3. Click **Permissions for this list**
4. Click **Stop Inheriting Permissions** → OK
5. Check **MCD Visitors** → **Remove User Permissions**
6. Verify MCD Owners and MCD Members remain
7. Done - Students cannot see session notes directly

---

## Why These Permissions?

| List | Reasoning |
|------|-----------|
| **Tutors** | Contains tutor contact info, schedules - students don't need direct access |
| **Students** | Contains PII (phone, grades) - students shouldn't see each other's data |
| **SessionNotes** | Contains tutor assessments - students access filtered view via PowerApp only |
| **Appointments** | All users need to see/create appointments - filtered in PowerApp by user |
| **ProgressTracking** | Students see own progress via PowerApp - list filtered by logged-in user |
| **Resources** | Public study materials - everyone can view |

---

## Testing Permissions

After configuring, test with a user from each group:

### Test as Student (MCD Visitors)
- [ ] Can access Appointments list ✓
- [ ] Can access ProgressTracking list ✓
- [ ] Can access Resources list ✓
- [ ] Cannot access Tutors list ✗
- [ ] Cannot access Students list ✗
- [ ] Cannot access SessionNotes list ✗

### Test as Tutor (MCD Members)
- [ ] Can access all 6 lists ✓
- [ ] Can edit Appointments ✓
- [ ] Can add SessionNotes ✓

### Test as Admin (MCD Owners)
- [ ] Full access to all lists ✓
- [ ] Can modify permissions ✓

---

## Troubleshooting

### "Access Denied" after removing permissions
- User may be cached - have them sign out and back in
- Check if user is in the correct M365 group

### User can still see restricted list
- Verify inheritance was broken
- Check if user has direct permissions (not just group)
- Clear browser cache

### PowerApp can't access list
- Service account needs permissions to all lists
- Add pa.svc.mardet.tutoring@dliflc.edu with Edit permission

---

## Service Account Permissions

The service account needs access to all lists for PowerApp/Power Automate to work:

**pa.svc.mardet.tutoring@dliflc.edu** → Add to MCD Owners (or grant Edit on each list)

---

*Last updated: January 2026*
