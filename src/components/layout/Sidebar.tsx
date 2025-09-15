import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  Shirt
} from "lucide-react"
import { NavLink } from "react-router-dom"

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigation = [
    {
      title: "Dashboard",
      href: "/",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Children",
      href: "/children",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Health Records",
      href: "/health-records",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "Education Records",
      href: "/education-records",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Clothing Inventory",
      href: "/clothing-inventory",
      icon: <Shirt className="h-5 w-5" />,
    },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetTrigger asChild>
        <Menu className="md:hidden absolute top-4 left-4" />
      </SheetTrigger>
      <SheetContent className="w-64 flex flex-col justify-between">
        <div>
          <SheetHeader className="text-left">
            <SheetTitle>Orphanage Management</SheetTitle>
            <SheetDescription>
              Manage every aspect of the orphanage with ease.
            </SheetDescription>
          </SheetHeader>
          <Separator className="my-4" />
          <nav className="flex flex-col space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.title}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center space-x-2 rounded-md p-2 text-sm font-medium hover:bg-secondary ${
                    isActive ? "bg-secondary" : ""
                  }`
                }
                onClick={onClose}
              >
                {item.icon}
                <span>{item.title}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        <div>
          <Separator className="my-4" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center justify-between rounded-md p-2 text-sm font-medium hover:bg-secondary">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" alt="Your Name" />
                    <AvatarFallback>YN</AvatarFallback>
                  </Avatar>
                  <span>Your Name</span>
                </div>
                <Settings className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" forceMount>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Feedback</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
