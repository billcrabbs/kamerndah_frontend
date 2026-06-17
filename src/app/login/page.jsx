'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { showModal } from '@/store/slices/uiSlice';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

/* ── Friendly Firebase error map ─────────────────────────────────── */
const FIREBASE_ERRORS = {
  'auth/invalid-email':          'Please enter a valid email address.',
  'auth/user-not-found':         'No account found with this email.',
  'auth/wrong-password':         'Incorrect password. Please try again.',
  'auth/invalid-credential':     'Incorrect email or password.',
  'auth/too-many-requests':      'Too many attempts. Please wait a moment and try again.',
  'auth/user-disabled':          'This account has been disabled. Contact support.',
  'auth/network-request-failed': 'Network error. Check your connection and retry.',
};

function friendlyError(err) {
  for (const [code, msg] of Object.entries(FIREBASE_ERRORS)) {
    if (err?.code === code || err?.message?.includes(code)) return msg;
  }
  return 'Something went wrong. Please try again.';
}

/* ── Google SVG icon ─────────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

export default function LoginPage() {
  const router     = useRouter();
  const dispatch   = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [error,     setError]     = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.push('/');
  }, [isAuthenticated, router]);

  /* ── Email / password login ────────────────────────────────────── */
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      dispatch(showModal({
        type:       'success',
        title:      'Welcome Back',
        message:    'You\'re now signed in to KamerNdah.',
        actionText: 'Go to Dashboard',
        redirect:   '/dashboard',
      }));
    } catch (err) {
      const msg = friendlyError(err);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Google login ──────────────────────────────────────────────── */
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/');
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ── Decorative top accent ─────────────────────────────────── */}
      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary-light to-secondary" />

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          {/* ── Card ───────────────────────────────────────────────── */}
          <div className="bg-white rounded-3xl border border-border shadow-xl shadow-slate-200/60 p-8 sm:p-10 space-y-8">

            {/* Brand */}
            <div className="text-center space-y-2">
              <Link href="/" className="inline-flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center">
                  <span className="text-white font-black text-base">K</span>
                </div>
                <span className="text-[18px] font-black tracking-tight text-navy">
                  Kamer<span className="text-primary">Ndah</span>
                </span>
              </Link>
              <h1 className="text-3xl font-black text-navy tracking-tight">Welcome back</h1>
              <p className="text-sm text-slate-500">Sign in to your KamerNdah account</p>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleEmailLogin} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="login-email" className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-border hover:border-slate-300 focus:border-primary rounded-xl py-3.5 pl-12 pr-4 text-navy font-semibold text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/15 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="login-password" className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input
                    id="login-password"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-border hover:border-slate-300 focus:border-primary rounded-xl py-3.5 pl-12 pr-4 text-navy font-semibold text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/15 transition-all"
                  />
                </div>
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
                <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors">
                  Remember me on this device
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all hover:shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="animate-pulse">Signing you in…</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  or continue with
                </span>
              </div>
            </div>

            {/* Google */}
            <button
              onClick={handleGoogleLogin}
              type="button"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-border hover:border-slate-300 hover:bg-slate-50 text-navy py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-60"
            >
              <GoogleIcon />
              <span>Continue with Google</span>
            </button>

            {/* Footer */}
            <p className="text-center text-sm text-slate-500">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-bold text-primary hover:text-primary-dark transition-colors">
                Create one free
              </Link>
            </p>
          </div>

          {/* Trust strip */}
          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Secured with Firebase Authentication</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
