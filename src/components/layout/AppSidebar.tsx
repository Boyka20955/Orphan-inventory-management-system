
import {
  LayoutDashboard,
  FileText,
  Utensils,
  Shirt,
  Heart,
  Settings,
  Stethoscope,
  BarChart,
  LogOut,
  Mic,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sidebar, SidebarContent, SidebarFooter, SidebarSeparator } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

const AppSidebar = () => {
  const { language } = useLanguage();
  const { logout } = useAuth();
  const { state } = useSidebar();

  const handleLogout = () => {
    logout();
  };

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className="border-r border-border">
      <SidebarContent className="pt-4">
        <div className="flex flex-col gap-1 px-2 mb-4">
          <div className="flex items-center justify-center mb-6">
            <h1 className={`text-xl font-bold text-primary transition-opacity duration-200 ${isCollapsed ? 'opacity-0 absolute' : 'opacity-100'}`}>
              {language === 'en' ? 'Orphanage Center' : 'Kituo cha Watoto'}
            </h1>
          </div>
          
          <SidebarLink
            icon={<LayoutDashboard className="h-4 w-4" />}
            label={language === 'en' ? 'Dashboard' : 'Paneli'}
            href="/"
            isCollapsed={isCollapsed}
          />
          <SidebarLink
            icon={<FileText className="h-4 w-4" />}
            label={language === 'en' ? 'Children Records' : 'Rekodi za Watoto'}
            href="/children-records"
            isCollapsed={isCollapsed}
          />
          <SidebarLink 
            icon={<Stethoscope className="h-4 w-4" />} 
            label={language === 'en' ? 'Health Records' : 'Rekodi za Afya'} 
            href="/health-records" 
            isCollapsed={isCollapsed}
          />
          {/* <SidebarLink 
            icon={<BarChart className="h-4 w-4" />} 
            label={language === 'en' ? 'Reports' : 'Ripoti'} 
            href="/reports" 
            isCollapsed={isCollapsed}
          /> */}
          <SidebarLink
            icon={<Utensils className="h-4 w-4" />}
            label={language === 'en' ? 'Food Inventory' : 'Hifadhi ya Chakula'}
            href="/food-inventory"
            isCollapsed={isCollapsed}
          />
          <SidebarLink
            icon={<Shirt className="h-4 w-4" />}
            label={language === 'en' ? 'Clothing Inventory' : 'Hifadhi ya Mavazi'}
            href="/clothing-inventory"
            isCollapsed={isCollapsed}
          />
          <SidebarLink
            icon={<Heart className="h-4 w-4" />}
            label={language === 'en' ? 'Donations' : 'Michango'}
            href="/donations"
            isCollapsed={isCollapsed}
          />
          <SidebarLink
            icon={<Mic className="h-4 w-4" />}
            label={language === 'en' ? 'Language Tools' : 'Zana za Lugha'}
            href="/speech"
            isCollapsed={isCollapsed}
          />
          <SidebarLink
            icon={<Settings className="h-4 w-4" />}
            label={language === 'en' ? 'Backup' : 'Hifadhi Nakala'}
            href="/backup"
            isCollapsed={isCollapsed}
          />
        </div>
      </SidebarContent>
      
      <SidebarFooter className="mt-auto p-2 pb-5">
        <SidebarSeparator className="mb-3" />
        <Button
          variant="ghost" 
          className="w-full flex items-center justify-start gap-2 px-2 py-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span className={`transition-opacity duration-200 ${isCollapsed ? 'opacity-0 absolute' : 'opacity-100'}`}>
            {language === 'en' ? 'Log Out' : 'Toka'}
          </span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

const SidebarLink = ({ 
  icon, 
  label, 
  href,
  isCollapsed
}: { 
  icon: React.ReactNode, 
  label: string, 
  href: string,
  isCollapsed: boolean
}) => {
  return (
    <Link 
      to={href}
      className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
    >
      {icon}
      <span className={`transition-opacity duration-200 ${isCollapsed ? 'opacity-0 absolute' : 'opacity-100'}`}>
        {label}
      </span>
    </Link>
  );
};

export default AppSidebar;