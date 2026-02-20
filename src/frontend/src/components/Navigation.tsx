import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import ProfileSetupModal from './ProfileSetupModal';
import { useGetCallerUserProfile, useIsCallerAdmin } from '../hooks/useQueries';

export default function Navigation() {
  const navigate = useNavigate();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: isAdmin, isLoading: isAdminLoading, error: isAdminError, isFetched: isAdminFetched } = useIsCallerAdmin();

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Debug logging for identity and admin state
  useEffect(() => {
    console.log('[Navigation] Identity state:', {
      isAuthenticated,
      identityExists: !!identity,
      principal: identity?.getPrincipal().toString(),
    });
  }, [identity, isAuthenticated]);

  useEffect(() => {
    console.log('[Navigation] Admin query state:', {
      isAdmin,
      isAdminLoading,
      isAdminFetched,
      isAdminError,
      isAuthenticated,
    });
  }, [isAdmin, isAdminLoading, isAdminFetched, isAdminError, isAuthenticated]);

  // Force re-evaluation when identity changes
  useEffect(() => {
    if (identity) {
      console.log('[Navigation] Identity changed, invalidating admin query');
      queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
    }
  }, [identity, queryClient]);

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Tutorials', path: '/tutorials' },
    { label: 'Gallery', path: '/projects' },
    ...(isAuthenticated
      ? [
          { label: 'My Projects', path: '/my-projects' },
          { label: 'Publish', path: '/publish' },
        ]
      : []),
    ...(isAuthenticated && !isAdminLoading && isAdmin === true ? [{ label: 'Admin', path: '/admin' }] : []),
  ];

  // Debug log for navLinks
  useEffect(() => {
    console.log('[Navigation] Nav links computed:', {
      totalLinks: navLinks.length,
      hasAdminLink: navLinks.some(link => link.label === 'Admin'),
      condition: {
        isAuthenticated,
        isAdminLoading,
        isAdmin,
        shouldShowAdmin: isAuthenticated && !isAdminLoading && isAdmin === true,
      },
    });
  }, [navLinks.length, isAuthenticated, isAdminLoading, isAdmin]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate({ to: '/' })}
              className="font-serif text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
            >
              Crochet Studio
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate({ to: link.path })}
                  className="text-foreground/80 hover:text-primary transition-colors font-medium"
                >
                  {link.label}
                </button>
              ))}
              <Button onClick={handleAuth} disabled={disabled} variant={isAuthenticated ? 'outline' : 'default'}>
                {disabled ? 'Loading...' : isAuthenticated ? 'Logout' : 'Login'}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-3">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => {
                    navigate({ to: link.path });
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-foreground/80 hover:text-primary transition-colors font-medium py-2"
                >
                  {link.label}
                </button>
              ))}
              <Button onClick={handleAuth} disabled={disabled} variant={isAuthenticated ? 'outline' : 'default'} className="w-full">
                {disabled ? 'Loading...' : isAuthenticated ? 'Logout' : 'Login'}
              </Button>
            </div>
          )}
        </nav>
      </header>

      {showProfileSetup && <ProfileSetupModal />}
    </>
  );
}
