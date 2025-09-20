import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Search, Heart, Menu, X } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 border-b border-gray-200 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" data-testid="logo-link">
            <i className="fas fa-hammer text-primary text-2xl"></i>
            <span className="font-serif font-bold text-xl text-foreground">ArtisanConnect</span>
            <span className="ai-badge text-white text-xs px-2 py-1 rounded-full">AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/marketplace"
              className={`text-sm transition-colors hover:text-foreground ${
                location === "/marketplace" ? "text-foreground" : "text-muted-foreground"
              }`}
              data-testid="link-marketplace"
            >
              Marketplace
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href="/upload"
                  className={`text-sm transition-colors hover:text-foreground ${
                    location === "/upload" ? "text-foreground" : "text-muted-foreground"
                  }`}
                  data-testid="link-upload"
                >
                  Sell
                </Link>
                <Link
                  href={`/artisan/${user?.id}`}
                  className={`text-sm transition-colors hover:text-foreground ${
                    location.startsWith("/artisan") ? "text-foreground" : "text-muted-foreground"
                  }`}
                  data-testid="link-profile"
                >
                  My Profile
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <button 
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-search"
            >
              <Search className="h-5 w-5" />
            </button>
            {isAuthenticated && (
              <button 
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-favorites"
              >
                <Heart className="h-5 w-5" />
              </button>
            )}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {user?.profileImageUrl && (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                    data-testid="img-avatar"
                  />
                )}
                <button
                  onClick={async () => {
                    try {
                      // Call logout API
                      await fetch('/api/auth/logout', {
                        method: 'POST',
                        credentials: 'include'
                      });

                      // Clear any stored auth data
                      localStorage.clear();
                      sessionStorage.clear();

                      // Invalidate auth queries
                      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });

                      toast({
                        title: "Signed out",
                        description: "You have been successfully signed out.",
                      });

                      // Redirect to landing page
                      setLocation("/");
                    } catch (error) {
                      console.error('Logout error:', error);
                      // Still redirect even if API call fails
                      localStorage.clear();
                      sessionStorage.clear();
                      setLocation("/");
                    }
                  }}
                  className="btn-outline text-sm"
                  data-testid="button-logout"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link href="/login">
                <button
                  className="btn-primary text-sm"
                  data-testid="button-signin"
                >
                  Sign In
                </button>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <div className="space-y-4">
              <Link
                href="/marketplace"
                className="block text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="mobile-link-marketplace"
              >
                Marketplace
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    href="/upload"
                    className="block text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="mobile-link-upload"
                  >
                    Sell
                  </Link>
                  <Link
                    href={`/artisan/${user?.id}`}
                    className="block text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="mobile-link-profile"
                  >
                    My Profile
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
