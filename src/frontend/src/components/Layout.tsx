import { useInternetIdentity } from '../hooks/useInternetIdentity';
import Navigation from './Navigation';
import { SiX, SiFacebook, SiInstagram } from 'react-icons/si';
import { Heart } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'crochet-studio'
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">{children}</main>
      <footer className="bg-card border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-serif text-lg font-semibold mb-3 text-foreground">Crochet Studio</h3>
              <p className="text-sm text-muted-foreground">
                Your creative companion for crochet projects, tutorials, and inspiration.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold mb-3 text-foreground">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="/" className="hover:text-primary transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/tutorials" className="hover:text-primary transition-colors">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="/projects" className="hover:text-primary transition-colors">
                    Gallery
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold mb-3 text-foreground">Connect</h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Facebook"
                >
                  <SiFacebook size={20} />
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Instagram"
                >
                  <SiInstagram size={20} />
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="X (Twitter)"
                >
                  <SiX size={20} />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            <p>
              © {currentYear} Crochet Studio. Built with <Heart className="inline w-4 h-4 text-rose-500" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
