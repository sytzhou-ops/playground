import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PlaygroundLogo from "./PlaygroundLogo";

const CTASection = () => {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-border p-12 md:p-20 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4">
            Got a problem?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-10">
            Whether you're drowning in manual work or an AI builder looking for real impact — start here.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/post-bounty"
              className="group inline-flex items-center gap-2.5 bg-primary text-primary-foreground font-semibold px-7 py-3.5 rounded-xl text-sm hover:bg-primary/90 transition-colors"
            >
              Post a Bounty
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/become-hunter"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium px-7 py-3.5 rounded-xl text-sm border border-border hover:border-foreground/20 transition-colors"
            >
              Join as a Hunter
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-6 mt-20">
        <div className="flex flex-col md:flex-row items-center justify-between py-8 border-t border-border text-sm text-muted-foreground">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <PlaygroundLogo className="w-5 h-5" />
            <span className="font-display font-bold text-foreground">playground.ai</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground transition-colors">About</a>
            <a href="#" className="hover:text-foreground transition-colors">Blog</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          </div>
          <p className="mt-4 md:mt-0 font-mono text-xs">© 2026 playground.ai</p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
