import { motion } from "framer-motion";
import { MessageSquare, Coins, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Describe your problem",
    description: "Tell us what manual work eats your time — in plain English.",
    icon: MessageSquare,
  },
  {
    number: "02",
    title: "Set your bounty",
    description: "Name your price based on how much the solution would save you.",
    icon: Coins,
  },
  {
    number: "03",
    title: "Get it solved",
    description: "Vetted AI builders propose solutions. Pay only when it works.",
    icon: Rocket,
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground">
            How it works
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="rounded-2xl border border-border p-8 hover:border-foreground/10 transition-colors">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Icon className="w-5 h-5 text-foreground" />
                    </div>
                    <span className="font-mono text-3xl font-bold text-border">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
