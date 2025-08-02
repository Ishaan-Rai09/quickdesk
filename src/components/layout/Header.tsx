'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Ticket, 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut, 
  Home,
  Plus,
  LayoutDashboard
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Header() {
  const { user, isSignedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl shadow-lg">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                <Ticket className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                QuickDesk
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {isSignedIn ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-gray-700 hover:text-indigo-600 font-medium">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/tickets/new">
                  <Button variant="ghost" className="text-gray-700 hover:text-indigo-600 font-medium">
                    <Plus className="w-4 h-4 mr-2" />
                    New Ticket
                  </Button>
                </Link>
                
                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10 ring-2 ring-indigo-500/20">
                        <AvatarImage src={user?.imageUrl} alt={user?.fullName || ''} />
                        <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold">
                          {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 p-2" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.fullName || 'User'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.emailAddresses[0]?.emailAddress}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <SignOutButton>
                        <span>Sign out</span>
                      </SignOutButton>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/">
                  <Button variant="ghost" className="text-gray-700 hover:text-indigo-600 font-medium">
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button variant="ghost" className="text-gray-700 hover:text-indigo-600 font-medium">
                    Sign In
                  </Button>
                </Link>
                <Link href="/agent/login">
                  <Button variant="outline" className="font-medium">
                    Agent Login
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant="premium" className="font-medium">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative z-50"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-4 pb-4 border-t border-gray-200"
            >
              <div className="pt-4 space-y-3">
                {isSignedIn ? (
                  <>
                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-indigo-600">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/tickets/new" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-indigo-600">
                        <Plus className="w-4 h-4 mr-2" />
                        New Ticket
                      </Button>
                    </Link>
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex items-center space-x-3 p-2 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.imageUrl} alt={user?.fullName || ''} />
                          <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm">
                            {user?.firstName?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                          <p className="text-xs text-gray-500">{user?.emailAddresses[0]?.emailAddress}</p>
                        </div>
                      </div>
                      <SignOutButton>
                        <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700">
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign out
                        </Button>
                      </SignOutButton>
                    </div>
                  </>
                ) : (
                  <>
                    <Link href="/" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-indigo-600">
                        <Home className="w-4 h-4 mr-2" />
                        Home
                      </Button>
                    </Link>
                    <Link href="/sign-in" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-indigo-600">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/agent/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Agent Login
                      </Button>
                    </Link>
                    <Link href="/sign-up" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="premium" className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
