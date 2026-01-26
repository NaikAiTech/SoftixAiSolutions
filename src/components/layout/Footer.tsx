import Link from "next/link";
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

const DISPLAY_NUMBER = "0303-2963333";
const TEL_NUMBER = "03032963333";
const WHATSAPP_INTL = "923032963333";

const footerLinks = {
  services: [
    { label: "AI Solutions", href: "/services#ai" },
    { label: "Custom Software", href: "/services#software" },
    { label: "Enterprise Platforms", href: "/services#enterprise" },
    { label: "Cloud Infrastructure", href: "/services#cloud" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  resources: [
    { label: "Portfolio", href: "/portfolio" },
    { label: "Pricing", href: "/pricing" },
    { label: "FAQ", href: "/faq" },
    { label: "Support", href: "/contact" },
  ],
};

const socialLinks = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
];

export const Footer = () => {
  return (
    <footer className="bg-background py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* GLASS CARD FOOTER (same as form) */}
        <div className="card-glass p-10 md:p-12 rounded-2xl shadow-2xl border border-border backdrop-blur-xl">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
            {/* Brand / Contact */}
            <div className="lg:col-span-2">
              

              <Link href="/" className="flex items-center gap-2 mb-6">
                <div className="w-20 h-20  rounded-lg flex items-center justify-center text-primary-foreground">
               <img src="./images/logo.png" />
              </div>
              </Link>
<h4 className="font-display font-bold text-foreground mb-4">
                Softix AI Solutions
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm">
                We engineer intelligent digital ecosystems that blend cutting-edge
                design with scalable, enterprise-ready technology—built for
                performance, security, and growth.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
  <Mail size={16} className="text-primary" />
  <a
    href="mailto:Info@sais.pk?subject=Contact%20Request"
    className="hover:text-primary transition-colors"
  >
   admin@sais.pk
  </a>
</div>


                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MessageCircle size={16} className="text-primary" />
                  <a
                    href={`https://wa.me/${WHATSAPP_INTL}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    WhatsApp: {DISPLAY_NUMBER}
                  </a>
                </div>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Phone size={16} className="text-primary" />
                  <a
                    href={`tel:${TEL_NUMBER}`}
                    className="hover:text-primary transition-colors"
                  >
                    Phone: {DISPLAY_NUMBER}
                  </a>
                </div>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin size={16} className="text-primary" />
                  <span>Pakistan</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-display font-bold text-foreground mb-4">
                Services
              </h4>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-display font-bold text-foreground mb-4">
                Company
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-display font-bold text-foreground mb-4">
                Resources
              </h4>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Location */}
            <div>
              <h4 className="font-display font-bold text-foreground mb-4">
                Location
              </h4>
              <div className="rounded-xl overflow-hidden border border-border bg-background">
                <iframe
                  src="https://www.google.com/maps?q=Softix%20AI%20Solutions&output=embed"
                  width="100%"
                  height="180"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Softix AI Solutions Location"
                />
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-muted-foreground text-xs font-mono">
              © {new Date().getFullYear()} Softix AI Solutions. All rights reserved.
            </div>

            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};
