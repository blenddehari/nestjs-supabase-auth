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
- **ORM**: Prisma
- **Storage**: Supabase Storage for profile pictures

## Project Structure

This project is organized as a monorepo with the following structure:

```
nestjs-supabase-auth/
├── packages/
│   ├── backend/         # NestJS backend
│   │   ├── prisma/      # Prisma schema and migrations
│   │   └── src/         # Backend source code
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

2. Create a `.env` file in the `packages/backend` directory with the following variables:

```
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_key
SUPABASE_JWT_SECRET=your_jwt_secret

# Prisma
DATABASE_URL=postgresql://postgres:your_password@your_supabase_host:5432/postgres
DIRECT_URL=postgresql://postgres:your_password@your_supabase_direct_host:5432/postgres

# Frontend
FRONTEND_URL=http://localhost:3001
```

### Database Setup

1. Run the SQL migrations in `packages/backend/prisma/migrations/manual/migration.sql` in your Supabase SQL editor.
2. Generate the Prisma client:

```bash
cd packages/backend
npx prisma generate
```

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

## Database Management with Prisma

This project uses Prisma ORM to interact with the Supabase PostgreSQL database. Since Supabase doesn't allow direct connections for migrations from external networks, we use a hybrid approach:

1. Define the database schema in `packages/backend/prisma/schema.prisma`
2. Create manual SQL migrations in `packages/backend/prisma/migrations/manual/migration.sql`
3. Run these migrations in the Supabase SQL editor
4. Generate the Prisma client to interact with the database:

```bash
cd packages/backend
npm run prisma:generate
```

### Connection URLs

For Prisma to work correctly with Supabase, we use two different connection URLs:

- `DATABASE_URL`: Used by the Prisma Client for normal database operations
- `DIRECT_URL`: Used for migrations and introspection (when available)

If you're working in an environment where direct connections to the database are possible (e.g., within Supabase's network), you can use the `DIRECT_URL` to run migrations directly:

```bash
npx prisma migrate dev
```

Otherwise, you'll need to manually apply the SQL migrations through the Supabase SQL editor.

To explore your database with Prisma Studio (requires direct database access):

```bash
npm run prisma:studio
```

## Usage

1. Register a new account or log in with existing credentials
2. Complete your professional profile
3. Browse the professionals directory to find and connect with others

## License

This project is licensed under the MIT License - see the LICENSE file for details.
