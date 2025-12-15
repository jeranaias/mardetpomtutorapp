# Power Automate Workflows - MARDET Tutoring System

## Overview

This document defines the automated workflows that support the MARDET Language Tutoring System PowerApp. All workflows run under the service account `pa.svc.mardet.tutoring`.

---

## Workflow Architecture

```
SharePoint Lists → Power Automate Triggers → Actions → Email/Updates

Appointments List:
  - New item created → Send confirmation
  - Modified (Status) → Send status change notification
  - AppointmentDate approaching → Send 24hr reminder
  
Daily Schedule:
  - 0800 daily → Check for appointments needing reminders
  - 1700 daily → Mark no-shows
  - Sunday 1800 → Send weekly digest to Tutor Chiefs
```

---

## Workflow 1: Appointment Confirmation Email

**Trigger**: When appointment is created in SharePoint  
**Purpose**: Send immediate confirmation to student and tutor  
**Frequency**: Each new appointment

### Flow Design

```
1. TRIGGER: When an item is created
   - List: Appointments
   - Condition: Status = "Scheduled"

2. GET: Student details
   - List: Students
   - Filter: ID = Appointments.StudentID

3. GET: Tutor details
   - List: Tutors
   - Filter: ID = Appointments.TutorID

4. CONDITION: Check if valid appointment
   - If AppointmentDate is not empty
   - And Duration > 0
   
5. SEND EMAIL: To Student
   - To: Student.Email
   - Subject: "Tutoring Appointment Confirmed - [Language]"
   - Body: [See template below]
   
6. SEND EMAIL: To Tutor
   - To: Tutor.Email
   - Subject: "New Tutoring Appointment - [Student Name]"
   - Body: [See template below]
   
7. UPDATE: Appointments list
   - Set field: NotificationSent = Yes
```

### Student Confirmation Email Template

```html
<html>
<body style="font-family: 'Segoe UI', Arial, sans-serif; color: #333;">
  <div style="background-color: #003E51; padding: 20px; color: white;">
    <h2>Tutoring Appointment Confirmed</h2>
  </div>
  
  <div style="padding: 20px;">
    <p>Dear <strong>@{Student.Rank} @{Student.FullName}</strong>,</p>
    
    <p>Your tutoring appointment has been confirmed:</p>
    
    <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #C5A572; margin: 20px 0;">
      <p><strong>Language:</strong> @{Student.Language}</p>
      <p><strong>Tutor:</strong> @{Tutor.Rank} @{Tutor.FullName}</p>
      <p><strong>Date & Time:</strong> @{formatDateTime(Appointments.AppointmentDate, 'dddd, MMMM dd, yyyy')} at @{formatDateTime(Appointments.AppointmentDate, 'HHmm')}</p>
      <p><strong>Duration:</strong> @{Appointments.Duration} minutes</p>
      <p><strong>Location:</strong> @{Appointments.Location}</p>
      @{if(equals(Appointments.Location, 'Online'), concat('<p><strong>Meeting Link:</strong> <a href="', Appointments.MeetingLink, '">Join Session</a></p>'), '')}
      <p><strong>Focus Areas:</strong> @{Appointments.FocusArea}</p>
    </div>
    
    @{if(not(empty(Appointments.BookingNotes)), concat('<p><strong>Your notes:</strong><br>', Appointments.BookingNotes, '</p>'), '')}
    
    <p><strong>Preparation Tips:</strong></p>
    <ul>
      <li>Review vocabulary from your current lesson</li>
      <li>Bring specific questions or challenges</li>
      <li>Complete any assigned pre-work</li>
    </ul>
    
    <p style="margin-top: 20px;">
      <a href="https://make.powerapps.com" style="background-color: #C5A572; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in App</a>
      <a href="mailto:@{Tutor.Email}?subject=Re: Tutoring Appointment @{formatDateTime(Appointments.AppointmentDate, 'yyyy-MM-dd')}" style="background-color: #003E51; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-left: 10px;">Email Tutor</a>
    </p>
    
    <p style="color: #666; font-size: 12px; margin-top: 30px;">
      Need to cancel? Open the app and cancel at least 24 hours in advance.<br>
      Questions? Contact your tutor or the Tutoring Center.
    </p>
  </div>
  
  <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
    <p>Marine Corps Detachment - Defense Language Institute<br>
    Monterey, California</p>
  </div>
</body>
</html>
```

