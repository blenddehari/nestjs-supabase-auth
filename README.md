# Professional Networking Platform

A networking platform for professionals to showcase their experience, skills, and connect with others in their industry.

## Features

- **User Authentication**: Secure login and registration using Supabase Auth
- **Professional Profiles**: Create and manage your professional profile
  - Add your bio, headline, and contact information
  - Showcase your skills and experience
  - Upload a profile picture
  - Set your current professional status (looking for jobs, hiring, etc.)
- **Professional Directory**: Browse and search for professionals
  - Filter by status, skills, and more
  - View detailed professional profiles
  - Connect with professionals through provided contact information

## Tech Stack

- **Frontend**: Vue.js 3 with Composition API
- **Backend**: NestJS
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **Storage**: Supabase Storage for profile pictures

## Project Structure

This project is organized as a monorepo with the following structure:

```
nestjs-supabase-auth/
├── packages/
│   ├── backend/         # NestJS backend
│   ├── frontend/        # Vue.js frontend
│   └── supabase/        # Supabase configuration
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Supabase account and project

### Environment Setup

1. Create a `.env` file in the root directory with the following variables:

```
# Backend
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_key
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3001

# Frontend
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

### Database Setup

1. Run the SQL migrations in `packages/backend/src/database/migrations/profiles.sql` in your Supabase SQL editor.

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development servers:

```bash
npm run dev
```

This will start both the frontend and backend servers concurrently.

- Frontend: http://localhost:3001
- Backend: http://localhost:3000

## Usage

1. Register a new account or log in with existing credentials
2. Complete your professional profile
3. Browse the professionals directory to find and connect with others

## License

This project is licensed under the MIT License - see the LICENSE file for details.
