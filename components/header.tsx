"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { Menu, X, Zap } from "lucide-react";
import { RealTimeNotifications } from "@/components/real-time-notifications";
import { AIChatbot } from "@/components/ai-chatbot";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { isSignedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const linkVariants = {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0 },
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#556492]/20 bg-[#131943]/95 backdrop-blur-md">
        <div className="container flex h-14 sm:h-16 items-center px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <motion.div
              className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#84C25D] to-[#6ba348] shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-lg font-bold text-white">
                ACC IT Carnival
              </span>
              <span className="text-xs text-[#84C25D] font-medium">4.0</span>
            </div>
          </Link>
          <nav className="hidden md:flex ml-auto items-center gap-6 lg:gap-8">
            {[
              { href: "/", label: "Home" },
              { href: "/events", label: "Events" },
              { href: "/live", label: "Live", isNew: true },
              { href: "/schedule", label: "Schedule" },
              { href: "/teams", label: "Teams" },
              { href: "/gallery", label: "Gallery" },
              { href: "/about", label: "About" },
            ].map((link) => (
              <motion.div
                key={link.href}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={link.href}
                  className="text-sm font-medium text-[#D4D4D6] hover:text-[#84C25D] transition-colors duration-200 relative"
                >
                  {link.label}
                  {link.isNew && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full animate-pulse">
                      LIVE
                    </span>
                  )}
                </Link>
              </motion.div>
            ))}
            {isSignedIn ? (
              <>
                {/* <RealTimeNotifications /> */}
                <Link href="/profile">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="border-[#556492] text-[#D4D4D6] hover:bg-[#556492]/20"
                    >
                      My Profile
                    </Button>
                  </motion.div>
                </Link>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8",
                    },
                  }}
                />
              </>
            ) : (
              <SignInButton mode="modal">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button className="bg-[#84C25D] hover:bg-[#6ba348] text-white">
                    Sign In
                  </Button>
                </motion.div>
              </SignInButton>
            )}
          </nav>
          <div className="md:hidden ml-auto flex items-center gap-2">
            {isSignedIn && <RealTimeNotifications />}
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white"
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
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="md:hidden border-t border-[#556492]/20 bg-[#131943]/95 backdrop-blur-md overflow-hidden"
            >
              <nav className="flex flex-col p-4 space-y-4">
                {[
                  { href: "/", label: "Home" },
                  { href: "/events", label: "Events" },
                  { href: "/live", label: "Live", isNew: true },
                  { href: "/schedule", label: "Schedule" },
                  { href: "/teams", label: "Teams" },
                  { href: "/gallery", label: "Gallery" },
                  { href: "/about", label: "About" },
                ].map((link, index) => (
                  <motion.div
                    key={link.href}
                    variants={linkVariants}
                    initial="closed"
                    animate="open"
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-[#D4D4D6] hover:text-[#84C25D] transition-colors block py-2 relative"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                      {link.isNew && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full animate-pulse">
                          LIVE
                        </span>
                      )}
                    </Link>
                  </motion.div>
                ))}
                {isSignedIn ? (
                  <motion.div
                    variants={linkVariants}
                    initial="closed"
                    animate="open"
                    transition={{ delay: 0.7 }}
                    className="space-y-4 pt-2"
                  >
                    <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full border-[#556492] text-[#D4D4D6] hover:bg-[#556492]/20"
                      >
                        My Profile
                      </Button>
                    </Link>
                    <div className="flex justify-start">
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={linkVariants}
                    initial="closed"
                    animate="open"
                    transition={{ delay: 0.7 }}
                  >
                    <SignInButton mode="modal">
                      <Button className="w-full bg-[#84C25D] hover:bg-[#6ba348] text-white">
                        Sign In
                      </Button>
                    </SignInButton>
                  </motion.div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* AI Chatbot - Available on all pages */}
      {/* <AIChatbot /> */}
    </>
  );
}
