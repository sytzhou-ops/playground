import { motion } from "framer-motion";
import { AISparkle } from "./DoodleElements";
import { MessageSquare, Coins, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Describe your problem",
    description: "Describe your challenge in plain English. Tell us what manual work eats your time.",
    icon: MessageSquare,
    gradient: "from-primary/20 to-primary/5",
  },
  {
    number: "02",
    title: "Set your bounty",
    description: "Name your price based on how much time & money the solution would save you.",
    icon: Coins,
    gradient: "from-accent/20 to-accent/5",
  },
  {
    number: "03",
    title: "Get matched & solved",
    description: "Vetted AI builders propose solutions. Pick the best one. Pay only when it works.",
    icon: Rocket,
    gradient: "from-primary/15 to-accent/5",
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
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-accent mb-4">
            <AISparkle className="w-3 h-3 text-accent" />
            How it Works
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold text-foreground">
            Simple as{" "}
            <span className="text-gradient-primary">1, 2, 3</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto mt-4 leading-relaxed">
            Post the problem. Set the bounty. Get it solved. Pay only for results.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-px bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group relative"
              >
                <div className={`relative glass rounded-3xl p-8 hover:border-primary/30 transition-all duration-300 overflow-hidden`}>
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/20 transition-all duration-300">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <span className="font-mono text-4xl font-bold text-border group-hover:text-primary/20 transition-colors duration-300">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
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
