/**
 * Prisma'dan gelen verilerin içindeki Decimal ve Date gibi 
 * Next.js Server Components tarafından Client Components'a aktarılamayan
 * nesneleri standart JavaScript tiplerine dönüştürür.
 */
export function serializePrisma<T>(obj: T): any {
  if (obj === null || obj === undefined) return obj;

  // Temel veri tipleriyse direkt döndür
  if (typeof obj !== "object") return obj;

  // Date nesnelerini ISO string formatına çevir
  if (obj instanceof Date) return obj.toISOString();

  // Prisma Decimal nesnesini number'a çevir (toNumber metodu varsa)
  if (typeof (obj as any).toNumber === "function") {
    return (obj as any).toNumber();
  }

  // Dizi ise içindeki elemanları da dön
  if (Array.isArray(obj)) {
    return obj.map((item) => serializePrisma(item));
  }

  // Normal obje ise içindeki property'leri (key/value) dön
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, serializePrisma(value)])
  );
}