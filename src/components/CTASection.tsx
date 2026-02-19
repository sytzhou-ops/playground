import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Orb, AISparkle } from "./DoodleElements";
import { Zap, ArrowRight, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[2rem] overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-card to-accent/5" />
          <Orb className="w-[300px] h-[300px] -top-20 -left-20" color="primary" />
          <Orb className="w-[250px] h-[250px] -bottom-20 -right-20" color="accent" />
          
          <div className="relative glass-strong rounded-[2rem] p-12 md:p-20 text-center">
            <AISparkle className="absolute top-8 left-10 w-5 h-5 text-primary/20 animate-float" />
            <AISparkle className="absolute bottom-10 right-12 w-4 h-4 text-accent/20 animate-float" style={{ animationDelay: "1.5s" }} />

            <span className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-primary mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Ready to start?
            </span>

            <h2 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6">
              Got a problem? Get it
              <br />
              <span className="text-gradient-primary">solved.</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-12 text-lg">
              Whether you're a business owner drowning in manual work or an AI builder looking for real impact — this is where it starts.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/post-bounty"
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold px-8 py-4 rounded-2xl text-lg glow-primary hover:shadow-[0_0_60px_-10px_hsl(270_95%_65%_/_0.6)] transition-all duration-300"
              >
                <Zap className="w-5 h-5" />
                Post a Bounty
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/become-hunter"
                className="inline-flex items-center gap-2 glass text-foreground font-semibold px-8 py-4 rounded-2xl text-lg hover:border-accent/30 transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 text-accent" />
                Join as a Bounty Hunter
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-6 mt-20">
        <div className="flex flex-col md:flex-row items-center justify-between py-8 border-t border-border text-sm text-muted-foreground">
           <div className="flex items-center gap-2 mb-4 md:mb-0">
            <img src="/patch-logo.png" alt="Patch" className="w-5 h-5" />
            <span className="font-display font-bold text-foreground">Patch</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground transition-colors">About</a>
            <a href="#" className="hover:text-foreground transition-colors">Blog</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          </div>
          <p className="mt-4 md:mt-0 font-mono text-xs">© 2026 Patch</p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
