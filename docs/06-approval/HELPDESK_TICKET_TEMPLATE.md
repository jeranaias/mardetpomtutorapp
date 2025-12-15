# Helpdesk Ticket Template - PowerApp Approval Request

## How to Submit

1. Navigate to: https://dliflc.service-now.com
2. Click "Create Incident" or "New Request"
3. Category: **PowerApps / Power Platform**
4. Copy and paste the template below
5. Attach: CYBERSECURITY_PACKAGE.md

---

## TICKET TEMPLATE

**Subject:** PowerApp Cybersecurity Approval Request - MARDET Tutoring System

**Priority:** Medium

**Category:** PowerApps / Power Platform

**Subcategory:** New Application Approval

**Requested By:** Marine Corps Detachment E-9 / [Your Name]

**Contact Email:** mardet_admin@dliflc.edu

**Contact Phone:** (831) 242-XXXX

---

### Description

**Request Type:** Authorization to Operate (ATO) for new PowerApp

**Application Name:** MARDET - Language Tutoring System

**Purpose:** Appointment scheduling and session tracking for Marine Corps language tutoring program

**Urgency:** Implementation requested within 30 days to support 400 students and 30 tutors

---

### System Details

**Platform:** Microsoft Power Platform (PowerApps, Power Automate, Power BI)

**License Type:** M365 Seeded (Canvas App only, no premium connectors)

**Service Account:** pa.svc.mardet.tutoring (request DCSIT create)

**Data Storage:** SharePoint Online (DLIFLC tenant)

**User Base:** 
- ~400 Marine Corps students
- ~30 language tutors
- ~10 administrators and leadership

**Data Classification:** UNCLASSIFIED (no classified or SPII)

**Network:** NIPRNET only

**Authentication:** CAC / Azure AD SSO

---

### Components to Approve

1. **PowerApp Canvas Application**
   - Name: "MARDET - Language Tutoring System"
   - Functionality: Appointment booking, schedule management, progress tracking
   - Data Source: SharePoint Lists (6 custom lists)
   - No external connectors
   - No file uploads
   - No custom code

2. **SharePoint Lists (6 total)**
   - Tutors
   - Students
   - Appointments
   - SessionNotes
   - ProgressTracking
   - Resources
   - Location: https://dliflc.sharepoint.com/sites/MarDet

3. **Power Automate Workflows (5 total)**
   - Appointment confirmation emails
   - 24-hour reminders
   - No-show detection
   - Status change notifications
   - Weekly digest reports
   - Email scope: @dliflc.edu domain only

4. **Power BI Dashboards (3 total)**
   - Executive dashboard
   - Operations dashboard
   - Student progress dashboard
   - Row-level security enabled
   - Daily refresh at 0600

5. **Public Website (Optional/Informational)**
   - Static HTML/JS hosted on GitHub Pages
   - No authentication required
   - Resource library and information only
   - No data collection
   - Link: https://[github-username].github.io/dli-tutoring

---

### Security Posture

**Risk Level:** LOW

**Justification:**
- No classified information
- No sensitive PII (only name, rank, email)
- CAC authentication required
- Encryption at rest (AES-256) and in transit (TLS 1.2+)
- Microsoft-managed security controls
- Role-based access control (RBAC)
- Comprehensive audit logging
- No custom code or external APIs
- Limited to internal users only

**Compliance:**
- DoD 8500.01 (Cybersecurity)
- FISMA Low Impact
- DoD 5400.11-R (Privacy)
- DLIFLC IT Policy for PowerApps

---

### Required Actions

**From DCSIT:**
1. Create service account: pa.svc.mardet.tutoring
   - Email: pa.svc.mardet.tutoring@dliflc.edu
   - License: Power Apps (included with M365)
   - MFA: Exempt (service account)
   - Password: 25+ character complex, quarterly rotation

2. Grant email send permissions:
   - "Send on behalf of" mardet@dliflc.edu
   - Or send as: no-reply-tutoring@dliflc.edu

3. Create Azure AD Security Groups:
   - MARDET_Students (~400 users)
   - MARDET_Tutors (~30 users)
   - MARDET_TutorChiefs (~7 users)
   - MARDET_Admins (~3 users)

4. Review and approve SharePoint site permissions
   - Site: https://dliflc.sharepoint.com/sites/MarDet
   - Service account: Full Control
   - Security groups: Appropriate permissions per role

**From Cybersecurity Office:**
1. Review attached security package (CYBERSECURITY_PACKAGE.md)
2. Conduct security assessment if required
3. Issue Authorization to Operate (ATO)
4. Add to continuous monitoring program

**From Privacy Office:**
1. Review data handling procedures
2. Confirm no Privacy Impact Assessment (PIA) required
3. Validate SORN coverage

---

### Timeline

**Requested Deployment Date:** [Insert Date - suggest 30 days from submission]

