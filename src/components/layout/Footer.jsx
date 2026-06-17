import Link from 'next/link';
import { Instagram, Twitter, Linkedin, Facebook, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

const sections = [
  {
    title: 'Browse',
    links: [
      { name: 'Verified Rentals',         href: '/rent' },
      { name: 'Properties For Sale',       href: '/buy' },
      { name: 'Commercial & Real Estate',  href: '/real-estate' },
      { name: 'Guest Houses & Stays',      href: '/guest-houses' },
    ],
  },
  {
    title: 'Account',
    links: [
      { name: 'Sign In',              href: '/login' },
      { name: 'Create Free Account',  href: '/register' },
      { name: 'Submit Your Property', href: '/submit-property' },
      { name: 'Member Dashboard',     href: '/dashboard' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About KamerNdah',           href: '/about' },
      { name: 'How Verification Works',    href: '/about' },
      { name: 'For Landlords & Agents',    href: '/submit-property' },
      { name: 'Privacy Policy',            href: '/privacy-policy' },
      { name: 'Terms of Use',              href: '/terms' },
    ],
  },
];

const socials = [
  { Icon: Instagram, href: 'https://instagram.com/kamerndah', label: 'Instagram' },
  { Icon: Twitter,   href: 'https://twitter.com/kamerndah',   label: 'Twitter/X' },
  { Icon: Linkedin,  href: 'https://linkedin.com/company/kamerndah', label: 'LinkedIn' },
  { Icon: Facebook,  href: 'https://facebook.com/kamerndah',  label: 'Facebook' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white" role="contentinfo">

      {/* ── MAIN FOOTER BODY ──────────────────────────────────────── */}
      <div className="container-wide py-14 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* ── Brand column (spans 2 on large) ────────────────────── */}
          <div className="sm:col-span-2 space-y-7">

            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 bg-primary group-hover:bg-primary-dark rounded-xl flex items-center justify-center transition-colors duration-200 flex-shrink-0">
                <span className="text-white font-black text-base leading-none">K</span>
              </div>
              <div className="leading-tight">
                <p className="text-[18px] font-black tracking-tight text-white leading-none">
                  Kamer<span className="text-primary-light">Ndah</span>
                </p>
                <p className="text-[8.5px] uppercase tracking-[0.28em] text-white/35 font-semibold mt-0.5">
                  Verified Properties
                </p>
              </div>
            </Link>

            <p className="text-white/55 text-sm leading-relaxed max-w-[280px]">
              Cameroon&apos;s most trusted property marketplace. Every listing is physically
              inspected by our team before going live — rent or buy with full confidence.
            </p>

            {/* Contact info */}
            <div className="space-y-3.5">
              <a
                href="tel:+237672676029"
                className="flex items-center gap-3 text-[13px] text-white/60 hover:text-white transition-colors group"
              >
                <div className="w-8 h-8 bg-white/10 group-hover:bg-primary rounded-lg flex items-center justify-center transition-colors flex-shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                +237 672 676 029
              </a>
              <a
                href="mailto:support@kamerndah.com"
                className="flex items-center gap-3 text-[13px] text-white/60 hover:text-white transition-colors group"
              >
                <div className="w-8 h-8 bg-white/10 group-hover:bg-primary rounded-lg flex items-center justify-center transition-colors flex-shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                support@kamerndah.com
              </a>
              <div className="flex items-center gap-3 text-[13px] text-white/50">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                Bastos, Yaoundé, Cameroon
              </div>
            </div>

            {/* Socials */}
            <div className="flex gap-2.5">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 hover:bg-primary rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Link columns ────────────────────────────────────────── */}
          {sections.map((section) => (
            <div key={section.title} className="space-y-5">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-white/60 hover:text-white transition-colors duration-150 leading-snug block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── BOTTOM BAR ─────────────────────────────────────────────── */}
      <div className="border-t border-white/10">
        <div className="container-wide py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[12px] text-white/35">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>© {year} KamerNdah. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-5 text-[12px] text-white/35">
            <Link href="/terms" className="hover:text-white/70 transition-colors">Terms of Use</Link>
            <Link href="/privacy-policy" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
            <Link href="/about" className="hover:text-white/70 transition-colors">About Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}