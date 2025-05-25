"use client";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn, getRoleLabel } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { countPendingProjects } from "@/api/projects";
import { useAuth } from "@/hooks/auth";
import { logoutUser } from "@/api/users";

export default function NavBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [countPending, setCountPending] = useState(0);

  useEffect(() => {
    if (!loading && user.role == "admin") {
      countPendingProjects().then((data) => {
        setCountPending(data.total_pending);
      });
    }
  }, [loading]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  function logout() {
    logoutUser().then(() => {
      navigate("/login");
    });
  }

  const navItems = [
    { to: "/", label: "Acceuil" },
    { to: "/e-archive-53-2023", label: "E-Archive-53-2023" },
    { to: "/e-archive-18-2022", label: "E-Archive-18-2022" },
    { to: "/utilisateurs", label: "Utilisateurs", allowedRoles: ["admin"] },
    {
      to: "/projets-en-attente",
      label: "Projets en attente",
      badge: countPending > 0 ? countPending : null,
      allowedRoles: ["admin"],
    },
    { to: "/journal", label: "Journal", allowedRoles: ["admin"] },
    { to: "/historique", label: "Historique" },
  ];

  if (loading) return <div></div>;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <img
              src="/logo.jpg"
              alt="ORMVAG"
              className="w-16 sm:w-20 rounded-md"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-[11px] xl:text-[12px]">
          {navItems
            .filter(
              (item) =>
                !item.allowedRoles || item.allowedRoles.includes(user.role)
            )
            .map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "font-medium transition-colors hover:text-primary whitespace-nowrap",
                  pathname === item.to
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <span className="flex items-center">
                  {item.label}
                  {item.badge && (
                    <Badge className="ml-1 bg-amber-100 text-amber-700 hover:bg-amber-100 h-4 px-1 text-[10px]">
                      {item.badge}
                    </Badge>
                  )}
                </span>
              </Link>
            ))}
        </nav>

        {/* Desktop User Menu & Mobile Menu Button */}
        <div className="flex items-center gap-2">
          {/* Desktop User Menu */}
          <div className="hidden lg:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 border cursor-pointer hover:opacity-80">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user.fname.charAt(0)}
                    {user.lname.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium">
                    {user.fname} {user.lname}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getRoleLabel(user.role)}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate("/profil")}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Mon profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t bg-white">
          <nav className="container px-4 py-4 space-y-3">
            {navItems
              .filter(
                (item) =>
                  !item.allowedRoles || item.allowedRoles.includes(user.role)
              )
              .map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={closeMobileMenu}
                  className={cn(
                    "block py-2 px-3 rounded-md font-medium transition-colors",
                    pathname === item.to
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-gray-100"
                  )}
                >
                  <span className="flex items-center justify-between">
                    {item.label}
                    {item.badge && (
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 h-5 px-2">
                        {item.badge}
                      </Badge>
                    )}
                  </span>
                </Link>
              ))}

            {/* Mobile User Section */}
            <div className="pt-4 border-t">
              <div className="flex items-center gap-3 py-2 px-3">
                <Avatar className="h-8 w-8 border">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user.fname.charAt(0)}
                    {user.lname.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {user.fname} {user.lname}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getRoleLabel(user.role)}
                  </p>
                </div>
              </div>
              <Link
                to="/profil"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 py-2 px-3 rounded-md text-muted-foreground hover:bg-gray-100"
              >
                <User className="h-4 w-4" />
                <span>Mon profil</span>
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-3 py-2 px-3 rounded-md text-red-600 hover:bg-red-50 w-full text-left"
              >
                <LogOut className="h-4 w-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
