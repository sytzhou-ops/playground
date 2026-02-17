import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useHunterProfile } from "@/hooks/useHunterProfile";
import { useProfile } from "@/hooks/useProfile";
import { DoodleStar, DoodleSquiggle } from "./DoodleElements";
import { Shield, ChevronDown } from "lucide-react";

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
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <DoodleStar className="w-6 h-6 text-primary animate-wiggle" />
          <span className="text-xl font-bold text-foreground">
            bounty<span className="text-primary">AI</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            How it works
          </Link>
          <Link to="/bounties" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Bounties
          </Link>
          <Link to="/#categories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Categories
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {hunterStatus === "approved" ? (
                <Link to="/my-applications" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
                  My Applications
                </Link>
              ) : (
                <Link to={hunterStatus === "pending" ? "/hunter-status" : "/become-hunter"} className="text-sm text-primary hover:text-primary/80 transition-colors px-3 py-2 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  {hunterStatus === "pending" ? "Hunter Status" : "Become a Hunter"}
                </Link>
              )}

              {/* Profile dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
                >
                  {profile?.full_name || "Profile"}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-1 w-56 rounded-lg border border-border bg-card shadow-lg py-1 z-50">
                    <div className="px-3 py-2 border-b border-border">
                      <p className="text-sm font-medium text-foreground truncate">{profile?.full_name || "User"}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email || user.phone}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      View Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      Settings
                    </Link>
                    <Link
                      to="/my-applications"
                      onClick={() => setProfileOpen(false)}
                      className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      My Applications
                    </Link>
                    <div className="border-t border-border mt-1 pt-1">
                      <button
                        onClick={() => { setProfileOpen(false); signOut(); }}
                        className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-secondary transition-colors"
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <Link to="/post-bounty" className="relative text-sm font-semibold bg-primary text-primary-foreground px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
                Post a Bounty
                <DoodleSquiggle className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 text-primary opacity-40" />
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
              >
                Log in
              </Link>
              <Link
                to="/auth"
                className="relative text-sm font-semibold bg-primary text-primary-foreground px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
              >
                Post a Bounty
                <DoodleSquiggle className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 text-primary opacity-40" />
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
