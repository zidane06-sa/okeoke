import { useState } from 'react';
import { useAuth } from '../lib/authContext';
import { Baby, Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    onNavigate('home');
    setIsOpen(false);
  };

  const handleNavClick = (page: string) => {
    onNavigate(page);
    setIsOpen(false);
  };

  const navLinks = [
    { label: 'Profil PAUD', page: 'profile' },
    { label: 'Profil Staff', page: 'staff' },
    { label: 'Visi & Misi', page: 'vision' },
    { label: 'Kontak', page: 'contact' },
  ];

  const parentLinks = [
    { label: 'Dashboard', page: 'parent-dashboard' },
  ];

  const adminLinks = [
    { label: 'Dashboard', page: 'admin-dashboard' },
  ];

  const teacherLinks = [
    { label: 'Dashboard', page: 'teacher-dashboard' },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="bg-gradient-to-br from-pink-300 to-purple-300 p-2 rounded-xl">
              <Baby className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-lg bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              PAUD Tunas Ceria
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => handleNavClick(link.page)}
                className={`text-sm hover:text-pink-500 transition-colors ${
                  currentPage === link.page ? 'text-pink-500' : 'text-gray-700'
                }`}
              >
                {link.label}
              </button>
            ))}

            {isAuthenticated && user?.role === 'parent' && (
              <button
                onClick={() => handleNavClick('parent-dashboard')}
                className={`text-sm hover:text-pink-500 transition-colors ${
                  currentPage === 'parent-dashboard' ? 'text-pink-500' : 'text-gray-700'
                }`}
              >
                Dashboard
              </button>
            )}

            {isAuthenticated && user?.role === 'admin' && (
              <button
                onClick={() => handleNavClick('admin-dashboard')}
                className={`text-sm hover:text-pink-500 transition-colors ${
                  currentPage === 'admin-dashboard' ? 'text-pink-500' : 'text-gray-700'
                }`}
              >
                Dashboard Admin
              </button>
            )}

            {isAuthenticated && user?.role === 'teacher' && (
              <button
                onClick={() => handleNavClick('teacher-dashboard')}
                className={`text-sm hover:text-pink-500 transition-colors ${
                  currentPage === 'teacher-dashboard' ? 'text-pink-500' : 'text-gray-700'
                }`}
              >
                Dashboard Guru
              </button>
            )}

            <div className="flex items-center gap-3 border-l pl-6">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <UserIcon className="w-4 h-4" />
                    <span>{user?.fullName}</span>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => handleNavClick('login')}
                    variant="outline"
                    size="sm"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => handleNavClick('register')}
                    size="sm"
                    className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
                  >
                    Register
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <button
                    key={link.page}
                    onClick={() => handleNavClick(link.page)}
                    className={`text-left py-2 hover:text-pink-500 transition-colors ${
                      currentPage === link.page ? 'text-pink-500' : 'text-gray-700'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}

                {isAuthenticated && user?.role === 'parent' && (
                  <button
                    onClick={() => handleNavClick('parent-dashboard')}
                    className={`text-left py-2 hover:text-pink-500 transition-colors ${
                      currentPage === 'parent-dashboard' ? 'text-pink-500' : 'text-gray-700'
                    }`}
                  >
                    Dashboard
                  </button>
                )}

                {isAuthenticated && user?.role === 'admin' && (
                  <button
                    onClick={() => handleNavClick('admin-dashboard')}
                    className={`text-left py-2 hover:text-pink-500 transition-colors ${
                      currentPage === 'admin-dashboard' ? 'text-pink-500' : 'text-gray-700'
                    }`}
                  >
                    Dashboard Admin
                  </button>
                )}

                {isAuthenticated && user?.role === 'teacher' && (
                  <button
                    onClick={() => handleNavClick('teacher-dashboard')}
                    className={`text-left py-2 hover:text-pink-500 transition-colors ${
                      currentPage === 'teacher-dashboard' ? 'text-pink-500' : 'text-gray-700'
                    }`}
                  >
                    Dashboard Guru
                  </button>
                )}

                <div className="border-t pt-4 mt-4">
                  {isAuthenticated ? (
                    <>
                      <div className="text-sm text-gray-700 mb-4">
                        {user?.fullName}
                      </div>
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="w-full gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => handleNavClick('login')}
                        variant="outline"
                        className="w-full"
                      >
                        Login
                      </Button>
                      <Button
                        onClick={() => handleNavClick('register')}
                        className="w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
                      >
                        Register
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
