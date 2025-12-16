# Segment 6: Approval System

Chain-of-command approval workflows for special requests.

---

## Status: Not Yet Built

This segment will be documented when built.

---

## Planned Approval Flows

### Approval 1: Extended Session Request
- **When:** Student requests >90 minute session
- **Approvers:** Tutor Lead → NCOIC
- **Outcome:** Approved/Denied with comments

### Approval 2: Off-Hours Tutoring
- **When:** Session requested outside normal hours
- **Approvers:** Tutor → NCOIC
- **Outcome:** Approved/Denied

### Approval 3: Special Accommodations
- **When:** Student needs special arrangements
- **Approvers:** NCOIC → OIC
- **Outcome:** Approved/Denied with conditions

### Approval 4: Resource Request
- **When:** Tutor requests new materials/resources
- **Approvers:** Tutor Lead → Budget Approver
- **Outcome:** Approved/Denied/Deferred

---

## Implementation Options

### Option A: Power Automate Approvals
- Built-in approval actions
- Teams/Outlook integration
- Mobile app support

### Option B: SharePoint List + Power Automate
- Custom approval list
- More flexibility
- Better audit trail

### Option C: PowerApp Screen
- In-app approval interface
- Real-time status
- Requires PowerApp modification

---

## Prerequisites

- Power Automate with Approvals connector
- SharePoint lists created (Segment 2)
- PowerApp created (Segment 3)
- Defined approval chain (who approves what)

---

## Files (To Be Added)

- `approval-flows/` - Exported flow packages
- `approval-matrix.md` - Who approves what

