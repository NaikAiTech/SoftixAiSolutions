import { MessageCircle, PhoneCall } from "lucide-react";

const DISPLAY_NUMBER = "0303-2963333";
const TEL_NUMBER = "03032963333";
const WHATSAPP_INTL = "923032963333";

export function FloatingContactButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <a
        href={`https://wa.me/${WHATSAPP_INTL}`}
        target="_blank"
        rel="noopener noreferrer"
        className="h-12 w-12 rounded-full bg-[#25D366] text-white shadow-lg hover:brightness-110 transition"
        aria-label={`WhatsApp ${DISPLAY_NUMBER}`}
        title={`WhatsApp ${DISPLAY_NUMBER}`}
      >
        <span className="flex h-full w-full items-center justify-center">
          <MessageCircle size={22} />
        </span>
      </a>

      <a
        href={`tel:${TEL_NUMBER}`}
        className="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:brightness-110 transition"
        aria-label={`Call ${DISPLAY_NUMBER}`}
        title={`Call ${DISPLAY_NUMBER}`}
      >
        <span className="flex h-full w-full items-center justify-center">
          <PhoneCall size={22} />
        </span>
      </a>
    </div>
  );
}

