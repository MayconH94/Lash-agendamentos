// Monta o link do WhatsApp (Brasil). O número é guardado só com DDD + número.
export function whatsappLink(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  const full = digits.startsWith("55") && digits.length >= 12 ? digits : `55${digits}`;
  return `https://wa.me/${full}?text=${encodeURIComponent(message)}`;
}