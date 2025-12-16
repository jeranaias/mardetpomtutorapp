# Segment 4: Power Automate

Automated workflows for the tutoring system.

---

## Status: Not Yet Built

This segment will be documented when built.

---

## Planned Flows

### Flow 1: Appointment Reminder
- **Trigger:** Scheduled (daily at 6 AM)
- **Action:** Email students/tutors about today's appointments
- **Notify:** 24 hours and 1 hour before

### Flow 2: Session Completion Alert
- **Trigger:** When Appointment status changes to "Completed"
- **Action:** Notify tutor to add session notes
- **Timeout:** Remind again if no notes after 24 hours

### Flow 3: Weekly Digest
- **Trigger:** Scheduled (Monday 7 AM)
- **Action:** Email tutors their weekly schedule
- **Include:** Upcoming appointments, pending notes count

### Flow 4: No-Show Notification
- **Trigger:** When Appointment status changes to "NoShow"
- **Action:** Notify student's chain of command
- **Log:** Record in separate tracking list

### Flow 5: Stats Sync to GitHub
- **Trigger:** Scheduled (daily) or manual
- **Action:** Query SharePoint lists, update stats.json via GitHub API
- **Updates:** Public site stats display

### Flow 6: New Student Welcome
- **Trigger:** When item added to Students list
- **Action:** Send welcome email with tutoring info
- **Include:** How to book, resources link

---

## Prerequisites

- Power Automate license (included in most M365 plans)
- SharePoint lists created (Segment 2)
- PowerApp created (Segment 3)
- GitHub Personal Access Token (for stats sync)

---

## Files (To Be Added)

- `flow-templates/` - Exported flow packages
- `github-stats-sync.md` - Detailed GitHub API setup

