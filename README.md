# Maintenance Issue Logger

A production-ready web application for property management companies to track and manage maintenance issues.

## 🚀 Features

- ✅ **Submit Issue Form** - Property, Category, Urgency, Description, Photo Upload
- ✅ **Dashboard View** - Table with all issues, color-coded urgency and status
- ✅ **Status Management** - Update status (Open/In Progress/Resolved) with dropdown
- ✅ **Filter System** - Filter by Property or Urgency
- ✅ **Auto Ticket Numbers** - Unique MNT-YYYYMMDD-XXXX format
- ✅ **Mobile Responsive** - Works on all devices
- ✅ **Supabase Database** - Persistent data storage

## 📋 Requirements

- Node.js 18+
- Supabase account (free tier)
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

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 5. Run development server

```bash
npm run dev
```

Open http://localhost:3001

## 🚀 Deployment to Vercel

1. Push code to GitHub
2. Import repository to Vercel
3. Add environment variables
4. Deploy

## 📁 Project Structure

```
maintenance-issue-logger/
├── app/
│   ├── api/
│   │   ├── issues/route.js      # GET/POST for issues
│   │   ├── update-status/route.js # PATCH for status updates
│   │   └── upload/route.js       # File upload API
│   ├── submit/page.js            # Submit issue form
│   ├── layout.js                 # Root layout
│   ├── page.js                   # Dashboard
│   └── globals.css
├── components/
│   ├── IssueTable.jsx            # Dashboard table
│   ├── UrgencyBadge.jsx          # Color-coded urgency
│   ├── StatusBadge.jsx           # Color-coded status
│   └── FileUpload.jsx            # File upload component
├── lib/
│   ├── supabase.js               # Supabase client
│   ├── validation.js             # Form validation
│   └── dateUtils.js              # Date utilities
└── public/uploads/               # Uploaded files
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