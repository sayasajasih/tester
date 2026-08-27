import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import {
  CATEGORIES,
  SUB_CATEGORY_MAP,
  ASAL_USUL,
  conditionsForCategory,
  isGoodCondition,
  type Asset,
  type AssetMetrics,
} from "@/lib/assets";

type AssetRow = {
  id: string;
  no_register: string;
  kode_barang: string;
  no_pabrik: string;
  no_polisi: string;
  name: string;
  category: string;
  sub_category: string;
  asal_usul: string;
  qty: number;
  price: number;
  condition: string;
  location: string;
  tahun: string;
  image: string | null;
  created_at: string | Date;
};

function mapAsset(row: AssetRow): Asset {
  return {
    id: row.id,
    noRegister: row.no_register,
    kodeBarang: row.kode_barang,
    noPabrik: row.no_pabrik ?? "",
    noPolisi: row.no_polisi ?? "",
    name: row.name,
    category: row.category,
    subCategory: row.sub_category,
    asalUsul: row.asal_usul,
    qty: Number(row.qty),
    price: Number(row.price),
    condition: row.condition,
    location: row.location ?? "",
    tahun: String(row.tahun),
    image: row.image,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : String(row.created_at),
  };
}

const MAX_IMAGE_CHARS = 1_400_000;

const assetInputSchema = z.object({
  name: z.string().trim().min(1).max(200),
  noRegister: z.string().trim().min(1).max(50),
  kodeBarang: z.string().trim().min(1).max(50),
  noPabrik: z.string().trim().max(80).default(""),
  noPolisi: z.string().trim().max(30).default(""),
  category: z
    .string()
    .refine((v): v is (typeof CATEGORIES)[number] =>
      (CATEGORIES as readonly string[]).includes(v),
    ),
  subCategory: z.string().trim().min(1).max(80),
  asalUsul: z
    .string()
    .refine((v): v is (typeof ASAL_USUL)[number] =>
      (ASAL_USUL as readonly string[]).includes(v),
    ),
  qty: z.number().int().min(1).max(1_000_000),
  price: z.number().int().min(0).max(99_999_999_999),
  condition: z.string().trim().min(1).max(40),
  location: z.string().trim().max(120).default(""),
  tahun: z.string().regex(/^\d{4}$/),
  image: z.string().max(MAX_IMAGE_CHARS).nullable().optional(),
});

function assertClassification(input: z.infer<typeof assetInputSchema>) {
  const subs = SUB_CATEGORY_MAP[input.category as (typeof CATEGORIES)[number]];
  if (!subs.includes(input.subCategory)) {
    throw new Error("Sub kategori tidak sesuai kategori utama");
  }
  const conditions = conditionsForCategory(input.category);
  if (!conditions.includes(input.condition)) {
    throw new Error("Kondisi tidak sesuai kategori");
  }
  if (input.image && !input.image.startsWith("data:image/")) {
    throw new Error("Format foto tidak valid");
  }
}

async function nextAssetId(): Promise<string> {
  const sql = await getSql();
  const year = new Date().getFullYear();
  const prefix = `AST-${year}-`;
  const rows = await sql<{ id: string }>`
    select id from assets where id like ${prefix + "%"}
  `;
  let maxNum = 0;
  for (const row of rows) {
    const numPart = parseInt(row.id.slice(prefix.length), 10);
    if (!Number.isNaN(numPart) && numPart > maxNum) maxNum = numPart;
  }
  return `${prefix}${String(maxNum + 1).padStart(3, "0")}`;
}

export const listAssets = createServerFn({ method: "GET" }).handler(
  async (): Promise<Asset[]> => {
    const sql = await getSql();
    const rows = await sql<AssetRow>`
      select
        id, no_register, kode_barang, no_pabrik, no_polisi, name,
        category, sub_category, asal_usul, qty, price, condition,
        location, tahun, image, created_at
      from assets
      order by created_at desc, id desc
    `;
    return rows.map(mapAsset);
  },
);

