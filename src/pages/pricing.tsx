// import { useState } from "react";
// import { motion } from "framer-motion";
// import Link from "next/link";
// import { Check, HelpCircle, Zap, Crown, Building } from "lucide-react";
// import { Navbar } from "@/components/layout/Navbar";
// import { Footer } from "@/components/layout/Footer";
// import { AnimatedSection } from "@/components/ui/AnimatedSection";
// import { SectionHeader } from "@/components/ui/SectionHeader";

// const plans = [
//   {
//     name: "Starter",
//     icon: Zap,
//     price: "10,000",
//     period: "project",
//     description: "Perfect for small projects and MVPs",
//     features: [
//       "Up to 4 weeks development",
//       "Single feature focus",
//       "Basic support",
//       "1 revision round",
//       "Source code included",
//     ],
//     cta: "Get Started",
//     highlighted: false,
//   },
//   {
//     name: "Professional",
//     icon: Crown,
//     price: "25,000",
//     period: "project",
//     description: "Ideal for growing businesses",
//     features: [
//       "Up to 12 weeks development",
//       "Full feature set",
//       "Priority support",
//       "3 revision rounds",
//       "Source code included",
//       "30 days post-launch support",
//       "Performance optimization",
//     ],
//     cta: "Most Popular",
//     highlighted: true,
//   },
//   {
//     name: "Enterprise",
//     icon: Building,
//     price: "Custom",
//     period: "",
//     description: "For large-scale enterprise needs",
//     features: [
//       "Unlimited development scope",
//       "Dedicated team",
//       "24/7 support",
//       "Unlimited revisions",
//       "Source code included",
//       "Ongoing maintenance",
//       "SLA guarantees",
//       "Custom integrations",
//     ],
//     cta: "Contact Sales",
//     highlighted: false,
//   },
// ];

// const faqs = [
//   {
//     question: "How do you price custom projects?",
//     answer:
//       "We provide detailed estimates based on project scope, complexity, and timeline. After our initial consultation, you'll receive a comprehensive proposal with transparent pricing.",
//   },
//   {
//     question: "What's your development process?",
//     answer:
//       "We follow an agile methodology with 2-week sprints. You'll receive regular updates, demos, and have opportunities to provide feedback throughout the development process.",
//   },
//   {
//     question: "Do you offer ongoing support?",
//     answer:
//       "Yes! All plans include post-launch support. We also offer monthly retainer packages for ongoing development, maintenance, and feature additions.",
//   },
//   {
//     question: "Can I upgrade my plan mid-project?",
//     answer:
//       "Absolutely. If your needs grow during development, we can easily adjust the scope and pricing to accommodate additional features or complexity.",
//   },
// ];

// const Pricing = () => {
//   const [billingPeriod, setBillingPeriod] = useState<"project" | "retainer">("project");

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="noise-overlay" />
//       <div className="fixed inset-0 tech-grid z-0 pointer-events-none" />
//       <Navbar />

//       {/* Hero */}
//       <section className="pt-32 pb-20 relative z-10">
//         <div className="max-w-7xl mx-auto px-6 lg:px-8">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="text-center max-w-3xl mx-auto"
//           >
//             <span className="font-mono text-primary text-sm tracking-widest uppercase font-bold mb-4 block">
//               Pricing
//             </span>
//             <h1 className="font-display text-5xl lg:text-6xl font-bold text-foreground mb-6">
//               Transparent <span className="text-primary">Pricing</span>
//             </h1>
//             <p className="text-xl text-muted-foreground leading-relaxed">
//               Choose the plan that fits your needs. All plans include our commitment 
//               to quality and your success.
//             </p>
//           </motion.div>
//         </div>
//       </section>

