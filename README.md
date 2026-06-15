 ## Portfolio — Rohit
 
> Built a dark-themed developer portfolio with fluid animations and cursor interactions, serving project data dynamically from a MySQL database via Express.
 
---
 
## Tech Stack
 
**Frontend**
- React (Vite)
- CSS Modules
- Framer Motion
- Lenis
- GSAP
**Backend**
- Express.js
- cors
- dotenv
- nodemon
**Database**
- MySQL — Aiven (cloud-hosted)
- mysql2
**Deployment**
- Render
- Aiven
---
 
## Features
 
- Custom magnetic cursor with fluid tracking
- Smooth scroll via Lenis
- Text reveal animations on scroll
- Page transitions with Framer Motion
- Dynamic project data served from MySQL via REST API
- Contact form powered by Resend (email delivery)
- Dark minimal aesthetic inspired by aristidebenoist.com
---
 
## Project Structure
 
```
portfolio/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vite.config.js      # Proxy to Express in dev
├── server/                 # Express backend
│   ├── routes/
│   ├── middleware/
│   └── index.js
├── .env
├── package.json
└── README.md
```
 
---
 
## Deployment
 
- Frontend is built with `npm run build` and served as static files by Express
- Hosted on **Render** (single service, one port)
- Database hosted on **Aiven** (MySQL 8.0)
