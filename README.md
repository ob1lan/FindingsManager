[![njsscan sarif](https://github.com/ob1lan/FindingsManager/actions/workflows/njsscan.yml/badge.svg)](https://github.com/ob1lan/FindingsManager/actions/workflows/njsscan.yml) [![CodeQL](https://github.com/ob1lan/FindingsManager/actions/workflows/codeql.yml/badge.svg)](https://github.com/ob1lan/FindingsManager/actions/workflows/codeql.yml)
# FindingsManager
Currently in DRAFT
# TO DO
- Finish the Overdue findings report (dashboard widget)
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
- Ensure the Admin - SMTP Setttings page is showing the same as the others Admin menu pages
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
    - add new fields (phone, location, prefered language) + handle their TZ 
    - Notification preferences (checkboxes)
    - Audit data (last login + UA + location + IP) + modal to see more
- set the max size for inputs (project name, finding name, etc.)
- set the max size for uploads (CSV and pictures)
- implement protections for NoSQL injections (cf security findings)
- make CSV import more robust (check for required fields, replace with System values, etc.)
- Project: add the ability to mention team members
- Export feature: refactor to use a modal with ability to chose filters (project, status, etc.)
- Refactor findings table to only use datatable buttons (custom action to open modals) + double click to open finding details
- refactor datatable without jQuery (use npm to instal packages)
- delete old avatar on avatar change
- error in modal in case something goes wrong during password change (using Flash)
- dashboard horizontal bar chart: projects findings by status
- clean unused code and simplify/harmonize the code and make it consistent
- variables CSS for color themes (consistent)

# Default credentials
- admin@example.com:MySup3rStr0ngP@$$w0rd