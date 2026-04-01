# Maintenance Suite | Deluxe Stays

A production-ready, premium internal web application designed for property management teams to track, assign, and resolve maintenance issues across multiple properties.

## 🚀 Features

- ✅ **Premium UI/UX** - Glassmorphism aesthetics, custom animations, and a responsive custom background.
- ✅ **Dark/Light Mode** - Persistent `class`-based dark mode switching for optimal visibility.
- ✅ **Real Email Integration** - Automatic SMTP confirmation emails (via Nodemailer) sent directly to users upon ticket submission.
- ✅ **Submit Issue Form** - Property selection (Mountain Heights, Sunset Apartments, etc.), Category, Urgency level, Description, and Photo Upload handling.
- ✅ **Dashboard View** - Dynamic table with all issues, intelligent filtering, and pulsing color-coded status/urgency badges.
- ✅ **Status Management** - Inline dropdowns to update status (Open/In Progress/Resolved).
- ✅ **Data Export** - One-click CSV export for offline analysis and reporting.
- ✅ **Supabase Database** - Persistent, real-time data storage configuration.
- ✅ **Custom Typography** - Styled seamlessly with Nunito Sans for a professional Deluxe Homes brand match.

## 📋 Requirements

- Node.js 18+
- Supabase account (free tier)
- Gmail account with an App Password (for SMTP email sending)
- Vercel account (for deployment)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/muhammedafsalpm/maintenance-issue-logger.git
cd maintenance-issue-logger
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create account at supabase.com
2. Create a new project
3. Run the SQL from `schema.sql` to create the `maintenance_issues` table
4. Get your project URL and anon key

### 4. Configure environment variables

Create `.env.local` in the root directory:

```bash
# Supabase Connection
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Gmail SMTP for Email Confirmations
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_gmail_app_password

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_SITE_NAME=Maintenance Suite
```

### 5. Run development server

```bash
npm run dev
```

The application is explicitly configured to boot on **Port 3001** to prevent conflicts.
Open [http://localhost:3001](http://localhost:3001) in your browser.

## 🚀 Deployment to Vercel

1. Push code to GitHub
2. Import repository to Vercel
3. Add ALL environment variables from your `.env.local` directly into the Vercel project settings.
4. Deploy

## 📁 Project Structure

```
maintenance-issue-logger/
├── app/
│   ├── api/
│   │   ├── issues/route.js        # GET/POST for issues
│   │   ├── send-email/route.js    # POST for dynamic Nodemailer emails
│   │   ├── update-status/route.js # PATCH for status updates
│   │   └── upload/route.js        # File upload API
│   ├── submit/page.js             # Submit issue form
│   ├── layout.js                  # Root layout & Nunito Sans config
│   ├── page.js                    # Professional Dashboard
│   └── globals.css                # Base Tailwind & custom glassmorphism Theme
├── components/
│   ├── DarkModeToggle.jsx         # Custom theme switcher
│   ├── ExportCSV.jsx              # CSV Data export utility
│   ├── IssueTable.jsx             # Dashboard table
│   ├── UrgencyBadge.jsx           # Pulsing urgency component
│   ├── StatusBadge.jsx            # Color-coded status component
│   └── FileUpload.jsx             # File upload UI
├── lib/
│   ├── supabase.js                # Supabase client
│   ├── validation.js              # Zod/Custom Form validation
│   └── dateUtils.js               # Date utilities
└── public/
    └── maintenance-bg.jpg         # Custom application background
```

## 📊 Database Schema

```sql
CREATE TABLE maintenance_issues (
  id BIGSERIAL PRIMARY KEY,
  ticket_number TEXT UNIQUE NOT NULL,
  property_name TEXT NOT NULL,
  category TEXT NOT NULL,
  urgency TEXT NOT NULL,
  description TEXT NOT NULL,
  photo_url TEXT,
  status TEXT DEFAULT 'Open',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 📝 License

MIT