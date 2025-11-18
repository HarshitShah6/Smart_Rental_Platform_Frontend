// Firebase configuration and initialization
import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getStorage, FirebaseStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
let app: FirebaseApp | undefined
let auth: Auth | undefined
let storage: FirebaseStorage | undefined

if (typeof window !== 'undefined') {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }
  auth = getAuth(app)
  // Ensure auth persistence is set to local so sessions survive closing the browser
  try {
    // setPersistence returns a promise; fire-and-forget is fine here during init
    setPersistence(auth, browserLocalPersistence).catch((e) => {
      // non-fatal: log for debugging
      // eslint-disable-next-line no-console
      console.warn('firebase: failed to set browserLocalPersistence', e?.message || e)
    })
  } catch (e) {
    // ignore in environments where persistence isn't available
    // eslint-disable-next-line no-console
    console.warn('firebase: setPersistence threw', e?.message || e)
  }
  storage = getStorage(app)
}

export { auth, storage, app }
