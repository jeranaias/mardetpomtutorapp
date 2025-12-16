# SharePoint Lists Import

Import these CSV files to create the 6 SharePoint lists for the MARDET Tutoring System.

## Import Order

Import in this order (due to relationships):

1. **Tutors.csv** - Tutor roster
2. **Students.csv** - Student roster
3. **Resources.csv** - Study materials library
4. **Appointments.csv** - Tutoring sessions
5. **SessionNotes.csv** - Post-session notes
6. **ProgressTracking.csv** - Student progress snapshots

## How to Import

For each CSV file:

1. Go to your SharePoint site: https://dliflc01.sharepoint.com/sites/MCD
2. Click **New** → **List**
3. Select **From Excel**
4. Upload the CSV file
5. Review columns and click **Create**

## After Import

1. Delete the sample data rows (keep one if needed for testing)
2. Set permissions:
   - **Tutors/Students/Progress**: Restrict to tutors and staff
   - **Resources**: Read access for all Marines
   - **Appointments**: Tutors can edit, students can add

## List Relationships

After creating all lists, you may want to add lookup columns:
- Appointments → link to Tutors list and Students list
- SessionNotes → link to Appointments list
- ProgressTracking → link to Students list

These can be added via List Settings → Create Column → Lookup.
