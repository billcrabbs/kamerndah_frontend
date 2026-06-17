'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

const FIREBASE_ERRORS = {
  'auth/user-not-found':         'No account found with this email address.',
  'auth/invalid-email':          'Please enter a valid email address.',
  'auth/network-request-failed': 'Network error. Check your connection and retry.',
  'auth/too-many-requests':      'Too many attempts. Please wait a moment and try again.',
};

function friendlyError(err) {
  for (const [code, msg] of Object.entries(FIREBASE_ERRORS)) {
    if (err?.code === code || err?.message?.includes(code)) return msg;
  }
  return 'Could not send a reset email. Please try again.';
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Decorative top accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary-light to-secondary" />

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
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
              <h1 className="text-3xl font-black text-navy tracking-tight">Reset your password</h1>
              <p className="text-sm text-slate-500">
                Enter your email and we&apos;ll send you a reset link
              </p>
            </div>

            {/* ── Sent state ──────────────────────────────────────────── */}
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg font-black text-navy">Check your inbox</h2>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    We sent a password reset link to{' '}
                    <span className="font-bold text-navy">{email}</span>.
                    It may take a minute to arrive.
                  </p>
                </div>
                <p className="text-xs text-slate-400">
                  Didn&apos;t receive it?{' '}
                  <button
                    onClick={() => { setSent(false); setEmail(''); }}
                    className="font-semibold text-primary hover:text-primary-dark transition-colors"
                  >
                    Try again
                  </button>
                </p>
              </motion.div>
            ) : (
              /* ── Form state ──────────────────────────────────────────── */
              <form onSubmit={handleSubmit} className="space-y-5">
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

                <div className="space-y-1.5">
                  <label htmlFor="reset-email" className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                      id="reset-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-border hover:border-slate-300 focus:border-primary rounded-xl py-3.5 pl-12 pr-4 text-navy font-semibold text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/15 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all hover:shadow-lg hover:shadow-primary/25"
                >
                  {isLoading ? 'Sending reset link…' : 'Send Reset Link'}
                </button>
              </form>
            )}

            {/* Back to login */}
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-navy transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>
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
