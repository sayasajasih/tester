import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as formatDateTime, i as conditionsForCategory, n as CATEGORIES, o as formatLongDate, r as SUB_CATEGORY_MAP, s as formatRupiah, t as ASAL_USUL } from "./assets-DTnNovwI.mjs";
import { i as string, n as number, r as object } from "../_libs/zod.mjs";
import { _ as Building2, a as Search, c as Plus, d as MapPin, f as Info, g as Calendar, h as CircleCheck, i as Trash2, l as Pencil, m as Eye, n as Wrench, o as Save, p as Image, s as Printer, t as X, u as Package } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C3FSXaJ2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
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
var listAssets = createServerFn({ method: "GET" }).handler(createSsrRpc("168a2a9395083d24eb2ee6b257bf7ad7efcbe19e1bb23753d73864f078ab4ea5"));
createServerFn({ method: "GET" }).handler(createSsrRpc("00b6b308b2c9f0ca1147ba7982f89f0588f078f6325d7aea1d2dba9bd8fbf907"));
var createAsset = createServerFn({ method: "POST" }).validator(assetInputSchema).handler(createSsrRpc("a162923c1f2e6956a7d6bb08f379e9a9a4c7969eebbf9eecd93d6a4ba779350c"));
var updateSchema = assetInputSchema.extend({ id: string().min(1).max(40) });
var updateAsset = createServerFn({ method: "POST" }).validator(updateSchema).handler(createSsrRpc("76c19b953cef2844ce528b15b5daaeb80c8a018bd6753f475dc15f085ef282ca"));
var deleteAsset = createServerFn({ method: "POST" }).validator(object({ id: string().min(1).max(40) })).handler(createSsrRpc("c700ebc260ad07d36afe560581c83a368c4f84979515917f956fc3d35de81003"));
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var fieldClass = "block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none";
var emptyForm = {
	name: "",
	noRegister: "",
	kodeBarang: "",
	noPabrik: "",
	noPolisi: "",
	category: "",
	subCategory: "",
	asalUsul: "",
	qty: 1,
	price: 0,
	condition: "",
	location: "",
	tahun: String((/* @__PURE__ */ new Date()).getFullYear()),
	image: null
};
function assetToInput(asset) {
	return {
		name: asset.name,
		noRegister: asset.noRegister,
		kodeBarang: asset.kodeBarang,
		noPabrik: asset.noPabrik,
		noPolisi: asset.noPolisi,
		category: asset.category,
		subCategory: asset.subCategory,
		asalUsul: asset.asalUsul,
		qty: asset.qty,
		price: asset.price,
		condition: asset.condition,
		location: asset.location,
		tahun: asset.tahun,
		image: asset.image
	};
}
function CategoryBadge({ category, subCategory }) {
	const style = {
		"Tanah dan Bangunan": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
		"Peralatan dan Mesin": "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
		"Aset Tak Berwujud": "bg-purple-50 text-purple-700 ring-purple-600/20"
	}[category] ?? "bg-slate-50 text-slate-700 ring-slate-600/20";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-start gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase",
			children: category
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("inline-flex items-center rounded-lg px-3 py-1 text-xs font-bold tracking-wide ring-1 ring-inset", style),
			children: subCategory || category
		})]
	});
}
function ConditionBadge({ condition }) {
	let dot = "bg-slate-500";
	let style = "bg-slate-50 text-slate-700 ring-slate-500/20";
	switch (condition) {
		case "Baik":
			dot = "bg-emerald-500";
			style = "bg-emerald-50 text-emerald-700 ring-emerald-500/20";
			break;
		case "Rusak Ringan":
			dot = "bg-amber-500";
			style = "bg-amber-50 text-amber-700 ring-amber-500/20";
			break;
		case "Rusak Berat":
			dot = "bg-rose-500";
			style = "bg-rose-50 text-rose-700 ring-rose-500/20";
			break;
		case "Aktif":
			dot = "bg-blue-500";
			style = "bg-blue-50 text-blue-700 ring-blue-500/20";
			break;
		case "Kadaluwarsa (Expired)":
			dot = "bg-slate-500";
			style = "bg-slate-50 text-slate-700 ring-slate-500/20";
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold ring-1 ring-inset", style),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-1.5 w-1.5 rounded-full shadow-sm", dot) }), condition]
	});
}
function InventoryDashboard() {
	const queryClient = useQueryClient();
	const assetsQuery = useQuery({
		queryKey: ["assets"],
		queryFn: () => listAssets()
	});
	const [search, setSearch] = (0, import_react.useState)("");
	const [filterCategory, setFilterCategory] = (0, import_react.useState)("all");
	const [filterSub, setFilterSub] = (0, import_react.useState)("all");
	const [filterYear, setFilterYear] = (0, import_react.useState)("all");
	const [filterCondition, setFilterCondition] = (0, import_react.useState)("all");
	const [formOpen, setFormOpen] = (0, import_react.useState)(false);
	const [formMode, setFormMode] = (0, import_react.useState)("add");
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(emptyForm);
	const [formErrors, setFormErrors] = (0, import_react.useState)({});
	const [detailAsset, setDetailAsset] = (0, import_react.useState)(null);
	const [deleteTarget, setDeleteTarget] = (0, import_react.useState)(null);
	const [zoom, setZoom] = (0, import_react.useState)(null);
	const [printAsset, setPrintAsset] = (0, import_react.useState)(null);
	const [todayLabel, setTodayLabel] = (0, import_react.useState)("");
	const [printedAt, setPrintedAt] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		setTodayLabel(formatLongDate());
		setPrintedAt(formatDateTime());
	}, []);
	const assets = assetsQuery.data ?? [];
	const years = (0, import_react.useMemo)(() => {
		return [...new Set(assets.map((a) => a.tahun).filter(Boolean))].sort((a, b) => Number(b) - Number(a));
	}, [assets]);
	const subOptions = (0, import_react.useMemo)(() => {
		if (filterCategory === "all") return [];
		return SUB_CATEGORY_MAP[filterCategory] ?? [];
	}, [filterCategory]);
	const filtered = (0, import_react.useMemo)(() => {
		const q = search.toLowerCase().trim();
		return assets.filter((a) => {
			return `${a.name} ${a.id} ${a.noRegister} ${a.kodeBarang} ${a.noPolisi}`.toLowerCase().includes(q) && (filterCategory === "all" || a.category === filterCategory) && (filterSub === "all" || a.subCategory === filterSub) && (filterCondition === "all" || a.condition === filterCondition) && (filterYear === "all" || a.tahun === filterYear);
		});
	}, [
		assets,
		search,
		filterCategory,
		filterSub,
		filterCondition,
		filterYear
	]);
	const metrics = (0, import_react.useMemo)(() => {
		const totalQty = assets.reduce((s, a) => s + a.qty, 0);
		const goodQty = assets.filter((a) => a.condition === "Baik" || a.condition === "Aktif").reduce((s, a) => s + a.qty, 0);
		return {
			totalQty,
			goodQty,
			repairQty: totalQty - goodQty
		};
	}, [assets]);
	const saveMutation = useMutation({
		mutationFn: async () => {
			if (formMode === "edit" && editingId) return updateAsset({ data: {
				...form,
				id: editingId
			} });
			return createAsset({ data: form });
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["assets"] });
			setFormOpen(false);
			toast.success(formMode === "add" ? "Aset berhasil ditambahkan" : "Data berhasil diperbarui");
		},
		onError: (err) => {
			toast.error(err.message || "Gagal menyimpan data");
		}
	});
	const deleteMutation = useMutation({
		mutationFn: async (id) => deleteAsset({ data: { id } }),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["assets"] });
			setDeleteTarget(null);
			toast.success("Data aset dihapus");
		},
		onError: (err) => {
			toast.error(err.message || "Gagal menghapus data");
		}
	});
	function openAdd() {
		setFormMode("add");
		setEditingId(null);
		setForm({
			...emptyForm,
			tahun: String((/* @__PURE__ */ new Date()).getFullYear())
		});
		setFormErrors({});
		setFormOpen(true);
	}
	function openEdit(asset) {
		setFormMode("edit");
		setEditingId(asset.id);
		setForm(assetToInput(asset));
		setFormErrors({});
		setFormOpen(true);
	}
	function onCategoryChange(category) {
		setForm((prev) => ({
			...prev,
			category,
			subCategory: "",
			condition: ""
		}));
	}
	function handleImage(file) {
		if (!file) return;
		if (file.size > 1048576) {
			toast.error("Ukuran file maksimal 1 MB!");
			return;
		}
		const reader = new FileReader();
		reader.onload = () => {
			const result = typeof reader.result === "string" ? reader.result : null;
			setForm((prev) => ({
				...prev,
				image: result
			}));
		};
		reader.readAsDataURL(file);
	}
	function validateAndSave() {
		const required = [
			"name",
			"noRegister",
			"kodeBarang",
			"category",
			"subCategory",
			"asalUsul",
			"qty",
			"price",
			"condition",
			"tahun"
		];
		const errors = {};
		for (const key of required) {
			const value = form[key];
			if (value === "" || value === null || value === void 0) errors[key] = true;
		}
		if (form.qty < 1) errors.qty = true;
		if (form.price < 0) errors.price = true;
		setFormErrors(errors);
		if (Object.keys(errors).length) {
			toast.error("Lengkapi semua kolom wajib (*)");
			return;
		}
		saveMutation.mutate();
	}
	function printList() {
		document.body.classList.remove("print-detail-mode");
		window.print();
	}
	function printDetail(asset) {
		setPrintAsset(asset);
		document.body.classList.add("print-detail-mode");
		setTimeout(() => {
			window.print();
			setTimeout(() => document.body.classList.remove("print-detail-mode"), 400);
		}, 50);
	}
	const formSubs = form.category ? SUB_CATEGORY_MAP[form.category] ?? [] : [];
	const formConds = conditionsForCategory(form.category);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col text-slate-700 antialiased",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "print-hide sticky top-0 z-30 border-b border-white/50 bg-white/70 shadow-sm backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-brand-500 to-indigo-600 text-white shadow-glow",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-6" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-xl font-bold text-transparent",
							children: "InventarisKu"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs leading-none font-medium text-slate-500",
							children: "Manajemen Aset Modern"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden items-center gap-2 rounded-full border border-slate-200/50 bg-slate-100/50 px-4 py-2 text-sm font-medium text-slate-600 sm:flex",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-4 text-brand-500" }), todayLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: todayLabel }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-40",
							children: "\xA0"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto w-full max-w-7xl flex-grow px-4 py-10 sm:px-6 lg:px-8 print:max-w-full print:px-0 print:py-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-8 hidden text-center print:block",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mb-2 text-3xl font-extrabold text-slate-900",
								children: "Laporan Inventaris Aset"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-medium text-slate-600",
								children: ["Diperbarui: ", printedAt]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-6 mb-2 h-0.5 w-full bg-slate-800" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "print-hide mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-3xl font-extrabold tracking-tight text-slate-900",
							children: "Dashboard Aset"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-medium text-slate-500",
							children: "Pantau dan kelola kondisi seluruh inventaris Anda."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex w-full gap-3 md:w-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: printList,
								className: "inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:bg-slate-50 md:flex-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-5" }), " Cetak Daftar"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: openAdd,
								className: "inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-brand-600 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:from-brand-500 md:flex-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
									className: "size-5",
									strokeWidth: 2.5
								}), " Tambah Aset"]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "print-hide mb-10 grid grid-cols-1 gap-6 md:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
								label: "Total Kuantitas",
								value: metrics.totalQty,
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "size-8" }),
								tone: "brand"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
								label: "Kondisi Baik",
								value: metrics.goodQty,
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-8" }),
								tone: "good"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
								label: "Perlu Perbaikan",
								value: metrics.repairQty,
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "size-8" }),
								tone: "repair"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "print-hide flex flex-col items-center justify-between gap-4 rounded-t-2xl border-x border-t border-white bg-white/90 p-5 shadow-soft backdrop-blur-sm md:flex-row",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex w-full flex-col gap-3 md:flex-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "group relative max-w-md flex-grow",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: search,
									onChange: (e) => setSearch(e.target.value),
									className: "block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-12 text-sm font-medium transition-all placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:outline-none",
									placeholder: "Cari nama, register, kode..."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-grow flex-wrap justify-end gap-3 md:flex-nowrap",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: filterCategory,
										onChange: (e) => {
											setFilterCategory(e.target.value);
											setFilterSub("all");
										},
										className: cn(fieldClass, "bg-slate-50 md:w-auto"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "all",
											children: "Semua Kategori"
										}), CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: c,
											children: c
										}, c))]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: filterSub,
										onChange: (e) => setFilterSub(e.target.value),
										className: cn(fieldClass, "bg-slate-50 md:w-auto"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "all",
											children: "Semua Sub Kategori"
										}), subOptions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: s,
											children: s
										}, s))]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: filterYear,
										onChange: (e) => setFilterYear(e.target.value),
										className: cn(fieldClass, "bg-slate-50 md:w-auto"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "all",
											children: "Semua Tahun Pembelian"
										}), years.map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: y,
											children: y
										}, y))]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: filterCondition,
										onChange: (e) => setFilterCondition(e.target.value),
										className: cn(fieldClass, "bg-slate-50 md:w-auto"),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "all",
												children: "Semua Kondisi"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Baik",
												children: "Baik"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Rusak Ringan",
												children: "Rusak Ringan"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Rusak Berat",
												children: "Rusak Berat"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Aktif",
												children: "Aktif"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Kadaluwarsa (Expired)",
												children: "Kadaluwarsa (Expired)"
											})
										]
									})
								]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-hidden rounded-b-2xl border border-white border-t-slate-100 bg-white shadow-soft print:rounded-none print:shadow-none",
						children: assetsQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-6 py-16 text-center text-sm font-medium text-slate-500",
							children: "Memuat data aset..."
						}) : assetsQuery.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-6 py-16 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-3 font-semibold text-slate-800",
								children: "Gagal memuat data"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => assetsQuery.refetch(),
								className: "rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white",
								children: "Coba lagi"
							})]
						}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center justify-center px-4 py-20 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-5 flex h-24 w-24 items-center justify-center rounded-full border border-slate-100 bg-slate-50",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-12 text-slate-300" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mb-2 text-xl font-bold text-slate-800",
									children: "Tidak ada data ditemukan"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "max-w-sm font-medium text-slate-500",
									children: "Coba sesuaikan filter pencarian Anda atau tambahkan aset baru."
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hidden overflow-x-auto md:block print:block",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "min-w-full divide-y divide-slate-100",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-slate-50/50 print:border-b-2 print:border-slate-800 print:bg-transparent",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
										"ID Aset",
										"Detail Aset & Identitas",
										"Kategori & Sub",
										"Harga Satuan",
										"Qty",
										"Status",
										"Aksi"
									].map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: cn("px-5 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase", i === 3 || i === 6 ? "text-right" : i === 4 ? "text-center" : "text-left", i === 6 && "print-hide", (i === 0 || i === 3 || i === 4) && "whitespace-nowrap"),
										children: h
									}, h)) })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y divide-slate-50",
									children: filtered.map((asset, index) => {
										const extra = [asset.noPolisi ? `Nopol: ${asset.noPolisi}` : null, asset.noPabrik ? `No. Pabrik: ${asset.noPabrik}` : null].filter(Boolean).join(" | ");
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "group animate-fade-in-up bg-white transition-colors hover:bg-slate-50/80",
											style: { animationDelay: `${index * 30}ms` },
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "px-5 py-4 align-top whitespace-nowrap",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "rounded-md border border-slate-100 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-400",
														children: asset.id
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-2 text-[11px] font-medium text-slate-500",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
															"Asal:",
															" ",
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-bold text-slate-700",
																children: asset.asalUsul || "-"
															})
														] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
															"Tahun:",
															" ",
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-bold text-slate-700",
																children: asset.tahun
															})
														] })]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-5 py-4",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-start gap-4",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															className: "relative mt-1 flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-sm transition-colors group-hover:border-brand-200",
															onClick: () => asset.image && setZoom({
																src: asset.image,
																title: asset.name
															}),
															disabled: !asset.image,
															children: asset.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
																src: asset.image,
																alt: "",
																className: "h-full w-full object-cover transition-transform duration-500 hover:scale-110"
															}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "size-6 text-slate-300" })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															onClick: () => setDetailAsset(asset),
															className: "text-left text-sm leading-tight font-bold text-slate-800 transition-colors hover:text-brand-600",
															children: asset.name
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "mt-1.5 space-y-0.5 text-xs text-slate-500",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "font-semibold text-slate-400",
																		children: "Reg:"
																	}),
																	" ",
																	asset.noRegister || "-",
																	" ",
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "mx-1 text-slate-300",
																		children: "|"
																	}),
																	" ",
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "font-semibold text-slate-400",
																		children: "Kode:"
																	}),
																	" ",
																	asset.kodeBarang || "-"
																] }),
																extra ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "font-medium text-brand-600",
																	children: extra
																}) : null,
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "flex items-center gap-1",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5 text-slate-400" }), asset.location || "Tidak ada lokasi"]
																})
															]
														})] })]
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-5 py-4 align-top whitespace-nowrap",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryBadge, {
														category: asset.category,
														subCategory: asset.subCategory
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-5 py-4 text-right align-top whitespace-nowrap",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-sm font-semibold text-slate-700",
														children: formatRupiah(asset.price)
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-5 py-4 text-center align-top whitespace-nowrap",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "rounded-lg border border-slate-100 bg-slate-50 px-3 py-1 text-sm font-extrabold text-slate-700",
														children: asset.qty
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-5 py-4 align-top whitespace-nowrap",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConditionBadge, { condition: asset.condition })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "print-hide px-5 py-4 text-right align-top whitespace-nowrap",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex justify-end gap-1 md:opacity-0 md:transition-all md:group-hover:opacity-100",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
																title: "Lihat Detail",
																className: "text-indigo-500 hover:bg-indigo-50",
																onClick: () => setDetailAsset(asset),
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-5" })
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
																title: "Edit",
																className: "text-brand-600 hover:bg-brand-50",
																onClick: () => openEdit(asset),
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-5" })
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
																title: "Hapus",
																className: "text-rose-500 hover:bg-rose-50",
																onClick: () => setDeleteTarget(asset),
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-5" })
															})
														]
													})
												})
											]
										}, asset.id);
									})
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "print-hide divide-y divide-slate-100 md:hidden",
							children: filtered.map((asset) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "flex flex-col gap-3 p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-slate-50",
												children: asset.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: asset.image,
													alt: "",
													className: "h-full w-full object-cover"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "size-6 text-slate-300" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0 flex-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => setDetailAsset(asset),
														className: "text-left text-sm font-bold text-slate-800",
														children: asset.name
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mt-0.5 text-xs font-medium text-slate-400",
														children: asset.id
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "mt-1 text-xs text-slate-500",
														children: [
															asset.noRegister,
															" · ",
															asset.kodeBarang
														]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConditionBadge, { condition: asset.condition })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-slate-700",
											children: formatRupiah(asset.price)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "rounded-lg bg-slate-50 px-2 py-1 text-xs font-bold text-slate-600",
											children: ["Qty ", asset.qty]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setDetailAsset(asset),
												className: "flex-1 rounded-xl bg-indigo-50 py-2 text-xs font-bold text-indigo-600",
												children: "Detail"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => openEdit(asset),
												className: "flex-1 rounded-xl bg-brand-50 py-2 text-xs font-bold text-brand-600",
												children: "Edit"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setDeleteTarget(asset),
												className: "flex-1 rounded-xl bg-rose-50 py-2 text-xs font-bold text-rose-600",
												children: "Hapus"
											})
										]
									})
								]
							}, asset.id))
						})] })
					})
				]
			}),
			formOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
				onClose: () => setFormOpen(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/50 px-6 py-5 backdrop-blur-xl sm:px-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "flex items-center gap-3 text-xl font-extrabold text-slate-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-xl bg-brand-50 p-2 text-brand-600",
									children: formMode === "add" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-5" })
								}), formMode === "add" ? "Tambah Aset Baru" : "Edit Data Aset"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloseBtn, { onClick: () => setFormOpen(false) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "no-scrollbar overflow-y-auto bg-slate-50/30 px-6 py-6 sm:px-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "mb-2 block text-sm font-bold text-slate-700",
										children: ["Foto Aset ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-normal text-slate-400",
											children: "(Opsional)"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mt-1 flex cursor-pointer justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white px-6 pt-5 pb-6 transition-all hover:border-brand-500 hover:bg-brand-50/50",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "w-full space-y-2 text-center",
											children: [
												form.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: form.image,
													alt: "Preview",
													className: "mx-auto mb-4 h-36 w-auto rounded-xl border border-slate-100 bg-white object-contain shadow-sm"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "size-6 text-slate-400" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-sm font-bold text-brand-600",
													children: "Klik untuk unggah foto"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "file",
													accept: "image/*",
													className: "sr-only",
													onChange: (e) => handleImage(e.target.files?.[0])
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs font-medium text-slate-400",
													children: "Format PNG/JPG maksimal 1 MB"
												})
											]
										})
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 gap-5 sm:grid-cols-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Nama Aset",
												required: true,
												className: "sm:col-span-2",
												error: formErrors.name,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: cn(fieldClass, formErrors.name && "border-rose-500"),
													value: form.name,
													onChange: (e) => setForm({
														...form,
														name: e.target.value
													}),
													placeholder: "Contoh: Laptop MacBook Pro M3"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Nomor Register",
												required: true,
												error: formErrors.noRegister,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: cn(fieldClass, formErrors.noRegister && "border-rose-500"),
													value: form.noRegister,
													onChange: (e) => setForm({
														...form,
														noRegister: e.target.value
													}),
													placeholder: "Contoh: 0001"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Kode Barang",
												required: true,
												error: formErrors.kodeBarang,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: cn(fieldClass, formErrors.kodeBarang && "border-rose-500"),
													value: form.kodeBarang,
													onChange: (e) => setForm({
														...form,
														kodeBarang: e.target.value
													}),
													placeholder: "Contoh: 3.1.01.01"
												})
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "border-slate-200/60" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 gap-5 sm:grid-cols-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Kategori Utama",
												required: true,
												error: formErrors.category,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													className: cn(fieldClass, formErrors.category && "border-rose-500"),
													value: form.category,
													onChange: (e) => onCategoryChange(e.target.value),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "",
														disabled: true,
														children: "Pilih Kategori Utama"
													}), CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: c,
														children: c
													}, c))]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Sub Kategori",
												required: true,
												error: formErrors.subCategory,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													className: cn(fieldClass, formErrors.subCategory && "border-rose-500"),
													value: form.subCategory,
													onChange: (e) => setForm({
														...form,
														subCategory: e.target.value
													}),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "",
														disabled: true,
														children: form.category ? "Pilih Sub Kategori" : "Pilih Kategori Utama Dahulu"
													}), formSubs.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: s,
														children: s
													}, s))]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "No. Pabrik / Rangka / Mesin",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: fieldClass,
													value: form.noPabrik,
													onChange: (e) => setForm({
														...form,
														noPabrik: e.target.value
													}),
													placeholder: "Kosongkan jika tidak ada"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "No. Polisi (Kendaraan)",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: fieldClass,
													value: form.noPolisi,
													onChange: (e) => setForm({
														...form,
														noPolisi: e.target.value
													}),
													placeholder: "Contoh: B 1234 CD"
												})
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "border-slate-200/60" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Asal Usul",
												required: true,
												className: "lg:col-span-2",
												error: formErrors.asalUsul,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													className: cn(fieldClass, formErrors.asalUsul && "border-rose-500"),
													value: form.asalUsul,
													onChange: (e) => setForm({
														...form,
														asalUsul: e.target.value
													}),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "",
														disabled: true,
														children: "Pilih Asal Usul"
													}), ASAL_USUL.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: a,
														children: a
													}, a))]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Kuantitas",
												required: true,
												error: formErrors.qty,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													min: 1,
													className: cn(fieldClass, formErrors.qty && "border-rose-500"),
													value: form.qty,
													onChange: (e) => setForm({
														...form,
														qty: Number(e.target.value) || 0
													})
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Kondisi",
												required: true,
												error: formErrors.condition,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													className: cn(fieldClass, formErrors.condition && "border-rose-500"),
													value: form.condition,
													onChange: (e) => setForm({
														...form,
														condition: e.target.value
													}),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "",
														disabled: true,
														children: form.category ? "Pilih Status" : "Pilih Kategori Utama Dahulu"
													}), formConds.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: c,
														children: c
													}, c))]
												})
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Tahun Pembelian",
												required: true,
												error: formErrors.tahun,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													min: 1900,
													max: 2100,
													className: cn(fieldClass, formErrors.tahun && "border-rose-500"),
													value: form.tahun,
													onChange: (e) => setForm({
														...form,
														tahun: e.target.value
													})
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Harga Satuan (Rp)",
												required: true,
												error: formErrors.price,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													min: 0,
													className: cn(fieldClass, formErrors.price && "border-rose-500"),
													value: form.price,
													onChange: (e) => setForm({
														...form,
														price: Number(e.target.value) || 0
													})
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Lokasi / Penempatan",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: fieldClass,
													value: form.location,
													onChange: (e) => setForm({
														...form,
														location: e.target.value
													}),
													placeholder: "Contoh: Ruang IT"
												})
											})
										]
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "z-10 flex justify-end gap-3 border-t border-slate-100 bg-white px-6 py-5 sm:px-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setFormOpen(false),
								className: "rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200",
								children: "Batal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: validateAndSave,
								disabled: saveMutation.isPending,
								className: "inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-bold text-white shadow-glow hover:bg-brand-700 disabled:opacity-60",
								children: [saveMutation.isPending ? "Menyimpan..." : "Simpan Data", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4" })]
							})]
						})
					]
				})
			}) : null,
			detailAsset ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
				onClose: () => setDetailAsset(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "print-hide sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/50 px-6 py-5 backdrop-blur-xl sm:px-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "flex items-center gap-3 text-xl font-extrabold text-slate-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-xl bg-indigo-50 p-2 text-indigo-600",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "size-5" })
								}), "Detail Aset"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloseBtn, { onClick: () => setDetailAsset(null) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssetDetailBody, { asset: detailAsset }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "print-hide z-10 flex justify-end gap-3 border-t border-slate-100 bg-white px-6 py-5 sm:px-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setDetailAsset(null),
								className: "rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200",
								children: "Tutup"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => printDetail(detailAsset),
								className: "inline-flex items-center gap-2 rounded-xl bg-slate-800 px-6 py-2.5 text-sm font-bold text-white shadow-glow hover:bg-slate-900",
								children: ["Cetak Detail", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" })]
							})]
						})
					]
				})
			}) : null,
			deleteTarget ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
				onClose: () => setDeleteTarget(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex w-full max-w-sm flex-col overflow-hidden rounded-3xl border border-white bg-white shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative overflow-hidden px-6 py-8 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-10 -right-10 h-32 w-32 rounded-full bg-rose-50 opacity-50" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-500 shadow-inner",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-8" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-2 text-xl font-extrabold text-slate-800",
								children: "Hapus Aset?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-medium text-slate-500",
								children: [
									"Hapus ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: deleteTarget.name }),
									" secara permanen?"
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setDeleteTarget(null),
							className: "flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm hover:bg-slate-50",
							children: "Batal"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: deleteMutation.isPending,
							onClick: () => deleteMutation.mutate(deleteTarget.id),
							className: "flex-1 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-200 hover:bg-rose-600 disabled:opacity-60",
							children: deleteMutation.isPending ? "Menghapus..." : "Ya, Hapus"
						})]
					})]
				})
			}) : null,
			zoom ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "print-hide fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "absolute inset-0 bg-slate-900/95 backdrop-blur-md",
					onClick: () => setZoom(null),
					"aria-label": "Tutup"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-10 flex max-h-[90vh] w-full max-w-5xl flex-col items-center justify-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: zoom.src,
						alt: zoom.title,
						className: "max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl ring-1 ring-white/10"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 rounded-full border border-white/10 bg-slate-800/50 px-4 py-2 text-lg font-bold text-white backdrop-blur-sm",
						children: zoom.title
					})]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				id: "detail-print-root",
				className: "hidden",
				children: printAsset ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white p-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6 border-b-2 border-slate-800 pb-4 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-extrabold tracking-widest text-slate-900 uppercase",
							children: "Detail Informasi Aset"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm font-medium text-slate-500",
							children: ["Dicetak pada: ", printedAt || formatDateTime()]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssetDetailBody, {
						asset: printAsset,
						compact: true
					})]
				}) : null
			})
		]
	});
}
function MetricCard({ label, value, icon, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group flex items-center gap-5 overflow-hidden rounded-2xl border border-white bg-white/80 p-6 shadow-soft backdrop-blur-sm transition-all duration-300 hover:-translate-y-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("flex h-16 w-16 items-center justify-center rounded-2xl transition-colors duration-300", {
				brand: "bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white",
				good: "bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white",
				repair: "bg-rose-50 text-rose-500 group-hover:bg-rose-500 group-hover:text-white"
			}[tone]),
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-1 text-sm font-bold tracking-wider text-slate-400 uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-4xl font-extrabold text-slate-800",
			children: value
		})] })]
	});
}
function IconBtn({ children, title, className, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		title,
		onClick,
		className: cn("rounded-xl p-2", className),
		children
	});
}
function CloseBtn({ onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: "rounded-xl bg-slate-50 p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500",
		"aria-label": "Tutup",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
	});
}
function Modal({ children, onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "print-hide fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "absolute inset-0 bg-slate-900/40 backdrop-blur-sm",
			onClick: onClose,
			"aria-label": "Tutup dialog"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative z-10 w-full max-w-max",
			children
		})]
	});
}
function Field({ label, required, children, className, error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mb-2 block text-sm font-bold text-slate-700",
				children: [
					label,
					" ",
					required ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-rose-500",
						children: "*"
					}) : null
				]
			}),
			children,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs font-medium text-rose-500",
				children: "Wajib diisi"
			}) : null
		]
	});
}
function AssetDetailBody({ asset, compact }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex-grow overflow-y-auto bg-slate-50/30 px-6 py-6 sm:px-8", compact && "bg-white p-0"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-8 md:flex-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full flex-shrink-0 md:w-1/3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-slate-100 bg-white p-2 shadow-sm",
					children: asset.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: asset.image,
						alt: asset.name,
						className: "w-full rounded-xl bg-slate-50 object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex aspect-square w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "mb-2 size-10" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium",
							children: "Tidak ada foto"
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConditionBadge, { condition: asset.condition })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full md:w-2/3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-1 text-xs font-bold tracking-wider text-brand-600 uppercase",
							children: asset.id
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-extrabold text-slate-800",
							children: asset.name
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-x-8 gap-y-5 text-sm sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailItem, {
								label: "Kategori Utama",
								value: asset.category
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailItem, {
								label: "Sub Kategori",
								value: asset.subCategory
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailItem, {
								label: "No. Register",
								value: asset.noRegister
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailItem, {
								label: "Kode Barang",
								value: asset.kodeBarang
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailItem, {
								label: "No. Pabrik / Mesin",
								value: asset.noPabrik || "-"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailItem, {
								label: "No. Polisi",
								value: asset.noPolisi || "-"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailItem, {
								label: "Asal Usul",
								value: asset.asalUsul
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailItem, {
								label: "Tahun Pembelian",
								value: asset.tahun
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailItem, {
								label: "Lokasi / Penempatan",
								value: asset.location || "-"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailItem, {
								label: "Kuantitas",
								value: `${asset.qty} Unit`
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-col justify-between gap-4 rounded-2xl border border-brand-100 bg-brand-50/50 p-5 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase",
							children: "Harga Satuan"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg font-bold text-slate-800",
							children: formatRupiah(asset.price)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sm:text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase",
								children: "Total Nilai Aset"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xl font-extrabold text-brand-600",
								children: formatRupiah(asset.price * asset.qty)
							})]
						})]
					})
				]
			})]
		})
	});
}
function DetailItem({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mb-0.5 font-medium text-slate-500",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "font-bold text-slate-800",
		children: value
	})] });
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InventoryDashboard, {});
}
//#endregion
export { Home as component };
