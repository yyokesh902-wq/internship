import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, User as FirebaseUser } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Initiates the Google Sign-In popup flow
 */
export const signInWithGooglePopup = async (): Promise<FirebaseUser> => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};
