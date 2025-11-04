# 🚀 BookLoop - Quick Setup Guide

Follow these steps to get BookLoop running on your local machine.

## ✅ Prerequisites Checklist

- [ ] Node.js 18 or higher installed
- [ ] npm or yarn package manager
- [ ] A Supabase account (free tier works!)
- [ ] A code editor (VS Code recommended)

## 📋 Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

Wait for all packages to install (~2-3 minutes).

### 2. Create Supabase Project

1. Visit [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub
4. Click "New project"
5. Fill in:
   - **Name:** BookLoop
   - **Database Password:** (save this!)
   - **Region:** Choose closest to you
6. Click "Create new project"
7. Wait for setup (2-3 minutes)

### 3. Set Up Database

1. In your Supabase project, click **SQL Editor** (left sidebar)
2. Click "New query"
3. Open `supabase-schema.sql` from this project
4. Copy ALL the SQL code
5. Paste into the Supabase SQL Editor
6. Click "Run" (bottom right)
7. Wait for success message

**Expected output:**
```
Success. No rows returned.
```

### 4. Get API Credentials

1. In Supabase, go to **Settings** → **API**
2. Find these two values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (under "Project API keys")
3. Keep this tab open!

### 5. Configure Environment Variables

1. In your project folder, find `.env.local.example`
2. Copy it and rename to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
3. Open `.env.local` in your editor
4. Replace the placeholders:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-long-anon-key-here
   ```
5. Save the file

### 6. Start the Development Server

```bash
npm run dev
```

You should see:
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

### 7. Test the Application

1. Open [http://localhost:3000](http://localhost:3000)
2. You should see the login page
3. Click "Sign up"
4. Create an account with an IIT email:
   - Email: `test@iitr.ac.in` (or your actual IIT email)
   - Fill in other details
5. Click "Sign Up"
6. You should be redirected to the dashboard!

## ✨ Success Checklist

After setup, you should be able to:

- [ ] Access the login page at http://localhost:3000
- [ ] Create an account with an IIT email
- [ ] See the dashboard after signup
- [ ] Navigate between pages using the navbar
- [ ] Add a new book from the dashboard
- [ ] View the marketplace
- [ ] See your profile

## 🐛 Common Issues

### Issue: "Invalid API key"
**Solution:**
- Check that you copied the full anon key
- Make sure there are no spaces or line breaks
- Verify the URL doesn't have `/` at the end

### Issue: "Cannot connect to Supabase"
**Solution:**
- Check your internet connection
- Verify the Supabase project is active (green dot in dashboard)
- Confirm environment variables are correct

### Issue: "Email validation failed"
**Solution:**
- Email must end with `@iitr.ac.in` or `.iitr.ac.in`
- For testing, use: `test@iitr.ac.in`

### Issue: SQL schema errors
**Solution:**
- Make sure you ran ALL the SQL code
- Check for any error messages in Supabase
- Try running the schema again (it's safe to re-run)

### Issue: "Module not found" errors
**Solution:**
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

## 🎯 Next Steps

Once everything is working:

1. **Add your first book**
   - Go to Dashboard
   - Click "Add Book"
   - Fill in details and submit

2. **Explore the marketplace**
   - Click "Marketplace" in the navbar
   - Try the search and filters

3. **Customize for your campus**
   - Update email validation in `src/app/auth/login/page.tsx`
   - Change `@iitr.ac.in` to your institute's domain

4. **Deploy to production**
   - See deployment section in main README.md

## 📞 Need Help?

If you're stuck:

1. Check the main README.md for detailed docs
2. Review error messages in the browser console (F12)
3. Check the terminal for server errors
4. Verify Supabase project is running

## 🎉 You're All Set!

BookLoop is now running locally. Start adding books and building your campus book-sharing community!

---

**Estimated setup time:** 10-15 minutes
**Last updated:** 2025
