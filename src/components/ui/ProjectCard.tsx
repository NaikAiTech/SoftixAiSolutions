import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  href?: string;
  delay?: number;
  reverse?: boolean;
}

export const ProjectCard = ({
  title,
  description,
  image,
  tags,
  href = "#",
  delay = 0,
  reverse = false,
}: ProjectCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={`group grid lg:grid-cols-2 gap-12 lg:gap-16 items-center`}
    >
      <div className={`${reverse ? "lg:order-2" : "lg:order-1"}`}>
        <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
          {title}
        </h3>
        <p className="text-muted-foreground text-lg leading-relaxed mb-8">
          {description}
        </p>

        <div className="flex flex-wrap gap-3 mb-8">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 border border-border bg-surface rounded text-xs text-muted-foreground font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link
          to={href}
          className="text-primary font-bold hover:text-foreground transition-colors flex items-center gap-2 group/link"
        >
          View Case Study{" "}
          <ArrowRight
            size={16}
            className="transform group-hover/link:translate-x-1 transition-transform"
          />
        </Link>
      </div>

      <div
        className={`${
          reverse ? "lg:order-1" : "lg:order-2"
        } relative rounded-xl overflow-hidden border border-border shadow-xl group-hover:shadow-2xl transition-all duration-500`}
      >
        <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors z-10" />
        <img
          src={image}
          alt={title}
          className="w-full h-auto aspect-video object-cover group-hover:scale-105 transition-all duration-700"
        />
      </div>
    </motion.div>
  );
};
