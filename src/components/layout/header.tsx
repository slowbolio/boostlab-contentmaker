import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/auth-context";
import { 
  Moon, 
  Sun, 
  Bell, 
  Search, 
  Menu, 
  X,
  LogOut
} from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import logoImage from '@/assets/images/Color logo - no background.png';

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Content Creator', href: '/content-creator' },
  { name: 'Content Enhancer', href: '/content-enhancer' },
  { name: 'A/B Testing', href: '/ab-testing' },
  { name: 'Templates', href: '/templates' },
  { name: 'Saved Projects', href: '/saved-projects' },
  { name: 'Analytics', href: '/analytics' },
  { name: 'Team', href: '/team' },
  { name: 'Settings', href: '/settings' },
];

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuthContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "An error occurred during logout.",
      });
    }
  };

  return (
    <header className="border-b bg-background">
      <div className="flex h-14 items-center px-4">
        <div className="md:hidden mr-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <div className="md:hidden flex items-center">
          <img 
            src={logoImage} 
            alt="BoostLab Logo" 
            className="h-8 w-auto" 
          />
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-foreground">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-foreground">
            <Bell className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="text-foreground"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
          {user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-foreground"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 z-50 w-full bg-background p-6 sm:max-w-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src={logoImage} 
                  alt="BoostLab Logo" 
                  className="h-8 w-auto" 
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                className="text-foreground"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="mt-6 flow-root">
              <div className="space-y-1 py-6">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      isActive
                        ? 'block rounded-lg py-2 px-3 text-base font-semibold bg-muted text-foreground'
                        : 'block rounded-lg py-2 px-3 text-base font-semibold text-muted-foreground hover:bg-muted hover:text-foreground'
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
              <div className="border-t py-6">
                {user && (
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                        {user.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-muted-foreground text-xs">{user.email}</div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="w-full"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}