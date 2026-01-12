import React from "react";
import { Info, AlertTriangle, HelpCircle } from "lucide-react";

const BRAND_PRIMARY = "#00A982"; // green
const BRAND_RED = "#F3C9C9"; // soft red tint background
const RED_BORDER = "#F5B5B5";
const BRAND_MINT = "#E6F6F2"; // green tint background
const TEXT_DARK = "#111827"; // heading/body
const TEXT_MUTED = "#4B5563"; // muted body
const BORDER = "#E5E7EB"; // gray border
const PAGE_BG = "#F9FAFB"; // page background
const SURFACE = "#FFFFFF"; // cards

function Card({ children, tone = "default", title, icon }: { children: React.ReactNode; tone?: "default" | "mint" | "red" | "ghost"; title?: string; icon?: React.ReactNode; }) {
  const styles: Record<string, React.CSSProperties> = {
    default: { backgroundColor: SURFACE, border: `1px solid ${BORDER}` },
    mint: { backgroundColor: BRAND_MINT, border: `1px solid ${BRAND_PRIMARY}` },
    red: { backgroundColor: '#f5ecec', border: `1px solid ${RED_BORDER}` },
    ghost: { backgroundColor: 'transparent', border: `1px solid ${BORDER}` },
  };
  const contentClass = [
    "px-5 py-4 text-sm leading-6",
    tone === "ghost" ? "text-muted-foreground mb-4" : "",
  ].join(" ");
  const contentStyle: React.CSSProperties | undefined = tone === "ghost" ? undefined : { color: TEXT_MUTED };
  return (
    <section className="rounded-xl" style={styles[tone]}> 
      {title && (
        <div className="flex items-center gap-2 border-b px-4 py-3" style={{ borderColor: BORDER }}>
          {icon}
          <h3 className="text-sm font-semibold" style={{ color: TEXT_DARK }}>{title}</h3>
        </div>
      )}
      <div className={contentClass} style={contentStyle}>{children}</div>
    </section>
  );
}

