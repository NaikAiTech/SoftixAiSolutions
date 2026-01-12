import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

import { blogPosts, type BlogPost } from "@/data/blog";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

type BlogPostPageProps = {
  post: BlogPost;
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: blogPosts.map((post) => ({ params: { id: String(post.id) } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async ({ params }) => {
  const id = Number(params?.id);
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return { notFound: true };
  }

  return {
    props: { post },
  };
};

export default function BlogPostPage({ post }: BlogPostPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="noise-overlay" />
      <div className="fixed inset-0 tech-grid z-0 pointer-events-none" />
      <Navbar />

      <section className="pt-32 pb-10 relative z-10">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft size={16} />
              Back to Blog
            </Link>

            <span className="font-mono text-primary text-sm tracking-widest uppercase font-bold mb-4 block">
              {post.category}
            </span>

            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <span>{post.author}</span>
              <span className="flex items-center gap-2">
                <Calendar size={14} />
                {post.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={14} />
                {post.readTime}
              </span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-24 relative z-10">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <AnimatedSection delay={0.1}>
            <div className="rounded-2xl overflow-hidden border border-border shadow-2xl mb-10">
              <img src={post.image} alt={post.title} className="w-full aspect-[16/9] object-cover" />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <motion.article
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <p className="text-muted-foreground text-lg leading-relaxed">{post.excerpt}</p>
              <p className="text-muted-foreground text-lg leading-relaxed mt-6">
                This article page is now a first-class route in Next.js. If you’d like fully written
                long-form content, we can wire these posts to a CMS (MDX, Contentlayer, Sanity,
                etc.) without changing your design.
              </p>
            </motion.article>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}

