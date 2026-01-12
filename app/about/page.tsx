import React from "react";
import {
  Heart,
  Globe2,
  Users,
  Video,
  FileText,
  ShieldCheck,
  Award,
  Newspaper,
  Dna,
} from "lucide-react";

export const metadata = {
  title: "About Dial A Vet – Our Story, Mission, Partners",
  description:
    "Making quality veterinary care accessible to pet parents around the world, one video call at a time.",
} as const;

// Use site brand tokens from globals.css (CSS variables)
const palette = {
  primary: "var(--brand)",
  primaryAlt: "var(--brand-2)",
  textDark: "var(--ink)",
  text: "#374151",
  subText: "#6B7280",
  border: "var(--line)",
  card: "#ffffff",
  bg: "hsl(var(--background))",
  iconBg: "#edf9f6",
};

const Pill = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div
    className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm text-[#4b5563]"
    style={{ borderColor: "rgba(0,0,0,.12)" }}
  >
    <span className="h-4 w-4" style={{ color: palette.primary }}>
      {icon}
    </span>
    <span>{text}</span>
  </div>
);

const IconBadge = ({ icon }: { icon: React.ReactNode }) => (
  <div
    className="inline-flex h-10 w-10 items-center justify-center rounded-full shrink-0"
    style={{ backgroundColor: palette.iconBg }}
  >
    <div className="h-5 w-5" style={{ color: palette.primary }}>
      {icon}
    </div>
  </div>
);

const MetricCard = ({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
}) => (
  <div
    className="rounded-xl border"
    style={{ borderColor: palette.border, backgroundColor: palette.card }}
  >
    <div className="px-8 py-8 text-center">
      <IconBadge icon={icon} />
      <div className="mt-2 text-2xl font-semibold" style={{ color: palette.primary }}>
        {value}
      </div>
      <div className="mt-1 text-sm" style={{ color: palette.subText }}>
        {label}
      </div>
    </div>
  </div>
);

const InfoCard = ({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
}) => (
  <div
    className="rounded-xl border p-6 text-left"
    style={{ borderColor: palette.border, backgroundColor: palette.card }}
  >
    <div className="flex items-start gap-4">
      <IconBadge icon={icon} />
      <div>
        <h3 className="text-[17px] font-medium" style={{ color: palette.textDark }}>
          {title}
        </h3>
        <p className="mt-2 text-sm leading-6" style={{ color: palette.subText }}>
          {desc}
        </p>
      </div>
    </div>
  </div>
);

