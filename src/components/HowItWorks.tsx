import { motion } from "framer-motion";
import { DoodleArrow, DoodleStar } from "./DoodleElements";

const steps = [
  {
    number: "01",
    title: "Describe your problem",
    description: "Tell us what manual work eats your time. No tech jargon needed — just describe the pain.",
    doodle: "📝",
  },
  {
    number: "02",
    title: "Set your bounty",
    description: "Name your price based on how much time & money the solution would save you.",
    doodle: "💰",
  },
  {
    number: "03",
    title: "Get matched & solved",
    description: "Vetted AI builders propose solutions. Pick the best one. Pay only when it works.",
    doodle: "🚀",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-doodle text-2xl text-primary">~ how it works ~</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 text-foreground">
            Simple as <span className="font-doodle text-primary">1, 2, 3</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Doodle arrows between steps */}
          <div className="hidden md:block absolute top-16 left-[33%] -translate-x-1/2 z-10">
            <DoodleArrow className="w-20 h-8 text-primary/40" />
          </div>
          <div className="hidden md:block absolute top-16 left-[66%] -translate-x-1/2 z-10">
            <DoodleArrow className="w-20 h-8 text-primary/40" />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative bg-card border border-border rounded-2xl p-8 hover:border-primary/30 transition-colors group"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="font-doodle text-5xl text-primary/20 group-hover:text-primary/40 transition-colors">
                  {step.number}
                </span>
                <span className="text-3xl animate-float" style={{ animationDelay: `${i * 0.5}s` }}>
                  {step.doodle}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              
              {/* Corner doodle */}
              <DoodleStar className="absolute -top-2 -right-2 w-5 h-5 text-primary/0 group-hover:text-primary/30 transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
