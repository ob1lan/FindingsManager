[![njsscan sarif](https://github.com/ob1lan/FindingsManager/actions/workflows/njsscan.yml/badge.svg)](https://github.com/ob1lan/FindingsManager/actions/workflows/njsscan.yml) [![CodeQL](https://github.com/ob1lan/FindingsManager/actions/workflows/codeql.yml/badge.svg)](https://github.com/ob1lan/FindingsManager/actions/workflows/codeql.yml)
# FindingsManager
Currently in DRAFT
# TO DO
- Findings table: add a feature to select multiple findings and perform actions on them (change status, etc.)
- Findings table: add a new contextual menu to send a finding to another user (email summary)
- Make sure the function to create a PDF report can be reused (transform as an standalone API)
- Ability to see how many findings per products per projects (in table + in dashboard)
- Add the same feature as the Findings table to other tables (right-click, double-click, etc.)
- Add an 'Active engagements' dashboard widget (ongoing projects)
- Dashboard: last 7 days charts/cards (new findings, fixed findings, etc.)
- Email to finding's assignee & creator when a finding changes status
- Fix logging of auth activities and flash message on user profile after password change, 2FA toggle, etc.
- Integrate and use CWE and CWE IDs if possible
- Work on the Admin settings visual (cards as for the profile page)
- Finish the Overdue findings report (dashboard widget), and do the same for the other statuses
- Fix the resize screen issues (responsiveness not mastered yet)
- Add a feature to securely attach files to findings (pictures, PDF, etc.) + limit +remove them as needed+test
- Add more features to the finding table (actions on selected findings, etc.)
- Refactor OTP and forgot password to match the login card style
- Change the icons used on the profile page (password change, 2FA toggle, etc.)
- Add a feature to set the fixed date in the finding details, based on the status (filled when Remediated) or manually
- From the above, get a trend graph of findings fixed on time vs overdue + how long it took to fix
- Add a feature/action to share/send a finding to another user (summary in email), button on the finding details modal
- Add a feature to toggle from pie chart to another chart type by clicking the card
- Add a 'show more' button under the Last logins list on the profile page (display a table with all logins events)
- Consider refactoring and use JWT to authenticate users (instead of sessions)
- Use email templates and harmonize the email content (use the same template for all emails) and helpers
- Allow admins to change logo and other settings (maybe)
- Allow admins to view user's activity (log every action then)
- Report on project's findings using a PDF template (with branding)
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
- Refactor findings table to only use datatable buttons (custom action to open modals) + double click to open finding details
- refactor datatable without jQuery (use npm to instal packages)
- error in modal in case something goes wrong during password change (using Flash)
- dashboard horizontal bar chart: projects findings by status
- clean unused code and simplify/harmonize the code and make it consistent
- variables CSS for color themes (consistent)

# Default credentials
- admin@example.com:MySup3rStr0ngP@$$w0rd