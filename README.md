# Haider · Portfolio

React + Vite portfolio with a Google / Material inspired design.

## Run it
```bash
npm install
npm run dev      # local dev server at http://localhost:5173
npm run build    # production build in /dist
```

## Edit content
Everything (bio, experience, projects, skills, links) lives in `src/data/content.js`.
Search for `REPLACE_` to fill in your email, LinkedIn, GitHub, résumé, and project links.

## Structure
```
src/
  App.jsx              page layout
  data/content.js      all text and links
  components/          Navbar, Hero, About, Experience, Projects, Skills, Contact, Footer
  hooks/               theme toggle, scroll reveal, typewriter
  utils/siteSearch.js  hero search + "I'm Feeling Lucky"
  styles/global.css    colors, dark mode, buttons, chips
```

## Deploy
Push to GitHub and import into Vercel or Netlify (build: `npm run build`, output: `dist`).
