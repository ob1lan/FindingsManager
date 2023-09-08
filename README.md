[![njsscan sarif](https://github.com/ob1lan/FindingsManager/actions/workflows/njsscan.yml/badge.svg)](https://github.com/ob1lan/FindingsManager/actions/workflows/njsscan.yml) [![CodeQL](https://github.com/ob1lan/FindingsManager/actions/workflows/codeql.yml/badge.svg)](https://github.com/ob1lan/FindingsManager/actions/workflows/codeql.yml)
# FindingsManager
Currently in DRAFT
# TO DO
- Refactor registration form to match login's style + same with OTP and forgot password (use JS to update the card)
- Consider refactoring and use JWT to authenticate users (instead of sessions)
- Handle environment variables to configure ports, hostname, etc...
- Use email templates and harmize the email content (use the same template for all emails) and helpers
- Allow admins to change logo and other settings (maybe)
- Allow admins to view user's activity (log every action then)
- Report on findings using a PDF template (with branding)
- Create a dashboard chart for issue type / OWASP Category (use several Top 10)
- Refactor the visual to fully use Bootstrap (see their examples)
- dropdowns : use svg icons or colored circles (cf bootstrap examples)
- Settings: policies in setting to calculate due date by computing the creation date
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
- Dashboard: add a view on findings approaching due date (3 days)
- Project: add the ability to mention team members
- Export feature: refactor to use a modal with ability to chose filters (project, status, etc.)
- Findings table: add the ability to select multiple findings at once and bulk action (change status, delete,...)
- Refactor findings table to only use datatable buttons (custom action to open modals) + double click to open finding details
- refactor datatable without jQuery (use npm to instal packages)
- add confirmation modal for user delete
- delete old avatar on avatar change
- error in modal in case something goes wrong during password change (using Flash)
- explore datatable rendering from server-side (instead of HTML table)
- explore modal/html rendering from MongoDB (automatically generate HTML from fields in DB)
- dashboard horizontal bar chart: projects findings by status
- clean unused code and simplify/harmonize the code and make it consistent
- variables CSS for color themes (consistent)

# Default credentials
- admin@example.com:MySup3rStr0ngP@$$w0rd