import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Network, Layers, Shield } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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
    title: "AI-Powered Web Systems",
    description: "Custom AI solutions embedded into web platforms, enabling predictive analytics, automation, and real-time intelligence.",
    features: ["TensorFlow_Integration", "Real_Time_Processing"],
  },
  {
    icon: Layers,
    title: "Scalable Web & SaaS Platforms",
    description: "We design and build high-availability web and SaaS platforms capable of handling millions of users and requests without latency.",
    features: ["Next.js / React", "Microservices"],
    highlighted: true,
  },
  {
    icon: Shield,
    title: "Secure & Intelligent Infrastructure",
    description: "We implement enterprise-grade security across web and software platforms, ensuring that every layer of your application stack is protected.",
    features: ["Continuous Monitoring", "End-to-End Encryption"],
  },
];

const projects = [
  {
    title: "Web & AI Projects",
    description: "Explore some of our recent projects where we combined cutting-edge web development with AI-powered solutions. From high-performance platforms to intelligent automation systems",
    image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&q=80&w=1600",
    tags: ["React", "Python", "WebSockets"],
  },
  {
    title: "Sentinel Web Dashboard",
    description: "AI-driven enterprise web platform for real-time monitoring, anomaly detection, and actionable analytics.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1600",
    tags: ["Vue.js", "Nextjs", "Ai"],
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
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col justify-start"
            >
              <h1 className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-8 leading-[1.1]">
           Intelligent  <br />
                <span className="text-primary">Software</span> with AI Automation
              </h1>

              <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-lg border-l-4 border-primary pl-6 bg-gradient-to-r from-primary/5 to-transparent py-2">
               We design and develop intelligent web and software solutions powered by AI automation. From scalable web platforms to smart business workflows, we help companies streamline operations, enhance productivity, and grow faster with future-ready technology.
              </p>

              <div className="flex flex-col sm:flex-row gap-5">
                <Link href="/contact" className="btn-solid px-8 py-4 rounded-lg text-center font-bold">
                  Deploy Solution
                </Link>
                <Link
                  href="/portfolio"
                  className="px-8 py-4 rounded-lg border border-border text-foreground hover:bg-surface transition-colors text-center flex items-center justify-center gap-2 group font-medium"
                >
                  View Case Studies <ArrowRight size={16} className="text-primary transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* RIGHT VISUAL – REPLACED */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative flex justify-center items-center w-full h-[500px] lg:h-full"
            >
              {/* Blob background */}
              <div className="absolute w-full h-full bg-[#66ba36] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] flex items-center justify-center" />

              {/* Main Image */}
              <motion.img
                src="./images/hero.jpg"
                alt="Developer working on laptop"
                className="relative z-10 w-[520px] md:w-[520px] rounded-2xl"
              />

              {/* Floating Cards */}
              <motion.div
                className="absolute top-8 left-0 bg-white rounded-xl shadow-xl px-4 py-3 z-20"
                animate={{ x: [0, 12, 0], y: [0, -10, 0], rotate: [0, 4, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <p className="text-sm font-bold text-gray-900">2K+</p>
                <p className="text-xs text-gray-500">Projects</p>
              </motion.div>

              <motion.div
                className="absolute top-12 right-0 bg-white rounded-xl shadow-xl px-4 py-3 z-20"
                animate={{ scale: [1, 1.05, 1], y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <p className="text-sm font-bold text-gray-900">⭐ 4.8</p>
                <p className="text-xs text-gray-500">Satisfaction</p>
              </motion.div>

              <motion.div
                className="absolute bottom-6 bg-white rounded-xl shadow-xl px-6 py-3 z-20"
                animate={{ y: [0, -10, 0], rotate: [0, -3, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              >
                <p className="text-sm font-bold text-gray-900">Software Developer</p>
                <p className="text-xs text-gray-500">5+ Years Experience</p>
              </motion.div>
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
          <SectionHeader badge="Capabilities" title="Intelligent Architecture for Complex Systems" description="Built for reliability and data protection" />

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
              Explore All Services <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
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
