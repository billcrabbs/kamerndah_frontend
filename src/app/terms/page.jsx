import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
            <h1 className="text-4xl font-black text-navy mb-4">Terms of Use</h1>
            <p className="text-slate-500 text-sm mb-6">Last updated: June 2026</p>
            <p className="text-slate-600 leading-relaxed">
              These Terms of Use govern your use of KamerNdah's platform and services. By accessing or using our platform, 
              you agree to be bound by these terms.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-navy mb-2">User Responsibilities</h2>
              <p className="text-slate-600">
                You agree to use our platform only for lawful purposes and in a way that does not infringe upon the rights 
                of others or restrict their use and enjoyment of the platform.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy mb-2">Property Listings</h2>
              <p className="text-slate-600">
                All properties on KamerNdah are verified before listing. Landlords and agents are responsible for providing 
                accurate information. Any misrepresentation may result in account suspension.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy mb-2">Limitation of Liability</h2>
              <p className="text-slate-600">
                KamerNdah provides the platform "as is" without warranties. We are not liable for any indirect, incidental, 
                special, or consequential damages arising from your use of our platform.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy mb-2">Contact Us</h2>
              <p className="text-slate-600">
                For questions about these Terms, contact us at{' '}
                <a href="mailto:legal@kamerndah.com" className="text-primary hover:underline font-semibold">
                  legal@kamerndah.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
