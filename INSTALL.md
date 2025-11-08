# 🚀 INSTALLATION INSTRUCTIONS

## Quick Installation (3 Steps)

### Step 1: Install Dependencies
```powershell
npm install
```
⏱️ Takes 2-3 minutes

### Step 2: Configure Environment
```powershell
# Copy template
Copy-Item .env.example .env.local

# Edit with your Firebase credentials
notepad .env.local
```

Add your Firebase configuration:
- Get from: https://console.firebase.google.com
- Project Settings → Your apps → Web app config

### Step 3: Start Development Server
```powershell
npm run dev
```

Open: http://localhost:3000

## ✅ Verification

Test these to confirm everything works:

1. **Homepage loads**: http://localhost:3000
2. **Sign up page**: http://localhost:3000/auth/signup
3. **Create account** (requires Firebase setup)

## ❗ Troubleshooting

### Error: "Module not found"
```powershell
# Clean install
Remove-Item -Recurse -Force node_modules
npm install
```

### Error: "Port 3000 is already in use"
```powershell
# Kill process on port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
npm run dev
```

### Error: "Firebase: Error (auth/invalid-api-key)"
- Check `.env.local` has correct Firebase keys
- No extra spaces or quotes in environment variables

## 📖 Next Steps

After installation:
1. ✅ Read [README.md](./README.md) - Full documentation
2. ✅ Read [SETUP.md](./SETUP.md) - Detailed setup
3. ✅ Read [QUICKSTART.md](./QUICKSTART.md) - Quick guide
4. ✅ Set up backend API (separate repository)

## 🔥 Firebase Setup (Required)

1. Go to https://console.firebase.google.com
2. Create new project
3. Enable **Authentication** → Email/Password + Google
4. Enable **Storage**
5. Get web app config
6. Add to `.env.local`

## 📦 What Gets Installed

- Next.js 14 (React framework)
- TypeScript (type safety)
- Tailwind CSS (styling)
- Firebase (authentication)
- Axios (API calls)
- Socket.io (real-time)
- React Icons (icons)
- And more... (see package.json)

## 💻 System Requirements

- Node.js 18 or higher
- npm 9 or higher
- 500MB free disk space
- Windows/Mac/Linux

## 🆘 Need Help?

- Check [SETUP.md](./SETUP.md) for detailed instructions
- Check [README.md](./README.md) troubleshooting section
- Open an issue on GitHub

---

**Installation Time**: ~5 minutes
**Difficulty**: Easy ⭐
**Status**: Ready to use ✅
