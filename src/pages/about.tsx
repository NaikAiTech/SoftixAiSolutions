import { motion } from "framer-motion";
import Link from "next/link";
import { Users, Target, Award, Rocket, Heart, Lightbulb, Zap, Globe } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatsCounter } from "@/components/ui/StatsCounter";

const team = [
  {
    name: "Alex Chen",
    role: "CEO & Founder",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    bio: "15+ years in enterprise software. Former Google engineer.",
  },
  {
    name: "Sarah Williams",
    role: "CTO",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
    bio: "AI/ML specialist with a PhD from Stanford.",
  },
  {
    name: "Michael Park",
    role: "Head of Engineering",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
    bio: "Built scalable systems for Fortune 500 companies.",
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Design",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400",
    bio: "Award-winning UX designer. Former Apple.",
  },
];

const values = [
  {
    icon: Lightbulb,
    title: "Innovation First",
    description: "We constantly push the boundaries of what's possible with technology.",
  },
  {
    icon: Heart,
    title: "Client-Centric",
    description: "Your success is our success. We treat every project as our own.",
  },
  {
    icon: Zap,
    title: "Excellence",
    description: "We don't settle for good enough. Every line of code matters.",
  },
  {
    icon: Globe,
    title: "Global Impact",
    description: "Building solutions that make a difference worldwide.",
  },
];

const milestones = [
  { year: "2018", title: "Founded", description: "Started in a small garage with big dreams" },
  { year: "2019", title: "First Enterprise Client", description: "Landed our first Fortune 500 contract" },
  { year: "2020", title: "Team Growth", description: "Expanded to 25+ engineers worldwide" },
  { year: "2021", title: "AI Division", description: "Launched dedicated AI/ML solutions team" },
  { year: "2022", title: "Global Expansion", description: "Opened offices in London and Singapore" },
  { year: "2023", title: "Industry Recognition", description: "Named Top 10 Tech Innovator by Forbes" },
];

const stats = [
  { value: 150, suffix: "+", label: "Projects Completed" },
  { value: 50, suffix: "+", label: "Team Members" },
  { value: 15, suffix: "+", label: "Countries Served" },
  { value: 8, suffix: "", label: "Years of Excellence" },
];

const About = () => {
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
              About Us
            </span>
            <h1 className="font-display text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Building the Future, <span className="text-primary">One Line at a Time</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We're a team of passionate engineers, designers, and innovators dedicated to creating 
              digital experiences that transform businesses and delight users.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <StatsCounter stats={stats} />
        </div>
      </section>

      {/* Mission */}
      <section className="py-32 bg-surface relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <SectionHeader
                badge="Our Mission"
                title="Empowering Innovation Through Technology"
              />
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                At Softix AI Solution, we believe that great software has the power to transform 
                industries and improve lives. Our mission is to partner with forward-thinking 
                organizations to build the digital infrastructure of tomorrow.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We combine cutting-edge technology with deep industry expertise to deliver 
                solutions that don't just meet requirements—they exceed expectations and 
                open new possibilities.
              </p>
            </AnimatedSection>
            
            <AnimatedSection delay={0.2} direction="left">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-3xl" />
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                  alt="Team collaboration"
                  className="relative rounded-2xl shadow-2xl border border-border"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Vision (matching Mission section layout) */}
      <section className="py-32 bg-surface relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <SectionHeader
                badge="Our Vision"
                title="Building a Smarter Digital Future"
              />
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Our vision is to become the trusted partner for organizations seeking intelligent,
                secure, and scalable digital ecosystems—where design excellence and engineering
                precision work together to unlock long-term growth.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We aim to set the standard for modern, enterprise-ready solutions that deliver
                measurable impact—through performance, reliability, and innovation.
              </p>
            </AnimatedSection>
            
            <AnimatedSection delay={0.2} direction="left">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-3xl" />
                <img
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=800"
                  alt="Vision and strategy"
                  className="relative rounded-2xl shadow-2xl border border-border"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader
            badge="Core Values"
            title="What Drives Us"
            description="The principles that guide everything we do."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <AnimatedSection key={value.title} delay={index * 0.1}>
                <div className="card-glass p-8 rounded-2xl text-center group">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary transition-colors">
                    <value.icon size={28} className="text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-32 bg-surface relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader
            badge="Leadership"
            title="Meet Our Team"
            description="The brilliant minds behind Softix AI Solution."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <AnimatedSection key={member.name} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="card-glass rounded-2xl overflow-hidden group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display font-bold text-foreground mb-1">{member.name}</h3>
                    <p className="text-primary text-sm font-medium mb-3">{member.role}</p>
                    <p className="text-muted-foreground text-sm">{member.bio}</p>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader
            badge="Our Journey"
            title="Milestones"
            align="center"
          />

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-border hidden md:block" />
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <AnimatedSection
                  key={milestone.year}
                  delay={index * 0.1}
                  direction={index % 2 === 0 ? "right" : "left"}
                >
                  <div className={`flex items-center gap-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                      <div className="card-glass p-6 rounded-xl inline-block">
                        <span className="text-primary font-mono font-bold text-lg">{milestone.year}</span>
                        <h3 className="font-display font-bold text-foreground mt-2">{milestone.title}</h3>
                        <p className="text-muted-foreground text-sm mt-1">{milestone.description}</p>
                      </div>
                    </div>
                    <div className="hidden md:flex w-4 h-4 bg-primary rounded-full relative z-10 shadow-lg" />
                    <div className="flex-1 hidden md:block" />
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-surface relative z-10">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="font-display text-4xl font-bold text-foreground mb-6">
              Want to Join Our Team?
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              We're always looking for talented individuals who share our passion for innovation.
            </p>
            <Link href="/careers" className="btn-solid px-10 py-5 rounded-lg text-lg font-bold inline-block">
              View Open Positions
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
