export function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, "");

  if (cleaned.length < 10) {
    throw new Error("Número de telefone deve ter pelo menos 10 dígitos.");
  }

  const countryCode = cleaned.substring(0, cleaned.length - 10);
  const areaCode = cleaned.substring(cleaned.length - 10, cleaned.length - 8);
  const firstPart = cleaned.substring(cleaned.length - 8, cleaned.length - 4);
  const secondPart = cleaned.substring(cleaned.length - 4);

  return `+${countryCode} (${areaCode}) ${firstPart}-${secondPart}`;
}