export const getAssetMetrics = createServerFn({ method: "GET" }).handler(
  async (): Promise<AssetMetrics> => {
    const sql = await getSql();
    const rows = await sql<{
      total_qty: number;
      good_qty: number;
      repair_qty: number;
    }>`
      select
        coalesce(sum(qty), 0)::int as total_qty,
        coalesce(sum(case when condition in ('Baik', 'Aktif') then qty else 0 end), 0)::int as good_qty,
        coalesce(sum(case when condition not in ('Baik', 'Aktif') then qty else 0 end), 0)::int as repair_qty
      from assets
    `;
    const row = rows[0];
    return {
      totalQty: Number(row?.total_qty ?? 0),
      goodQty: Number(row?.good_qty ?? 0),
      repairQty: Number(row?.repair_qty ?? 0),
    };
  },
);

export const createAsset = createServerFn({ method: "POST" })
  .validator(assetInputSchema)
  .handler(async ({ data }): Promise<Asset> => {
    assertClassification(data);
    const sql = await getSql();
    const id = await nextAssetId();
    const rows = await sql<AssetRow>`
      insert into assets (
        id, no_register, kode_barang, no_pabrik, no_polisi, name,
        category, sub_category, asal_usul, qty, price, condition,
        location, tahun, image
      ) values (
        ${id}, ${data.noRegister}, ${data.kodeBarang}, ${data.noPabrik},
        ${data.noPolisi}, ${data.name}, ${data.category}, ${data.subCategory},
        ${data.asalUsul}, ${data.qty}, ${data.price}, ${data.condition},
        ${data.location}, ${data.tahun}, ${data.image ?? null}
      )
      returning
        id, no_register, kode_barang, no_pabrik, no_polisi, name,
        category, sub_category, asal_usul, qty, price, condition,
        location, tahun, image, created_at
    `;
    const row = rows[0];
    if (!row) throw new Error("Gagal menyimpan aset");
    return mapAsset(row);
  });

const updateSchema = assetInputSchema.extend({
  id: z.string().min(1).max(40),
});

export const updateAsset = createServerFn({ method: "POST" })
  .validator(updateSchema)
  .handler(async ({ data }): Promise<Asset> => {
    assertClassification(data);
    const sql = await getSql();
    const rows = await sql<AssetRow>`
      update assets set
        no_register = ${data.noRegister},
        kode_barang = ${data.kodeBarang},
        no_pabrik = ${data.noPabrik},
        no_polisi = ${data.noPolisi},
        name = ${data.name},
        category = ${data.category},
        sub_category = ${data.subCategory},
        asal_usul = ${data.asalUsul},
        qty = ${data.qty},
        price = ${data.price},
        condition = ${data.condition},
        location = ${data.location},
        tahun = ${data.tahun},
        image = ${data.image ?? null}
      where id = ${data.id}
      returning
        id, no_register, kode_barang, no_pabrik, no_polisi, name,
        category, sub_category, asal_usul, qty, price, condition,
        location, tahun, image, created_at
    `;
    const row = rows[0];
    if (!row) throw new Error("Aset tidak ditemukan");
    return mapAsset(row);
  });

export const deleteAsset = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().min(1).max(40) }))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const sql = await getSql();
    const rows = await sql<{ id: string }>`
      delete from assets where id = ${data.id} returning id
    `;
    if (!rows[0]) throw new Error("Aset tidak ditemukan");
    return { ok: true };
  });

export function computeMetrics(assets: Asset[]): AssetMetrics {
  const totalQty = assets.reduce((sum, a) => sum + a.qty, 0);
  const goodQty = assets
    .filter((a) => isGoodCondition(a.condition))
    .reduce((sum, a) => sum + a.qty, 0);
  return {
    totalQty,
    goodQty,
    repairQty: totalQty - goodQty,
  };
}
