import { MessageCircle } from "lucide-react";

/** Floating WhatsApp contact button — always visible bottom-right. */
export function WhatsappButton() {
  return (
    <a
      href="https://wa.me/212634585463?text=Bonjour%20Filtre%20Maroc,%20j'ai%20une%20question"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter sur WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] p-4 text-white shadow-[0_12px_30px_-6px_rgba(37,211,102,0.6)] transition-all hover:-translate-y-0.5 hover:pr-5"
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366] opacity-40" />
      <MessageCircle className="h-6 w-6" />
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all group-hover:max-w-[140px] sm:inline">
        Besoin d&apos;aide ?
      </span>
    </a>
  );
}
