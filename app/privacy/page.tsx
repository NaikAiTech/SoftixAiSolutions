export const metadata = {
  title: "Privacy Policy | Dial A Vet",
  description: "Read how Dial A Vet collects, uses, and protects your data.",
};

// Terms-like card component
const BRAND_PRIMARY = "#00A982";
const RED_BORDER = "#F5B5B5";
const BRAND_MINT = "#E6F6F2";
const TEXT_DARK = "#111827";
const TEXT_MUTED = "#4B5563";
const BORDER = "#E5E7EB";
const PAGE_BG = "#F9FAFB";
const SURFACE = "#FFFFFF";

function Card({ children, tone = "default", title }: { children: React.ReactNode; tone?: "default" | "mint" | "ghost"; title?: string }) {
  const styles: Record<string, React.CSSProperties> = {
    default: { backgroundColor: SURFACE, border: `1px solid ${BORDER}` },
    mint: { backgroundColor: BRAND_MINT, border: `1px solid ${BRAND_PRIMARY}` },
    ghost: { backgroundColor: 'transparent', border: `1px solid ${BORDER}` },
  };
  return (
    <section className="rounded-xl" style={styles[tone]}> 
      {title && (
        <div className="flex items-center gap-2 border-b px-4 py-3" style={{ borderColor: BORDER }}>
          <h3 className="text-sm font-semibold" style={{ color: TEXT_DARK }}>{title}</h3>
        </div>
      )}
      <div className="px-5 py-4 text-sm leading-6" style={{ color: TEXT_MUTED }}>{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: PAGE_BG, color: TEXT_DARK }}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Privacy Policy</h1>
          <p className="mt-2 text-sm" style={{ color: TEXT_MUTED }}>Effective Date: 17 June 2025</p>
        </header>

        <Card tone="mint" title="Your Privacy Matters">
          <p>Dial A Vet Pty Ltd (“Dial A Vet”, “we”, “us”) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and disclose personal information when you use our website, web application, and services.</p>
        </Card>

        <h2 className="mt-8 mb-3 text-xl font-semibold">Collection of Personal Information</h2>
        <Card>
          <p>We may collect the following types of personal information:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Name, contact details (email, phone number), and address</li>
            <li>Payment details (processed securely via Stripe)</li>
            <li>Pet information relevant to the consultation</li>
            <li>Information you provide in consultations or through forms</li>
          </ul>
          <p className="mt-2">We collect this information when you register or book, contact us, or participate in surveys and reviews.</p>
        </Card>

        <h2 className="mt-8 mb-3 text-xl font-semibold">Use of Personal Information</h2>
        <Card>
          <ul className="list-disc pl-5 space-y-1">
            <li>Provide veterinary telehealth services</li>
            <li>Communicate with you regarding your appointments or account</li>
            <li>Process payments securely</li>
            <li>Improve our services and user experience</li>
            <li>Comply with legal obligations</li>
          </ul>
        </Card>

        <h2 className="mt-8 mb-3 text-xl font-semibold">Sharing of Personal Information</h2>
        <Card tone="ghost">
          <p>We only share your personal information:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>With licensed veterinarians and veterinary nurses who provide consultations</li>
            <li>With trusted third parties where necessary to operate our services (payments, hosting, compliance, insurance partners)</li>
            <li>If required by law, subpoena, regulatory obligation, or with your express consent</li>
          </ul>
        </Card>

        <h2 className="mt-8 mb-3 text-xl font-semibold">Storage and Security</h2>
        <Card>
          <p>We store your data securely using reputable third‑party hosting platforms. We implement appropriate technical and organisational measures to protect your personal information from misuse, interference, loss, unauthorised access, modification, or disclosure.</p>
        </Card>

        <h2 className="mt-8 mb-3 text-xl font-semibold">Cookies and Analytics</h2>
        <Card>
          <p>We may use cookies and third‑party analytics tools (e.g. Google Analytics) to monitor website traffic, improve functionality, and deliver personalised experiences. You can modify your browser settings to manage cookie preferences.</p>
        </Card>

        <h2 className="mt-8 mb-3 text-xl font-semibold">Access and Correction</h2>
        <Card>
          <p>You have the right to access your personal information and request corrections to ensure accuracy. Contact us at <a className="underline" href="mailto:support@dialavet.com.au">support@dialavet.com.au</a>.</p>
        </Card>

        <h2 className="mt-8 mb-3 text-xl font-semibold">Data Retention</h2>
        <Card>
          <p>We retain personal information as long as necessary for the purposes outlined in this policy or as required by law. Data may be anonymised and retained for analytical purposes.</p>
        </Card>

        <h2 className="mt-8 mb-3 text-xl font-semibold">Third‑Party Links</h2>
        <Card>
          <p>Our website may contain links to third‑party websites. We are not responsible for the privacy practices of these external sites.</p>
        </Card>

        <h2 className="mt-8 mb-3 text-xl font-semibold">Children’s Privacy</h2>
        <Card>
          <p>Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal data from children.</p>
        </Card>

        <h2 className="mt-8 mb-3 text-xl font-semibold">Changes to This Policy</h2>
        <Card>
          <p>We may update this Privacy Policy from time to time. Changes will be posted on our website and effective upon publication.</p>
        </Card>

        <h2 className="mt-8 mb-3 text-xl font-semibold">Contact Us</h2>
        <Card tone="mint">
          <div>
            <div style={{ color: TEXT_MUTED, fontSize: 12 }}>Contact</div>
            <div style={{ fontWeight: 600, color: TEXT_DARK }}>Dial A Vet Pty Ltd</div>
            <div>Email: <a className="underline" href="mailto:support@dialavet.com.au">support@dialavet.com.au</a></div>
            <div>ABN: 657 754 375</div>
            <div>Location: New South Wales, Australia</div>
          </div>
        </Card>
      </div>
    </div>
  );
}