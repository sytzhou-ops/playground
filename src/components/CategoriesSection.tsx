import { motion } from "framer-motion";
import { AISparkle } from "./DoodleElements";
import { BarChart3, MessageCircle, Megaphone, Settings, HeartPulse, Scale, Home, BookOpen } from "lucide-react";

const categories = [
  { name: "Finance & Accounting", icon: BarChart3, count: 42, accent: "primary" as const },
  { name: "Customer Support", icon: MessageCircle, count: 38, accent: "accent" as const },
  { name: "Marketing & Content", icon: Megaphone, count: 31, accent: "primary" as const },
  { name: "Operations & Logistics", icon: Settings, count: 27, accent: "accent" as const },
  { name: "Healthcare", icon: HeartPulse, count: 19, accent: "primary" as const },
  { name: "Legal & Compliance", icon: Scale, count: 14, accent: "accent" as const },
  { name: "Real Estate", icon: Home, count: 11, accent: "primary" as const },
  { name: "Education", icon: BookOpen, count: 22, accent: "accent" as const },
];

const CategoriesSection = () => {
  return (
    <section id="categories" className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-accent mb-4">
            <AISparkle className="w-3 h-3 text-accent" />
            Categories
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold text-foreground">
            Every industry has{" "}
            <span className="text-gradient-primary">inefficiencies</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            const isAccent = cat.accent === "accent";
            return (
              <motion.button
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="group relative glass rounded-2xl p-6 text-left hover:border-primary/30 transition-all duration-300 overflow-hidden"
              >
                {/* Hover glow */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                  isAccent 
                    ? "bg-gradient-to-br from-accent/10 to-transparent" 
                    : "bg-gradient-to-br from-primary/10 to-transparent"
                }`} />
                
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${
                    isAccent 
                      ? "bg-accent/10 text-accent" 
                      : "bg-primary/10 text-primary"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    <span className={`font-mono font-bold text-base ${isAccent ? "text-accent" : "text-primary"}`}>{cat.count}</span>{" "}bounties
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
