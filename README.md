# Nursing Mentorship - Gibbs' Reflective Cycle

A full-fledged Next.js application with Supabase authentication and database for nursing mentorship using Gibbs' Reflective Cycle framework.

## Features

- ✨ **Beautiful UI** - Ocean-themed healthcare aesthetics with glass morphism effects
- 🔐 **Authentication** - Secure email/password authentication with Supabase
- 📝 **Reflection Management** - Create, edit, and track reflections through 6 phases
- 💾 **Auto-save** - Automatic saving of reflection content
- 📊 **Progress Tracking** - Visual progress indicators for each reflection
- 🎨 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ⚡ **Server-Side Rendering** - Fast page loads with Next.js 14

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Vanilla CSS with CSS Custom Properties
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### 1. Clone and Install

```bash
# Navigate to project directory
cd c-computer-science-Website-gibbs

# Install dependencies
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once your project is ready, go to **Settings** → **API**
3. Copy your **Project URL** and **anon/public key**

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set Up Database

1. In your Supabase project, go to **SQL Editor**
2. Create a new query
3. Copy the contents of `supabase-migration.sql`
4. Paste and run the SQL script

This will create:
- `profiles` table for user profiles
- `reflections` table for reflection data
- Row Level Security (RLS) policies
- Necessary indexes and triggers

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── (auth)/
│   │   ├── login/          # Login page
│   │   └── register/       # Registration page
│   ├── dashboard/          # Dashboard page
│   ├── reflection/[id]/    # Reflection detail page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
├── components/
│   ├── dashboard/          # Dashboard components
│   ├── reflection/         # Reflection components
│   ├── Navbar.tsx          # Navigation component
│   └── GibbsCycle.tsx      # Animated cycle visualization
├── lib/
│   ├── supabase/           # Supabase client configuration
│   └── utils/              # Utility functions
├── types/                  # TypeScript type definitions
├── public/                 # Static assets
└── middleware.ts           # Auth middleware

```

## The Six Phases of Gibbs' Reflective Cycle

1. **Description** - What happened?
2. **Feelings** - What were you thinking and feeling?
3. **Evaluation** - What was good and bad?
4. **Analysis** - What sense can you make of it?
5. **Conclusion** - What else could you have done?
6. **Action Plan** - What will you do next time?

## Usage

### Creating a Reflection

1. Register or log in to your account
2. Click "New Reflection" on the dashboard
3. Enter a meaningful title for your reflection
4. Work through each of the 6 phases
5. Your progress is automatically saved

### Managing Reflections

- **View All**: See all your reflections on the dashboard
- **Continue**: Resume incomplete reflections
- **Review**: View completed reflections
- **Delete**: Remove reflections you no longer need

## Building for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings
4. Deploy!

### Environment Variables for Production

Make sure to add these in your deployment platform:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Customization

### Changing Colors

Edit CSS custom properties in `app/globals.css`:

```css
:root {
  --primary-500: #14b8a6;  /* Main teal color */
  --secondary-500: #0ea5e9; /* Ocean blue */
  /* ... more colors */
}
```

### Adding OAuth Providers

To add Google, GitHub, or other OAuth providers:

1. Configure providers in Supabase Dashboard → Authentication → Providers
2. Update login/register pages to include OAuth buttons
3. Use `supabase.auth.signInWithOAuth({ provider: 'google' })`

## Troubleshooting

### "Failed to fetch" errors

- Check that your Supabase URL and anon key are correct
- Verify your Supabase project is active
- Check browser console for CORS errors

### Authentication not working

- Verify RLS policies are set up correctly
- Check that email confirmation is disabled (or handle confirmation emails)
- Ensure middleware is protecting the correct routes

### Database errors

- Run the migration script again
- Check Supabase logs in the dashboard
- Verify table structure matches TypeScript types

## License

This project is for educational purposes.

## Support

For issues or questions, please check the Supabase documentation or Next.js documentation.

---

Built with ❤️ for nursing professionals