export const metadata = {
  title: "Terms & Conditions | Dial A Vet",
  description: "Read the latest Terms and Conditions for using Dial A Vet's services.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: PAGE_BG, color: TEXT_DARK }}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Terms of Service</h1>
          <p className="mt-2 text-sm" style={{ color: TEXT_MUTED }}>Last updated: January 2025</p>
        </header>

        {/* Welcome notice */}
        <Card tone="mint" title="Welcome to Dial A Vet" icon={<Info className="h-4 w-4" style={{ color: BRAND_PRIMARY }} />}> 
          <p>
            These Terms of Service govern your use of Dial A Vet veterinary consultation services. By using our platform,
            you agree to these terms. Please read them carefully.
          </p>
        </Card>

        {/* About Our Service */}
        <h2 className="mt-8 mb-3 text-xl font-semibold">About Our Service</h2>
        <Card>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Service Provider:</strong> Dial A Vet PTY LTD</li>
            <li><strong>Address:</strong> Surry Hills, NSW 2010, Australia</li>
            <li><strong>Contact:</strong> support@dialavet.com.au</li>
          </ul>
          <p className="mt-3">
            Dial A Vet provides online veterinary consultation services connecting pet owners with licensed veterinarians via
            video calls and messaging.
          </p>
        </Card>

        {/* Important Medical Disclaimer */}
        <h2 className="mt-8 mb-3 text-xl font-semibold">Important Medical Disclaimer</h2>
        <Card tone="red" title="Please read this section carefully — limitations of our service" icon={<AlertTriangle className="h-4 w-4" color="#B91C1C" />}> 
          <h4 className="font-semibold" style={{ color: TEXT_DARK }}>General Advice Only</h4>
          <p className="mb-3">Our veterinary consultations provide general educational advice and guidance only. We do not provide diagnoses, treatment plans, or prescriptions through our online platform.</p>

          <h4 className="font-semibold" style={{ color: TEXT_DARK }}>No Prescriptions</h4>
          <p className="mb-3">We cannot and will not prescribe medications through our online consultation service. If you require medication, you must visit a licensed veterinarian in person.</p>

          <h4 className="font-semibold" style={{ color: TEXT_DARK }}>Not a Substitute for In‑Person Care</h4>
          <p className="mb-3">Our service is intended to provide guidance and peace of mind. It does not replace professional in‑person veterinary care or physical examinations when necessary for proper diagnosis and treatment.</p>

          <h4 className="font-semibold" style={{ color: TEXT_DARK }}>Emergencies</h4>
          <p className="mb-3">Do not use Dial A Vet for veterinary emergencies. If your pet is experiencing a medical emergency, contact your local emergency veterinary clinic immediately or call your regional emergency number.</p>

          <h4 className="font-semibold" style={{ color: TEXT_DARK }}>No Veterinarian‑Client Patient Relationship (VCPR)</h4>
          <p className="mb-1">Our consultation is not a formal Veterinarian‑Client‑Patient Relationship (VCPR). A VCPR can only be established through an in‑person examination by a veterinarian.</p>
        </Card>

        {/* What We Provide */}
        <h2 className="mt-8 mb-3 text-xl font-semibold">What We Provide</h2>
        <Card>
          <ul className="list-disc pl-5 space-y-1">
            <li>General pet health guidance and answers to questions</li>
            <li>Advice on whether your pet may need an in‑person veterinary visit</li>
            <li>Second opinions on existing veterinary advice</li>
            <li>Pet behaviour and wellness suggestions</li>
            <li>Nutritional guidance</li>
            <li>Preventive care recommendations</li>
            <li>General advice on managing chronic conditions (not treatment)</li>
          </ul>
        </Card>

        {/* Service Limitations */}
        <h2 className="mt-8 mb-3 text-xl font-semibold">Service Limitations</h2>
        <Card tone="ghost">
          <ul className="list-disc pl-5 space-y-1">
            <li>Medical diagnoses</li>
            <li>Prescription medications</li>
            <li>Treatment plans</li>
            <li>Surgical recommendations</li>
            <li>Emergency veterinary care</li>
            <li>Physical examinations</li>
            <li>Laboratory test interpretation (without in‑person context)</li>
            <li>Euthanasia decisions or services</li>
          </ul>
        </Card>

        {/* Your Responsibilities */}
        <h2 className="mt-8 mb-3 text-xl font-semibold">Your Responsibilities</h2>
        <Card>
          <ul className="list-disc pl-5 space-y-1">
            <li>Provide accurate and complete information about your pet’s condition</li>
            <li>Follow up with an in‑person veterinarian when advised</li>
            <li>Seek emergency care when your pet shows signs of a medical emergency</li>
            <li>Understand that our advice is general guidance, not medical treatment</li>
            <li>Not rely solely on our consultations for serious health concerns</li>
            <li>Use the service responsibly and honestly</li>
            <li>Maintain your account security and credentials</li>
          </ul>
        </Card>

        {/* Limitation of Liability */}
        <h2 className="mt-8 mb-3 text-xl font-semibold">Limitation of Liability</h2>
        <Card tone="ghost">
          <p className="uppercase text-xs tracking-wide mb-2" style={{ color: TEXT_MUTED }}>
            To the maximum extent permitted by law
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>No Liability for Advice:</strong> Dial A Vet PTY LTD, its directors, employees, veterinarians, and partners shall not be liable for any claims, damages, or losses arising from the use of our consultation services, including but not limited to decisions made based on the information provided in our consultations.</li>
            <li><strong>No Negligence Claims:</strong> Given that we provide general advice only and not medical treatment, you acknowledge that our service is informational in nature. You agree to indemnify and hold harmless Dial A Vet PTY LTD from any claims of negligence related to our consultations.</li>
            <li><strong>Maximum Liability:</strong> Our maximum liability for any claim arising from our services is limited to the amount you paid for the consultation in question.</li>
            <li><strong>Third‑Party Actions:</strong> We are not responsible for the actions of or advice of third‑party veterinarians you consult following our guidance, nor for any outcomes resulting from decisions you make based on our consultations.</li>
          </ul>
        </Card>

        {/* Account & Subscription */}
        <h2 className="mt-8 mb-3 text-xl font-semibold">Account & Subscription Terms</h2>
        <Card>
          <ul className="list-disc pl-5 space-y-1">
            <li>You must be 18 years or older to create an account</li>
            <li>You are responsible for maintaining account security</li>
            <li>Subscriptions auto‑renew unless canceled before the renewal date</li>
            <li>Refunds are provided according to our refund policy</li>
            <li>We reserve the right to suspend or terminate accounts for violations of these terms</li>
            <li>You may cancel your subscription at any time through your account settings</li>
          </ul>
        </Card>

        {/* Data Sharing */}
        <h2 className="mt-8 mb-3 text-xl font-semibold">Data Sharing with Partners</h2>
        <Card>
          <p className="mb-2">We may share consultation information with:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Insurance Partners:</strong> With your consent, we may share consultation records with your pet insurance provider to facilitate claims</li>
            <li><strong>Partner Organisations:</strong> Such as Vetzo, Ancestry, and Pawssum, where sharing information is required to provide you with veterinary telehealth services or linked features/services.</li>
            <li><strong>Service Providers:</strong> Third‑party platforms that help us deliver our service (payment processors, video platforms, etc.)</li>
            <li><strong>Legal Requirements:</strong> When required by law to protect rights and safety</li>
          </ul>
          <p className="mt-2">See our Privacy Policy for complete details on data sharing.</p>
        </Card>

        {/* Intellectual Property */}
        <h2 className="mt-8 mb-3 text-xl font-semibold">Intellectual Property</h2>
        <Card>
          <ul className="list-disc pl-5 space-y-1">
            <li>All content on the Dial A Vet platform, including text, graphics, logos, videos, and software, is owned by Dial A Vet PTY LTD and protected by copyright and trademark laws</li>
            <li>You may not copy, reproduce, or distribute our content without permission</li>
            <li>Your consultation records remain your property</li>
            <li>We may use anonymized consultation data for research and improvement</li>
          </ul>
        </Card>

        {/* Prohibited Uses */}
        <h2 className="mt-8 mb-3 text-xl font-semibold">Prohibited Uses</h2>
        <Card tone="ghost">
          <ul className="list-disc pl-5 space-y-1">
            <li>Use the service for illegal purposes</li>
            <li>Share account credentials with others</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Harass, abuse, or harm our veterinarians or staff</li>
            <li>Provide false information about your pet’s condition</li>
            <li>Use the service to obtain prescription medications illegally</li>
            <li>Record consultations without consent</li>
            <li>Resell or redistribute our services</li>
          </ul>
        </Card>

        {/* Disputes & Governing Law */}
        <h2 className="mt-8 mb-3 text-xl font-semibold">Disputes & Governing Law</h2>
        <Card>
          <ul className="list-disc pl-5 space-y-1">
            <li>These terms are governed by the laws of New South Wales, Australia</li>
            <li>Any disputes will be resolved in the courts of New South Wales</li>
            <li>We encourage resolving disputes informally by contacting us first</li>
            <li>You agree to notify us of any concerns within 30 days of the issue arising</li>
          </ul>
        </Card>

        {/* Changes to Terms */}
        <h2 className="mt-8 mb-3 text-xl font-semibold">Changes to These Terms</h2>
        <Card tone="default">
          <p>We may update these Terms of Service from time to time. We’ll notify you of significant changes via email or through our platform. Your continued use after changes indicates acceptance of the updated terms.</p>
        </Card>

        {/* Severability */}
        <h2 className="mt-8 mb-3 text-xl font-semibold">Severability</h2>
        <Card>
          <p>If any provision of these terms is found to be unenforceable, the remaining provisions will continue in full force and effect.</p>
        </Card>

        {/* Questions */}
        <h2 className="mt-8 mb-3 text-xl font-semibold">Questions About These Terms?</h2>
        <Card tone="mint" title="Contact Us" icon={<HelpCircle className="h-4 w-4" style={{ color: BRAND_PRIMARY }} />}> 
          <p>If you have questions about these Terms of Service, please contact us:</p>
          <ul className="mt-2 list-disc pl-5">
            <li>Email: support@dialavet.com.au</li>
            <li>Address: Dial A Vet PTY LTD, Surry Hills, NSW 2010, Australia</li>
          </ul>
          <p className="mt-3">By using Dial A Vet, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>
        </Card>

        {/* Footer */}
        <footer className="mt-12 flex items-center justify-center gap-6 text-sm">
          <a href="/" className="hover:underline">Home</a>
          <a href="/privacy" className="hover:underline">Privacy Policy</a>
          <a href="/about" className="hover:underline">About</a>
        </footer>
      </div>
    </div>
  );
}

