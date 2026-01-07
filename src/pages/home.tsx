import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TechStack } from "@/components/ui/TechStack";

export default function Home() {
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
          <div className="grid lg:grid-cols-2 gap-16 items-stretch">
            {/* Content */}
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

            {/* Visual / Canvas Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative w-full min-h-[420px]"
            >
              <div className="absolute inset-0 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-float">
                {/* Window Controls */}
                <div className="h-10 bg-surface border-b border-border flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-border" />
                  <div className="w-3 h-3 rounded-full bg-border" />
                  <div className="w-3 h-3 rounded-full bg-border" />
                  <div className="ml-auto font-mono text-[10px] text-primary font-bold">● LIVE</div>
                </div>

                <div className="flex-1 relative bg-card">
                  {/* Web-development themed image */}
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1600"
                    alt="Web development team working on laptops"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-12">
            <TechStack />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

