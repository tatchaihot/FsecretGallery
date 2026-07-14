import { Link } from '../lib/router';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight">F-Secret AI Art</span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              หน้าแรก
            </Link>
            <Link to="/gallery" className="hover:text-foreground transition-colors">
              แกลเลอรี่
            </Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">
              ติดต่อ
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> F-Secret AI Art
          </p>
        </div>
      </div>
    </footer>
  );
}
