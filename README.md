# Lumière — Finishing School Management System

A complete, commercial-grade web application for managing a personality development and grooming school.

---

## Features

### 📊 Dashboard
- Live statistics: students, revenue, courses, outstanding dues
- Revenue trend chart (6-month line graph)
- Course enrollment bar chart
- Student status pie chart
- Upcoming sessions feed
- Recent activity log

### 👩‍🎓 Students
- Full student enrollment with all details
- Search and filter by status, course
- View detailed student profile
- Edit student records
- Delete students with confirmation
- Payment status tracking

### 📚 Courses
- Visual course cards with color coding
- Create, edit, and delete courses
- Topic/curriculum management
- Seat capacity with progress bars
- View enrolled students per course
- Instructor assignment

### 📅 Schedule
- Appointment booking for sessions
- Today / Upcoming / All filters
- Confirm/Pending status management
- One-click appointment confirmation
- Instructor assignment
- Session notes

### 💳 Payments
- Invoice generation
- Revenue split pie chart
- Overdue alerts with quick-pay actions
- Mark invoices as paid (syncs student payment status)
- Filter by status
- Invoice detail modal

### ⚙️ Settings
- School profile management
- Admin profile & password
- Instructor management
- Notification toggles
- Payment preferences (late fees, grace period, UPI)

---

## Tech Stack

- **React 18** — UI framework
- **Vite** — Build tool
- **Recharts** — Charts and analytics
- **Lucide React** — Icons
- **Context API + useReducer** — State management
- No backend required — all state is managed client-side

---

## Quick Start (Local)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# http://localhost:5173
```

---

## Deploy to Netlify (Recommended)

### Option A: Drag & Drop (Fastest)
```bash
npm run build
```
Then drag the `dist/` folder to [netlify.com/drop](https://app.netlify.com/drop)

### Option B: Git Integration
1. Push this folder to a GitHub/GitLab repo
2. Go to [netlify.com](https://netlify.com) → New site from Git
3. Connect your repo
4. Build settings are auto-detected from `netlify.toml`
5. Click **Deploy**

---

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or connect your GitHub repo at [vercel.com](https://vercel.com).

---

## Deploy to GitHub Pages

```bash
# 1. Add to package.json scripts:
#    "deploy": "vite build && gh-pages -d dist"

# 2. Install gh-pages
npm install --save-dev gh-pages

# 3. Deploy
npm run deploy
```

---

## Project Structure

```
lumiere/
├── src/
│   ├── components/
│   │   ├── UI.jsx          # Reusable components (Button, Modal, Table, etc.)
│   │   ├── Sidebar.jsx     # Navigation sidebar
│   │   └── Header.jsx      # Top header bar
│   ├── context/
│   │   └── AppContext.jsx  # Global state management + seed data
│   ├── pages/
│   │   ├── Dashboard.jsx   # Analytics overview
│   │   ├── Students.jsx    # Student management
│   │   ├── Courses.jsx     # Course/curriculum management
│   │   ├── Schedule.jsx    # Appointment scheduling
│   │   ├── Payments.jsx    # Invoice & payment tracking
│   │   └── Settings.jsx    # School settings
│   ├── App.jsx             # Root component + layout
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles + design tokens
├── index.html
├── vite.config.js
├── netlify.toml            # Netlify deployment config
├── vercel.json             # Vercel deployment config
└── package.json
```

---

## Customisation

### Change School Name & Branding
Edit `src/components/Sidebar.jsx` — update the brand name.
Edit `index.html` — update the `<title>` tag.

### Add Real Backend / Database
The app uses in-memory state. To persist data:
- Replace `AppContext.jsx` reducer calls with API calls (REST or GraphQL)
- Connect to Firebase, Supabase, or your own Node/Express backend

### Change Currency
Update `₹` symbols in `Payments.jsx` and `Courses.jsx` to your currency.

---

## License
Commercial use permitted. Customize freely for your institution.
