[![CodeQL](https://github.com/ob1lan/FindingsManager/actions/workflows/codeql.yml/badge.svg)](https://github.com/ob1lan/FindingsManager/actions/workflows/codeql.yml)
# FindingsManager
Currently in DRAFT
# TO DO
- Add an admin menu and find out how to handle the roles
- Add a due date to the findings and conditional coloring in the table
- Allow admins to create/delete users
- Allow admins to change logo and other settings (maybe)
- Allow admins to view user's activity (log everything then)
- Allow users to change their password
- Import findings from CSV (no file upload, all in the client)
- Report on findings using a PDF template (with branding)
- Create a dashboard chart for issue type / OWASP Category (use several Top 10)
- Refactor the visual to fully use Bootstrap (see their examples)
- dropdowns : use svg icons or colored circles (cf bootstrap examples)
- Settings: policies in setting to calculate due date by computing the creation date
- SAML auth support
- User profile:
    - add the user's created findings (last 5)
    - add the user's assigned findings (last 5)
    - add the user's created projects (last 5)
    - add new fields (phone, location, prefered language)
    - correct the picture upload (only when clicking on the picture + hover animation with UL logo)
    - Notification preferences (checkboxes)
    - Audit data (last login + UA + location + IP)
- move the profile page and related code to a separate file to match /me/ URL/path