### Tutor Notification Email Template

```html
<html>
<body style="font-family: 'Segoe UI', Arial, sans-serif; color: #333;">
  <div style="background-color: #003E51; padding: 20px; color: white;">
    <h2>New Tutoring Appointment</h2>
  </div>
  
  <div style="padding: 20px;">
    <p>Dear <strong>@{Tutor.Rank} @{Tutor.FullName}</strong>,</p>
    
    <p>A new tutoring appointment has been scheduled with you:</p>
    
    <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #C5A572; margin: 20px 0;">
      <p><strong>Student:</strong> @{Student.Rank} @{Student.FullName}</p>
      <p><strong>Language:</strong> @{Student.Language}</p>
      <p><strong>Class:</strong> @{Student.Class}</p>
      <p><strong>Company:</strong> @{Student.Company}</p>
      <p><strong>Date & Time:</strong> @{formatDateTime(Appointments.AppointmentDate, 'dddd, MMMM dd, yyyy')} at @{formatDateTime(Appointments.AppointmentDate, 'HHmm')}</p>
      <p><strong>Duration:</strong> @{Appointments.Duration} minutes</p>
      <p><strong>Location:</strong> @{Appointments.Location}</p>
      @{if(equals(Appointments.Location, 'Online'), concat('<p><strong>Meeting Link:</strong> <a href="', Appointments.MeetingLink, '">Join Session</a></p>'), '')}
      <p><strong>Focus Areas:</strong> @{Appointments.FocusArea}</p>
    </div>
    
    @{if(not(empty(Appointments.BookingNotes)), concat('<p><strong>Student notes:</strong><br>', Appointments.BookingNotes, '</p>'), '')}
    
    <p style="margin-top: 20px;">
      <a href="https://make.powerapps.com" style="background-color: #C5A572; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Schedule</a>
      <a href="mailto:@{Student.Email}?subject=Re: Tutoring Appointment @{formatDateTime(Appointments.AppointmentDate, 'yyyy-MM-dd')}" style="background-color: #003E51; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-left: 10px;">Email Student</a>
    </p>
    
    <p style="color: #666; font-size: 12px; margin-top: 30px;">
      This appointment was @{if(Appointments.CreatedByStudent, 'booked by the student', 'created by admin')}.<br>
      Remember to complete session notes after the appointment.
    </p>
  </div>
  
  <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
    <p>Marine Corps Detachment - Defense Language Institute<br>
    Monterey, California</p>
  </div>
</body>
</html>
```

---

## Workflow 2: 24-Hour Reminder

**Trigger**: Scheduled (runs daily at 0800)  
**Purpose**: Send reminder 24 hours before appointment  
**Frequency**: Daily

### Flow Design

```
1. TRIGGER: Recurrence
   - Frequency: Day
   - Interval: 1
   - Time: 08:00 (0800)
   
2. GET: Appointments needing reminders
   - List: Appointments
   - Filter: 
     * Status eq 'Scheduled'
     * ReminderSent eq false
     * AppointmentDate ge '@{addHours(utcNow(), 23)}'
     * AppointmentDate le '@{addHours(utcNow(), 25)}'
   
3. APPLY TO EACH: Appointment in results
   
4. GET: Student details
   - List: Students
   - Filter: ID = CurrentItem.StudentID
   
5. GET: Tutor details
   - List: Tutors
   - Filter: ID = CurrentItem.TutorID
   
6. SEND EMAIL: Reminder to Student
   - To: Student.Email
   - Subject: "Reminder: Tutoring Tomorrow at [Time]"
   - Body: [See template below]
   
7. SEND EMAIL: Reminder to Tutor
   - To: Tutor.Email
   - Subject: "Reminder: Session Tomorrow with [Student]"
   - Body: [See template below]
   
8. UPDATE: Appointments list
   - Item: CurrentItem.ID
   - ReminderSent: Yes
```

### Student Reminder Email Template

