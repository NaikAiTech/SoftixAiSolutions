import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features?: string[];
  delay?: number;
  highlighted?: boolean;
}

export const ServiceCard = ({
  icon: Icon,
  title,
  description,
  features = [],
  delay = 0,
  highlighted = false,
}: ServiceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className={`card-glass p-8 rounded-2xl group ${
        highlighted ? "border-primary/30" : ""
      }`}
    >
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-all duration-300 ${
          highlighted
            ? "bg-primary text-primary-foreground shadow-md"
            : "bg-primary/10 border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground"
        }`}
      >
        <Icon size={24} className={highlighted ? "" : "text-primary group-hover:text-primary-foreground"} />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-3 font-display">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-6">{description}</p>
      {features.length > 0 && (
        <ul className="space-y-2 text-xs font-mono text-primary font-semibold">
          {features.map((feature, index) => (
            <li key={index}>&gt; {feature}</li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};
