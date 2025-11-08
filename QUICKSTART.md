# Quick Start - SmartRental Frontend

Get up and running in 5 minutes! ⚡

## Prerequisites

- Node.js 18+ and npm installed
- Backend API running (see backend repo)
- Firebase account

## Installation

### 1. Install Dependencies
```powershell
npm install
```

### 2. Configure Environment
```powershell
# Copy environment template
Copy-Item .env.example .env.local

# Edit .env.local with your values
notepad .env.local
```

### 3. Add Firebase Config

Get your Firebase config from:
https://console.firebase.google.com → Project Settings → Your apps

Add to `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Start Development Server
```powershell
npm run dev
```

Open http://localhost:3000 🎉

## Quick Test

1. **Sign Up**: http://localhost:3000/auth/signup
2. **Browse Properties**: http://localhost:3000
3. **List Property**: http://localhost:3000/properties/create

## Common Issues

**Port 3000 in use?**
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
npm run dev
```

**Can't connect to backend?**
- Ensure backend is running on port 4000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`

**Firebase errors?**
- Verify all Firebase env vars are set
- Enable Email/Password auth in Firebase Console

## Next Steps

- ✅ Read full [README.md](./README.md) for detailed docs
- ✅ Check [SETUP.md](./SETUP.md) for complete setup guide
- ✅ Set up backend API (see backend repo)
- ✅ Deploy to Vercel (see README deployment section)

## Project Structure

```
📁 Smart_Rental_Platform_Frontend/
├── 📁 pages/              # Routes (index, auth, properties)
├── 📁 components/         # Reusable components
├── 📁 lib/                # Firebase, API, Auth
├── 📁 styles/             # Global CSS
├── 📁 types/              # TypeScript types
└── 📁 utils/              # Helper functions
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Lint code |

## Need Help?

- 📖 [Full Documentation](./README.md)
- 🔧 [Setup Guide](./SETUP.md)
- 🐛 [Report Issue](https://github.com/your-repo/issues)

---

**Happy Coding! 🚀**