```html
<html>
<body style="font-family: 'Segoe UI', Arial, sans-serif; color: #333;">
  <div style="background-color: #FF9800; padding: 20px; color: white;">
    <h2>⏰ Reminder: Tutoring Appointment Tomorrow</h2>
  </div>
  
  <div style="padding: 20px;">
    <p>Dear <strong>@{Student.Rank} @{Student.FullName}</strong>,</p>
    
    <p>This is a reminder about your tutoring appointment:</p>
    
    <div style="background-color: #fff3e0; padding: 15px; border-left: 4px solid #FF9800; margin: 20px 0;">
      <p><strong>TOMORROW</strong></p>
      <p style="font-size: 18px;"><strong>@{formatDateTime(Appointments.AppointmentDate, 'HHmm')} (@{Appointments.Duration} min)</strong></p>
      <p><strong>Tutor:</strong> @{Tutor.Rank} @{Tutor.FullName}</p>
      <p><strong>Language:</strong> @{Student.Language}</p>
      <p><strong>Location:</strong> @{Appointments.Location}</p>
      @{if(equals(Appointments.Location, 'Online'), concat('<p><strong>Meeting Link:</strong> <a href="', Appointments.MeetingLink, '">Join Session</a></p>'), '')}
      <p><strong>Focus:</strong> @{Appointments.FocusArea}</p>
    </div>
    
    <p><strong>Before Your Session:</strong></p>
    <ul>
      <li>✅ Review materials from recent classes</li>
      <li>✅ Prepare specific questions</li>
      <li>✅ Bring notebook and textbook</li>
      @{if(equals(Appointments.Location, 'Online'), '<li>✅ Test your microphone and camera</li>', '<li>✅ Arrive 5 minutes early</li>')}
    </ul>
    
    <p style="margin-top: 20px;">
      <a href="https://make.powerapps.com" style="background-color: #FF9800; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Appointment</a>
    </p>
    
    <p style="color: #d84315; font-weight: bold; margin-top: 20px;">
      ⚠️ Can't make it? Cancel at least 4 hours in advance to avoid a no-show.
    </p>
  </div>
  
  <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
    <p>Marine Corps Detachment - Defense Language Institute</p>
  </div>
</body>
</html>
```

---

## Workflow 3: No-Show Detection

**Trigger**: Scheduled (runs daily at 1700)  
**Purpose**: Mark appointments as no-show if status not updated  
**Frequency**: Daily

### Flow Design

```
1. TRIGGER: Recurrence
   - Frequency: Day
   - Interval: 1
   - Time: 17:00 (1700)
   
2. GET: Appointments possibly no-shows
   - List: Appointments
   - Filter:
     * Status eq 'Scheduled'
     * AppointmentDate lt '@{utcNow()}'
     * AppointmentDate gt '@{addDays(utcNow(), -1)}'
   
3. APPLY TO EACH: Appointment in results
   
4. GET: Student details
   - List: Students
   - Filter: ID = CurrentItem.StudentID
   
5. GET: Tutor details
   - List: Tutors
   - Filter: ID = CurrentItem.TutorID
   
6. UPDATE: Appointments list
   - Item: CurrentItem.ID
   - Status: NoShow
   - CancellationReason: "Auto-marked as no-show - status not updated"
   
7. SEND EMAIL: To Student
   - To: Student.Email
   - Subject: "Missed Appointment - [Date]"
   - Body: [See template below]
   
8. SEND EMAIL: To Tutor
   - To: Tutor.Email
   - Subject: "Student No-Show - [Student Name]"
   - Body: Brief notification
   
9. CONDITION: Check no-show count
   - GET: Count of NoShow appointments for this student
   
10. IF: NoShow count >= 3
    - SEND EMAIL: To Tutor Chief
      - Subject: "Student with 3+ No-Shows: [Student Name]"
      - Body: Escalation notice with student details
```

### No-Show Email Template (Student)

