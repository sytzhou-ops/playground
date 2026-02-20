import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface BountyCardProps {
  title: string;
  bounty: string;
  category: string;
  author: string;
  daysLeft: number;
  hot?: boolean;
}

const bounties: BountyCardProps[] = [
  {
    title: "Automate invoice extraction from vendor emails into QuickBooks",
    bounty: "$4,000",
    category: "Finance",
    author: "Marco T.",
    daysLeft: 5,
    hot: true,
  },
  {
    title: "AI agent to categorize and respond to 80% of inbound support emails",
    bounty: "$2,000",
    category: "Support",
    author: "Sarah K.",
    daysLeft: 12,
  },
  {
    title: "Build an interactive AI-powered wedding website with RSVP management",
    bounty: "$500",
    category: "Web",
    author: "Jamie & Alex",
    daysLeft: 20,
  },
  {
    title: "Auto-generate social media posts from blog content with brand voice",
    bounty: "$1,500",
    category: "Marketing",
    author: "Diana L.",
    daysLeft: 8,
    hot: true,
  },
  {
    title: "Schedule optimization AI for 30+ field technicians across 3 cities",
    bounty: "$6,000",
    category: "Logistics",
    author: "Robert M.",
    daysLeft: 14,
  },
  {
    title: "AI chatbot for patient intake and appointment pre-screening",
    bounty: "$3,000",
    category: "Healthcare",
    author: "Dr. Patel",
    daysLeft: 7,
  },
];

const BountyCard = ({ title, bounty, category, author, daysLeft }: BountyCardProps) => (
  <div className="rounded-xl border border-border p-5 hover:border-foreground/10 transition-colors">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs text-muted-foreground">{category}</span>
      <span className="text-xs text-muted-foreground font-mono">{daysLeft}d left</span>
    </div>
    <h3 className="text-sm font-semibold text-foreground mb-4 leading-snug">{title}</h3>
    <div className="flex items-center justify-between pt-3 border-t border-border">
      <span className="text-lg font-bold text-foreground">{bounty}</span>
      <span className="text-xs text-muted-foreground">{author}</span>
    </div>
  </div>
);

const BountiesSection = () => {
  return (
    <section id="bounties" className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground">
            Live Bounties
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto text-sm">
            Real problems. Real budgets. Pick your bounty.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {bounties.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <BountyCard {...b} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            to="/bounties"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
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
