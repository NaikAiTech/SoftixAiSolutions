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
    title: "Neural Networks",
    description: "Custom AI models trained on your proprietary data.",
    features: ["TensorFlow", "Real-Time AI"],
  },
  {
    icon: Layers,
    title: "Enterprise Platforms",
    description: "Scalable SaaS systems built for performance.",
    features: ["Next.js", "Microservices"],
    highlighted: true,
  },
  {
    icon: Shield,
    title: "Cyber Infrastructure",
    description: "Bank-grade security across your stack.",
    features: ["SOC2", "Encryption"],
  },
];

const projects = [
  {
    title: "Nexus Finance",
    description: "High-frequency trading platform with AI risk analysis.",
    image:
      "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&q=80&w=1600",
    tags: ["React", "Python"],
  },
  {
    title: "Sentinel Grid",
    description: "Enterprise cybersecurity visualization system.",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1600",
    tags: ["Vue", "Go"],
  },
];

const stats = [
  { value: 150, suffix: "+", label: "Projects Delivered" },
  { value: 50, suffix: "+", label: "Enterprise Clients" },
  { value: 99, suffix: "%", label: "Client Satisfaction" },
  { value: 24, suffix: "/7", label: "Support" },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section className="pt-40 pb-32 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-7xl font-bold mb-8">
                Engineering <br />
                <span className="text-primary">Intelligent</span> Future
              </h1>

              <p className="text-lg text-muted-foreground mb-10 max-w-lg">
                We build intelligent, scalable and secure digital systems.
              </p>

              <div className="flex gap-4">
                <Link href="/contact" className="btn-solid px-8 py-4 font-bold">
                  Deploy Solution
                </Link>
                <Link
                  href="/portfolio"
                  className="border px-8 py-4 rounded-lg flex items-center gap-2"
                >
                  View Case Studies <ArrowRight size={16} />
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

          <div className="mt-16">
            <TechStack />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <StatsCounter stats={stats} />
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader badge="Capabilities" title="System Architecture" />
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {services.map((s, i) => (
              <ServiceCard key={s.title} {...s} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader badge="Work" title="Featured Projects" />
          <div className="space-y-24 mt-20">
            {projects.map((p, i) => (
              <ProjectCard key={p.title} {...p} reverse={i % 2 !== 0} />
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      {/* CTA */}
      <section className="py-32 bg-surface text-center">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Build Something Amazing?
        </h2>
        <Link href="/contact" className="btn-solid px-10 py-5 font-bold">
          Start Your Project
        </Link>
      </section>

      <Footer />
    </div>
  );
}
