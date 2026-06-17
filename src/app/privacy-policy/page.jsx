import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
            <h1 className="text-4xl font-black text-navy mb-4">Privacy Policy</h1>
            <p className="text-slate-500 text-sm mb-6">Last updated: June 2026</p>
            <p className="text-slate-600 leading-relaxed">
              At KamerNdah, we are committed to protecting your privacy. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-navy mb-2">Information We Collect</h2>
              <p className="text-slate-600">
                We collect information you provide directly, such as when you create an account, submit a property, 
                or contact us. We also automatically collect certain information about your device and how you interact with our platform.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy mb-2">How We Use Your Information</h2>
              <p className="text-slate-600">
                We use your information to provide, maintain, and improve our services; to communicate with you; 
                to process transactions; and to comply with legal obligations.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy mb-2">Data Security</h2>
              <p className="text-slate-600">
                We implement appropriate security measures to protect your personal information. However, no method of 
                transmission over the Internet is 100% secure.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy mb-2">Contact Us</h2>
              <p className="text-slate-600">
                If you have questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:privacy@kamerndah.com" className="text-primary hover:underline font-semibold">
                  privacy@kamerndah.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
