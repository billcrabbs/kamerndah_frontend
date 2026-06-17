import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CookiesPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="container-wide py-16 lg:py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="max-w-3xl space-y-8">
          <div>
            <h1 className="text-4xl font-black text-navy mb-4">Cookie Policy</h1>
            <p className="text-slate-500 text-sm mb-6">Last updated: June 2026</p>
            <p className="text-slate-600 leading-relaxed">
              This Cookie Policy explains how KamerNdah uses cookies and similar technologies to recognize you and 
              enhance your experience on our platform.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-navy mb-2">What Are Cookies?</h2>
              <p className="text-slate-600">
                Cookies are small data files stored on your device. They help us remember your preferences, keep you 
                logged in, and understand how you use our platform.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy mb-2">How We Use Cookies</h2>
              <p className="text-slate-600">
                We use cookies for authentication, preferences, analytics, and security. Essential cookies are necessary 
                for the platform to function, while others enhance your experience.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy mb-2">Your Cookie Choices</h2>
              <p className="text-slate-600">
                You can control cookie settings through your browser. However, disabling certain cookies may affect the 
                functionality of our platform.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy mb-2">Third-Party Cookies</h2>
              <p className="text-slate-600">
                We may allow third parties to place cookies on your device for analytics and advertising purposes. 
                You can manage these preferences through your browser settings.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy mb-2">Contact Us</h2>
              <p className="text-slate-600">
                For questions about our cookie practices, contact us at{' '}
                <a href="mailto:support@kamerndah.com" className="text-primary hover:underline font-semibold">
                  support@kamerndah.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