**Key Milestones:**
- Day 0: Submit ticket and security package
- Day 7: DCSIT creates service account and security groups
- Day 14: Cybersecurity review complete
- Day 21: Privacy review complete (if required)
- Day 28: ATO issued
- Day 30: Deploy to production

**Flexibility:** Can adjust timeline based on approval process

---

### Attached Documents

- [✅] CYBERSECURITY_PACKAGE.md (comprehensive security documentation)
- [✅] System Architecture Diagram (embedded in package)
- [✅] Data Flow Diagram (embedded in package)
- [✅] SharePoint List Schema (from Segment 2)
- [✅] User Role Matrix (from Segment 3)

---

### Business Justification

**Problem Statement:**
The Marine Corps Detachment currently manages tutoring appointments manually via email and phone calls, resulting in:
- Double-booking conflicts
- No-show appointments without tracking
- Inconsistent session documentation
- No visibility into tutor utilization
- Lack of progress tracking metrics
- Administrative burden on tutors and staff

**Proposed Solution:**
Implement a comprehensive PowerApp-based system that:
- Automates appointment scheduling with conflict detection
- Sends automated reminders to reduce no-shows
- Standardizes session documentation
- Provides real-time utilization dashboards
- Tracks student academic progress
- Reduces administrative overhead by ~10 hours/week

**Expected Benefits:**
- 20% reduction in no-show rate
- 100% conflict-free scheduling
- 95%+ session documentation compliance
- Real-time metrics for leadership decisions
- Improved student academic support
- Better tutor workload balancing

**Impact if Not Approved:**
- Continue manual processes (inefficient)
- No data-driven decision making
- Continued scheduling conflicts
- Lack of accountability for no-shows
- Poor visibility into program effectiveness

---

### Success Metrics

**Post-Deployment (90 days):**
- System adoption: 80%+ of students use app
- No-show rate: Reduced to <10%
- Session notes: 95%+ completion
- User satisfaction: 4.0/5.0 average rating
- Support tickets: <5 per week
- Tutor time savings: 2 hours/week per tutor

---

### Support & Maintenance

**Primary Contact:** Marine Corps Detachment E-9

**Technical Lead:** [System Developer] (through contract end, ~1 year)

**Long-term Ownership:** 
- Successor to [System Developer] billet (E-6)
- Tutor Chief oversight
- DCSIT for infrastructure support

**Annual Review:** Committed to annual security review and ATO renewal

**Training Plan:** User training guide provided (Segment 7)

**Documentation:** Complete system documentation provided (Segments 1-7)

---

### Additional Notes

**Why PowerApps?**
- Approved DoD/DLIFLC platform (no new software acquisition)
- Rapid development (built in 4-6 weeks vs 6+ months custom)
- No ATO required for infrastructure (Microsoft-managed)
- Native CAC integration
- M365 seeded licensing (no additional cost)
- DCSIT familiar with platform

**Alternatives Considered:**
- Custom web application: 6-12 month ATO process, significant cost
- Commercial off-the-shelf (COTS): Licensing fees, limited customization
- Continue manual process: Inefficient, no metrics

**PowerApps Selected Because:**
- Fastest to deploy
- Lowest cost (included in M365)
- Already approved platform
- Easy to maintain
- Meets all functional requirements

---

### Questions for Reviewer

1. Are there any additional security controls required beyond those documented?
2. Is a formal penetration test required, or is Microsoft's assessment sufficient?
3. Should we schedule a walkthrough demonstration for the Cybersecurity Office?
4. Is there a preferred format for the ATO documentation?
5. What is the typical timeline for PowerApp approvals at DLIFLC?

---

### Acknowledgments

- [  ] I confirm all information provided is accurate
- [  ] I have attached the complete security package
- [  ] I understand annual reviews are required
- [  ] I commit to following DLIFLC IT policies
- [  ] I will report all security incidents immediately

**Submitted By:** [Your Name]  
**Date:** [Submission Date]  
**Signature:** [Digital or Physical]

---

## After Submission

### Next Steps

1. **Helpdesk Response (1-2 business days)**
   - Ticket assigned to PowerApps specialist
   - Initial review of request
   - Request for any missing information

2. **DCSIT Review (3-5 business days)**
   - Technical feasibility assessment
   - Service account creation
   - Security group setup
   - SharePoint permissions review

3. **Cybersecurity Review (7-14 business days)**
   - Security package evaluation
   - Risk assessment
   - Compliance verification
   - ATO decision

4. **Privacy Review (if required, 3-5 business days)**
   - Data handling review
   - PIA determination
   - SORN coverage verification

5. **Final Approval & Deployment**
   - ATO issued
   - Service account credentials provided
   - Deployment authorization
   - Go-live coordination

### Expected Outcome

**Best Case:** Approval in 14-21 days  
**Typical Case:** Approval in 21-30 days  
**Worst Case:** Additional requirements, 30-45 days

---

## Template Version

**Version:** 1.0  
**Last Updated:** December 2025  
**Next Review:** Annual or when DLIFLC policy changes

---

**Copy everything above this line into your ServiceNow ticket.**
