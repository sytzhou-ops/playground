import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Orb, AISparkle, GridBackground } from "./DoodleElements";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Ambient orbs */}
      <Orb className="w-[500px] h-[500px] -top-40 -left-40" color="primary" />
      <Orb className="w-[400px] h-[400px] top-20 right-[-10%]" color="accent" />
      <Orb className="w-[300px] h-[300px] bottom-10 left-[20%]" color="primary" />
      
      <GridBackground className="opacity-40" />

      {/* Floating sparkles */}
      <AISparkle className="absolute top-32 left-[12%] w-4 h-4 text-primary/40 animate-float" />
      <AISparkle className="absolute top-48 right-[18%] w-3 h-3 text-accent/40 animate-float" style={{ animationDelay: "1s" }} />
      <AISparkle className="absolute bottom-40 left-[8%] w-5 h-5 text-primary/25 animate-float" style={{ animationDelay: "2s" }} />
      <AISparkle className="absolute bottom-60 right-[8%] w-3 h-3 text-accent/30 animate-float" style={{ animationDelay: "3s" }} />

      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-primary border border-primary/20 rounded-full px-5 py-2 glass mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            The AI BountyAI Marketplace
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight leading-[1.05] mb-6"
        >
          <span className="text-foreground">Real Problems.</span>
          <br />
          <span className="text-gradient-primary">AI Solutions.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-lg md:text-2xl text-foreground max-w-2xl mx-auto mb-4 leading-relaxed font-semibold"
        >
          The first marketplace where real operational problems meet outcome-driven AI solutions.
        </motion.p>


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/post-bounty"
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold px-8 py-4 rounded-2xl text-lg glow-primary hover:shadow-[0_0_60px_-10px_hsl(270_95%_65%_/_0.6)] transition-all duration-300"
          >
            <Zap className="w-5 h-5" />
            Post a Bounty
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/bounties"
            className="inline-flex items-center gap-2 text-foreground/80 hover:text-foreground px-8 py-4 rounded-2xl glass hover:border-primary/30 transition-all duration-300"
          >
            Browse Bounties
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/become-hunter"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground px-8 py-4 rounded-2xl border border-border hover:border-accent/30 transition-all duration-300"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            Join as a Hunter
          </Link>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-20 inline-flex items-center gap-8 glass rounded-2xl px-10 py-5"
        >
          {[
            { value: "$2.4M+", label: "Bounties Posted" },
            { value: "850+", label: "Problems Solved" },
            { value: "4.9★", label: "Avg Satisfaction" },
          ].map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-4">
              {i > 0 && <div className="w-px h-8 bg-border" />}
              <div className="text-left">
                <p className="text-lg font-bold text-gradient-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
