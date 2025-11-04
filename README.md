# 📚 BookLoop

A community-based platform for IIT students to **buy, rent, or exchange books** within their campus network.

![BookLoop](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)

## ✨ Features

- 🔐 **College Email Verification** - Secure authentication using IIT domain emails
- 📖 **Personal Dashboard** - Manage your book listings and view your profile
- 🛍️ **Marketplace** - Browse and search books from your campus community
- 💬 **Real-time Chat** - Chat with other students after request acceptance
- 🔄 **Book Exchange** - Rent, exchange, or sell books easily
- ⭐ **Reviews & Feedback** - Share your thoughts about books
- 🏆 **Leaderboard** - See the most active book sharers
- 🎨 **Beautiful UI** - Cute, minimal design with smooth animations

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Language:** TypeScript

## 📦 Installation

### Prerequisites

- Node.js 18+ installed
- A Supabase account ([Sign up here](https://supabase.com))
- Git

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd bookloop
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Wait for the database to be set up

### Step 4: Run Database Schema

1. Open the SQL Editor in your Supabase project
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL commands

This will create all necessary tables, policies, and triggers.

### Step 5: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

2. Get your Supabase credentials:
   - Go to **Settings > API** in your Supabase dashboard
   - Copy the **Project URL** and **anon public** key

3. Update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 6: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app!

## 🚀 Usage

### First Time Setup

1. **Sign Up** - Use your IIT email (e.g., `yourname@iitr.ac.in`)
2. **Complete Profile** - Add your branch, year, and institute ID
3. **Add Books** - Start listing books you want to share
4. **Browse Marketplace** - Discover books from your campus

### Adding a Book

1. Go to Dashboard
2. Click "Add Book"
3. Fill in book details (title, author, genre, description)
4. Choose availability options (rent/exchange/sale)
5. Set a price if selling
6. Submit!

### Requesting a Book

1. Browse the Marketplace
2. Use filters to find books
3. Click "Request to Rent/Exchange/Buy"
4. Wait for the owner to accept
5. Start chatting once accepted!

## 📁 Project Structure

```
bookloop/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── auth/                 # Authentication pages
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── dashboard/            # User dashboard
│   │   ├── marketplace/          # Browse books
│   │   ├── chat/                 # Messaging system
│   │   ├── feedback/             # Reviews & leaderboard
│   │   ├── profile/              # Edit profile
│   │   ├── add-book/             # Add new book
│   │   └── edit-book/[id]/       # Edit existing book
│   ├── components/               # Reusable components
│   │   └── Navbar.tsx
│   ├── lib/                      # Utility functions
│   │   └── supabase/             # Supabase clients
│   │       ├── client.ts
│   │       └── server.ts
│   └── middleware.ts             # Auth middleware
├── public/                       # Static assets
├── supabase-schema.sql           # Database schema
└── README.md
```

## 🎨 Design System

BookLoop uses a custom pastel color palette:

- **Mint Green** (`#b4e7ce`) - Primary actions
- **Soft Pink** (`#ffc4d6`) - Secondary actions
- **Sky Blue** (`#a8d8ea`) - Accents
- **Butter Yellow** (`#fff4b1`) - Highlights
- **Lavender** (`#d4b5ff`) - Special elements
- **Peach** (`#ffd4b0`) - Warm accents

All UI components feature:
- Rounded corners (2xl)
- Smooth animations
- Hover effects
- Gradient backgrounds

## 🔒 Security

- Email verification required for signup
- Row Level Security (RLS) enabled on all tables
- User data protected with Supabase Auth
- Only IIT domain emails allowed
- Chat only accessible after request acceptance

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🐛 Troubleshooting

### Authentication Issues

- Ensure your email ends with `@iitr.ac.in` or `.iitr.ac.in`
- Check that Supabase Auth is enabled in your project
- Verify environment variables are set correctly

### Database Errors

- Confirm the SQL schema was run successfully
- Check RLS policies are enabled
- Ensure Supabase project is active

### Build Errors

- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version is 18+

## 📧 Contact

For questions or support, please reach out to your campus BookLoop administrators.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Database powered by [Supabase](https://supabase.com)
- Animations by [Framer Motion](https://www.framer.com/motion)
- Icons from [Lucide](https://lucide.dev)

---

Made with ❤️ for IIT students
