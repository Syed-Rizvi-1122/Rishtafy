import { Link } from 'react-router';
import { Star, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer style={{ backgroundColor: '#1B3B2D' }} className="text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Star size={16} fill="#C5A55A" color="#C5A55A" />
              <span className="font-playfair text-xl">Rishtafy</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Verified profiles. Guardian controls. Intent-only matching. Your trusted partner in finding a halal connection.
            </p>
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#C5A55A' }}>Quick Links</p>
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-white/60 hover:text-white no-underline transition-colors">Home</Link>
              <Link to="/register" className="block text-sm text-white/60 hover:text-white no-underline transition-colors">Register</Link>
              <Link to="/login" className="block text-sm text-white/60 hover:text-white no-underline transition-colors">Login</Link>
            </div>
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#C5A55A' }}>Our Promise</p>
            <p className="text-sm text-white/60 leading-relaxed">
              Rishtafy is built with Islamic values at its core — privacy, respect, and guardian involvement in every step.
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/40 text-xs">© 2026 Rishtafy. All rights reserved.</p>
          <p className="text-white/40 text-xs flex items-center gap-1">
            Made with <Heart size={12} fill="#C5A55A" color="#C5A55A" /> for the ummah
          </p>
        </div>
      </div>
    </footer>
  );
}