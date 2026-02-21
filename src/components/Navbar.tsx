import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useHunterProfile } from "@/hooks/useHunterProfile";
import { useProfile } from "@/hooks/useProfile";
import { ChevronDown, User, Settings, FileText, LogOut } from "lucide-react";
import PlaygroundLogo from "./PlaygroundLogo";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { status: hunterStatus } = useHunterProfile();
  const { profile } = useProfile();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-3.5">
        <Link to="/" className="flex items-center gap-2.5 text-primary">
          <PlaygroundLogo className="w-7 h-7" />
          <span className="text-lg font-display font-bold tracking-wide uppercase">
            playground.ai
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {[
            { to: "/#how-it-works", label: "How it works" },
            { to: "/bounties", label: "Bounties" },
            { to: "/#categories", label: "Categories" },
          ].map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {hunterStatus === "approved" ? null : (
                <Link
                  to={hunterStatus === "pending" ? "/hunter-status" : "/become-hunter"}
                  className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
                >
                  {hunterStatus === "pending" ? "Hunter Status" : "Become a Hunter"}
                </Link>
              )}

              {/* Profile dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
                >
                  <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground">
                    {profile?.full_name?.trim()
                      ? profile.full_name.trim().split(/\s+/).map(n => n[0]).join("").toUpperCase().slice(0, 2)
                      : (user?.email?.[0] || "U").toUpperCase()}
                  </div>
                  <span className="hidden sm:inline max-w-[120px] truncate">{profile?.full_name || "Profile"}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card shadow-lg py-1 z-50"
                    >
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-semibold text-foreground truncate">{profile?.full_name || "User"}</p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email || user.phone}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          View Profile
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        <Link
                          to="/my-applications"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          My Applications
                        </Link>
                      </div>
                      <div className="border-t border-border py-1">
                        <button
                          onClick={() => { setProfileOpen(false); signOut(); }}
                          className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-destructive/80 hover:text-destructive hover:bg-destructive/5 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Log out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/post-bounty"
                className="inline-flex items-center gap-2 text-sm font-semibold bg-primary text-primary-foreground px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
              >
                Post a Bounty
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2"
              >
                Log in
              </Link>
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 text-sm font-semibold bg-primary text-primary-foreground px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
              >
                Post a Bounty
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
