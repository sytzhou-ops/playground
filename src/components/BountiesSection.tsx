import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { DoodleStar } from "./DoodleElements";

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
  <div className="relative bg-card border border-border rounded-2xl p-6 w-[340px] shrink-0 mt-4">
    {hot && (
      <div className="absolute -top-3 right-4 flex items-center gap-1 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full glow-bounty z-10">
        <span>🔥</span> HOT
      </div>
    )}

    <div className="flex items-start justify-between mb-4">
      <span className="text-xs font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">
        {category}
      </span>
      <span className="text-xs text-muted-foreground">{daysLeft}d left</span>
    </div>

    <h3 className="text-foreground font-semibold mb-4 leading-snug">
      {title}
    </h3>

    <div className="flex items-center justify-between">
      <div>
        <span className="font-doodle text-3xl text-accent font-bold">{bounty}</span>
        <span className="text-xs text-muted-foreground ml-2">bounty</span>
      </div>
    </div>

    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-secondary-foreground">
          {author[0]}
        </div>
        <div>
          <p className="text-xs font-medium text-foreground">{author}</p>
          <p className="text-[10px] text-muted-foreground">{role}</p>
        </div>
      </div>
      <span className="text-xs text-muted-foreground">
        {proposals} proposals
      </span>
    </div>
  </div>
);

const BountiesSection = () => {
  const doubled = [...bounties, ...bounties];

  return (
    <section id="bounties" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-doodle text-2xl text-primary">~ choose your challenge ~</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 text-foreground">
            The Bounty{" "}
            <span className="relative inline-block">
              Board
              <DoodleStar className="absolute -top-3 -right-6 w-5 h-5 text-accent animate-wiggle" />
            </span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            Real problems. Real budgets. Choose your bounty.
          </p>
        </motion.div>
      </div>

      {/* Continuous scroll marquee */}
      <div className="relative overflow-hidden pt-2">
        <div className="flex gap-6 animate-[marquee_30s_linear_infinite] hover:[animation-play-state:paused]">
          {doubled.map((b, i) => (
            <BountyCard key={i} {...b} />
          ))}
        </div>
        {/* Fade edges */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
      </div>

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/bounties"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-full hover:bg-primary/90 transition-colors text-base"
          >
            View all bounties →
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BountiesSection;
