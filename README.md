# 🏠 SmartRental Platform - Frontend

![Next.js](https://img.shields.io/badge/Next.js-14.x-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8)
![Firebase](https://img.shields.io/badge/Firebase-10.x-orange)

AI-powered rental platform with fraud detection, rent prediction, and real-time chat. Built with Next.js, TypeScript, Tailwind CSS, and Firebase Authentication.

## ✨ Features

- 🤖 **AI-Powered Rent Prediction** - Machine learning models predict optimal rental prices
- 🛡️ **Fraud Detection** - Automatic analysis of listings for suspicious activity
- 🔐 **Secure Authentication** - Firebase Auth with Google Sign-In
- 💬 **Real-time Chat** - Socket.io powered messaging between tenants and owners
- 🎨 **Modern UI/UX** - Responsive design with Tailwind CSS
- 📱 **Mobile Friendly** - Fully responsive across all devices
- 🚀 **Fast Performance** - Optimized with Next.js 14 and SWR for data fetching

## 🏗️ Architecture

```
Frontend (Next.js + Tailwind)
    ↓
Firebase Auth → Backend API (Express) → PostgreSQL (Supabase)
    ↓                 ↓
Real-time Chat    ML Service (FastAPI)
 (Socket.io)    (Fraud + Rent Prediction)
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Smart_Rental_Platform_Frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_WS_URL=http://localhost:4000

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔥 Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → **Email/Password** and **Google** providers
4. Enable **Storage** for property images

### 2. Get Configuration

1. Project Settings → General → Your apps
2. Select Web App (</>) → Register app
3. Copy the configuration object
4. Add values to `.env.local`

### 3. Set Up Firebase Admin (Backend)

For the backend, download the service account JSON:

1. Project Settings → Service Accounts
2. Generate new private key
3. Save as JSON and set in backend environment

## 📦 Project Structure

```
Smart_Rental_Platform_Frontend/
├── components/              # Reusable React components
│   ├── Navbar.tsx          # Navigation bar
│   ├── Footer.tsx          # Footer component
│   ├── PropertyCard.tsx    # Property listing card
│   └── LoadingSpinner.tsx  # Loading indicator
├── pages/                   # Next.js pages (routes)
│   ├── _app.tsx            # App wrapper with providers
│   ├── _document.tsx       # HTML document structure
│   ├── index.tsx           # Home page with search
│   ├── auth/
│   │   ├── login.tsx       # Login page
│   │   └── signup.tsx      # Sign up page
│   └── properties/
│       └── create.tsx      # Create listing page
├── lib/                     # Core utilities and configs
│   ├── firebase.ts         # Firebase configuration
│   ├── AuthContext.tsx     # Authentication context
│   └── api.ts              # API client with Axios
├── styles/                  # Global styles
│   └── globals.css         # Tailwind + custom CSS
├── types/                   # TypeScript type definitions
│   └── index.ts            # Shared types
├── public/                  # Static assets
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── Dockerfile              # Docker container definition
├── vercel.json             # Vercel deployment config
└── package.json            # Dependencies and scripts
```

## 🎨 Key Components

### Authentication

```tsx
// lib/AuthContext.tsx
- Firebase authentication wrapper
- Session management with backend JWT
- Google Sign-In support
```

### Property Listing

```tsx
// components/PropertyCard.tsx
- Displays property with fraud badge
- Shows AI-predicted rent
- Responsive card design
```

### API Integration

```typescript
// lib/api.ts
- Axios client with interceptors
- Automatic token injection
- Error handling and redirects
```

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on http://localhost:3000 |
| `npm run build` | Build production bundle |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint for code quality |
| `npm run type-check` | Run TypeScript compiler checks |

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t smartrental-frontend .
```

### Run Container

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://your-api.com/api \
  -e NEXT_PUBLIC_FIREBASE_API_KEY=your_key \
  smartrental-frontend
```

### Docker Compose (Full Stack)

See the main monorepo `docker-compose.yml` for orchestrating frontend + backend + ML service + database.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all `NEXT_PUBLIC_*` variables from `.env.local`

5. **Production Deployment**
   ```bash
   vercel --prod
   ```

### Deploy to Other Platforms

#### Netlify
```bash
npm run build
# Deploy the .next folder
```

#### AWS Amplify
```bash
# Connect GitHub repo
# Build command: npm run build
# Publish directory: .next
```

#### Railway
```bash
# Connect GitHub repo
# Automatically detects Next.js
```

## 🔌 API Integration

The frontend communicates with the Express backend API:

### Endpoints Used

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/session` | POST | Exchange Firebase token for JWT |
| `/api/properties/search` | GET | Search properties with filters |
| `/api/properties` | POST | Create new property listing |
| `/api/properties/:id` | GET | Get property details |
| `/api/chat/conversations/:userId` | GET | Get user conversations |

### Example API Call

```typescript
import { propertyAPI } from '@/lib/api'

// Search properties
const properties = await propertyAPI.search({
  city: 'San Francisco',
  minPrice: 1000,
  maxPrice: 3000
})

// Create property
const formData = new FormData()
formData.append('title', 'Beautiful Apartment')
formData.append('price', '2000')
formData.append('images', file)

const result = await propertyAPI.create(formData)
```

## 🎯 Key Features Implementation

### 1. Search & Filters

```typescript
// pages/index.tsx
- Real-time search with debouncing
- City, price range filters
- SWR for efficient data fetching
```

### 2. Authentication Flow

```typescript
// lib/AuthContext.tsx
1. User signs in with Firebase
2. Frontend gets Firebase ID token
3. Exchange token with backend → Get JWT + user data
4. Store JWT in localStorage
5. Include JWT in all API requests
```

### 3. Property Creation

```typescript
// pages/properties/create.tsx
- Multi-image upload with drag & drop
- Form validation
- Automatic ML analysis on submission
- Redirect to property page after creation
```

### 4. Fraud Detection Display

```typescript
// components/PropertyCard.tsx
- Green badge: Verified (score < 0.3)
- Yellow badge: Caution (0.3 - 0.6)
- Red badge: High Risk (> 0.6)
```

## 🧪 Testing

### Run Tests (TODO)

```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
```

### E2E Tests with Cypress (TODO)

```bash
npm run cypress:open       # Open Cypress UI
npm run cypress:run        # Run headless
```

## 🔧 Configuration

### Tailwind CSS

Custom theme in `tailwind.config.js`:

```javascript
colors: {
  primary: { ... },    // Blue shades
  secondary: { ... },  // Purple shades
}
```

### Next.js

Key configurations in `next.config.js`:

```javascript
- Image domains (Firebase Storage, Supabase)
- API URL environment variables
- Redirects and rewrites
```

## 🐛 Troubleshooting

### Common Issues

**1. Firebase Auth Errors**
```bash
# Ensure Firebase config is correct in .env.local
# Check Firebase Console → Authentication is enabled
```

**2. API Connection Failed**
```bash
# Verify backend is running on http://localhost:4000
# Check NEXT_PUBLIC_API_URL in .env.local
```

**3. Build Errors**
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

**4. TypeScript Errors**
```bash
# The errors shown during file creation are normal
# They will resolve after running: npm install
```

## 📚 Tech Stack Details

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.x | React framework with SSR/SSG |
| React | 18.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Utility-first CSS |
| Firebase | 10.x | Authentication & Storage |
| Axios | 1.6.x | HTTP client |
| SWR | 2.x | Data fetching & caching |
| Socket.io-client | 4.x | Real-time chat |
| React Icons | 5.x | Icon library |
| React Dropzone | 14.x | File upload |
| React Hot Toast | 2.x | Toast notifications |

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Firebase for authentication services
- Tailwind CSS for the utility-first approach
- Vercel for hosting platform

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Email: support@smartrental.com
- Documentation: [docs.smartrental.com](https://docs.smartrental.com)

## 🗺️ Roadmap

- [ ] Advanced search with maps integration
- [ ] Saved searches and favorites
- [ ] Property comparison tool
- [ ] Mobile app (React Native)
- [ ] Payment integration (Stripe)
- [ ] Review and rating system
- [ ] Virtual tours (360° images)
- [ ] Multi-language support (i18n)

---

**Built with ❤️ by the SmartRental Team**

For the complete full-stack setup including backend and ML service, see the main repository.
