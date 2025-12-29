# EliteSolutions Website

This repository contains the static front-end and a small Node backend for the EliteSolutions marketing site.

## Overview

- Responsive marketing website (HTML/CSS/JS) with pages for Home, Services, Portfolio, and Contact.
- Plain JavaScript for interactivity, Tailwind used via CDN for rapid styling, and small backend to handle contact form submissions.
- Recent improvements include a Clerk sign-in guard, a professional footer with social links, and a dynamic footer year.

## Repository Structure

- `index.html` — homepage
- `services.html`, `portfolio.html`, `contact.html` — site pages
- `main.js`, `shared.js`, `contact.js` — client-side JavaScript
- `light-mode.css` — alternate theme styles
- `backend/` — Node backend for form handling (see below)
- `resources/` — images and static assets
- `github.md` — generated commit log
- `README.md` — this file

## Local Development

Static preview (quick):

```powershell
cd "C:\Users\HP\Downloads\elitesolutions_website"
python -m http.server 8000
# open http://localhost:8000
```

Backend (contact form):

```powershell
cd backend
npm install
# create a .env with SMTP credentials: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
npm start
```

The backend listens on port `3000` by default and exposes `/send-email` for contact form POSTs.

## Notable Code & Files

- `main.js` — site initialization, Clerk sign-in guard (`initializeClerkGuard()`), and dynamic footer year (`initializeFooterYear()`).
- `contact.js` — contact form validation and submission logic.
- `github.md` — concise commit history generated in the repository root.

## Deployment

For static-only deployments (Vercel, Netlify, GitHub Pages) deploy the site root. If using the `backend/`, deploy it to a Node-capable host and update the contact form `fetch` URL to point to the deployed backend.

## Security

- Do not commit secrets (PATs, SMTP passwords) into the repository.
- Revoke any PATs shared during setup at: https://github.com/settings/tokens. Use SSH or a credential helper for future pushes.

## Contributing

- Fork, create a branch, make changes, and open a pull request. Keep commits focused and descriptive.

## License

MIT (add a `LICENSE` file if needed).

---

Generated and updated on 2025-12-29.
