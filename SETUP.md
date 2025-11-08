# SETUP GUIDE - SmartRental Frontend

This guide will walk you through setting up the SmartRental frontend from scratch.

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] npm 9+ installed  
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] Firebase account
- [ ] Backend API running (see backend setup)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages:
- Next.js, React, TypeScript
- Tailwind CSS
- Firebase SDK
- Axios, SWR
- Socket.io client
- React Icons, React Dropzone
- And more...

### 2. Firebase Configuration

#### Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Enter project name: `smartrental` (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create project"

#### Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Enable **Email/Password** provider
4. Enable **Google** provider
   - Enter project support email
   - Save

#### Enable Storage

1. Go to **Storage**
2. Click "Get started"
3. Choose "Start in test mode"
4. Select a location
5. Click "Done"

#### Get Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click Web icon (</>) to add a web app
4. Register app: `SmartRental Web`
5. Copy the `firebaseConfig` object
6. Paste values into `.env.local`

### 3. Environment Variables

Create `.env.local` file:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Backend API (adjust if backend is on different port/host)
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_WS_URL=http://localhost:4000

# Firebase (paste from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=smartrental-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=smartrental-xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=smartrental-xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 4. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 5. Verify Setup

#### Test Authentication
1. Go to http://localhost:3000/auth/signup
2. Create a test account
3. Check Firebase Console → Authentication → Users
4. User should appear

#### Test Property Listing
1. Sign in
2. Go to "List Property"
3. Fill out the form
4. Upload images
5. Submit (requires backend to be running)

## Troubleshooting

### Port 3000 Already in Use

```bash
# Kill the process using port 3000
# Windows (PowerShell):
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Then restart
npm run dev
```

### Firebase Errors

**"Firebase: Error (auth/invalid-api-key)"**
- Check `NEXT_PUBLIC_FIREBASE_API_KEY` in `.env.local`
- Ensure no extra spaces or quotes

**"Firebase: Error (auth/unauthorized-domain)"**
- Go to Firebase Console → Authentication → Settings → Authorized domains
- Add `localhost` if not present

### Backend Connection Failed

**"Network Error" when creating property**
- Ensure backend is running on port 4000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify CORS is enabled in backend

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

## Next Steps

1. **Backend Setup** - Follow backend README to set up Express API
2. **Database Setup** - Set up PostgreSQL with Prisma
3. **ML Service** - Set up FastAPI fraud detection service
4. **Deploy** - Follow deployment guide in main README

## Development Tips

### Hot Reload
- Next.js automatically hot-reloads on file changes
- If it doesn't work, restart dev server

### TypeScript Errors
- Run `npm run type-check` to see all type errors
- Use VS Code for inline type checking

### Tailwind CSS
- Use Tailwind IntelliSense extension in VS Code
- Autocomplete for class names

### Debugging
- Use React DevTools browser extension
- Check Network tab for API calls
- Check Console for errors

## Common Commands

```bash
# Development
npm run dev              # Start dev server

# Building
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Check TypeScript

# Package Management
npm install <package>    # Add new dependency
npm update               # Update dependencies
```

## Project Structure Overview

```
pages/               ← Add new pages here
  auth/             ← Authentication pages
  properties/       ← Property-related pages
  index.tsx         ← Home page

components/          ← Reusable UI components
lib/                 ← Core utilities (Firebase, API, Auth)
styles/              ← Global CSS
types/               ← TypeScript types
public/              ← Static files (images, fonts)
```

## Adding New Features

### Add a New Page

1. Create file in `pages/` folder
2. Export default React component
3. Next.js automatically creates route

Example: `pages/about.tsx` → http://localhost:3000/about

### Add a New Component

1. Create file in `components/` folder
2. Export component
3. Import where needed

### Add API Endpoint

1. Open `lib/api.ts`
2. Add new function in appropriate API object
3. Use in components with `useSWR` or direct call

## Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Check main README.md
3. Open an issue on GitHub
4. Contact team

---

**Happy Coding! 🚀**
