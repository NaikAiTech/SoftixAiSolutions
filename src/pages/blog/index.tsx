import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, Search, Tag } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

import { blogCategories as categories, blogPosts } from "@/data/blog";

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find((post) => post.featured);

  return (
    <div className="min-h-screen bg-background">
      <div className="noise-overlay" />
      <div className="fixed inset-0 tech-grid z-0 pointer-events-none" />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="font-mono text-primary text-sm tracking-widest uppercase font-bold mb-4 block">
              /// Blog
            </span>
            <h1 className="font-display text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Insights & <span className="text-primary">Innovation</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Thoughts on technology, design, and building great products from our team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-8 relative z-10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <AnimatedSection>
              <Link href={`/blog/${featuredPost.id}`}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="card-glass rounded-2xl overflow-hidden grid lg:grid-cols-2 gap-0"
                >
                  <div className="relative aspect-video lg:aspect-auto">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <span className="text-xs font-mono text-primary font-bold uppercase mb-4">
                      {featuredPost.category}
                    </span>
                    <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">
                      {featuredPost.title}
                    </h2>
                    <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Calendar size={14} />
                        {featuredPost.date}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock size={14} />
                        {featuredPost.readTime}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Search & Filter */}
      <section className="py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-light w-full rounded-lg pl-11 pr-4 py-3"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts
              .filter((post) => !post.featured)
              .map((post, index) => (
                <AnimatedSection key={post.id} delay={index * 0.1}>
                  <Link href={`/blog/${post.id}`}>
                    <motion.article
                      whileHover={{ y: -5 }}
                      className="card-glass rounded-2xl overflow-hidden group h-full flex flex-col"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <span className="text-xs font-mono text-primary font-bold uppercase mb-3">
                          {post.category}
                        </span>
                        <h3 className="font-display text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 flex-1">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-2">
                            <Calendar size={12} />
                            {post.date}
                          </span>
                          <span className="flex items-center gap-2">
                            <Clock size={12} />
                            {post.readTime}
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  </Link>
                </AnimatedSection>
              ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No articles found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-32 bg-surface relative z-10">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="font-display text-4xl font-bold text-foreground mb-6">
              Stay Updated
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Subscribe to our newsletter for the latest insights and updates.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="input-light flex-1 rounded-lg px-4 py-3"
              />
              <button type="submit" className="btn-solid px-8 py-3 rounded-lg font-bold whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