//       {/* Pricing Cards */}
//       <section className="py-20 relative z-10">
//         <div className="max-w-7xl mx-auto px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {plans.map((plan, index) => (
//               <AnimatedSection key={plan.name} delay={index * 0.1}>
//                 <motion.div
//                   whileHover={{ y: -5 }}
//                   className={`card-glass rounded-2xl p-8 h-full flex flex-col relative ${
//                     plan.highlighted ? "border-primary/50 shadow-xl" : ""
//                   }`}
//                 >
//                   {plan.highlighted && (
//                     <div className="absolute -top-4 left-1/2 -translate-x-1/2">
//                       <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
//                         Most Popular
//                       </span>
//                     </div>
//                   )}

//                   <div className="mb-6">
//                     <div
//                       className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
//                         plan.highlighted ? "bg-primary" : "bg-primary/10"
//                       }`}
//                     >
//                       <plan.icon
//                         size={24}
//                         className={plan.highlighted ? "text-primary-foreground" : "text-primary"}
//                       />
//                     </div>
//                     <h3 className="font-display text-2xl font-bold text-foreground">{plan.name}</h3>
//                     <p className="text-muted-foreground text-sm mt-1">{plan.description}</p>
//                   </div>

//                   <div className="mb-6">
//                     <span className="font-display text-4xl font-bold text-foreground">
//                       ${plan.price}
//                     </span>
//                     {plan.period && (
//                       <span className="text-muted-foreground text-sm ml-2">/ {plan.period}</span>
//                     )}
//                   </div>

//                   <ul className="space-y-3 mb-8 flex-1">
//                     {plan.features.map((feature) => (
//                       <li key={feature} className="flex items-start gap-3">
//                         <Check size={18} className="text-primary flex-shrink-0 mt-0.5" />
//                         <span className="text-muted-foreground text-sm">{feature}</span>
//                       </li>
//                     ))}
//                   </ul>

//                   <Link
//                     href="/contact"
//                     className={`w-full py-4 rounded-lg text-center font-bold transition-all ${
//                       plan.highlighted
//                         ? "btn-solid"
//                         : "bg-surface border border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary"
//                     }`}
//                   >
//                     {plan.cta}
//                   </Link>
//                 </motion.div>
//               </AnimatedSection>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* FAQ */}
//       <section className="py-32 bg-surface relative z-10">
//         <div className="max-w-3xl mx-auto px-6 lg:px-8">
//           <SectionHeader
//             badge="FAQ"
//             title="Common Questions"
//             description="Find answers to frequently asked questions about our pricing and services."
//             align="center"
//           />

//           <div className="space-y-4">
//             {faqs.map((faq, index) => (
//               <AnimatedSection key={index} delay={index * 0.1}>
//                 <div className="card-glass p-6 rounded-xl">
//                   <h3 className="font-display font-bold text-foreground mb-3 flex items-start gap-3">
//                     <HelpCircle size={20} className="text-primary flex-shrink-0 mt-0.5" />
//                     {faq.question}
//                   </h3>
//                   <p className="text-muted-foreground text-sm pl-8">{faq.answer}</p>
//                 </div>
//               </AnimatedSection>
//             ))}
//           </div>

//           <AnimatedSection delay={0.4} className="mt-12 text-center">
//             <p className="text-muted-foreground mb-4">Still have questions?</p>
//             <Link
//               href="/contact"
//               className="text-primary font-bold hover:text-foreground transition-colors"
//             >
//               Get in touch →
//             </Link>
//           </AnimatedSection>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="py-32 relative z-10">
//         <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
//           <AnimatedSection>
//             <h2 className="font-display text-4xl font-bold text-foreground mb-6">
//               Ready to Get Started?
//             </h2>
//             <p className="text-muted-foreground text-lg mb-10">
//               Let's discuss your project and find the perfect solution for your needs.
//             </p>
//             <Link href="/contact" className="btn-solid px-10 py-5 rounded-lg text-lg font-bold inline-block">
//               Schedule a Consultation
//             </Link>
//           </AnimatedSection>
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// };

// export default Pricing;