```html
<html>
<body style="font-family: 'Segoe UI', Arial, sans-serif; color: #333;">
  <div style="background-color: #F44336; padding: 20px; color: white;">
    <h2>❌ Missed Tutoring Appointment</h2>
  </div>
  
  <div style="padding: 20px;">
    <p>Dear <strong>@{Student.Rank} @{Student.FullName}</strong>,</p>
    
    <p style="color: #d32f2f; font-weight: bold;">
      You missed your scheduled tutoring appointment:
    </p>
    
    <div style="background-color: #ffebee; padding: 15px; border-left: 4px solid #F44336; margin: 20px 0;">
      <p><strong>Date:</strong> @{formatDateTime(Appointments.AppointmentDate, 'dddd, MMMM dd, yyyy')}</p>
      <p><strong>Time:</strong> @{formatDateTime(Appointments.AppointmentDate, 'HHmm')}</p>
      <p><strong>Tutor:</strong> @{Tutor.Rank} @{Tutor.FullName}</p>
      <p><strong>Duration:</strong> @{Appointments.Duration} minutes</p>
    </div>
    
    <p><strong>This appointment has been marked as a no-show.</strong></p>
    
    <p style="background-color: #fff9c4; padding: 10px; border-left: 3px solid #FFC107;">
      ⚠️ <strong>Important:</strong> Multiple no-shows may result in temporary suspension from tutoring services. 
      Always cancel appointments at least 4 hours in advance if you cannot attend.
    </p>
    
    <p>If you believe this was marked incorrectly, please contact your tutor or the Tutoring Center immediately.</p>
    
    <p style="margin-top: 20px;">
      <a href="https://make.powerapps.com" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Book Next Appointment</a>
    </p>
  </div>
  
  <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
    <p>Marine Corps Detachment - Defense Language Institute</p>
  </div>
</body>
</html>
```

---

## Workflow 4: Status Change Notification

**Trigger**: When appointment modified in SharePoint  
**Purpose**: Notify relevant parties of cancellations or changes  
**Frequency**: Each status change

### Flow Design

```
1. TRIGGER: When an item is modified
   - List: Appointments
   - Specific column: Status
   
2. CONDITION: Check if Status changed
   - Status is not equal to @{triggerBody()?['Status/Value']}
   
3. GET: Student and Tutor details
   
4. SWITCH: Based on new Status value
   
   CASE: Cancelled
     - SEND EMAIL: To Student
       - Subject: "Appointment Cancelled - [Date]"
       - Body: Cancellation confirmation
     - SEND EMAIL: To Tutor
       - Subject: "Appointment Cancelled - [Student]"
       - Body: Cancellation notice
       
   CASE: Completed
     - SEND EMAIL: To Tutor
       - Subject: "Reminder: Complete Session Notes"
       - Body: Link to session notes form
       
   CASE: NoShow
     - (Handled by Workflow 3)
       
   DEFAULT:
     - Do nothing
```

### Cancellation Email Template

```html
<html>
<body style="font-family: 'Segoe UI', Arial, sans-serif; color: #333;">
  <div style="background-color: #FF5722; padding: 20px; color: white;">
    <h2>Appointment Cancelled</h2>
  </div>
  
  <div style="padding: 20px;">
    <p>Dear <strong>@{Student.Rank} @{Student.FullName}</strong>,</p>
    
    <p>Your tutoring appointment has been cancelled:</p>
    
    <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #FF5722; margin: 20px 0;">
      <p><strong>Date & Time:</strong> @{formatDateTime(Appointments.AppointmentDate, 'dddd, MMMM dd, yyyy')} at @{formatDateTime(Appointments.AppointmentDate, 'HHmm')}</p>
      <p><strong>Tutor:</strong> @{Tutor.Rank} @{Tutor.FullName}</p>
      <p><strong>Duration:</strong> @{Appointments.Duration} minutes</p>
      @{if(not(empty(Appointments.CancellationReason)), concat('<p><strong>Reason:</strong> ', Appointments.CancellationReason, '</p>'), '')}
    </div>
    
    <p>You can book a new appointment anytime through the tutoring system.</p>
    
    <p style="margin-top: 20px;">
      <a href="https://make.powerapps.com" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Book New Appointment</a>
    </p>
  </div>
  
  <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
    <p>Marine Corps Detachment - Defense Language Institute</p>
  </div>
</body>
</html>
```

---

## Workflow 5: Weekly Digest (Tutor Chiefs)

**Trigger**: Scheduled (Sunday 1800)  
**Purpose**: Summary report of week's activity  
**Frequency**: Weekly

### Flow Design

