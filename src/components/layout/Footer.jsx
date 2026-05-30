import Link from 'next/link';
import { 
 Instagram, 
 Twitter, 
 Linkedin, 
 Facebook, 
 Mail, 
 Phone, 
 MapPin,
 ShieldCheck,
 Award,
 Zap
} from 'lucide-react';

export function Footer() {
 const currentYear = new Date().getFullYear();

 const sections = [
    {
      title: 'Marketplace',
      links: [
        { name: 'Verified Rentals', href: '/rent' },
        { name: 'Investment & Buy', href: '/buy' },
        { name: 'Commercial Spaces', href: '/real-estate' },
        { name: 'Premium Guest Stays', href: '/guest-houses' },
      ]
    },
    {
      title: 'Client Portals',
      links: [
        { name: 'Identity Portal', href: '/login' },
        { name: 'Create Free Account', href: '/register' },
        { name: 'Submit Your Estate', href: '/submit-property' },
        { name: 'Member Dashboard', href: '/dashboard' },
      ]
    }
  ];

  return (
    <footer className="relative bg-[#08080a] pt-24 pb-12 overflow-hidden border-t border-white/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-afro opacity-[0.03] z-0" />
      
      <div className="relative z-10 main-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 border-b border-white/5 pb-20">
          
          {/* Column 1: Brand & Promise (2 Columns wide) */}
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="flex flex-col group">
              <span className="text-3xl font-black tracking-tighter text-white uppercase transition-all group-hover:text-primary-light">
                Kamer<span className="text-primary-light">Ndah</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold mt-1">
                Luxury Estate Network
              </span>
            </Link>
            
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              The premier ecosystem connecting elite landlords with discerning residents across Cameroon. 100% physically verified properties. 0% compromise on quality.
            </p>

            <div className="flex space-x-4">
              {[Instagram, Twitter, Linkedin, Facebook].map((Icon, i) => (
                <Link key={i} href="#" className="p-3 bg-white/5 rounded-2xl border border-white/10 text-gray-400 hover:text-primary-light hover:border-primary/30 transition-all duration-350 hover:-translate-y-1">
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2 & 3: Sections mapping (2 Columns wide in total) */}
          {sections.map((section) => (
            <div key={section.title} className="space-y-6 lg:col-span-1">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-gray-500 hover:text-white transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Column 4: Premium Concierge visual card (2 Columns wide) */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">
              Elite Concierge
            </h3>
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl space-y-4 hover:border-primary/20 transition-all duration-300">
              <div className="flex items-center space-x-3 group/item">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary-light group-hover/item:bg-primary group-hover/item:text-white transition-all">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">Direct Hotline</p>
                  <Link href="tel:+237672676029" className="text-xs font-bold text-white hover:text-primary-light transition-colors">
                    +237 672 676 029
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-3 group/item">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary-light group-hover/item:bg-primary group-hover/item:text-white transition-all">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">Email Concierge</p>
                  <Link href="mailto:support@kamerndah.com" className="text-xs font-bold text-white hover:text-primary-light transition-colors">
                    support@kamerndah.com
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-3 group/item">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary-light group-hover/item:bg-primary group-hover/item:text-white transition-all">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">Headquarters</p>
                  <p className="text-xs font-bold text-white">Bastos, Yaoundé, CM</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Final Bottom Bar */}
        <div className="pt-12 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex items-center space-x-8 text-[11px] font-bold uppercase tracking-widest text-gray-600">
            <p>© {currentYear} KamerNdah.</p>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Verified Identity Network</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-12">
            <div className="flex items-center space-x-2 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
              <Award className="w-5 h-5 text-blue-400" />
              <span className="text-[10px] font-black uppercase text-white tracking-widest">Fintech Approved</span>
            </div>
            <div className="flex items-center space-x-2 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
              <Zap className="w-5 h-5 text-secondary" />
              <span className="text-[10px] font-black uppercase text-white tracking-widest">Instant Booking</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}