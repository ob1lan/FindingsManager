[![njsscan sarif](https://github.com/ob1lan/FindingsManager/actions/workflows/njsscan.yml/badge.svg)](https://github.com/ob1lan/FindingsManager/actions/workflows/njsscan.yml) [![CodeQL](https://github.com/ob1lan/FindingsManager/actions/workflows/codeql.yml/badge.svg)](https://github.com/ob1lan/FindingsManager/actions/workflows/codeql.yml)

# FindingsManager

Currently in DRAFT

# TO DO

- Handle the case when there are no SMTP settings yet
- Handle the case when there are no projects yet
- Handle the case when there are no products yet
- Fix the Settings form submission (currently, it does not work)
- Calculate DueDate should take the createdAt instead of today
- Implement finding's reference link (if exists, transform the reference into a link)
- Review BFF recommendations on the findings controller (and continue with others)
  - Expand on the Data Type Consistency point, particularly focusing on the use of references in MongoDB schemas with Mongoose
    - From this, rework the different controllers to use the same data types (e.g. use ObjectId instead of string for project ID)
- Switch to HTML emails with nodemailer instead of plain text
- Ask for remediation/accepted/declined reason when changing status to any of these
- Review the content and formating of findings shared by email and reported in PDF via the context menu
- Finish the context menu actions
- Findings table: add a feature to select multiple findings and perform actions on them (change status, etc.)
- Findings table context menu: try to make menu items conditional
- Add the same feature as the Findings table to other tables (right-click, double-click, etc.)
- Add an 'Active engagements' dashboard widget (ongoing projects)
- Dashboard: last 7 days charts/cards (new findings, fixed findings, etc. like in Jira)
- Fix logging of auth activities and flash message on user profile after password change, 2FA toggle, etc.
- Integrate and use CWE and CWE IDs if possible
- Work on the Admin settings visual (cards as for the profile page)
- Fix responsiveness
- Add a feature to securely attach files to findings (pictures, PDF, etc.) + limit +remove them as needed+test
- Refactor OTP and forgot password to match the login card style
- From the above, get a trend graph of findings fixed on time vs overdue + how long it took to fix
- Add a feature to toggle from pie chart to another chart type by clicking the card
- Consider refactoring and use JWT to authenticate users (instead of sessions)
- Use email templates and harmonize the email content (use the same template for all emails) and helpers
- Allow admins to change logo and other settings (maybe)
- Allow admins to view user's activity (log every action then)
- Create a dashboard chart for issue type / OWASP Category (use several Top 10)
- Refactor the visual to fully use Bootstrap (see their examples)
- dropdowns : use svg icons or colored circles (cf bootstrap examples)
- SAML auth support
- User profile:
  - add the user's created projects 5 by 5 (pagination sliding effect)
  - add new fields (location, prefered language) + handle their TZ
  - Notification preferences (checkboxes)
- set the max size for inputs (project name, finding name, etc.)
- set the max size for uploads (CSV and pictures)
- implement protections for NoSQL injections (cf security findings)
- make CSV import more robust (check for required fields, replace with System values, etc.)
- Project: add the ability to mention team members
- Export feature: refactor to use a modal with ability to chose filters (project, status, etc.)
- error in modal in case something goes wrong during password change (using Flash)
- variables CSS for color themes (consistent)
- Investigate the use of an AI product to read a PDF report and create findings automatically

# Default credentials

- admin@example.com:MySup3rStr0ngP@$$w0rd
