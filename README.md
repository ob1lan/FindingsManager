[![njsscan sarif](https://github.com/ob1lan/FindingsManager/actions/workflows/njsscan.yml/badge.svg)](https://github.com/ob1lan/FindingsManager/actions/workflows/njsscan.yml)

[![CodeQL](https://github.com/ob1lan/FindingsManager/actions/workflows/codeql.yml/badge.svg)](https://github.com/ob1lan/FindingsManager/actions/workflows/codeql.yml)
# FindingsManager
Currently in DRAFT
# TO DO
- Add a due date to the findings and conditional coloring in the table
- Allow admins to create/delete users
- Allow admins to change logo and other settings (maybe)
- Allow admins to view user's activity (log every action then)
- Allow users to change their password
- Report on findings using a PDF template (with branding)
- Create a dashboard chart for issue type / OWASP Category (use several Top 10)
- Refactor the visual to fully use Bootstrap (see their examples)
- dropdowns : use svg icons or colored circles (cf bootstrap examples)
- Settings: policies in setting to calculate due date by computing the creation date
- SAML auth support
- User profile:
    - add the user's created findings 5 by 5 (pagination)
    - add the user's assigned findings 5 by 5 (pagination)
    - add the user's created projects 5 by 5 (pagination)
    - add new fields (phone, location, prefered language)
    - correct the picture upload (only when clicking on the picture + hover animation with UL logo)
    - Notification preferences (checkboxes)
    - Audit data (last login + UA + location + IP)
- move the profile page and related code to a separate file to match /me/ URL/path
- set the max size for inputs (project name, finding name, etc.)
- set the max size for uploads (CSV and pictures)