```
1. TRIGGER: Recurrence
   - Frequency: Week
   - Days: Sunday
   - Time: 18:00 (1800)
   
2. INITIALIZE VARIABLES:
   - varWeekStart: @{addDays(utcNow(), -7)}
   - varWeekEnd: @{utcNow()}
   
3. GET: All appointments this week
   - List: Appointments
   - Filter:
     * AppointmentDate ge '@{varWeekStart}'
     * AppointmentDate le '@{varWeekEnd}'
     
4. COMPOSE: Calculate statistics
   - Total appointments: @{length(body('Get_appointments'))}
   - Completed: @{length(filter(body('Get_appointments'), equals(item()?['Status'], 'Completed')))}
   - Cancelled: @{length(filter(body('Get_appointments'), equals(item()?['Status'], 'Cancelled')))}
   - No-shows: @{length(filter(body('Get_appointments'), equals(item()?['Status'], 'NoShow')))}
   - Scheduled (upcoming): @{length(filter(body('Get_appointments'), equals(item()?['Status'], 'Scheduled')))}
   
5. GET: Session notes completed
   - List: SessionNotes
   - Filter: SessionDate ge '@{varWeekStart}'
   
6. GET: Tutors
   - List: Tutors
   - Filter: Status eq 'Active'
   
7. APPLY TO EACH: Tutor
   - Calculate tutor's weekly hours
   - Calculate utilization rate
   
8. COMPOSE: HTML table of tutor statistics
   
9. GET: Tutor Chief emails
   - List: Tutors
   - Filter: Rank eq 'MGySgt' or Email contains 'chief'
   
10. SEND EMAIL: Weekly digest
    - To: Tutor Chief distribution list
    - Subject: "Weekly Tutoring Summary - Week of [Date]"
    - Body: [See template below]
```

### Weekly Digest Email Template

```html
<html>
<body style="font-family: 'Segoe UI', Arial, sans-serif; color: #333;">
  <div style="background-color: #003E51; padding: 20px; color: white;">
    <h2>📊 Weekly Tutoring Summary</h2>
    <p>Week of @{formatDateTime(varWeekStart, 'MMMM dd')} - @{formatDateTime(varWeekEnd, 'MMMM dd, yyyy')}</p>
  </div>
  
  <div style="padding: 20px;">
    <h3>Appointment Statistics</h3>
    
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tr style="background-color: #f5f5f5;">
        <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Metric</th>
        <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Count</th>
        <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Percentage</th>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;">Total Appointments</td>
        <td style="padding: 10px; text-align: center; border: 1px solid #ddd; font-weight: bold;">@{variables('totalAppointments')}</td>
        <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">100%</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;">✅ Completed</td>
        <td style="padding: 10px; text-align: center; border: 1px solid #ddd; color: #4CAF50; font-weight: bold;">@{variables('completedCount')}</td>
        <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">@{div(mul(variables('completedCount'), 100), variables('totalAppointments'))}%</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;">📅 Scheduled (Upcoming)</td>
        <td style="padding: 10px; text-align: center; border: 1px solid #ddd; color: #2196F3; font-weight: bold;">@{variables('scheduledCount')}</td>
        <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">@{div(mul(variables('scheduledCount'), 100), variables('totalAppointments'))}%</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;">❌ Cancelled</td>
        <td style="padding: 10px; text-align: center; border: 1px solid #ddd; color: #FF9800; font-weight: bold;">@{variables('cancelledCount')}</td>
        <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">@{div(mul(variables('cancelledCount'), 100), variables('totalAppointments'))}%</td>
      </tr>
      <tr style="background-color: #ffebee;">
        <td style="padding: 10px; border: 1px solid #ddd;">🚫 No-Shows</td>
        <td style="padding: 10px; text-align: center; border: 1px solid #ddd; color: #F44336; font-weight: bold;">@{variables('noshowCount')}</td>
        <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">@{div(mul(variables('noshowCount'), 100), variables('totalAppointments'))}%</td>
      </tr>
    </table>
    
    <h3>Tutor Utilization</h3>
    
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tr style="background-color: #f5f5f5;">
        <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Tutor</th>
        <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Languages</th>
        <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Sessions</th>
        <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Hours</th>
        <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Utilization</th>
      </tr>
      @{variables('tutorStatsHTML')}
    </table>
    
    <h3>Session Notes Completion</h3>
    <p>
      <strong>@{variables('notesCompletedCount')}</strong> of @{variables('completedCount')} completed sessions have notes 
      (<strong>@{div(mul(variables('notesCompletedCount'), 100), variables('completedCount'))}%</strong>)
    </p>
    
    @{if(less(div(mul(variables('notesCompletedCount'), 100), variables('completedCount')), 95), 
      '<p style="background-color: #fff3e0; padding: 10px; border-left: 3px solid #FF9800;">⚠️ Note: Target completion rate is 95%. Please remind tutors to complete session notes promptly.</p>', 
      '<p style="background-color: #e8f5e9; padding: 10px; border-left: 3px solid #4CAF50;">✅ Great job! Session notes completion rate meets target.</p>'
    )}
    
    <h3>Action Items</h3>
    <ul>
      @{if(greater(variables('noshowCount'), 0), '<li>Follow up with students who had no-shows</li>', '')}
      @{if(less(div(mul(variables('notesCompletedCount'), 100), variables('completedCount')), 95), '<li>Remind tutors to complete session notes</li>', '')}
      @{if(greater(length(variables('lowUtilizationTutors')), 0), '<li>Review tutors with <50% utilization</li>', '')}
    </ul>
    
    <p style="margin-top: 30px;">
      <a href="https://make.powerapps.com" style="background-color: #C5A572; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Full Dashboard</a>
    </p>
  </div>
  
  <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
    <p>This report is generated automatically every Sunday at 1800.<br>
    Marine Corps Detachment - Defense Language Institute</p>
  </div>
</body>
</html>
```

