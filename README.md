# AI INFOTECH – Enterprise Website & Recruitment Portal

An enterprise website and recruitment portal developed for **AI INFOTECH**. The project includes a responsive corporate website, recruiter authentication, candidate management powered by Supabase, and a contact form integrated with EmailJS.

---

## Live Demo

Deployed on Vercel
>
```
>https://aiinfotechweb1.vercel.app/
```

---

# Features

### Corporate Website
- Modern responsive landing page
- Dark / Light mode
- About Us
- Services
- Careers
- Contact Us
- Smooth animations
- Mobile responsive design

### Recruitment Portal
- Recruiter Authentication
- Candidate Management
- Candidate Applications
- Secure Supabase Database
- Row Level Security (RLS)

### Contact Form
- EmailJS integration
- Form validation
- Loading state
- Success/Error notifications
- Sends enquiries directly to the configured email

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion

## Backend

- Supabase
- PostgreSQL
- Supabase Authentication
- Supabase Storage

## Email Service

- EmailJS

## Deployment

- Vercel

---

# Project Structure

```
.
├── src/
├── public/
├── supabase/
│   ├── migrations/
│   └── functions/
├── assets/
├── .env.example
├── package.json
├── vite.config.ts
└── README.md
```

---

# Requirements

- Node.js 18+
- npm
- Git
- Supabase Account
- EmailJS Account
- Vercel Account (optional)

---

# Installation

Clone the repository

```bash
git clone https://github.com/Arya42-cmd/aiinfotechweb1.git
```

Move into the project

```bash
cd aiinfotechweb1
```

Install dependencies

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the project root.

Copy the contents from `.env.example`.

Required variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url

VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id

VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id

VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

---

# Supabase Setup

Create a new Supabase project.

Install the Supabase CLI.

Login

```bash
supabase login
```

Link your project

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

Run database migrations

```bash
supabase db push
```

This will automatically create:

- Database Tables
- Policies
- Row Level Security
- Storage Configuration
- Required Database Objects

---

# EmailJS Setup

Create a free EmailJS account.

Create

- Email Service
- Email Template

Configure the template variables:

```
{{name}}

{{email}}

{{subject}}

{{message}}
```

Update your `.env`

```
VITE_EMAILJS_SERVICE_ID=

VITE_EMAILJS_TEMPLATE_ID=

VITE_EMAILJS_PUBLIC_KEY=
```

---

# Local Development

Run

```bash
npm run dev
```

Application runs at

```
http://localhost:3000
```

or

```
http://localhost:5173
```

depending on your Vite configuration.

---

# Production Build

```bash
npm run build
```

Preview production build

```bash
npm run preview
```

---

# Security Notes

The repository intentionally excludes:

- `.env`
- API Keys
- EmailJS Credentials
- Supabase Secrets

Only `.env.example` is included.

---

# Git Ignore

Ensure the following are ignored:

```
.env
node_modules
dist
```

---

# Future Improvements

- Resume Upload
- Recruiter Dashboard Analytics
- Candidate Status Tracking
- Interview Scheduling
- AI Resume Screening
- Email Notifications
- Admin Dashboard

---



