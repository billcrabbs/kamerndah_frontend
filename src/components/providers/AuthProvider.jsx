'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { setCredentials, logout, setLoading } from '@/store/slices/authSlice';
import { userApi } from '@/store/services/userApi';

export function AuthProvider({ children }) {
 const dispatch = useDispatch();
 const [createUser] = userApi.useCreateUserMutation();

 useEffect(() => {
 // Listen for Firebase Auth state changes
 const unsubscribe = onAuthStateChanged(auth, async (user) => {
 dispatch(setLoading(true));
 
 if (user) {
 // Get the latest ID Token
 const token = await user.getIdToken();
 
 // Basic user info for the Redux store
 const userData = {
 uid: user.uid,
 email: user.email,
 displayName: user.displayName,
 photoURL: user.photoURL,
 };

 // Update Redux state
 dispatch(setCredentials({
 user: userData,
 idToken: token,
 }));

 // Optional: Trigger a profile sync to ensure backend has this user
 // This is primarily for social logins where the user might not have gone
 // through our registration form.
 try {
 await createUser({
 uid: user.uid,
 email: user.email,
 display_name: user.displayName || 'KamerNdah User',
 photo_url: user.photoURL || '',
 user_type: 'visitor' // Default, will be updated by existing profile
 }).unwrap();
 } catch (err) {
 console.warn('Backend profile sync failed (user might not exist yet):', err);
 }

 } else {
 // User is signed out
 dispatch(logout());
 }
 
 dispatch(setLoading(false));
 });

 return () => unsubscribe();
 }, [dispatch, createUser]);

 return <>{children}</>;
}
