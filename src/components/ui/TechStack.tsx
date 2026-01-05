import { motion } from "framer-motion";

const technologies = [
  { name: "React", icon: "⚛️" },
  { name: "TypeScript", icon: "📘" },
  { name: "Python", icon: "🐍" },
  { name: "Node.js", icon: "💚" },
  { name: "AWS", icon: "☁️" },
  { name: "Docker", icon: "🐳" },
  { name: "PostgreSQL", icon: "🐘" },
  { name: "TensorFlow", icon: "🧠" },
];

export const TechStack = () => {
  return (
    <div className="py-12 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-6"
      >
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider font-bold text-center">
          Powered By Leading Technologies
        </p>
      </motion.div>
      
      <div className="flex gap-8 justify-center flex-wrap">
        {technologies.map((tech, index) => (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.1, y: -5 }}
            className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-surface transition-colors cursor-pointer"
          >
            <span className="text-3xl">{tech.icon}</span>
            <span className="text-xs font-medium text-muted-foreground">{tech.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
