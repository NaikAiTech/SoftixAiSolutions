import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDown, Search, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const faqCategories = [
  {
    name: "General",
    faqs: [
      {
        question: "What services does Softix AI Solution offer?",
        answer:
          "We offer a comprehensive range of technology services including AI/ML solutions, custom software development, enterprise platforms, cloud infrastructure, mobile development, and cybersecurity. Our team specializes in building high-performance digital solutions tailored to your business needs.",
      },
      {
        question: "How long has Softix AI Solution been in business?",
        answer:
          "We've been helping businesses transform their digital presence since 2018. Over the years, we've delivered 150+ successful projects for clients ranging from startups to Fortune 500 companies.",
      },
      {
        question: "Where is Softix AI Solution located?",
        answer:
          "Our headquarters is in San Francisco, CA, with additional offices in London and Singapore. However, we operate as a remote-first company with team members across the globe, allowing us to serve clients worldwide.",
      },
    ],
  },
  {
    name: "Projects",
    faqs: [
      {
        question: "How do you approach new projects?",
        answer:
          "We follow a proven 4-step process: Discovery (understanding your needs), Strategy (planning the solution), Development (agile execution), and Launch & Scale (deployment and optimization). Each phase includes regular client communication and feedback loops.",
      },
      {
        question: "What is your typical project timeline?",
        answer:
          "Timelines vary based on project scope. Small projects (MVPs) typically take 4-8 weeks, medium projects 8-16 weeks, and enterprise solutions 3-6 months or more. We'll provide a detailed timeline during our initial consultation.",
      },
      {
        question: "Do you work with existing codebases?",
        answer:
          "Yes! We regularly work with existing applications for modernization, optimization, or feature additions. Our team is experienced in legacy system integration and code refactoring.",
      },
      {
        question: "Can I see progress during development?",
        answer:
          "Absolutely. We use agile methodology with 2-week sprints. You'll receive regular demos, have access to a staging environment, and participate in sprint reviews to ensure the project aligns with your vision.",
      },
    ],
  },
  {
    name: "Pricing & Payment",
    faqs: [
      {
        question: "How do you structure your pricing?",
        answer:
          "We offer flexible pricing models including fixed-price projects, time & materials, and monthly retainers. The best model depends on your project's scope and requirements. We provide transparent, detailed estimates after our discovery session.",
      },
      {
        question: "What are your payment terms?",
        answer:
          "For fixed-price projects, we typically structure payments as 30% upfront, 40% at midpoint, and 30% upon completion. Monthly retainers are billed at the beginning of each month. We accept wire transfers, credit cards, and ACH payments.",
      },
      {
        question: "Do you offer refunds?",
        answer:
          "We stand behind our work. If you're not satisfied with our deliverables, we'll work with you to make it right. Specific refund policies are outlined in our project agreements.",
      },
    ],
  },
  {
    name: "Technology",
    faqs: [
      {
        question: "What technologies do you specialize in?",
        answer:
          "Our core stack includes React, Next.js, Node.js, Python, and cloud platforms (AWS, Azure, GCP). For AI/ML, we work with TensorFlow, PyTorch, and various NLP frameworks. We're technology-agnostic and choose the best tools for each project.",
      },
      {
        question: "Do you build mobile apps?",
        answer:
          "Yes! We develop both native iOS/Android apps and cross-platform solutions using React Native. We also create Progressive Web Apps (PWAs) for businesses that want web-first mobile experiences.",
      },
      {
        question: "How do you ensure code quality?",
        answer:
          "We follow industry best practices including code reviews, automated testing, CI/CD pipelines, and comprehensive documentation. All code is version-controlled and we maintain high test coverage standards.",
      },
    ],
  },
  {
    name: "Support",
    faqs: [
      {
        question: "What support do you offer after launch?",
        answer:
          "All projects include post-launch support (duration varies by plan). We offer ongoing maintenance packages that include bug fixes, security updates, performance monitoring, and feature enhancements.",
      },
      {
        question: "How can I reach your support team?",
        answer:
          "You can reach us via email at support@softixai.com, through our contact form, or by scheduling a call. Enterprise clients have access to dedicated support channels and guaranteed response times.",
      },
      {
        question: "Do you offer training for our team?",
        answer:
          "Yes! We provide comprehensive documentation and can arrange training sessions to help your team understand and maintain the solutions we build. This can include admin training, developer handoffs, and user guides.",
      },
    ],
  },
];

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const allFaqs = faqCategories.flatMap((category) =>
    category.faqs.map((faq) => ({ ...faq, category: category.name }))
  );

  const filteredFaqs =
    activeCategory === "All"
      ? allFaqs
      : allFaqs.filter((faq) => faq.category === activeCategory);

  const searchedFaqs = filteredFaqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            className="text-center max-w-3xl mx-auto"
          >
            <span className="font-mono text-primary text-sm tracking-widest uppercase font-bold mb-4 block">
              /// FAQ
            </span>
            <h1 className="font-display text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Frequently Asked <span className="text-primary">Questions</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Find answers to common questions about our services, process, and more.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 relative z-10">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          {/* Search */}
          <div className="relative mb-8">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-light w-full rounded-lg pl-11 pr-4 py-4 text-lg"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setActiveCategory("All")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === "All"
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {faqCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category.name
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-12 relative z-10">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="space-y-4">
            {searchedFaqs.map((faq, index) => {
              const itemId = `${faq.category}-${index}`;
              const isOpen = openItems.includes(itemId);

              return (
                <AnimatedSection key={itemId} delay={index * 0.05}>
                  <div className="card-glass rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleItem(itemId)}
                      className="w-full p-6 text-left flex items-start justify-between gap-4"
                    >
                      <div>
                        <span className="text-xs font-mono text-primary font-bold uppercase mb-2 block">
                          {faq.category}
                        </span>
                        <h3 className="font-display font-bold text-foreground">
                          {faq.question}
                        </h3>
                      </div>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-shrink-0 mt-1"
                      >
                        <ChevronDown size={20} className="text-primary" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="px-6 pb-6">
                            <p className="text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </AnimatedSection>
              );
            })}

            {searchedFaqs.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No questions found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-surface relative z-10">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle size={32} className="text-primary" />
            </div>
            <h2 className="font-display text-4xl font-bold text-foreground mb-6">
              Still Have Questions?
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Can't find what you're looking for? Our team is here to help.
            </p>
            <Link to="/contact" className="btn-solid px-10 py-5 rounded-lg text-lg font-bold inline-block">
              Contact Us
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
