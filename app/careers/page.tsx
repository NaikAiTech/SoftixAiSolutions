import React from "react";
import Image from "next/image";

const GlobalStyles = () => (
  <style>{`
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    .animate-fade-in { animation: fadeIn 0.7s ease-out forwards; }
    .animate-scale-in { animation: scaleIn 0.5s ease-out forwards; }
    .hover-scale { transition: transform 0.2s ease-in-out; }
    .hover-scale:hover { transform: scale(1.03); }
  `}</style>
);

const brand = {
  green: "#14b89a",
  blue: "#2563eb",
  textDark: "var(--ink)",
  text: "#374151",
  subText: "#6b7280",
  border: "var(--line)",
  cardBg: "#ffffff",
  pageBg: "hsl(var(--background))",
  iconBg: "rgba(20, 184, 154, 0.1)",
  mutedBg: "#f1f5f9",
};

const ArrowRightIcon = ({ className = "" }) => (
  <svg className={`h-5 w-5 ${className}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
);

const GlobeIcon = () => (
  <svg className="h-7 w-7" style={{ color: brand.green }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
);
const ClockIcon = ({ small = false }) => (
  <svg className={small ? "h-4 w-4 text-gray-500" : "h-7 w-7 text-gray-800"} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);
const DollarSignIcon = () => (
  <svg className="h-7 w-7 text-gray-800" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
);
const TrendingUpIcon = () => (
  <svg className="h-7 w-7 text-gray-800" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
);
const UsersIcon = () => (
  <svg className="h-7 w-7 text-gray-800" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
const AwardIcon = () => (
  <svg className="h-7 w-7 text-gray-800" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path><circle cx="12" cy="8" r="6"></circle></svg>
);
const StethoscopeIcon = () => (
  <svg className="h-8 w-8" style={{ color: brand.green }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 2v2"></path><path d="M5 2v2"></path><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"></path><path d="M8 15a6 6 0 0 0 12 0v-3"></path><circle cx="20" cy="10" r="2"></circle></svg>
);
const HeartIcon = () => (
  <svg className="h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
);
const CheckCircleIcon = () => (
  <svg className="h-6 w-6 flex-shrink-0 mt-0.5" style={{ color: brand.green }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>
);
const MapPinIcon = () => (
  <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
);
const BriefcaseIcon = () => (
  <svg className="h-10 w-10" style={{ color: brand.green }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path><rect width="20" height="14" x="2" y="6" rx="2"></rect></svg>
);
const GraduationCapIcon = () => (
  <svg className="h-10 w-10" style={{ color: brand.green }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path><path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path></svg>
);
const VideoIcon = () => (
  <svg className="h-10 w-10" style={{ color: brand.green }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path><rect x="2" y="6" width="14" height="12" rx="2"></rect></svg>
);
const StarIcon = () => (
  <svg className="h-10 w-10" style={{ color: brand.green }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166 .756a.53.53 0 0 1 .294 .904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771 .56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
);

export const metadata = {
  title: "Careers – Dial A Vet",
  description: "Join our global platform of independent veterinary professionals.",
} as const;

export default function CareersPage() {
  const benefits = [
    "Access to our advanced telehealth platform",
    "Latest veterinary software and tools included",
    "24/7 support and technical assistance",
    "Flexible payment options - weekly or monthly",
    "Professional liability insurance coverage",
    "Continuous learning resources and webinars",
    "Join a network of global veterinary professionals",
    "Built-in client base - no marketing needed",
  ];

  return (
    <div className="min-h-screen w-full antialiased" style={{ backgroundColor: brand.pageBg, color: brand.text }}>
      <GlobalStyles />
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-20 animate-fade-in">
          <div>
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors mb-4" style={{ backgroundColor: brand.iconBg, color: brand.green, borderColor: "transparent" }}>We’re Hiring!</span>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight" style={{ color: brand.textDark }}>
              Be Your Own Boss.<br />
              <span style={{ color: brand.green }}>Work On Your Terms.</span>
            </h1>
            <p className="text-xl mb-8" style={{ color: brand.subText }}>
              Join our platform as an independent contractor and provide remote veterinary consultations when and where you want. Like Uber, but for vets.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#open-roles" className="h-11 px-8 inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium rounded-md hover-scale" style={{ backgroundColor: brand.green, color: "white" }}>
                View Open Positions <ArrowRightIcon className="ml-2" />
              </a>
              <a href="#how-it-works" className="h-11 px-8 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium rounded-md border hover-scale" style={{ borderColor: brand.border, backgroundColor: brand.cardBg }}>
                Learn More
              </a>
            </div>
          </div>
          <div className="relative animate-scale-in">
            <div className="absolute inset-0 rounded-3xl blur-3xl" style={{ background: `linear-gradient(to right, ${brand.iconBg}, ${brand.blue}20)` }} />
            <Image
              src="/hero/zoe.png"
              alt="Veterinary professional"
              width={720}
              height={480}
              className="relative rounded-3xl shadow-2xl w-full object-cover"
            />
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {[
            { num: "180k+", label: "Consultations Delivered" },
            { num: "50+", label: "Team Members" },
            { num: "15+", label: "Countries Served" },
            { num: "4.9/5", label: "Team Satisfaction" },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border text-center p-6 hover:shadow-lg transition-shadow hover-scale" style={{ borderColor: brand.border, backgroundColor: brand.cardBg }}>
              <h3 className="text-4xl font-bold" style={{ color: brand.green }}>{item.num}</h3>
              <p className="text-base mt-1" style={{ color: brand.subText }}>{item.label}</p>
            </div>
          ))}
        </section>

        {/* Why Join */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-4" style={{ color: brand.textDark }}>Why Join Our Platform?</h2>
          <p className="text-center mb-12 text-lg" style={{ color: brand.subText }}>Freedom, flexibility, and the ability to work on your own terms</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <GlobeIcon />, title: "100% Remote", desc: "Work from anywhere in the world", iconBg: brand.iconBg },
              { icon: <ClockIcon />, title: "Be Your Own Boss", desc: "Set your own schedule and rates", iconBg: brand.mutedBg },
              { icon: <DollarSignIcon />, title: "Earn on Demand", desc: "Get paid for every consultation", iconBg: brand.mutedBg },
              { icon: <TrendingUpIcon />, title: "No Quotas", desc: "Work as much or as little as you want", iconBg: brand.mutedBg },
              { icon: <UsersIcon />, title: "Global Platform", desc: "Access clients worldwide", iconBg: brand.mutedBg },
              { icon: <AwardIcon />, title: "Make Impact", desc: "Help thousands of pets on your terms", iconBg: brand.mutedBg },
            ].map((card) => (
              <div key={card.title} className="group rounded-lg border shadow-sm p-6 hover:shadow-xl transition-all hover-scale cursor-pointer" style={{ borderColor: brand.border, backgroundColor: brand.cardBg }}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ backgroundColor: card.iconBg }}>{card.icon}</div>
                <h3 className="font-semibold tracking-tight text-xl mb-1" style={{ color: brand.textDark }}>{card.title}</h3>
                <p className="text-base" style={{ color: brand.subText }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Join As Contractor */}
        <section id="open-roles" className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-4" style={{ color: brand.textDark }}>Join As A Contractor</h2>
          <p className="text-center mb-12 text-lg" style={{ color: brand.subText }}>Work independently with complete flexibility and control</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-lg border shadow-sm hover:shadow-2xl transition-all cursor-pointer" style={{ borderColor: brand.border, backgroundColor: brand.cardBg }}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: brand.iconBg }}><StethoscopeIcon /></div>
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: brand.mutedBg, color: brand.text, borderColor: "transparent" }}>Multiple Openings</span>
                </div>
                <h3 className="font-semibold tracking-tight text-2xl mb-2" style={{ color: brand.textDark }}>Veterinarian</h3>
                <p className="text-base mb-4" style={{ color: brand.subText }}>Be your own boss. Join our platform and provide remote consultations to pet owners worldwide on your schedule.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {["Set Your Own Hours", "Work When You Want", "100% Remote"].map(tag => (
                    <span key={tag} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold hover-scale" style={{ borderColor: brand.border, color: brand.text }}>{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm mb-4" style={{ color: brand.subText }}>
                  <span className="flex items-center gap-1"><MapPinIcon />100% Remote</span>
                  <span className="flex items-center gap-1"><ClockIcon small={true} />Work Anytime</span>
                </div>
              </div>
              <div className="p-6 pt-0">
                <a href="mailto:support@dialavet.com.au?subject=Application%20for%20Veterinarian" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 w-full text-white" style={{ backgroundColor: brand.green }}>Apply Now <ArrowRightIcon /></a>
              </div>
            </div>
            <div className="rounded-lg border shadow-sm hover:shadow-2xl transition-all cursor-pointer" style={{ borderColor: brand.border, backgroundColor: brand.cardBg }}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(37, 99, 235, 0.1)" }}><HeartIcon /></div>
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: brand.mutedBg, color: brand.text, borderColor: "transparent" }}>Multiple Openings</span>
                </div>
                <h3 className="font-semibold tracking-tight text-2xl mb-2" style={{ color: brand.textDark }}>Veterinary Nurse</h3>
                <p className="text-base mb-4" style={{ color: brand.subText }}>Work independently on our platform and provide compassionate care guidance to pet owners on your terms.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {["Flexible Schedule", "Remote Work", "Choose Your Hours"].map(tag => (
                    <span key={tag} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold hover-scale" style={{ borderColor: brand.border, color: brand.text }}>{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm mb-4" style={{ color: brand.subText }}>
                  <span className="flex items-center gap-1"><MapPinIcon />100% Remote</span>
                  <span className="flex items-center gap-1"><ClockIcon small={true} />Work Anytime</span>
                </div>
              </div>
              <div className="p-6 pt-0">
                <a href="mailto:support@dialavet.com.au?subject=Application%20for%20Veterinary%20Nurse" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 w-full text-white" style={{ backgroundColor: brand.green }}>Apply Now <ArrowRightIcon /></a>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Benefits */}
        <section className="mb-20">
          <div className="rounded-lg border p-6" style={{ borderColor: `rgba(20, 184, 154, 0.2)`, background: `linear-gradient(to bottom right, rgba(20, 184, 154, 0.05), rgba(37, 99, 235, 0.05))` }}>
            <h3 className="font-semibold tracking-tight text-3xl mb-2 text-center" style={{ color: brand.textDark }}>Platform Benefits</h3>
            <p className="text-center text-lg mb-8" style={{ color: brand.subText }}>Everything you need to succeed as an independent contractor</p>
            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3 p-4 rounded-lg hover:shadow-md transition-shadow hover-scale" style={{ backgroundColor: brand.cardBg }}>
                  <CheckCircleIcon />
                  <span className="text-base" style={{ color: brand.text }}>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to Get Started */}
        <section id="how-it-works" className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-4" style={{ color: brand.textDark }}>How to Get Started</h2>
          <p className="text-center mb-12 text-lg" style={{ color: brand.subText }}>Simple onboarding process to join our platform</p>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: <BriefcaseIcon />, title: "Apply Online", desc: "Submit your application and resume" },
              { icon: <GraduationCapIcon />, title: "Initial Review", desc: "We review your qualifications" },
              { icon: <VideoIcon />, title: "Video Interview", desc: "Meet with our hiring team" },
              { icon: <StarIcon />, title: "Welcome Aboard", desc: "Join our amazing team!" },
            ].map((step, i) => (
              <div key={step.title} className="text-center group">
                <div className="relative mb-4 inline-block">
                  <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: brand.iconBg }}>
                    {step.icon}
                  </div>
                </div>
                <p className="text-sm font-bold mb-2" style={{ color: brand.green }}>STEP {i + 1}</p>
                <h3 className="font-semibold text-lg mb-2" style={{ color: brand.textDark }}>{step.title}</h3>
                <p className="text-sm" style={{ color: brand.subText }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <div className="rounded-lg text-white p-12 text-center" style={{ background: `linear-gradient(to right, ${brand.green}, rgba(20, 184, 154, 0.8))` }}>
            <h2 className="text-4xl font-bold mb-4">Ready to Work On Your Terms?</h2>
            <p className="text-xl mb-8 opacity-90">Join our platform of independent veterinary professionals and start earning on your schedule.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="mailto:support@dialavet.com.au?subject=Application%20to%20Join%20Platform" className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium h-11 rounded-md px-8 hover-scale" style={{ backgroundColor: brand.mutedBg, color: brand.textDark }}>Apply to Join Platform</a>
              <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium border h-11 rounded-md px-8 hover:bg-white hover:text-logo-green hover-scale" style={{ borderColor: "white", color: "white", background: "transparent" }}>Learn About the Platform</a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
