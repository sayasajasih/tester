import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { i as conditionsForCategory, n as CATEGORIES, r as SUB_CATEGORY_MAP, t as ASAL_USUL } from "./assets-DTnNovwI.mjs";
import { i as string, n as number, r as object } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/asset-api-BDTtKOuq.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var _0002_assets_default = "create table if not exists assets (\n  id text primary key,\n  no_register text not null,\n  kode_barang text not null,\n  no_pabrik text not null default '',\n  no_polisi text not null default '',\n  name text not null,\n  category text not null,\n  sub_category text not null,\n  asal_usul text not null,\n  qty integer not null check (qty >= 1),\n  price integer not null check (price >= 0),\n  condition text not null,\n  location text not null default '',\n  tahun text not null,\n  image text,\n  created_at timestamptz not null default now()\n);\n\ncreate index if not exists assets_category_idx on assets (category);\ncreate index if not exists assets_tahun_idx on assets (tahun);\ncreate index if not exists assets_created_at_idx on assets (created_at desc);\n\ninsert into assets (\n  id, no_register, kode_barang, no_pabrik, no_polisi, name,\n  category, sub_category, asal_usul, qty, price, condition, location, tahun\n) values\n  (\n    'AST-2026-001', '0001', '3.1.02.01', 'M3-2024-X', '',\n    'Laptop MacBook Pro M3', 'Peralatan dan Mesin', 'Peralatan Komputer TI',\n    'Pembelian', 2, 25000000, 'Baik', 'Ruang IT / Lantai 2', '2026'\n  ),\n  (\n    'AST-2026-002', '0015', '3.1.04.05', 'HONDA-2991', 'KT 1234 A',\n    'Motor Operasional Honda Vario', 'Peralatan dan Mesin', 'Kendaraan',\n    'Hibah', 1, 22000000, 'Baik', 'Parkiran Kantor', '2024'\n  ),\n  (\n    'AST-2026-003', '0008', '2.1.01.01', '', '',\n    'Gedung Kantor Utama', 'Tanah dan Bangunan', 'Bangunan',\n    'Pembelian', 1, 1850000000, 'Baik', 'Kompleks Perkantoran', '2018'\n  ),\n  (\n    'AST-2026-004', '0022', '3.1.05.02', 'EPSON-L3210', '',\n    'Printer Epson L3210', 'Peralatan dan Mesin', 'Alat Kantor dan Rumah Tangga',\n    'Pembelian', 4, 3200000, 'Rusak Ringan', 'Ruang Administrasi', '2023'\n  ),\n  (\n    'AST-2026-005', '0101', '5.2.01.03', '', '',\n    'Lisensi Microsoft 365 Business', 'Aset Tak Berwujud', 'Lisensi Perangkat Lunak',\n    'Pembelian', 25, 890000, 'Aktif', 'Divisi IT', '2025'\n  ),\n  (\n    'AST-2026-006', '0030', '3.1.06.01', 'UBNT-AP-09', '',\n    'Access Point Kantor Lantai 1', 'Peralatan dan Mesin', 'Alat Komunikasi dan Studio',\n    'Pembelian', 6, 1750000, 'Rusak Berat', 'Gudang IT', '2021'\n  )\non conflict (id) do nothing;\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({ "/migrations/0002_assets.sql": _0002_assets_default });
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
/**
* Finish DB bootstrap before the server handles traffic.
*
* - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
*   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
* - **Neon**: no-op (pool is created lazily on first query).
*
* Vite `configureServer` awaits this at dev startup; production imports of this
* module kick it off immediately (see bottom of file).
*/
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
function mapAsset(row) {
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
		createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at)
	};
}
var assetInputSchema = object({
	name: string().trim().min(1).max(200),
	noRegister: string().trim().min(1).max(50),
	kodeBarang: string().trim().min(1).max(50),
	noPabrik: string().trim().max(80).default(""),
	noPolisi: string().trim().max(30).default(""),
	category: string().refine((v) => CATEGORIES.includes(v)),
	subCategory: string().trim().min(1).max(80),
	asalUsul: string().refine((v) => ASAL_USUL.includes(v)),
	qty: number().int().min(1).max(1e6),
	price: number().int().min(0).max(99999999999),
	condition: string().trim().min(1).max(40),
	location: string().trim().max(120).default(""),
	tahun: string().regex(/^\d{4}$/),
	image: string().max(14e5).nullable().optional()
});
function assertClassification(input) {
	if (!SUB_CATEGORY_MAP[input.category].includes(input.subCategory)) throw new Error("Sub kategori tidak sesuai kategori utama");
	if (!conditionsForCategory(input.category).includes(input.condition)) throw new Error("Kondisi tidak sesuai kategori");
	if (input.image && !input.image.startsWith("data:image/")) throw new Error("Format foto tidak valid");
}
async function nextAssetId() {
	const sql = await getSql();
	const prefix = `AST-${(/* @__PURE__ */ new Date()).getFullYear()}-`;
	const rows = await sql`
    select id from assets where id like ${prefix + "%"}
  `;
	let maxNum = 0;
	for (const row of rows) {
		const numPart = parseInt(row.id.slice(prefix.length), 10);
		if (!Number.isNaN(numPart) && numPart > maxNum) maxNum = numPart;
	}
	return `${prefix}${String(maxNum + 1).padStart(3, "0")}`;
}
var listAssets_createServerFn_handler = createServerRpc({
	id: "168a2a9395083d24eb2ee6b257bf7ad7efcbe19e1bb23753d73864f078ab4ea5",
	name: "listAssets",
	filename: "src/lib/asset-api.ts"
}, (opts) => listAssets.__executeServer(opts));
var listAssets = createServerFn({ method: "GET" }).handler(listAssets_createServerFn_handler, async () => {
	return (await (await getSql())`
      select
        id, no_register, kode_barang, no_pabrik, no_polisi, name,
        category, sub_category, asal_usul, qty, price, condition,
        location, tahun, image, created_at
      from assets
      order by created_at desc, id desc
    `).map(mapAsset);
});
var getAssetMetrics_createServerFn_handler = createServerRpc({
	id: "00b6b308b2c9f0ca1147ba7982f89f0588f078f6325d7aea1d2dba9bd8fbf907",
	name: "getAssetMetrics",
	filename: "src/lib/asset-api.ts"
}, (opts) => getAssetMetrics.__executeServer(opts));
var getAssetMetrics = createServerFn({ method: "GET" }).handler(getAssetMetrics_createServerFn_handler, async () => {
	const row = (await (await getSql())`
      select
        coalesce(sum(qty), 0)::int as total_qty,
        coalesce(sum(case when condition in ('Baik', 'Aktif') then qty else 0 end), 0)::int as good_qty,
        coalesce(sum(case when condition not in ('Baik', 'Aktif') then qty else 0 end), 0)::int as repair_qty
      from assets
    `)[0];
	return {
		totalQty: Number(row?.total_qty ?? 0),
		goodQty: Number(row?.good_qty ?? 0),
		repairQty: Number(row?.repair_qty ?? 0)
	};
});
var createAsset_createServerFn_handler = createServerRpc({
	id: "a162923c1f2e6956a7d6bb08f379e9a9a4c7969eebbf9eecd93d6a4ba779350c",
	name: "createAsset",
	filename: "src/lib/asset-api.ts"
}, (opts) => createAsset.__executeServer(opts));
var createAsset = createServerFn({ method: "POST" }).validator(assetInputSchema).handler(createAsset_createServerFn_handler, async ({ data }) => {
	assertClassification(data);
	const row = (await (await getSql())`
      insert into assets (
        id, no_register, kode_barang, no_pabrik, no_polisi, name,
        category, sub_category, asal_usul, qty, price, condition,
        location, tahun, image
      ) values (
        ${await nextAssetId()}, ${data.noRegister}, ${data.kodeBarang}, ${data.noPabrik},
        ${data.noPolisi}, ${data.name}, ${data.category}, ${data.subCategory},
        ${data.asalUsul}, ${data.qty}, ${data.price}, ${data.condition},
        ${data.location}, ${data.tahun}, ${data.image ?? null}
      )
      returning
        id, no_register, kode_barang, no_pabrik, no_polisi, name,
        category, sub_category, asal_usul, qty, price, condition,
        location, tahun, image, created_at
    `)[0];
	if (!row) throw new Error("Gagal menyimpan aset");
	return mapAsset(row);
});
var updateSchema = assetInputSchema.extend({ id: string().min(1).max(40) });
var updateAsset_createServerFn_handler = createServerRpc({
	id: "76c19b953cef2844ce528b15b5daaeb80c8a018bd6753f475dc15f085ef282ca",
	name: "updateAsset",
	filename: "src/lib/asset-api.ts"
}, (opts) => updateAsset.__executeServer(opts));
var updateAsset = createServerFn({ method: "POST" }).validator(updateSchema).handler(updateAsset_createServerFn_handler, async ({ data }) => {
	assertClassification(data);
	const row = (await (await getSql())`
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
    `)[0];
	if (!row) throw new Error("Aset tidak ditemukan");
	return mapAsset(row);
});
var deleteAsset_createServerFn_handler = createServerRpc({
	id: "c700ebc260ad07d36afe560581c83a368c4f84979515917f956fc3d35de81003",
	name: "deleteAsset",
	filename: "src/lib/asset-api.ts"
}, (opts) => deleteAsset.__executeServer(opts));
var deleteAsset = createServerFn({ method: "POST" }).validator(object({ id: string().min(1).max(40) })).handler(deleteAsset_createServerFn_handler, async ({ data }) => {
	if (!(await (await getSql())`
      delete from assets where id = ${data.id} returning id
    `)[0]) throw new Error("Aset tidak ditemukan");
	return { ok: true };
});
//#endregion
export { createAsset_createServerFn_handler, deleteAsset_createServerFn_handler, getAssetMetrics_createServerFn_handler, listAssets_createServerFn_handler, updateAsset_createServerFn_handler };
