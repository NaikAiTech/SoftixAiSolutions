import { motion } from "framer-motion";
import Link from "next/link";
import {
  Brain,
  Code,
  Cloud,
  Shield,
  Smartphone,
  Database,
  Cpu,
  LineChart,
  Layers,
  Zap,
  ArrowRight,
  Check,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TechStack } from "@/components/ui/TechStack";

const services = [
  {
    id: "ai",
    icon: Brain,
    title: "AI & Machine Learning",
    description: "Practical AI that reduces manual work and improves decisions—no hype, only measurable impact.",
    features: [
      "AI support assistants (Web / WhatsApp)",
      "Smart follow-ups & notification engines",
      "Workflow automation (n8n + custom logic)",
"AI agents for repetitive internal taskss",
    ],
  },
  {
    id: "software",
    icon: Code,
    title: "Custom Software Development",
    description: "We design the full customer journey—capture, onboarding, retention—then build custom software to support it.",
    features: [
      "Lead-to-customer pipelines (custom CRM logic)",
      "Onboarding flows & customer portals",
      "Subscriptions, accounts & permissions",
      "Customer insights, analytics & reporting",
      
    ],
  },
  {
    id: "enterprise",
    icon: Layers,
    title: "Enterprise Platforms",
    description: "Secure, scalable web applications built around your business logic—not templates.",
    features: [
      "Admin dashboards & internal tools",
      "Multi-tenant SaaS architecture",
      "API-first development & integrations",
      "Performance, security & scalability",
      
    ],
  },
  {
    id: "cloud",
    icon: Cloud,
    title: "Integrations & Workflow Engineering",
    description: "We connect your tools into one system so your business runs smoother.",
    features: [
      "CRM ↔ Website ↔ Payments automation",
      "Email/SMS/WhatsApp system integration",
      "Third‑party APIs & data sync",
      "Event tracking & operational alerts",
      
    ],
  },
  {
    id: "mobile",
    icon: Smartphone,
    title: "Mobile Development",
    description: "Native and cross-platform mobile applications that users love.",
    features: [
      "React Native Apps",
      "iOS & Android Native",
      "Progressive Web Apps",
      "Mobile-First Design",
      "Offline Capabilities",
      
    ],
  },
  {
    id: "security",
    icon: Shield,
    title: "Custom Commerce & Marketplaces",
    description: "We engineer commerce around how you sell. WooCommerce/Laravel-based—fully customized.",
    features: [
      "Pricing & product logic customization",
      "Checkout, payments & order workflows",
      "Vendor/customer roles & permissions",
      "Automation for fulfillment & ops",
      
    ],
  },
];

const process = [
  {
    step: "01",
    title: "Discovery",
    description: "We learn your audience, offer, and the real reasons customers convert or drop.",
  },
  {
    step: "02",
    title: "Strategy",
    description: "We define a simple, measurable process from lead → customer → repeat buyer.",
  },
  {
    step: "03",
    title: "Development",
    description: "Architecture, data model, permissions, automation map—planned before building.",
  },
  {
    step: "04",
    title: "Build Custom Logic",
    description: "We develop your platform with clean code, scalable structure, and real-world handling.",
  },
   {
    step: "05",
    title: "Automate & Optimize",
    description: "We reduce manual operations using AI/workflows and optimize conversion points.",
  },
   {
    step: "06",
    title: "Scale with Confidence",
    description: "Performance, monitoring, iteration—so your system grows with your business.",
  },
];

const Services = () => {
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
              Our Services
            </span>
            <h1 className="font-display text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Full-Stack <span className="text-primary">Technology</span> Solutions
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We don’t sell templates. We design the customer journey first, then engineer custom software and automation that helps you acquire, onboard, and retain customers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <AnimatedSection key={service.id} delay={index * 0.1}>
                <motion.div
                  id={service.id}
                  whileHover={{ y: -5 }}
                  className="card-glass p-8 rounded-2xl h-full group"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                    <service.icon size={28} className="text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check size={14} className="text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 bg-surface relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader
            badge="Technology Stack"
            title="Built with the Best"
            description="We leverage cutting-edge technologies to build robust, scalable solutions."
            align="center"
          />
          <TechStack />
        </div>
      </section>

      {/* Process */}
      <section className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader
            badge="Our Process"
            title="How We Work"
            description="A simple, structured process focused on outcomes. No confusion, no over-engineering."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <AnimatedSection key={step.step} delay={index * 0.15}>
                <div className="relative">
                  <div className="text-6xl font-display font-bold text-primary/10 mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                  
                  {index < process.length - 1 && (
                    <div className="hidden lg:block absolute top-8 right-0 transform translate-x-1/2">
                      <ArrowRight size={24} className="text-primary/30" />
                    </div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-surface relative z-10">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="font-display text-4xl font-bold text-foreground mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Let's discuss how our services can help you achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-solid px-10 py-5 rounded-lg text-lg font-bold">
                Get Started
              </Link>
              <Link href="/pricing" className="btn-neon px-10 py-5 rounded-lg text-lg font-bold">
                View Pricing
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
