import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
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

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    });
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
              Contact Us
            </span>
            <h1 className="font-display text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Let's Build Something <span className="text-primary">Amazing</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Ready to start your project? Get in touch and we'll respond within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <AnimatedSection className="lg:col-span-1">
              <div className="space-y-8">
                <div>
                  <h3 className="font-display text-2xl font-bold text-foreground mb-6">
                    Get in Touch
                  </h3>
                  <p className="text-muted-foreground mb-8">
                    Have a question or want to work together? We'd love to hear from you.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail size={20} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Email</h4>
                      <a
                        href="mailto:hello@softixai.com"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        hello@softixai.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone size={20} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Phone</h4>
                      <a
                        href="tel:03032963333"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        0303-2963333
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Office</h4>
                      <p className="text-muted-foreground">
                        123 Innovation Drive<br />
                        San Francisco, CA 94105
                      </p>
                    </div>
                  </div>
                </div>

                {/* Map placeholder */}
                <div className="aspect-video bg-surface rounded-xl border border-border overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <MapPin size={40} className="opacity-30" />
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Form */}
            <AnimatedSection delay={0.2} className="lg:col-span-2">
              <div className="card-glass p-8 md:p-10 rounded-2xl">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                  >
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={40} className="text-primary" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                      Message Sent!
                    </h3>
                    <p className="text-muted-foreground mb-8">
                      Thank you for reaching out. We'll get back to you within 24 hours.
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
                          placeholder="John Doe"
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
                          placeholder="john@company.com"
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

export default Contact;
