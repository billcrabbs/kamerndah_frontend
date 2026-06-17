import Link from 'next/link';
import { ShieldCheck, MapPin, Phone, Mail, Users, Award, Zap } from 'lucide-react';

export const metadata = {
  title: 'About KamerNdah — Cameroon\'s Verified Property Marketplace',
  description: 'Learn how KamerNdah is transforming property search in Cameroon with 100% physically verified listings and zero-commission first contact.',
};

const milestones = [
  { year: '2022', text: 'KamerNdah founded in Douala with a mission to eliminate fake listings in Cameroon.' },
  { year: '2023', text: 'Expanded to Yaoundé, Buea, and Bafoussam. Crossed 200 verified listings.' },
  { year: '2024', text: 'Launched mobile-first platform and integrated mobile money inquiry system.' },
  { year: '2025', text: 'Over 500 verified properties. Trusted by 1,000+ tenants and 300+ landlords.' },
];

const values = [
  { icon: ShieldCheck, title: 'Verification First', desc: 'Every listing is physically visited by a KamerNdah agent before it goes live. No exceptions.' },
  { icon: Zap,        title: 'Speed & Clarity',  desc: 'We give tenants direct contact with landlords. No layers, no delays, no confusion.' },
  { icon: Users,      title: 'Community Trust',  desc: 'We build long-term relationships between landlords and tenants — not one-off transactions.' },
  { icon: Award,      title: 'Local Expertise',  desc: 'We know Douala, Yaoundé, Kribi, Buea, and Bafoussam inside out. That matters.' },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-navy py-20 lg:py-32">
        <div className="container-wide">
          <div className="max-w-3xl space-y-6">
            <p className="text-primary-light text-[11px] font-bold uppercase tracking-widest">Our Story</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Cameroon&apos;s most trusted<br />
              <span className="text-primary-light">property marketplace.</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed max-w-xl">
              We started KamerNdah because finding a genuine, fairly-priced property in Cameroon
              was needlessly hard. We&apos;re fixing that — one verified listing at a time.
            </p>
          </div>
        </div>
      </section>

      {/* ── Mission ──────────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-black text-navy tracking-tight">
                Our Mission
              </h2>
              <p className="text-slate-600 leading-relaxed">
                KamerNdah exists to make property search in Cameroon transparent, fast, and trustworthy.
                We believe every Cameroonian deserves access to accurate property information without being
                scammed, misled, or charged unfair middleman fees.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Every listing on our platform has been physically verified by a member of our team.
                We confirm the address is real, the price is accurate, and the photos are genuine
                before any listing goes live.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '500+', label: 'Verified listings' },
                { value: '6',    label: 'Cities covered' },
                { value: '0%',   label: 'Commission on contact' },
                { value: '48h',  label: 'Avg. first inquiry' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white border border-border rounded-2xl p-6 text-center">
                  <p className="text-3xl font-black text-navy">{stat.value}</p>
                  <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Verification process ─────────────────────────────────────── */}
      <section id="verification" className="py-16 lg:py-24 bg-white">
        <div className="container-wide">
          <div className="max-w-2xl mb-12">
            <p className="text-primary text-[11px] font-bold uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="text-3xl lg:text-4xl font-black text-navy tracking-tight">
              How verification works
            </h2>
            <p className="text-slate-500 mt-4 leading-relaxed">
              Our 4-step process ensures every listing you see is genuine.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Landlord submits',  desc: 'A property owner creates a listing with details, price, and photos.' },
              { step: '02', title: 'Team review',       desc: 'Our agents review the submission and schedule a physical visit.' },
              { step: '03', title: 'Site inspection',   desc: 'We visit the property, verify the space, confirm the price, and take official photos.' },
              { step: '04', title: 'Published live',    desc: 'Once verified, the listing goes live with a ✓ Verified badge.' },
            ].map((item) => (
              <div key={item.step} className="space-y-4 p-6 bg-slate-50 border border-border rounded-2xl">
                <span className="text-4xl font-black text-primary/20">{item.step}</span>
                <h3 className="text-base font-black text-navy">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-navy">
        <div className="container-wide">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight">Our values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-5 p-6 bg-white/[0.06] border border-white/10 rounded-2xl">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon className="w-5 h-5 text-primary-light" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white mb-1">{title}</h3>
                  <p className="text-sm text-white/55 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-wide max-w-3xl">
          <h2 className="text-3xl font-black text-navy tracking-tight mb-12">Our journey</h2>
          <div className="space-y-8">
            {milestones.map((m) => (
              <div key={m.year} className="flex gap-6">
                <div className="flex-shrink-0 w-16 text-right">
                  <span className="text-sm font-black text-primary">{m.year}</span>
                </div>
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-primary mt-0.5" />
                  <div className="w-px flex-1 bg-border mt-2" />
                </div>
                <p className="text-slate-600 text-sm leading-relaxed pb-8">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────── */}
      <section className="py-16 bg-slate-50">
        <div className="container-wide max-w-2xl text-center space-y-6">
          <h2 className="text-2xl font-black text-navy">Get in touch</h2>
          <p className="text-slate-500">Questions, partnerships, or press inquiries — we&apos;re happy to help.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+237672676029" className="inline-flex items-center gap-2 btn-outline">
              <Phone className="w-4 h-4" /> +237 672 676 029
            </a>
            <a href="mailto:support@kamerndah.com" className="inline-flex items-center gap-2 btn-primary">
              <Mail className="w-4 h-4" /> support@kamerndah.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
