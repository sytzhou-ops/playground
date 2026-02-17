import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useHunterProfile } from "@/hooks/useHunterProfile";
import { DoodleStar, DoodleSquiggle } from "./DoodleElements";
import { Shield } from "lucide-react";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { status: hunterStatus } = useHunterProfile();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-xl"
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <DoodleStar className="w-6 h-6 text-primary animate-wiggle" />
          <span className="font-western text-lg text-foreground tracking-wide">
            bounty<span className="text-accent">AI</span>
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
                <Link to={hunterStatus === "pending" ? "/hunter-status" : "/become-hunter"} className="text-sm text-accent hover:text-accent/80 transition-colors px-3 py-2 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  {hunterStatus === "pending" ? "Hunter Status" : "Become a Hunter"}
                </Link>
              )}
              <span className="text-sm text-muted-foreground hidden sm:inline truncate max-w-[150px]">
                {user.email || user.phone}
              </span>
              <button
                onClick={signOut}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
              >
                Log out
              </button>
              <Link to="/post-bounty" className="relative text-sm font-semibold bg-primary text-primary-foreground px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity border border-primary/50">
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
                className="relative text-sm font-semibold bg-primary text-primary-foreground px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity border border-primary/50"
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
