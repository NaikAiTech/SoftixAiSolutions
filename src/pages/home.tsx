import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Network, Layers, Shield, Cpu, Cloud, Zap } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ParticleCanvas } from "@/components/ui/ParticleCanvas";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { StatsCounter } from "@/components/ui/StatsCounter";
import { TechStack } from "@/components/ui/TechStack";
import Testimonials from "@/components/ui/Testimonials";

const services = [
  {
    icon: Network,
    title: "Neural Networks",
    description:
      "Custom AI models trained on your proprietary data. Predictive analytics and automated decision engines.",
    features: ["TensorFlow_Integration", "Real_Time_Processing"],
  },
  {
    icon: Layers,
    title: "Enterprise Platforms",
    description: "High-availability SaaS architectures. Built to handle millions of requests without latency.",
    features: ["Next.js / React", "Microservices"],
    highlighted: true,
  },
  {
    icon: Shield,
    title: "Cyber Infrastructure",
    description: "Bank-grade security protocols embedded into every layer of your application stack.",
    features: ["SOC2 Compliance", "End-to-End Encryption"],
  },
];

const projects = [
  {
    title: "Nexus Finance",
    description:
      "Engineered a high-frequency trading engine. Reduced latency by 40ms and implemented real-time AI risk assessment.",
    image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&q=80&w=1600",
    tags: ["React", "Python", "WebSockets"],
  },
  {
    title: "Sentinel Grid",
    description:
      "Cybersecurity visualization platform for a Fortune 500 firm. Monitors 1M+ endpoints in real-time with anomaly detection.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1600",
    tags: ["Vue.js", "GoLang", "Elastic"],
  },
];

const stats = [
  { value: 150, suffix: "+", label: "Projects Delivered" },
  { value: 50, suffix: "+", label: "Enterprise Clients" },
  { value: 99, suffix: "%", label: "Client Satisfaction" },
  { value: 24, suffix: "/7", label: "Support Available" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Background Elements */}
      <div className="noise-overlay" />
      <div className="fixed inset-0 tech-grid z-0 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 lg:pt-52 lg:pb-32 min-h-screen flex flex-col justify-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-surface border border-border mb-8 shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                System V4.0 Online
              </span>
            </motion.div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-stretch">
            {/* Content (from headline to buttons) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col justify-start"
            >
              <h1 className="font-display text-5xl lg:text-7xl font-bold tracking-tight text-foreground mb-8 leading-[1.1]">
                Engineering <br />
                <span className="text-primary">Intelligent</span> Future.
              </h1>

              <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-lg border-l-4 border-primary pl-6 bg-gradient-to-r from-primary/5 to-transparent py-2">
                We engineer intelligent digital ecosystems that blend cutting-edge design with scalable, enterprise-ready technology—built for performance, security, and growth.
              </p>

              <div className="flex flex-col sm:flex-row gap-5">
                <Link href="/contact" className="btn-solid px-8 py-4 rounded-lg text-center font-bold">
                  Deploy Solution
                </Link>
                <Link
                  href="/portfolio"
                  className="px-8 py-4 rounded-lg border border-border text-foreground hover:bg-surface transition-colors text-center flex items-center justify-center gap-2 group font-medium"
                >
                  View Case Studies{" "}
                  <ArrowRight
                    size={16}
                    className="text-primary transform group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </motion.div>

            {/* Visual / Canvas */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative w-full h-[500px] lg:h-full"
            >
              <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent opacity-60 blur-3xl" />

              <div className="absolute inset-0 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-float">
                {/* Window Controls */}
                <div className="h-10 bg-surface border-b border-border flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-border" />
                  <div className="w-3 h-3 rounded-full bg-border" />
                  <div className="w-3 h-3 rounded-full bg-border" />
                  <div className="ml-auto font-mono text-[10px] text-primary font-bold">● LIVE</div>
                </div>

                <div className="flex-1 relative bg-card">
                  <ParticleCanvas />

                  {/* Floating Data Widget */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="absolute bottom-6 right-6 bg-card/90 backdrop-blur border border-border p-4 rounded-lg shadow-xl w-48"
                  >
                    <div className="text-xs text-muted-foreground mb-1 font-medium">Server Load</div>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-foreground">34ms</span>
                      <span className="text-xs text-primary mb-1 font-bold">▼ 12%</span>
                    </div>
                    <div className="flex items-end gap-1 h-6 mt-2">
                      {[2, 4, 5, 3, 2, 4].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: h * 4 }}
                          transition={{ delay: 1.2 + i * 0.1, duration: 0.3 }}
                          className="w-1 bg-primary"
                          style={{ opacity: 0.3 + (h / 5) * 0.7 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-12">
            <TechStack />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <StatsCounter stats={stats} />
        </div>
      </section>

      {/* Services Section */}
      <section id="capabilities" className="py-32 relative z-10 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader badge="Capabilities" title="System Architecture" description="Precision tools for complex problems." />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ServiceCard key={service.title} {...service} delay={index * 0.1} />
            ))}
          </div>

          <AnimatedSection delay={0.4} className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-primary font-bold hover:text-foreground transition-colors group"
            >
              Explore All Services{" "}
              <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Work Section */}
      <section id="work" className="py-32 border-t border-border bg-background relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader badge="Selected Operations" title="Featured Projects" />

          <div className="space-y-32">
            {projects.map((project, index) => (
              <ProjectCard key={project.title} {...project} reverse={index % 2 !== 0} delay={0.1} />
            ))}
          </div>

          <AnimatedSection delay={0.2} className="mt-16 text-center">
            <Link href="/portfolio" className="btn-neon px-8 py-4 rounded-lg text-center font-bold inline-block">
              View All Projects
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <Testimonials />

      {/* CTA Section */}
      <section className="py-32 relative z-10 bg-surface">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Let's transform your vision into a high-performance digital solution.
            </p>
            <Link href="/contact" className="btn-solid px-10 py-5 rounded-lg text-lg font-bold inline-block">
              Start Your Project
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

