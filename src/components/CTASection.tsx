import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { DoodleStar, DoodleSquiggle } from "./DoodleElements";

const CTASection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-card border border-border rounded-3xl p-12 md:p-20 text-center overflow-hidden"
        >
          {/* Decorations */}
          <DoodleStar className="absolute top-6 left-8 w-8 h-8 text-primary/20 animate-wiggle" />
          <DoodleStar className="absolute bottom-8 right-12 w-6 h-6 text-accent/20 animate-float" />
          <DoodleSquiggle className="absolute top-12 right-8 w-24 text-primary/10" />

          <span className="font-doodle text-2xl text-primary mb-2 block">~ ready? ~</span>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Your problem is worth
            <br />
            <span className="text-gradient-primary">solving</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-10 text-lg">
            Whether you're a business owner drowning in manual work or an AI builder looking for real impact — this is where it starts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/post-bounty" className="bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-xl text-lg glow-primary hover:opacity-90 transition-all">
              Post a Bounty
            </Link>
            <button className="border border-border text-foreground hover:border-primary/40 px-8 py-4 rounded-xl text-lg transition-all">
              Join as a Builder
            </button>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-6 mt-16">
        <div className="flex flex-col md:flex-row items-center justify-between py-8 border-t border-border text-sm text-muted-foreground">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <DoodleStar className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">bounty<span className="text-primary">AI</span></span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground transition-colors">About</a>
            <a href="#" className="hover:text-foreground transition-colors">Blog</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          </div>
          <p className="mt-4 md:mt-0">© 2026 bountyAI</p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
