import { motion } from "framer-motion";
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
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -4 }}
    className="group relative bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-all cursor-pointer"
  >
    {hot && (
      <div className="absolute -top-3 right-4 flex items-center gap-1 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full glow-bounty">
        <span>🔥</span> HOT
      </div>
    )}

    <div className="flex items-start justify-between mb-4">
      <span className="text-xs font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">
        {category}
      </span>
      <span className="text-xs text-muted-foreground">{daysLeft}d left</span>
    </div>

    <h3 className="text-foreground font-semibold mb-4 leading-snug group-hover:text-primary/90 transition-colors">
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
  </motion.div>
);

const BountiesSection = () => {
  return (
    <section id="bounties" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-doodle text-2xl text-primary">~ live bounties ~</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 text-foreground">
            Live{" "}
            <span className="relative inline-block">
              Bounties
              <DoodleStar className="absolute -top-3 -right-6 w-5 h-5 text-accent animate-wiggle" />
            </span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            Real problems. Real budgets. Choose your bounty.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bounties.map((bounty, i) => (
            <BountyCard key={i} {...bounty} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
            View all bounties →
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default BountiesSection;
