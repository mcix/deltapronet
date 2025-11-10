# DeltaProNet - Skills Database Platform

A comprehensive Next.js application for managing a curated database of skilled engineers and professionals. Built with TypeScript, Prisma, NextAuth.js, and shadcn/ui.

## Features

- 🔐 **LinkedIn OAuth Authentication** - Users can sign in with LinkedIn to claim their profiles
- 👥 **User Profiles** - Comprehensive profiles with education, experience, and bio
- ⭐ **Skills Rating System** - 1-5 star rating for each skill across multiple expertise areas
- 💬 **Comments & Reviews** - Users can leave comments on profiles (moderated)
- ❓ **Q&A Forum** - Community discussion with moderated questions and answers
- 🛡️ **Curator Dashboard** - Full moderation and user management for curators
- 📱 **Mobile-Friendly** - Responsive design that works on all devices
- 🎨 **Apple-Inspired Design** - Using custom color scheme with light/dark mode support

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Neon PostgreSQL database
- LinkedIn Developer App credentials

### Installation

1. **Clone the repository**

\`\`\`bash
git clone <your-repo-url>
cd deltapronet
\`\`\`

2. **Install dependencies**

\`\`\`bash
npm install
\`\`\`

3. **Set up environment variables**

Create a `.env` file in the root directory:

\`\`\`env
# Database
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"

# LinkedIn OAuth
LINKEDIN_CLIENT_ID="your-linkedin-client-id"
LINKEDIN_CLIENT_SECRET="your-linkedin-client-secret"
\`\`\`

**Generate NEXTAUTH_SECRET**:
\`\`\`bash
openssl rand -base64 32
\`\`\`

### LinkedIn OAuth Setup

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Create a new app or use an existing one
3. Add OAuth 2.0 redirect URLs:
   - Development: `http://localhost:3000/api/auth/callback/linkedin`
   - Production: `https://your-domain.com/api/auth/callback/linkedin`
4. Request access to OpenID Connect scope (openid, profile, email)
5. Copy the Client ID and Client Secret to your `.env` file

### Database Setup

1. **Push the schema to your database**

\`\`\`bash
npm run db:push
\`\`\`

2. **Seed the database with initial data**

\`\`\`bash
npm run db:seed
\`\`\`

This will create:
- 4 expertise areas (Technical Architect, Electronica, Mechanica, Software)
- All predefined skills for each area
- 3 initial user profiles (unclaimed)

### Development

Run the development server:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Database Management

- **Prisma Studio**: \`npm run db:studio\` - Visual database editor
- **Push schema**: \`npm run db:push\` - Push schema changes to database
- **Seed database**: \`npm run db:seed\` - Populate with initial data

## Project Structure

\`\`\`
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── auth/            # NextAuth.js configuration
│   │   ├── users/           # User management endpoints
│   │   ├── comments/        # Comment moderation endpoints
│   │   ├── questions/       # Q&A endpoints
│   │   └── answers/         # Answer endpoints
│   ├── people/              # User directory and profiles
│   ├── questions/           # Q&A forum
│   ├── curator/             # Curator dashboard
│   ├── dashboard/           # User dashboard
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── navigation.tsx       # Main navigation
│   ├── footer.tsx           # Footer component
│   ├── skill-rating.tsx     # Star rating component
│   └── ...                  # Other components
├── lib/                     # Utility functions
│   ├── prisma.ts           # Prisma client
│   ├── auth.ts             # Auth configuration
│   └── utils.ts            # Helper functions
├── prisma/                  # Database schema and seeds
│   ├── schema.prisma       # Prisma schema
│   └── seed.ts             # Database seeding script
├── public/                  # Static assets
└── middleware.ts            # Route protection middleware
\`\`\`

## User Roles

### USER (Default)
- View all public profiles and content
- Claim their own profile
- Edit their own profile and skills
- Add comments and ask questions
- Answer approved questions

### CURATOR
- All USER permissions
- Add new users to the database
- Edit any user profile
- Moderate comments (approve/delete)
- Moderate questions (approve/delete)

### MODERATOR
- All CURATOR permissions
- Additional moderation capabilities

## Key Features

### Skills System

The skills system is organized into expertise areas:

1. **Technical Architect**: System design and methodology
2. **Electronica**: Electronics engineering
3. **Mechanica**: Mechanical engineering (including CAD tools)
4. **Software**: Software development (including languages)

Each skill can be rated 1-5 stars, providing clear visibility into expertise levels.

### Profile Claiming

Users added by curators start as "unclaimed" profiles. When someone signs in with LinkedIn:
- The system checks if their LinkedIn URL matches an unclaimed profile
- If it matches, the profile is automatically claimed and linked to their account
- They can then edit their profile and manage their skills

### Moderation System

All user-generated content requires moderation:
- **Comments**: Must be approved by a curator before appearing on profiles
- **Questions**: Must be approved before appearing in the Q&A forum
- Curators can approve or delete pending content from the dashboard

## Deployment

### Vercel (Recommended)

1. **Push your code to GitHub**

2. **Connect to Vercel**
   - Import your repository in Vercel
   - Add environment variables in Vercel dashboard
   - Deploy

3. **Set up Neon PostgreSQL**
   - Vercel will automatically detect Prisma
   - Connect your Neon database
   - Run migrations after deployment

4. **Post-Deployment**
   - Run seed command in Vercel CLI if needed
   - Set up your LinkedIn OAuth production redirect URLs
   - Test authentication and functionality

### Environment Variables for Production

Make sure to set these in your Vercel dashboard:
- \`DATABASE_URL\`
- \`NEXTAUTH_URL\` (your production URL)
- \`NEXTAUTH_SECRET\`
- \`LINKEDIN_CLIENT_ID\`
- \`LINKEDIN_CLIENT_SECRET\`

## Customization

### Color Scheme

The application uses a custom Apple-inspired color scheme defined in \`app/globals.css\`. The design supports both light and dark modes automatically based on system preferences.

### Logo

Replace \`public/deltaproto-logo.svg\` with your own logo. The logo is used in:
- Navigation header
- Footer
- Favicon and app icons

## Database Schema

### Core Models

- **User**: Profile information, role, claimed status
- **ExpertiseArea**: Categories of skills (4 main areas)
- **Skill**: Individual skills within areas
- **UserSkill**: Junction table linking users to skills with ratings
- **Comment**: User comments with moderation
- **Question**: Forum questions with moderation
- **Answer**: Responses to questions

### NextAuth Models

- **Account**: OAuth account linkage
- **Session**: User sessions
- **VerificationToken**: Email verification

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

[Your License Here]

## Support

For issues and questions:
- GitHub Issues: [Your Repo Issues]
- Email: [Your Contact Email]

---

Built with ❤️ by DeltaProto

