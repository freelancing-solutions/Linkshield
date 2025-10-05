"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, Moon, Sun, User, LogOut, Settings, Shield } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore } from "@/stores/authStore"
import { useUiStore } from '@/stores/uiStore';

/**
 * Navigation link configuration for the top navigation bar
 */
interface NavLink {
  /** Display text for the navigation link */
  label: string
  /** URL path for the navigation link */
  href: string
  /** Whether the link should open in a new tab */
  external?: boolean
}

/**
 * Props for the TopNav component
 */
interface TopNavProps {
  /** Additional CSS classes to apply to the navigation container */
  className?: string
}

/**
 * Main navigation links displayed in the top navigation bar
 */
const navigationLinks: NavLink[] = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
]

/**
 * TopNav Component
 * 
 * A responsive top navigation bar that provides:
 * - Brand logo and navigation links
 * - Theme toggle (light/dark mode)
 * - User authentication state handling
 * - Mobile-responsive navigation drawer
 * - User profile dropdown with account actions
 * 
 * The component adapts its content based on authentication state:
 * - Unauthenticated: Shows login/signup buttons
 * - Authenticated: Shows user avatar and profile dropdown
 * 
 * @param props - Component props
 * @param props.className - Additional CSS classes for styling
 * @returns JSX element representing the top navigation bar
 * 
 * @example
 * ```tsx
 * // Basic usage in root layout
 * <TopNav />
 * 
 * // With custom styling
 * <TopNav className="border-b-2" />
 * ```
 * 
 * @features
 * - Responsive design with mobile navigation drawer
 * - Theme toggle integration with uiStore
 * - Authentication state management
 * - User profile dropdown with logout functionality
 * - Accessible keyboard navigation
 * - Brand logo linking to home page
 * - External link handling for documentation
 */
const TopNav: React.FC<TopNavProps> = ({ className }) => {
  const router = useRouter()
  const { user, isAuthenticated, clearAuth } = useAuthStore()
  const { theme, setTheme } = useUiStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  /**
   * Handles user logout by clearing authentication state and redirecting to home
   */
  const handleLogout = React.useCallback(() => {
    clearAuth()
    router.push("/")
  }, [clearAuth, router])

  /**
   * Toggles between light and dark themes
   */
  const toggleTheme = React.useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light")
  }, [theme, setTheme])

  /**
   * Closes mobile menu when navigation occurs
   */
  const closeMobileMenu = React.useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  /**
   * Gets user initials for avatar fallback display
   */
  const getUserInitials = React.useCallback((fullName: string): string => {
    return fullName
      .split(" ")
      .map(name => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }, [])

  return (
    <nav className={cn(
      "sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Brand Logo */}
        <Link 
          href="/" 
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">LinkShield</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-9 w-9 px-0"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>

          {/* Authentication Actions */}
          {isAuthenticated && user ? (
            <>
              {/* Dashboard Link (Desktop) */}
              <Link href="/dashboard" className="hidden md:inline-flex">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>

              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://avatar.vercel.sh/${user.email}`} alt={user.full_name} />
                      <AvatarFallback>{getUserInitials(user.full_name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.full_name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* Unauthenticated Actions */}
              <Link href="/login" className="hidden sm:inline-flex">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  Sign up
                </Button>
              </Link>
            </>
          )}

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="md:hidden h-9 w-9 px-0"
                aria-label="Open navigation menu"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>LinkShield</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-6">
                {/* Mobile Navigation Links */}
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
                
                {/* Mobile Authentication Actions */}
                {isAuthenticated && user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={closeMobileMenu}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/settings"
                      onClick={closeMobileMenu}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                    >
                      Settings
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleLogout()
                        closeMobileMenu()
                      }}
                      className="justify-start text-red-600 hover:text-red-700"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={closeMobileMenu}>
                      <Button variant="outline" className="w-full justify-start">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/register" onClick={closeMobileMenu}>
                      <Button className="w-full justify-start">
                        Sign up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}

export { TopNav }
export type { TopNavProps }