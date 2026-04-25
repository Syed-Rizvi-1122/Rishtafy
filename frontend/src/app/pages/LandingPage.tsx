import { Link } from 'react-router';
import { Shield, Users, Eye, Star, ArrowRight, CheckCircle, Heart, Lock, ShieldCheck, Target } from 'lucide-react';
import { Footer } from '../components/layout/Footer';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1775179182715-61dd143f7899?w=1400&q=80';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col font-inter" style={{ backgroundColor: 'var(--color-neutral-50)' }}>
      {/* Navbar */}
      <nav style={{ backgroundColor: 'var(--color-primary-900)' }} className="sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star size={18} fill="var(--color-accent-500)" color="var(--color-accent-500)" />
            <span className="font-playfair text-white text-xl">Rishtafy</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-white/80 hover:text-white text-sm px-4 py-1.5 rounded-md transition-colors no-underline hidden sm:block">
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm px-4 py-2 rounded-lg font-medium no-underline transition-colors"
              style={{ backgroundColor: 'var(--color-accent-500)', color: 'white' }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ minHeight: '88vh' }}>
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(27,59,45,0.92) 0%, rgba(27,59,45,0.75) 60%, rgba(27,59,45,0.5) 100%)' }} />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24" style={{ minHeight: '88vh' }}>
          <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--color-accent-500)' }}>
            ✦ Intent-Based Matrimonial ✦
          </p>
          <h1 className="font-playfair text-white mb-5 leading-tight max-w-3xl" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
            Find Your Partner With <span style={{ color: 'var(--color-accent-500)' }}>Purpose</span> & Dignity
          </h1>
          <p className="text-white/75 mb-10 max-w-xl leading-relaxed" style={{ fontSize: '1.05rem' }}>
            Rishtafy is a verified matrimonial platform built for Pakistani and South Asian Muslim families — with guardian involvement, photo privacy, and intent-first matching.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="/register"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium no-underline transition-all hover:shadow-xl hover:scale-105 text-white"
              style={{ backgroundColor: 'var(--color-accent-500)' }}
            >
              Create Your Profile
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium no-underline transition-all border border-white/40 text-white hover:bg-white/10"
            >
              Sign In
            </Link>
          </div>
          <div className="flex items-center gap-8 mt-14 text-white/60 text-sm">
            <div className="text-center">
              <p className="text-2xl font-semibold text-white">847+</p>
              <p>Verified Profiles</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-semibold text-white">312</p>
              <p>Connections Made</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-semibold text-white">100%</p>
              <p>Halal Process</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6" style={{ backgroundColor: 'var(--color-neutral-50)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.25em] uppercase mb-3" style={{ color: 'var(--color-accent-500)' }}>Why Rishtafy</p>
            <h2 className="font-playfair mb-4" style={{ color: 'var(--color-primary-900)', fontSize: '2rem' }}>
              A Platform Built on Islamic Values
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: 'var(--color-neutral-400)' }}>
              Every feature is designed to protect your dignity, involve your family, and ensure every interaction is intentional.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: 'Verified Profiles',
                desc: 'Every profile goes through a manual verification process. Look for the verified badge to know you\'re speaking with a genuine person.',
                highlight: 'Manual verification by our team',
              },
              {
                icon: Users,
                title: 'Guardian Dashboard',
                desc: 'Parents and guardians have a dedicated dashboard to manage their candidate\'s profile and review every incoming interest request before it reaches the candidate.',
                highlight: 'Full guardian control',
              },
              {
                icon: Target,
                title: 'Intent-Only Matching',
                desc: 'Connect with purpose on a platform built strictly for serious matrimonial intentions. Interactions are focused on finding a lifelong partner.',
                highlight: 'Serious intentions only',
              },
            ].map(({ icon: Icon, title, desc, highlight }) => (
              <div key={title} className="bg-white rounded-2xl p-7 shadow-sm border" style={{ borderColor: 'var(--color-neutral-100)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(27,59,45,0.08)' }}>
                  <Icon size={22} color="var(--color-primary-900)" />
                </div>
                <h3 className="font-playfair mb-2" style={{ color: 'var(--color-primary-900)', fontSize: '1.15rem' }}>{title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-neutral-400)' }}>{desc}</p>
                <p className="text-xs font-medium flex items-center gap-1.5" style={{ color: 'var(--color-accent-500)' }}>
                  <CheckCircle size={12} />
                  {highlight}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6" style={{ backgroundColor: 'var(--color-primary-900)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.25em] uppercase mb-3" style={{ color: 'var(--color-accent-500)' }}>The Process</p>
            <h2 className="font-playfair text-white mb-3" style={{ fontSize: '2rem' }}>How Rishtafy Works</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>Simple, respectful, and family-inclusive from start to finish.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', icon: Users, title: 'Create Profile', desc: 'Register and build your detailed profile with your guardian\'s help.' },
              { step: '02', icon: Shield, title: 'Get Verified', desc: 'Our team manually verifies your profile for authenticity.' },
              { step: '03', icon: Heart, title: 'Send Interest', desc: 'Browse verified profiles and express interest. Guardians are notified.' },
              { step: '04', icon: Lock, title: 'Connect & Chat', desc: 'Once mutually accepted, photos unlock and chat opens.' },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 relative" style={{ backgroundColor: 'rgba(197,165,90,0.15)', border: '1px solid rgba(197,165,90,0.3)' }}>
                  <Icon size={20} color="var(--color-accent-500)" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center font-semibold" style={{ backgroundColor: 'var(--color-accent-500)', color: 'var(--color-primary-900)' }}>
                    {step.replace('0', '')}
                  </span>
                </div>
                <h3 className="font-playfair text-white mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 text-center" style={{ backgroundColor: 'var(--color-neutral-50)' }}>
        <div className="max-w-2xl mx-auto">
          <Star size={28} fill="var(--color-accent-500)" color="var(--color-accent-500)" className="mx-auto mb-4" />
          <h2 className="font-playfair mb-4" style={{ color: 'var(--color-primary-900)', fontSize: '2rem' }}>
            Ready to Begin Your Journey?
          </h2>
          <p className="mb-8 leading-relaxed" style={{ color: 'var(--color-neutral-400)' }}>
            Join hundreds of Pakistani and South Asian Muslim families who trust Rishtafy for a dignified, intent-based rishta process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-medium no-underline transition-all hover:shadow-lg text-white"
              style={{ backgroundColor: 'var(--color-accent-500)' }}
            >
              Register as Candidate
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/register"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-medium no-underline transition-all border"
              style={{ color: 'var(--color-primary-900)', borderColor: 'var(--color-primary-900)' }}
            >
              Register as Guardian
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}