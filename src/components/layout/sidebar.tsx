import { NavLink } from 'react-router-dom';
import { useAuthContext } from '@/contexts/auth-context';
import { 
  LayoutDashboard, 
  PenTool, 
  Wand2, 
  Files, 
  FileText, 
  BarChart3, 
  Settings,
  Users,
  LayoutGrid,
  LogOut,
  Search,
  Edit,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import logoImage from '@/assets/images/Color logo - no background.png';
import { useState } from 'react';

// Organize navigation items in categories
const navigationGroups = [
  {
    category: "Översikt",
    items: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    ]
  },
  {
    category: "Innehållsverktyg",
    items: [
      { name: 'Content Creator', href: '/content-creator', icon: PenTool },
      { name: 'Advanced Editor', href: '/advanced-editor', icon: Edit },
      { name: 'Content Enhancer', href: '/content-enhancer', icon: Wand2 },
      { name: 'A/B Testing', href: '/ab-testing', icon: LayoutGrid },
    ]
  },
  {
    category: "Innehållshantering",
    items: [
      { name: 'Templates', href: '/templates', icon: FileText },
      { name: 'Saved Projects', href: '/saved-projects', icon: Files },
    ]
  },
  {
    category: "Analys & Insikter",
    items: [
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
      { name: 'SEO Analysis', href: '/seo-analysis', icon: Search },
    ]
  },
  {
    category: "Administration",
    items: [
      { name: 'Team', href: '/team', icon: Users },
      { name: 'Settings', href: '/settings', icon: Settings },
    ]
  }
];

export default function Sidebar() {
  const { user, logout } = useAuthContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    navigationGroups.map(group => group.category) // Initially expand all categories
  );

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

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="hidden md:flex h-full w-64 flex-col bg-sidebar border-r">
      <div className="flex h-16 items-center border-b px-4">
        <div className="flex items-center">
          <img 
            src={logoImage} 
            alt="BoostLab Logo" 
            className="h-10 w-auto"
          />
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
        {navigationGroups.map((group) => (
          <div key={group.category} className="mb-4">
            <div 
              className={cn(
                'sidebar-category menu-transition',
                expandedCategories.includes(group.category) && 'sidebar-category-active'
              )}
              onClick={() => toggleCategory(group.category)}
            >
              <span>{group.category}</span>
              {expandedCategories.includes(group.category) 
                ? <ChevronDown className="h-4 w-4" /> 
                : <ChevronRight className="h-4 w-4" />
              }
            </div>
            
            {expandedCategories.includes(group.category) && (
              <div className="sidebar-category-content menu-transition">
                {group.items.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        'sidebar-nav-item',
                        isActive && 'active'
                      )
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="text-sm">{item.name}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      
      <div className="border-t p-4">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
              {user?.name?.substring(0, 2).toUpperCase() || 'U'}
            </div>
            <div className="text-sm">
              <div className="font-medium text-sidebar-foreground">{user?.name || 'Användare'}</div>
              <div className="text-sidebar-foreground/60 text-xs">{user?.email || 'användare@example.com'}</div>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logga ut
          </Button>
        </div>
      </div>
    </div>
  );
}