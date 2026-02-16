import { motion } from "framer-motion";

const categories = [
  { name: "Finance & Accounting", icon: "📊", count: 42, color: "from-primary/10 to-primary/5" },
  { name: "Customer Support", icon: "💬", count: 38, color: "from-accent/10 to-accent/5" },
  { name: "Marketing & Content", icon: "📢", count: 31, color: "from-primary/10 to-primary/5" },
  { name: "Operations & Logistics", icon: "⚙️", count: 27, color: "from-accent/10 to-accent/5" },
  { name: "Healthcare", icon: "🏥", count: 19, color: "from-primary/10 to-primary/5" },
  { name: "Legal & Compliance", icon: "⚖️", count: 14, color: "from-accent/10 to-accent/5" },
  { name: "Real Estate", icon: "🏠", count: 11, color: "from-primary/10 to-primary/5" },
  { name: "Education", icon: "📚", count: 22, color: "from-accent/10 to-accent/5" },
];

const CategoriesSection = () => {
  return (
    <section id="categories" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-doodle text-2xl text-primary">~ categories ~</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 text-foreground">
            Every industry has <span className="font-doodle text-accent">inefficiencies</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.03 }}
              className={`group relative bg-gradient-to-br ${cat.color} border border-border rounded-2xl p-6 text-left hover:border-primary/30 transition-all`}
            >
              <span className="text-3xl mb-3 block">{cat.icon}</span>
              <h3 className="text-sm font-semibold text-foreground mb-1">{cat.name}</h3>
              <p className="text-xs text-muted-foreground">
                <span className="font-doodle text-base text-primary">{cat.count}</span> bounties
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