---

## Configuration Steps

### 1. Create Each Workflow

For each workflow above:

1. Navigate to https://make.powerautomate.com
2. Click **+ Create** → **Automated cloud flow** (or Scheduled for time-based)
3. Name the flow per workflow name
4. Select trigger type
5. Build flow per design
6. Save and test

### 2. Configure Service Account

All workflows must run as `pa.svc.mardet.tutoring`:

1. Create workflow in personal account first
2. Export as solution
3. Import to service account environment
4. Verify connections
5. Turn on

### 3. Email Configuration

Request DCSIT grant send permissions:
- Service account: `pa.svc.mardet.tutoring@dliflc.edu`
- Send on behalf of: `mardet@dliflc.edu`
- Or send as: `no-reply-tutoring@dliflc.edu`

---

## Testing Procedures

### Test Workflow 1 (Confirmation)
1. Create test appointment in PowerApp
2. Verify student receives confirmation within 1 minute
3. Verify tutor receives notification
4. Check appointment.NotificationSent = Yes

### Test Workflow 2 (24hr Reminder)
1. Create appointment for tomorrow
2. Wait for 0800 trigger OR manually run flow
3. Verify both parties receive reminder
4. Check appointment.ReminderSent = Yes

### Test Workflow 3 (No-Show Detection)
1. Create appointment for yesterday, leave Status = Scheduled
2. Wait for 1700 trigger OR manually run flow
3. Verify status changed to NoShow
4. Verify student received no-show email

### Test Workflow 4 (Status Change)
1. Change appointment status to Cancelled
2. Verify cancellation emails sent
3. Change status to Completed
4. Verify tutor receives session notes reminder

### Test Workflow 5 (Weekly Digest)
1. Create sample appointments for past week
2. Manually trigger flow
3. Verify Tutor Chief receives digest
4. Check statistics accuracy

---

## Deployment Checklist

- [ ] All 5 workflows created
- [ ] Tested individually
- [ ] Service account configured
- [ ] Email permissions granted
- [ ] Connections verified
- [ ] Workflows turned on
- [ ] Error handling tested
- [ ] Email templates reviewed
- [ ] Tutor Chief distribution list confirmed
- [ ] Documentation updated

---

## Monitoring & Maintenance

### Daily
- Check flow run history for errors
- Monitor email delivery rates

### Weekly
- Review no-show trends
- Check reminder delivery success rate
- Verify digest generation

### Monthly
- Update email templates if needed
- Review trigger schedules
- Optimize flow performance

---

**Workflows are now fully documented. Proceed to Segment 5 for PowerBI dashboards.**