export default function AboutPage() {
  return (
    <div
      className="min-h-screen w-full text-center"
      style={{ backgroundColor: palette.bg }}
    >
      {/* Header */}
      <section className="mx-auto max-w-[1100px] px-8 pt-20 pb-12">
        <h1
          className="text-4xl font-semibold tracking-[-0.01em]"
          style={{ color: palette.textDark }}
        >
          About Dial A Vet
        </h1>
        <p
          className="mx-auto mt-3 max-w-[900px] text-[17px] leading-7"
          style={{ color: palette.text }}
        >
          Making quality veterinary care accessible to pet parents around the
          world, one video call at a time.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Pill icon={<Heart className="h-4 w-4" />} text="Founded with love in 2022" />
          <Pill
            icon={<Globe2 className="h-4 w-4" />}
            text="Serving pet parents globally"
          />
        </div>
      </section>

      {/* Our Story */}
      <section className="mx-auto mt-2 max-w-[1100px] px-8">
        <h2 className="text-2xl font-medium" style={{ color: palette.textDark }}>
          Our Story
        </h2>
        <div
          className="mt-6 rounded-xl border p-8 text-left leading-7"
          style={{
            borderColor: palette.border,
            backgroundColor: palette.card,
            color: palette.text,
          }}
        >
          <div className="mx-auto max-w-[900px]">
            <p>
              In August 2022, <strong>Joshua Fidrmuc</strong> founded Dial A Vet
              with a simple yet powerful vision: to make veterinary care more
              accessible, affordable, and convenient for pet parents everywhere.
            </p>
            <p className="mt-4">
              As a pet parent himself, Joshua understood the worry and stress
              that comes when your furry family member isn’t feeling well. Too
              often, pet owners face long wait times, expensive emergency vet
              visits, or simply don’t know whether their pet’s concern warrants
              a trip to the clinic.
            </p>
            <p className="mt-4">
              Dial A Vet was born from the belief that every pet parent deserves
              peace of mind and access to professional veterinary
              guidance—whenever they need it, wherever they are.
            </p>
          </div>
        </div>
      </section>

      {/* Our Impact */}
      <section className="mx-auto mt-16 max-w-[1100px] px-8">
        <h2 className="text-2xl font-medium" style={{ color: palette.textDark }}>
          Our Impact
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
          <MetricCard value="90+" label="Veterinarians & Vet Nurses" icon={<Users />} />
          <MetricCard value="180k+" label="Consultations Completed" icon={<Video />} />
          <MetricCard value="550k+" label="Pet Health Articles" icon={<FileText />} />
          <MetricCard value="6.5m+" label="Visitors Annually" icon={<Globe2 />} />
        </div>
      </section>

      {/* Our Mission */}
      <section className="mx-auto mt-16 max-w-[1100px] px-8">
        <h2 className="text-2xl font-medium" style={{ color: palette.textDark }}>
          Our Mission
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <InfoCard
            title="Compassionate Care"
            desc="We treat every pet with the same love and care we’d give our own furry family members."
            icon={<Heart />}
          />
          <InfoCard
            title="Expert Guidance"
            desc="Our team of licensed vets and vet nurses bring decades of combined experience to every consultation."
            icon={<Users />}
          />
          <InfoCard
            title="Global Access"
            desc="Breaking down barriers to quality vet care, no matter where in the world you are."
            icon={<Globe2 />}
          />
        </div>
      </section>

      {/* Partnerships & Recognition */}
      <section className="mx-auto mt-16 max-w-[1100px] px-8">
        <h2 className="text-2xl font-medium" style={{ color: palette.textDark }}>
          Partnerships & Recognition
        </h2>
        <div className="mt-8 space-y-4">
          <InfoCard
            title="Over 12+ Insurance Partners Across the Globe"
            desc="Partnering with leading pet insurance providers worldwide to make veterinary care more accessible and affordable for pet parents everywhere."
            icon={<ShieldCheck />}
          />
          <InfoCard
            title="RSPCA Million Paws Walk Partner"
            desc="Proud partners with the RSPCA’s Million Paws Walk, supporting animal welfare and rescue efforts across Australia. Together, we’re making a difference in the lives of pets in need."
            icon={<Award />}
          />
          <InfoCard
            title="Featured on 7News Sunrise"
            desc="Our innovative approach to veterinary care has been recognized nationally, with features on 7News Sunrise showcasing how we're revolutionizing pet healthcare."
            icon={<Video />}
          />
          <InfoCard
            title="Featured on Money Magazine"
            desc="Recognized as a top way to help save money on vet bills, featured in Money Magazine for our affordable and accessible approach to veterinary care."
            icon={<Newspaper />}
          />
          <InfoCard
            title="Trusted by Ancestry DNA"
            desc="Selected as the global veterinary provider for Ancestry DNA pet owners, helping families understand and care for their pets' unique health needs."
            icon={<Dna />}
          />
        </div>
      </section>

      {/* Meet Our Global Vet Team */}
      <section
        className="mx-auto mt-20 max-w-[1000px] px-8 text-center"
        id="team"
      >
        <h2 className="text-2xl font-medium" style={{ color: palette.textDark }}>
          Meet Our Global Vet Team
        </h2>
        <p
          className="mx-auto mt-4 max-w-[880px] text-[15px] leading-7"
          style={{ color: palette.subText }}
        >
          Our team of over 90 licensed veterinarians and veterinary nurses brings
          together diverse expertise from around the world. Each member is
          carefully selected for their clinical excellence, compassionate
          approach, and dedication to helping pets live healthier, happier
          lives.
        </p>
        <p
          className="mx-auto mt-4 max-w-[860px] text-[15px] leading-7"
          style={{ color: palette.subText }}
        >
          From emergency triage to ongoing health guidance, our vets are here to
          support you with professional advice, clear next steps, and genuine
          care for your pet’s wellbeing.
        </p>
        {/* Meet Our Vets button hidden per request */}
      </section>

      {/* Join Our Growing Family */}
      <section className="mx-auto mt-16 max-w-[1000px] px-8 pb-24 text-center">
        <h2 className="text-2xl font-medium" style={{ color: palette.textDark }}>
          Join Our Growing Family
        </h2>
        <p
          className="mx-auto mt-4 max-w-[860px] text-[15px] leading-7"
          style={{ color: palette.subText }}
        >
          Whether you’re worried about your pet’s sudden symptoms or just want
          expert advice on their health, our team is here for you—24/7, across
          the globe.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <a
            href="/book-a-vet-consultation"
            className="inline-block rounded-full px-6 py-2 font-medium text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: palette.primary }}
          >
            Book a Consultation
          </a>
          <a
            href="/how-to-book-an-online-vet-consultation"
            className="inline-block rounded-full border px-6 py-2 font-medium transition-colors hover:bg-black/5"
            style={{ borderColor: palette.border, color: palette.textDark }}
          >
            Learn How It Works
          </a>
        </div>
      </section>
    </div>
  );
}
