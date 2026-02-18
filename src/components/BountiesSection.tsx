import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AISparkle } from "./DoodleElements";
import { Flame, ArrowRight } from "lucide-react";

interface BountyCardProps {
  title: string;
  bounty: string;
  author: string;
  role: string;
  category: string;
  proposals: number;
  daysLeft: number;
  hot?: boolean;
}

const bounties: BountyCardProps[] = [
  {
    title: "Automate invoice extraction from vendor emails into QuickBooks",
    bounty: "$4,000",
    author: "Marco T.",
    role: "Restaurant Owner",
    category: "Finance",
    proposals: 12,
    daysLeft: 5,
    hot: true,
  },
  {
    title: "AI agent to categorize and respond to 80% of inbound support emails",
    bounty: "$2,000",
    author: "Sarah K.",
    role: "Gym Owner",
    category: "Customer Support",
    proposals: 8,
    daysLeft: 12,
  },
  {
    title: "Build an interactive AI-powered wedding website with RSVP management",
    bounty: "$500",
    author: "Jamie & Alex",
    role: "Engaged Couple",
    category: "Web",
    proposals: 15,
    daysLeft: 20,
  },
  {
    title: "Auto-generate social media posts from blog content with brand voice",
    bounty: "$1,500",
    author: "Diana L.",
    role: "Marketing Director",
    category: "Marketing",
    proposals: 6,
    daysLeft: 8,
    hot: true,
  },
  {
    title: "Schedule optimization AI for 30+ field technicians across 3 cities",
    bounty: "$6,000",
    author: "Robert M.",
    role: "Operations Manager",
    category: "Logistics",
    proposals: 4,
    daysLeft: 14,
  },
  {
    title: "AI chatbot for patient intake and appointment pre-screening",
    bounty: "$3,000",
    author: "Dr. Patel",
    role: "Clinic Owner",
    category: "Healthcare",
    proposals: 9,
    daysLeft: 7,
  },
];

const BountyCard = ({ title, bounty, author, role, category, proposals, daysLeft, hot }: BountyCardProps) => (
  <div className="group relative glass rounded-2xl p-6 w-[340px] shrink-0 mt-4 hover:border-primary/30 transition-all duration-300">
    {hot && (
      <div className="absolute -top-3 right-4 flex items-center gap-1.5 bg-gradient-to-r from-bounty to-bounty/80 text-bounty-foreground text-xs font-bold px-3 py-1 rounded-full glow-bounty z-10">
        <Flame className="w-3 h-3" /> HOT
      </div>
    )}

    <div className="flex items-start justify-between mb-4">
      <span className="text-xs font-medium text-primary/80 bg-primary/10 px-3 py-1 rounded-full border border-primary/10">
        {category}
      </span>
      <span className="text-xs text-muted-foreground font-mono">{daysLeft}d left</span>
    </div>

    <h3 className="text-foreground font-semibold mb-5 leading-snug group-hover:text-primary/90 transition-colors">
      {title}
    </h3>

    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-extrabold text-gradient-primary">{bounty}</span>
      <span className="text-xs text-muted-foreground">bounty</span>
    </div>

    <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center text-xs font-bold text-primary">
          {author[0]}
        </div>
        <div>
          <p className="text-xs font-medium text-foreground">{author}</p>
          <p className="text-[10px] text-muted-foreground">{role}</p>
        </div>
      </div>
      <span className="text-xs text-muted-foreground font-mono">
        {proposals} proposals
      </span>
    </div>
  </div>
);

const BountiesSection = () => {
  const doubled = [...bounties, ...bounties];

  return (
    <section id="bounties" className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-accent mb-4">
            <AISparkle className="w-3 h-3 text-accent" />
            Live Bounties
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold text-foreground">
            Bounty <span className="text-gradient-primary">Wall</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            Real problems. Real budgets. Pick your bounty.
          </p>
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="relative overflow-hidden pt-2 space-y-6">
        <div className="flex gap-6 animate-[marquee_31.5s_linear_infinite] hover:[animation-play-state:paused]">
          {doubled.map((b, i) => (
            <BountyCard key={`row1-${i}`} {...b} />
          ))}
        </div>
        <div className="flex gap-6 animate-[marquee-reverse_31.5s_linear_infinite] hover:[animation-play-state:paused]">
          {[...bounties.slice(3), ...bounties.slice(0, 3), ...bounties.slice(3), ...bounties.slice(0, 3)].map((b, i) => (
            <BountyCard key={`row2-${i}`} {...b} />
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
      </div>

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <Link
            to="/bounties"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold px-8 py-3.5 rounded-2xl hover:shadow-[0_0_40px_-10px_hsl(270_95%_65%_/_0.5)] transition-all duration-300"
          >
            View all bounties
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BountiesSection;
