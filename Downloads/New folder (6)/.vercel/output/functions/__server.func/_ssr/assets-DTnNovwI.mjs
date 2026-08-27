//#region node_modules/.nitro/vite/services/ssr/assets/assets-DTnNovwI.js
var CATEGORIES = [
	"Tanah dan Bangunan",
	"Peralatan dan Mesin",
	"Aset Tak Berwujud"
];
var SUB_CATEGORY_MAP = {
	"Tanah dan Bangunan": ["Tanah", "Bangunan"],
	"Peralatan dan Mesin": [
		"Kendaraan",
		"Peralatan Komputer TI",
		"Alat Kantor dan Rumah Tangga",
		"Alat Komunikasi dan Studio"
	],
	"Aset Tak Berwujud": [
		"Kajian",
		"Lisensi Perangkat Lunak",
		"Aplikasi",
		"Hak Cipta"
	]
};
var ASAL_USUL = [
	"Pembelian",
	"Hibah",
	"Sewa",
	"Pinjam",
	"Guna Usaha",
	"Lainnya"
];
function conditionsForCategory(category) {
	if (category === "Aset Tak Berwujud") return ["Aktif", "Kadaluwarsa (Expired)"];
	if (category) return [
		"Baik",
		"Rusak Ringan",
		"Rusak Berat"
	];
	return [];
}
function formatRupiah(angka) {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0
	}).format(angka || 0);
}
function formatLongDate(date = /* @__PURE__ */ new Date()) {
	return date.toLocaleDateString("id-ID", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric"
	});
}
function formatDateTime(date = /* @__PURE__ */ new Date()) {
	return date.toLocaleString("id-ID", {
		dateStyle: "full",
		timeStyle: "short"
	});
}
//#endregion
export { formatDateTime as a, conditionsForCategory as i, CATEGORIES as n, formatLongDate as o, SUB_CATEGORY_MAP as r, formatRupiah as s, ASAL_USUL as t };
