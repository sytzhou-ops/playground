import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { DoodleUnderline, DoodleArrow, DoodleStar, DoodleCircle } from "./DoodleElements";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Doodle decorations */}
      <DoodleStar className="absolute top-32 left-[10%] w-8 h-8 text-primary/30 animate-float" />
      <DoodleStar className="absolute top-48 right-[15%] w-6 h-6 text-accent/30 animate-float" style={{ animationDelay: "1s" }} />
      <DoodleCircle className="absolute bottom-32 left-[8%] w-16 h-16 text-primary/15 animate-wiggle" />
      <DoodleStar className="absolute bottom-48 right-[10%] w-10 h-10 text-primary/20 animate-float" style={{ animationDelay: "2s" }} />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
        backgroundSize: "30px 30px"
      }} />

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <span className="inline-block font-doodle text-2xl text-primary mb-4 animate-wiggle">
            ~ the marketplace for ~
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6"
        >
          <span className="text-foreground">Real Problems.</span>
          <br />
          <span className="relative inline-block">
            <span className="text-gradient-primary">AI Solutions.</span>
            <DoodleUnderline className="absolute -bottom-2 left-0 w-full text-primary" />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Post your automation challenge with a bounty. 
          AI builders compete to solve it. You only pay for results.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/post-bounty" className="group relative bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-xl text-lg glow-primary hover:opacity-90 transition-all">
            Post a Bounty
            <span className="font-doodle text-sm ml-2 opacity-70">— it's free!</span>
          </Link>
          <Link to="/bounties" className="flex items-center gap-2 text-muted-foreground hover:text-foreground px-8 py-4 rounded-xl border border-border hover:border-muted-foreground/30 transition-all">
            Browse Bounties
            <DoodleArrow className="w-10 h-5 text-primary" />
          </Link>
          <Link to="/become-hunter" className="text-muted-foreground hover:text-foreground px-8 py-4 rounded-xl border border-border hover:border-muted-foreground/30 transition-all">
            Join as a Bounty Hunter
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <span className="font-doodle text-xl text-primary">✓</span>
            <span>$2.4M+ in bounties posted</span>
          </div>
          <div className="w-px h-4 bg-border hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="font-doodle text-xl text-primary">✓</span>
            <span>850+ problems solved</span>
          </div>
          <div className="w-px h-4 bg-border hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="font-doodle text-xl text-primary">✓</span>
            <span>4.9★ avg satisfaction</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
