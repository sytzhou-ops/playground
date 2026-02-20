import { motion } from "framer-motion";
import { BarChart3, MessageCircle, Megaphone, Settings, HeartPulse, Scale, Home, BookOpen } from "lucide-react";

const categories = [
  { name: "Finance & Accounting", icon: BarChart3, count: 42 },
  { name: "Customer Support", icon: MessageCircle, count: 38 },
  { name: "Marketing & Content", icon: Megaphone, count: 31 },
  { name: "Operations & Logistics", icon: Settings, count: 27 },
  { name: "Healthcare", icon: HeartPulse, count: 19 },
  { name: "Legal & Compliance", icon: Scale, count: 14 },
  { name: "Real Estate", icon: Home, count: 11 },
  { name: "Education", icon: BookOpen, count: 22 },
];

const CategoriesSection = () => {
  return (
    <section id="categories" className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground">
            Categories
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.button
                key={cat.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl border border-border p-5 text-left hover:border-foreground/10 transition-colors"
              >
                <Icon className="w-5 h-5 text-muted-foreground mb-3" />
                <h3 className="text-sm font-medium text-foreground">{cat.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="font-mono font-bold text-foreground">{cat.count}</span> bounties
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
