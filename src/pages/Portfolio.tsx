import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";

const categories = ["All", "AI/ML", "Web", "Mobile", "Enterprise"];

const projects = [
  {
    id: 1,
    title: "Nexus Finance",
    category: "Enterprise",
    description: "High-frequency trading engine with AI-powered risk assessment. Reduced latency by 40ms.",
    image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&q=80&w=800",
    tags: ["React", "Python", "WebSockets", "TensorFlow"],
    metrics: { latency: "-40ms", accuracy: "99.9%", users: "10K+" },
  },
  {
    id: 2,
    title: "Sentinel Grid",
    category: "Enterprise",
    description: "Cybersecurity visualization platform monitoring 1M+ endpoints in real-time.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    tags: ["Vue.js", "GoLang", "Elastic", "Kubernetes"],
    metrics: { endpoints: "1M+", uptime: "99.99%", alerts: "Real-time" },
  },
  {
    id: 3,
    title: "MediCare AI",
    category: "AI/ML",
    description: "AI diagnostic assistant for healthcare providers with 95% accuracy in early detection.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800",
    tags: ["Python", "TensorFlow", "React", "HIPAA"],
    metrics: { accuracy: "95%", diagnoses: "50K+", hospitals: "120" },
  },
  {
    id: 4,
    title: "EcoTrack",
    category: "Mobile",
    description: "Sustainability tracking app helping companies reduce their carbon footprint.",
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=800",
    tags: ["React Native", "Node.js", "MongoDB"],
    metrics: { downloads: "500K+", reduction: "30%", companies: "200+" },
  },
  {
    id: 5,
    title: "Quantum Analytics",
    category: "AI/ML",
    description: "Predictive analytics platform for retail inventory optimization.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    tags: ["Python", "AWS", "React", "ML"],
    metrics: { savings: "$2M+", accuracy: "94%", retailers: "80" },
  },
  {
    id: 6,
    title: "ConnectHub",
    category: "Web",
    description: "Enterprise collaboration platform with real-time messaging and file sharing.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
    tags: ["Next.js", "PostgreSQL", "WebRTC"],
    metrics: { users: "100K+", messages: "10M+", uptime: "99.9%" },
  },
];

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = projects.filter(
    (project) => activeCategory === "All" || project.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="noise-overlay" />
      <div className="fixed inset-0 tech-grid z-0 pointer-events-none" />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="font-mono text-primary text-sm tracking-widest uppercase font-bold mb-4 block">
              /// Our Portfolio
            </span>
            <h1 className="font-display text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Projects That <span className="text-primary">Define Excellence</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Explore our portfolio of successful projects across industries, 
              showcasing our expertise in delivering impactful solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project, index) => (
              <AnimatedSection key={project.id} delay={index * 0.1}>
                <motion.div
                  layout
                  whileHover={{ y: -5 }}
                  className="card-glass rounded-2xl overflow-hidden group"
                >
                  <div className="relative overflow-hidden aspect-video">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-4 text-xs text-primary-foreground">
                        {Object.entries(project.metrics).map(([key, value]) => (
                          <div key={key} className="bg-primary/80 backdrop-blur px-2 py-1 rounded">
                            <span className="font-bold">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <span className="text-xs font-mono text-primary font-bold uppercase">
                      {project.category}
                    </span>
                    <h3 className="font-display text-xl font-bold text-foreground mt-2 mb-3">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-surface border border-border rounded text-xs text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      to={`/portfolio/${project.id}`}
                      className="text-primary font-bold text-sm hover:text-foreground transition-colors flex items-center gap-2 group/link"
                    >
                      View Case Study
                      <ArrowRight size={14} className="transform group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-surface relative z-10">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="font-display text-4xl font-bold text-foreground mb-6">
              Have a Project in Mind?
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Let's discuss how we can bring your vision to life.
            </p>
            <Link to="/contact" className="btn-solid px-10 py-5 rounded-lg text-lg font-bold inline-block">
              Start Your Project
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Portfolio;
