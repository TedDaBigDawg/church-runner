"use client";
import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Home,
  Info,
  Calendar,
  Phone,
  LayoutDashboard,
  MessageCircle,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClickOutside } from "@/hooks/use-click-outside";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import ActivityNotifications from "./activity-notifications";
import Image from "next/image";

interface NavbarProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

const navigationItems = {
  public: [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/about", icon: Info },
    { name: "Services", href: "/services", icon: Calendar },
    { name: "Appointment", href: "/book-appointment", icon: MessageCircle },
    { name: "Contact", href: "/contact", icon: Phone },
    { name: "Live Stream", href: "/live-stream", icon: Video },
  ],
  authenticated: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ],
  admin: [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  ],
  superadmin: [
    { name: "Dashboard", href: "/superadmin/dashboard", icon: LayoutDashboard },
  ],
};

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useClickOutside(mobileMenuRef as React.RefObject<HTMLElement>, () => {
    if (mobileMenuOpen) setMobileMenuOpen(false);
  });

  useClickOutside(userMenuRef as React.RefObject<HTMLElement>, () => {
    if (userMenuOpen) setUserMenuOpen(false);
  });

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = useCallback(async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Logout failed");
      }
      const redirectUrl = data.redirectUrl || "/login";
      router.push(redirectUrl);
      router.refresh();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, [router]);

  const getNavigationItems = useCallback(() => {
    const items = [...navigationItems.public];
    if (user) {
      if (user.role === "PARISHIONER")
        items.push(...navigationItems.authenticated);
      if (user.role === "ADMIN") items.push(...navigationItems.admin);
      if (user.role === "SUPERADMIN") items.push(...navigationItems.superadmin);
    }
    return items;
  }, [user]);

  const navItems = getNavigationItems();

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  function getProfilePath(role: string) {
    switch (role) {
      case "ADMIN":
        return "/admin/profile";
      case "SUPERADMIN":
      case "PARISHIONER":
      default:
        return "/profile";
    }
  }

  return (
    <nav className="bg-primary text-text-secondary sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/assets/transparent-logo.png"
                width={120}
                height={120}
                alt="Lumina Logo"
                className="w-24 sm:w-28 md:w-32 lg:w-36 h-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2  text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-primary/80 border-white border-2 rounded-full text-white"
                      : "hover:bg-primary/50"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <item.icon className="h-4 w-4 mr-1" />
                  {item.name}
                </Link>
              );
            })}
            {/* {!user && (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="text-white border-white hover:bg-blue-500 rounded-lg px-4 py-2 text-sm"
                    aria-label="Sign in">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    variant="outline"
                    className="text-white border-white hover:bg-blue-500 rounded-lg px-4 py-2 text-sm"
                    aria-label="Register">
                    Register
                  </Button>
                </Link>
              </div>
            )} */}
          </div>

          {/* Right Side (User Menu, Notifications, Mobile Menu Button) */}
          <div className="flex items-center space-x-2">
            {user && (
              <div className="flex items-center">
                <ActivityNotifications />
              </div>
            )}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  className="flex items-center text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors duration-200"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="ml-2 hidden xl:block max-w-[120px] truncate text-sm">
                    {user.name}
                  </span>
                  <ChevronDown
                    className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg py-1 bg-white ring-1 ring-black/5 z-10"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu"
                    >
                      <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200">
                        <span className="font-medium">Signed in as</span>
                        <div className="font-medium truncate mt-0.5 text-gray-700">
                          {user.email}
                        </div>
                      </div>
                      <Link
                        href={getProfilePath(user.role)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Your Profile
                      </Link>
                      <Link
                        href="/dashboard/activities"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Your Activities
                      </Link>
                      <button
                        type="button"
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        onClick={handleLogout}
                      >
                        <div className="flex items-center">
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign out
                        </div>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-2">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="text-white border-white hover:bg-blue-500 rounded-lg px-4 py-2 text-sm"
                    aria-label="Sign in"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    variant="outline"
                    className="text-white border-white hover:bg-blue-500 rounded-lg px-4 py-2 text-sm"
                    aria-label="Register"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}
            <div className="lg:hidden">
              <button
                type="button"
                className="p-2 rounded-lg text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black lg:hidden z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-64 bg-primary shadow-lg lg:hidden z-50 overflow-y-auto"
              ref={mobileMenuRef}
            >
              <div className="px-4 py-4 flex justify-between items-center border-b border-primary/30">
                <span className="font-semibold text-lg text-white">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-white hover:bg-primary/border-primary/30"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {user && (
                <div className="px-4 py-3 border-b border-primary/30">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-white truncate">
                        {user.name}
                      </div>
                      <div className="text-sm text-blue-200 truncate">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="px-2 pt-2 pb-4 space-y-1">
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 rounded-lg text-base font-medium text-white ${
                        isActive
                          ? "bg-blue-800"
                          : "hover:bg-primary/border-primary/30"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
                {!user ? (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-white hover:bg-primary/border-primary/30"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-white hover:bg-primary/border-primary/30"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href={getProfilePath(user.role)}
                      className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-white hover:bg-primary/border-primary/30"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5 mr-2" />
                      Profile
                    </Link>
                    <Link
                      href="/dashboard/activities"
                      className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-white hover:bg-primary/border-primary/30"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      Your Activities
                    </Link>
                    <button
                      type="button"
                      className="w-full text-left flex items-center px-3 py-2 rounded-lg text-base font-medium text-white hover:bg-primary/border-primary/30"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Sign out
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
