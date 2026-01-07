import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Briefcase,
  Users,
  Heart,
  Coffee,
  Laptop,
  Plane,
  GraduationCap,
  ArrowRight,
  Clock,
  Send,
  CheckCircle,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useToast } from "@/hooks/use-toast";

const benefits = [
  { icon: Heart, title: "Health & Wellness", description: "Comprehensive health, dental, and vision coverage" },
  { icon: Laptop, title: "Remote-First", description: "Work from anywhere with flexible hours" },
  { icon: Plane, title: "Unlimited PTO", description: "Take the time you need to recharge" },
  { icon: GraduationCap, title: "Learning Budget", description: "$5,000 annual learning & development stipend" },
  { icon: Coffee, title: "Home Office", description: "$1,000 to set up your perfect workspace" },
  { icon: Users, title: "Team Retreats", description: "Annual company-wide gatherings worldwide" },
];

const openPositions = [
  {
    id: 1,
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Build and scale our core platform products using React, Node.js, and PostgreSQL.",
  },
  {
    id: 2,
    title: "Machine Learning Engineer",
    department: "AI/ML",
    location: "San Francisco / Remote",
    type: "Full-time",
    description: "Develop and deploy ML models that power our AI-driven solutions.",
  },
  {
    id: 3,
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    description: "Create beautiful, intuitive experiences for enterprise software products.",
  },
  {
    id: 4,
    title: "DevOps Engineer",
    department: "Infrastructure",
    location: "Remote",
    type: "Full-time",
    description: "Build and maintain our cloud infrastructure on AWS and Kubernetes.",
  },
  {
    id: 5,
    title: "Technical Writer",
    department: "Documentation",
    location: "Remote",
    type: "Part-time",
    description: "Create clear, comprehensive documentation for our APIs and products.",
  },
];

const values = [
  {
    title: "Move Fast, Stay Focused",
    description: "We ship quickly without sacrificing quality. Every feature should delight.",
  },
  {
    title: "Ownership Mentality",
    description: "Take initiative, make decisions, and own the outcomes of your work.",
  },
  {
    title: "Radical Transparency",
    description: "We share information openly and give honest, constructive feedback.",
  },
  {
    title: "Continuous Growth",
    description: "We're always learning, experimenting, and pushing boundaries.",
  },
];

const Careers = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    budget: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      setIsSubmitted(true);
      toast({
        title: "Message sent!",
        description: "We'll get back to you within 24 hours.",
      });
    } catch (err) {
      toast({
        title: "Message failed",
        description: err instanceof Error ? err.message : "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
            className="text-center max-w-3xl mx-auto"
          >
            <span className="font-mono text-primary text-sm tracking-widest uppercase font-bold mb-4 block">
              Careers
            </span>
            <h1 className="font-display text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Build the Future <span className="text-primary">With Us</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Join a team of passionate innovators working on challenging problems 
              that shape the future of technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Culture Image */}
      <section className="py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1600"
                alt="Team collaboration"
                className="w-full aspect-[21/9] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Values */}
      <section className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader
            badge="Our Culture"
            title="What We Value"
            description="The principles that guide how we work and grow together."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {values.map((value, index) => (
              <AnimatedSection key={value.title} delay={index * 0.1}>
                <div className="card-glass p-8 rounded-2xl">
                  <h3 className="font-display text-xl font-bold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-32 bg-surface relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader
            badge="Benefits"
            title="Why You'll Love It Here"
            description="We take care of our team so they can do their best work."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <AnimatedSection key={benefit.title} delay={index * 0.1}>
                <div className="card-glass p-6 rounded-2xl flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                    <benefit.icon
                      size={24}
                      className="text-primary group-hover:text-primary-foreground transition-colors"
                    />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader
            badge="Open Positions"
            title="Join Our Team"
            description="Explore current opportunities and find your perfect role."
          />

          <div className="space-y-4">
            {openPositions.map((position, index) => (
              <AnimatedSection key={position.id} delay={index * 0.1}>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="card-glass p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 group cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {position.title}
                      </h3>
                      <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                        {position.department}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{position.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {position.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {position.type}
                      </span>
                    </div>
                  </div>
                  <ArrowRight
                    size={20}
                    className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Careers Contact Form */}
      <section className="py-32 bg-surface relative z-10">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <AnimatedSection>
              <SectionHeader
                badge="Contact"
                title="Apply / Connect With Us"
                description="Send your details and we’ll reach out. Your message is delivered directly to our inbox."
              />
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="card-glass p-8 md:p-10 rounded-2xl">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-primary" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Thanks for reaching out. We&apos;ll get back to you soon.
                    </p>
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          name: "",
                          email: "",
                          company: "",
                          projectType: "",
                          budget: "",
                          message: "",
                        });
                      }}
                      className="text-primary font-bold hover:text-foreground transition-colors"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-mono text-primary mb-2 uppercase font-bold">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="input-light w-full rounded-lg px-4 py-3"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-primary mb-2 uppercase font-bold">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="input-light w-full rounded-lg px-4 py-3"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-mono text-primary mb-2 uppercase font-bold">
                          Company
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="input-light w-full rounded-lg px-4 py-3"
                          placeholder="Your Company"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-primary mb-2 uppercase font-bold">
                          Project Type
                        </label>
                        <select
                          name="projectType"
                          value={formData.projectType}
                          onChange={handleChange}
                          className="input-light w-full rounded-lg px-4 py-3"
                        >
                          <option value="">Select a type</option>
                          <option value="web">Web Application</option>
                          <option value="mobile">Mobile App</option>
                          <option value="ai">AI/ML Solution</option>
                          <option value="enterprise">Enterprise Platform</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-primary mb-2 uppercase font-bold">
                        Budget Range
                      </label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="input-light w-full rounded-lg px-4 py-3"
                      >
                        <option value="">Select budget range</option>
                        <option value="10k-25k">$10,000 - $25,000</option>
                        <option value="25k-50k">$25,000 - $50,000</option>
                        <option value="50k-100k">$50,000 - $100,000</option>
                        <option value="100k+">$100,000+</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-primary mb-2 uppercase font-bold">
                        Project Details *
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="input-light w-full rounded-lg px-4 py-3 resize-none"
                        placeholder="Tell us about your project, goals, and timeline..."
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full btn-solid py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Careers;
