import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import { portfolioProjects, type PortfolioProject } from "@/data/portfolio";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

type PortfolioProjectPageProps = {
  project: PortfolioProject;
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: portfolioProjects.map((project) => ({ params: { id: String(project.id) } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PortfolioProjectPageProps> = async ({ params }) => {
  const id = Number(params?.id);
  const project = portfolioProjects.find((p) => p.id === id);

  if (!project) {
    return { notFound: true };
  }

  return { props: { project } };
};

export default function PortfolioProjectPage({ project }: PortfolioProjectPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="noise-overlay" />
      <div className="fixed inset-0 tech-grid z-0 pointer-events-none" />
      <Navbar />

      <section className="pt-32 pb-10 relative z-10">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft size={16} />
              Back to Portfolio
            </Link>

            <span className="font-mono text-primary text-sm tracking-widest uppercase font-bold mb-4 block">
              {project.category}
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              {project.title}
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl">
              {project.description}
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-24 relative z-10">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <AnimatedSection delay={0.1}>
            <div className="rounded-2xl overflow-hidden border border-border shadow-2xl mb-10">
              <img src={project.image} alt={project.title} className="w-full aspect-[16/9] object-cover" />
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <AnimatedSection delay={0.2} className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card-glass rounded-2xl p-8"
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  Overview
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  This case study route didn’t exist in the original React Router setup, but the UI
                  linked to it. It’s now implemented as a real Next.js page so navigation works end-to-end.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 border border-border bg-surface rounded text-xs text-muted-foreground font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatedSection>

            <AnimatedSection delay={0.25} className="lg:col-span-1">
              <div className="card-glass rounded-2xl p-8">
                <h3 className="font-display text-lg font-bold text-foreground mb-4">
                  Key Metrics
                </h3>
                <div className="space-y-3">
                  {Object.entries(project.metrics).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground text-sm capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="text-foreground font-bold">{value}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/contact"
                  className="btn-solid mt-8 w-full py-4 rounded-lg text-center font-bold inline-flex items-center justify-center gap-2"
                >
                  Build Something Similar <ArrowRight size={16} />
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

