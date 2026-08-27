export const CATEGORIES = [
  "Tanah dan Bangunan",
  "Peralatan dan Mesin",
  "Aset Tak Berwujud",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const SUB_CATEGORY_MAP: Record<Category, string[]> = {
  "Tanah dan Bangunan": ["Tanah", "Bangunan"],
  "Peralatan dan Mesin": [
    "Kendaraan",
    "Peralatan Komputer TI",
    "Alat Kantor dan Rumah Tangga",
    "Alat Komunikasi dan Studio",
  ],
  "Aset Tak Berwujud": [
    "Kajian",
    "Lisensi Perangkat Lunak",
    "Aplikasi",
    "Hak Cipta",
  ],
};

export const ASAL_USUL = [
  "Pembelian",
  "Hibah",
  "Sewa",
  "Pinjam",
  "Guna Usaha",
  "Lainnya",
] as const;

export function conditionsForCategory(category: string): string[] {
  if (category === "Aset Tak Berwujud") {
    return ["Aktif", "Kadaluwarsa (Expired)"];
  }
  if (category) {
    return ["Baik", "Rusak Ringan", "Rusak Berat"];
  }
  return [];
}

export function isGoodCondition(condition: string): boolean {
  return condition === "Baik" || condition === "Aktif";
}

export type Asset = {
  id: string;
  noRegister: string;
  kodeBarang: string;
  noPabrik: string;
  noPolisi: string;
  name: string;
  category: string;
  subCategory: string;
  asalUsul: string;
  qty: number;
  price: number;
  condition: string;
  location: string;
  tahun: string;
  image: string | null;
  createdAt: string;
};

export type AssetInput = {
  name: string;
  noRegister: string;
  kodeBarang: string;
  noPabrik: string;
  noPolisi: string;
  category: string;
  subCategory: string;
  asalUsul: string;
  qty: number;
  price: number;
  condition: string;
  location: string;
  tahun: string;
  image: string | null;
};

export type AssetMetrics = {
  totalQty: number;
  goodQty: number;
  repairQty: number;
};

export function formatRupiah(angka: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka || 0);
}

export function formatLongDate(date = new Date()): string {
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(date = new Date()): string {
  return date.toLocaleString("id-ID", {
    dateStyle: "full",
    timeStyle: "short",
  });
}
