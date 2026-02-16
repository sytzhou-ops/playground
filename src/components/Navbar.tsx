import { motion } from "framer-motion";
import { DoodleUnderline, DoodleStar, DoodleSquiggle } from "./DoodleElements";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <DoodleStar className="w-6 h-6 text-primary animate-wiggle" />
          <span className="text-xl font-bold text-foreground">
            bounty<span className="text-primary">AI</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            How it works
          </a>
          <a href="#bounties" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Bounties
          </a>
          <a href="#categories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Categories
          </a>
        </div>

        <div className="flex items-center gap-3">
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
            Log in
          </button>
          <button className="relative text-sm font-semibold bg-primary text-primary-foreground px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
            Post a Bounty
            <DoodleSquiggle className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 text-primary opacity-40" />
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
