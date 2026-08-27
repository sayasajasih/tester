"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Eye,
  Image as ImageIcon,
  Info,
  Search,
  MapPin,
  Package,
  Pencil,
  Plus,
  Printer,
  Save,
  Trash2,
  Wrench,
  X,
} from "lucide-react";
import {
  CATEGORIES,
  SUB_CATEGORY_MAP,
  ASAL_USUL,
  conditionsForCategory,
  formatDateTime,
  formatLongDate,
  formatRupiah,
  type Asset,
  type AssetInput,
  type Category,
} from "@/lib/assets";
import {
  createAsset,
  deleteAsset,
  listAssets,
  updateAsset,
} from "@/lib/asset-api";
import { cn } from "@/lib/cn";

const fieldClass =
  "block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none";

const emptyForm: AssetInput = {
  name: "",
  noRegister: "",
  kodeBarang: "",
  noPabrik: "",
  noPolisi: "",
  category: "" as Category,
  subCategory: "",
  asalUsul: "",
  qty: 1,
  price: 0,
  condition: "",
  location: "",
  tahun: String(new Date().getFullYear()),
  image: null,
};

function assetToInput(asset: Asset): AssetInput {
  return {
    name: asset.name,
    noRegister: asset.noRegister,
    kodeBarang: asset.kodeBarang,
    noPabrik: asset.noPabrik,
    noPolisi: asset.noPolisi,
    category: asset.category as Category,
    subCategory: asset.subCategory,
    asalUsul: asset.asalUsul,
    qty: asset.qty,
    price: asset.price,
    condition: asset.condition,
    location: asset.location,
    tahun: asset.tahun,
    image: asset.image,
  };
}

function CategoryBadge({
  category,
  subCategory,
}: {
  category: string;
  subCategory: string;
}) {
  const styles: Record<string, string> = {
    "Tanah dan Bangunan": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    "Peralatan dan Mesin": "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
    "Aset Tak Berwujud": "bg-purple-50 text-purple-700 ring-purple-600/20",
  };
  const style = styles[category] ?? "bg-slate-50 text-slate-700 ring-slate-600/20";
  return (
    <div className="flex flex-col items-start gap-1">
      <span className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
        {category}
      </span>
      <span
        className={cn(
          "inline-flex items-center rounded-lg px-3 py-1 text-xs font-bold tracking-wide ring-1 ring-inset",
          style,
        )}
      >
        {subCategory || category}
      </span>
    </div>
  );
}

function ConditionBadge({ condition }: { condition: string }) {
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
      break;
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold ring-1 ring-inset",
        style,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shadow-sm", dot)} />
      {condition}
    </span>
  );
}

export function InventoryDashboard() {
  const queryClient = useQueryClient();
  const assetsQuery = useQuery({
    queryKey: ["assets"],
    queryFn: () => listAssets(),
  });

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterSub, setFilterSub] = useState("all");
  const [filterYear, setFilterYear] = useState("all");
  const [filterCondition, setFilterCondition] = useState("all");

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AssetInput>(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

  const [detailAsset, setDetailAsset] = useState<Asset | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Asset | null>(null);
  const [zoom, setZoom] = useState<{ src: string; title: string } | null>(null);
  const [printAsset, setPrintAsset] = useState<Asset | null>(null);
  const [todayLabel, setTodayLabel] = useState("");
  const [printedAt, setPrintedAt] = useState("");

  useEffect(() => {
    setTodayLabel(formatLongDate());
    setPrintedAt(formatDateTime());
  }, []);

  const assets = assetsQuery.data ?? [];

  const years = useMemo(() => {
    return [...new Set(assets.map((a) => a.tahun).filter(Boolean))].sort(
      (a, b) => Number(b) - Number(a),
    );
  }, [assets]);

  const subOptions = useMemo(() => {
    if (filterCategory === "all") return [];
    return SUB_CATEGORY_MAP[filterCategory as Category] ?? [];
  }, [filterCategory]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return assets.filter((a) => {
      const hay = `${a.name} ${a.id} ${a.noRegister} ${a.kodeBarang} ${a.noPolisi}`.toLowerCase();
      return (
        hay.includes(q) &&
        (filterCategory === "all" || a.category === filterCategory) &&
        (filterSub === "all" || a.subCategory === filterSub) &&
        (filterCondition === "all" || a.condition === filterCondition) &&
        (filterYear === "all" || a.tahun === filterYear)
      );
    });
  }, [assets, search, filterCategory, filterSub, filterCondition, filterYear]);

  const metrics = useMemo(() => {
    const totalQty = assets.reduce((s, a) => s + a.qty, 0);
    const goodQty = assets
      .filter((a) => a.condition === "Baik" || a.condition === "Aktif")
      .reduce((s, a) => s + a.qty, 0);
    return { totalQty, goodQty, repairQty: totalQty - goodQty };
  }, [assets]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (formMode === "edit" && editingId) {
        return updateAsset({ data: { ...form, id: editingId } });
      }
      return createAsset({ data: form });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["assets"] });
      setFormOpen(false);
      toast.success(
        formMode === "add" ? "Aset berhasil ditambahkan" : "Data berhasil diperbarui",
      );
    },
    onError: (err: Error) => {
      toast.error(err.message || "Gagal menyimpan data");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => deleteAsset({ data: { id } }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["assets"] });
      setDeleteTarget(null);
      toast.success("Data aset dihapus");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Gagal menghapus data");
    },
  });

  function openAdd() {
    setFormMode("add");
    setEditingId(null);
    setForm({ ...emptyForm, tahun: String(new Date().getFullYear()) });
    setFormErrors({});
    setFormOpen(true);
  }

  function openEdit(asset: Asset) {
    setFormMode("edit");
    setEditingId(asset.id);
    setForm(assetToInput(asset));
    setFormErrors({});
    setFormOpen(true);
  }

  function onCategoryChange(category: string) {
    setForm((prev) => ({
      ...prev,
      category: category as Category,
      subCategory: "",
      condition: "",
    }));
  }

  function handleImage(file: File | undefined) {
    if (!file) return;
    if (file.size > 1024 * 1024) {
      toast.error("Ukuran file maksimal 1 MB!");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null;
      setForm((prev) => ({ ...prev, image: result }));
    };
    reader.readAsDataURL(file);
  }

  function validateAndSave() {
    const required: Array<keyof AssetInput> = [
      "name",
      "noRegister",
      "kodeBarang",
      "category",
      "subCategory",
      "asalUsul",
      "qty",
      "price",
      "condition",
      "tahun",
    ];
    const errors: Record<string, boolean> = {};
    for (const key of required) {
      const value = form[key];
      if (value === "" || value === null || value === undefined) errors[key] = true;
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

  function printDetail(asset: Asset) {
    setPrintAsset(asset);
    document.body.classList.add("print-detail-mode");
    setTimeout(() => {
      window.print();
      setTimeout(() => document.body.classList.remove("print-detail-mode"), 400);
    }, 50);
  }

  const formSubs = form.category
    ? (SUB_CATEGORY_MAP[form.category as Category] ?? [])
    : [];
  const formConds = conditionsForCategory(form.category);

  return (
    <div className="flex min-h-screen flex-col text-slate-700 antialiased">
      <nav className="print-hide sticky top-0 z-30 border-b border-white/50 bg-white/70 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-brand-500 to-indigo-600 text-white shadow-glow">
              <Building2 className="size-6" />
            </div>
            <div>
              <h1 className="bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-xl font-bold text-transparent">
                InventarisKu
              </h1>
              <p className="text-xs leading-none font-medium text-slate-500">
                Manajemen Aset Modern
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-slate-200/50 bg-slate-100/50 px-4 py-2 text-sm font-medium text-slate-600 sm:flex">
            <Calendar className="size-4 text-brand-500" />
            {todayLabel ? <span>{todayLabel}</span> : <span className="w-40">&nbsp;</span>}
          </div>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-7xl flex-grow px-4 py-10 sm:px-6 lg:px-8 print:max-w-full print:px-0 print:py-0">
        <div className="mb-8 hidden text-center print:block">
          <h1 className="mb-2 text-3xl font-extrabold text-slate-900">
            Laporan Inventaris Aset
          </h1>
          <p className="text-sm font-medium text-slate-600">
            Diperbarui: {printedAt}
          </p>
          <div className="mt-6 mb-2 h-0.5 w-full bg-slate-800" />
        </div>

        <div className="print-hide mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Dashboard Aset
            </h2>
            <p className="mt-1 font-medium text-slate-500">
              Pantau dan kelola kondisi seluruh inventaris Anda.
            </p>
          </div>
          <div className="flex w-full gap-3 md:w-auto">
            <button
              type="button"
              onClick={printList}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:bg-slate-50 md:flex-none"
            >
              <Printer className="size-5" /> Cetak Daftar
            </button>
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-brand-600 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:from-brand-500 md:flex-none"
            >
              <Plus className="size-5" strokeWidth={2.5} /> Tambah Aset
            </button>
          </div>
        </div>

        <div className="print-hide mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <MetricCard
            label="Total Kuantitas"
            value={metrics.totalQty}
            icon={<Package className="size-8" />}
            tone="brand"
          />
          <MetricCard
            label="Kondisi Baik"
            value={metrics.goodQty}
            icon={<CheckCircle2 className="size-8" />}
            tone="good"
          />
          <MetricCard
            label="Perlu Perbaikan"
            value={metrics.repairQty}
            icon={<Wrench className="size-8" />}
            tone="repair"
          />
        </div>

        <div className="print-hide flex flex-col items-center justify-between gap-4 rounded-t-2xl border-x border-t border-white bg-white/90 p-5 shadow-soft backdrop-blur-sm md:flex-row">
          <div className="flex w-full flex-col gap-3 md:flex-row">
            <div className="group relative max-w-md flex-grow">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <Search className="size-5" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-12 text-sm font-medium transition-all placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
                placeholder="Cari nama, register, kode..."
              />
            </div>
            <div className="flex flex-grow flex-wrap justify-end gap-3 md:flex-nowrap">
              <select
                value={filterCategory}
                onChange={(e) => {
                  setFilterCategory(e.target.value);
                  setFilterSub("all");
                }}
                className={cn(fieldClass, "bg-slate-50 md:w-auto")}
              >
                <option value="all">Semua Kategori</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                value={filterSub}
                onChange={(e) => setFilterSub(e.target.value)}
                className={cn(fieldClass, "bg-slate-50 md:w-auto")}
              >
                <option value="all">Semua Sub Kategori</option>
                {subOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className={cn(fieldClass, "bg-slate-50 md:w-auto")}
              >
                <option value="all">Semua Tahun Pembelian</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <select
                value={filterCondition}
                onChange={(e) => setFilterCondition(e.target.value)}
                className={cn(fieldClass, "bg-slate-50 md:w-auto")}
              >
                <option value="all">Semua Kondisi</option>
                <option value="Baik">Baik</option>
                <option value="Rusak Ringan">Rusak Ringan</option>
                <option value="Rusak Berat">Rusak Berat</option>
                <option value="Aktif">Aktif</option>
                <option value="Kadaluwarsa (Expired)">Kadaluwarsa (Expired)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-b-2xl border border-white border-t-slate-100 bg-white shadow-soft print:rounded-none print:shadow-none">
          {assetsQuery.isLoading ? (
            <div className="px-6 py-16 text-center text-sm font-medium text-slate-500">
              Memuat data aset...
            </div>
          ) : assetsQuery.isError ? (
            <div className="px-6 py-16 text-center">
              <p className="mb-3 font-semibold text-slate-800">Gagal memuat data</p>
              <button
                type="button"
                onClick={() => assetsQuery.refetch()}
                className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white"
              >
                Coba lagi
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
              <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full border border-slate-100 bg-slate-50">
                <Search className="size-12 text-slate-300" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-800">
                Tidak ada data ditemukan
              </h3>
              <p className="max-w-sm font-medium text-slate-500">
                Coba sesuaikan filter pencarian Anda atau tambahkan aset baru.
              </p>
            </div>
          ) : (
            <>
            <div className="hidden overflow-x-auto md:block print:block">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50/50 print:border-b-2 print:border-slate-800 print:bg-transparent">
                  <tr>
                    {[
                      "ID Aset",
                      "Detail Aset & Identitas",
                      "Kategori & Sub",
                      "Harga Satuan",
                      "Qty",
                      "Status",
                      "Aksi",
                    ].map((h, i) => (
                      <th
                        key={h}
                        className={cn(
                          "px-5 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase",
                          i === 3 || i === 6 ? "text-right" : i === 4 ? "text-center" : "text-left",
                          i === 6 && "print-hide",
                          (i === 0 || i === 3 || i === 4) && "whitespace-nowrap",
                        )}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((asset, index) => {
                    const extra = [
                      asset.noPolisi ? `Nopol: ${asset.noPolisi}` : null,
                      asset.noPabrik ? `No. Pabrik: ${asset.noPabrik}` : null,
                    ]
                      .filter(Boolean)
                      .join(" | ");
                    return (
                      <tr
                        key={asset.id}
                        className="group animate-fade-in-up bg-white transition-colors hover:bg-slate-50/80"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <td className="px-5 py-4 align-top whitespace-nowrap">
                          <span className="rounded-md border border-slate-100 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-400">
                            {asset.id}
                          </span>
                          <div className="mt-2 text-[11px] font-medium text-slate-500">
                            <div>
                              Asal:{" "}
                              <span className="font-bold text-slate-700">
                                {asset.asalUsul || "-"}
                              </span>
                            </div>
                            <div>
                              Tahun:{" "}
                              <span className="font-bold text-slate-700">{asset.tahun}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-start gap-4">
                            <button
                              type="button"
                              className="relative mt-1 flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-sm transition-colors group-hover:border-brand-200"
                              onClick={() =>
                                asset.image &&
                                setZoom({ src: asset.image, title: asset.name })
                              }
                              disabled={!asset.image}
                            >
                              {asset.image ? (
                                <img
                                  src={asset.image}
                                  alt=""
                                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                />
                              ) : (
                                <ImageIcon className="size-6 text-slate-300" />
                              )}
                            </button>
                            <div>
                              <button
                                type="button"
                                onClick={() => setDetailAsset(asset)}
                                className="text-left text-sm leading-tight font-bold text-slate-800 transition-colors hover:text-brand-600"
                              >
                                {asset.name}
                              </button>
                              <div className="mt-1.5 space-y-0.5 text-xs text-slate-500">
                                <div>
                                  <span className="font-semibold text-slate-400">Reg:</span>{" "}
                                  {asset.noRegister || "-"}{" "}
                                  <span className="mx-1 text-slate-300">|</span>{" "}
                                  <span className="font-semibold text-slate-400">Kode:</span>{" "}
                                  {asset.kodeBarang || "-"}
                                </div>
                                {extra ? (
                                  <div className="font-medium text-brand-600">{extra}</div>
                                ) : null}
                                <div className="flex items-center gap-1">
                                  <MapPin className="size-3.5 text-slate-400" />
                                  {asset.location || "Tidak ada lokasi"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 align-top whitespace-nowrap">
                          <CategoryBadge
                            category={asset.category}
                            subCategory={asset.subCategory}
                          />
                        </td>
                        <td className="px-5 py-4 text-right align-top whitespace-nowrap">
                          <span className="text-sm font-semibold text-slate-700">
                            {formatRupiah(asset.price)}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center align-top whitespace-nowrap">
                          <span className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-1 text-sm font-extrabold text-slate-700">
                            {asset.qty}
                          </span>
                        </td>
                        <td className="px-5 py-4 align-top whitespace-nowrap">
                          <ConditionBadge condition={asset.condition} />
                        </td>
                        <td className="print-hide px-5 py-4 text-right align-top whitespace-nowrap">
                          <div className="flex justify-end gap-1 md:opacity-0 md:transition-all md:group-hover:opacity-100">
                            <IconBtn
                              title="Lihat Detail"
                              className="text-indigo-500 hover:bg-indigo-50"
                              onClick={() => setDetailAsset(asset)}
                            >
                              <Eye className="size-5" />
                            </IconBtn>
                            <IconBtn
                              title="Edit"
                              className="text-brand-600 hover:bg-brand-50"
                              onClick={() => openEdit(asset)}
                            >
                              <Pencil className="size-5" />
                            </IconBtn>
                            <IconBtn
                              title="Hapus"
                              className="text-rose-500 hover:bg-rose-50"
                              onClick={() => setDeleteTarget(asset)}
                            >
                              <Trash2 className="size-5" />
                            </IconBtn>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="print-hide divide-y divide-slate-100 md:hidden">
              {filtered.map((asset) => (
                <article key={asset.id} className="flex flex-col gap-3 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                      {asset.image ? (
                        <img src={asset.image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon className="size-6 text-slate-300" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => setDetailAsset(asset)}
                        className="text-left text-sm font-bold text-slate-800"
                      >
                        {asset.name}
                      </button>
                      <p className="mt-0.5 text-xs font-medium text-slate-400">{asset.id}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {asset.noRegister} · {asset.kodeBarang}
                      </p>
                    </div>
                    <ConditionBadge condition={asset.condition} />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700">{formatRupiah(asset.price)}</span>
                    <span className="rounded-lg bg-slate-50 px-2 py-1 text-xs font-bold text-slate-600">
                      Qty {asset.qty}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setDetailAsset(asset)}
                      className="flex-1 rounded-xl bg-indigo-50 py-2 text-xs font-bold text-indigo-600"
                    >
                      Detail
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(asset)}
                      className="flex-1 rounded-xl bg-brand-50 py-2 text-xs font-bold text-brand-600"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(asset)}
                      className="flex-1 rounded-xl bg-rose-50 py-2 text-xs font-bold text-rose-600"
                    >
                      Hapus
                    </button>
                  </div>
                </article>
              ))}
            </div>
            </>
          )}
        </div>
      </main>

      {formOpen ? (
        <Modal onClose={() => setFormOpen(false)}>
          <div className="flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/50 px-6 py-5 backdrop-blur-xl sm:px-8">
              <h3 className="flex items-center gap-3 text-xl font-extrabold text-slate-800">
                <span className="rounded-xl bg-brand-50 p-2 text-brand-600">
                  {formMode === "add" ? <Plus className="size-5" /> : <Pencil className="size-5" />}
                </span>
                {formMode === "add" ? "Tambah Aset Baru" : "Edit Data Aset"}
              </h3>
              <CloseBtn onClick={() => setFormOpen(false)} />
            </div>
            <div className="no-scrollbar overflow-y-auto bg-slate-50/30 px-6 py-6 sm:px-8">
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Foto Aset <span className="font-normal text-slate-400">(Opsional)</span>
                  </label>
                  <label className="mt-1 flex cursor-pointer justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white px-6 pt-5 pb-6 transition-all hover:border-brand-500 hover:bg-brand-50/50">
                    <div className="w-full space-y-2 text-center">
                      {form.image ? (
                        <img
                          src={form.image}
                          alt="Preview"
                          className="mx-auto mb-4 h-36 w-auto rounded-xl border border-slate-100 bg-white object-contain shadow-sm"
                        />
                      ) : (
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50">
                          <ImageIcon className="size-6 text-slate-400" />
                        </div>
                      )}
                      <span className="text-sm font-bold text-brand-600">
                        Klik untuk unggah foto
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => handleImage(e.target.files?.[0])}
                      />
                      <p className="text-xs font-medium text-slate-400">
                        Format PNG/JPG maksimal 1 MB
                      </p>
                    </div>
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Nama Aset" required className="sm:col-span-2" error={formErrors.name}>
                    <input
                      className={cn(fieldClass, formErrors.name && "border-rose-500")}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Contoh: Laptop MacBook Pro M3"
                    />
                  </Field>
                  <Field label="Nomor Register" required error={formErrors.noRegister}>
                    <input
                      className={cn(fieldClass, formErrors.noRegister && "border-rose-500")}
                      value={form.noRegister}
                      onChange={(e) => setForm({ ...form, noRegister: e.target.value })}
                      placeholder="Contoh: 0001"
                    />
                  </Field>
                  <Field label="Kode Barang" required error={formErrors.kodeBarang}>
                    <input
                      className={cn(fieldClass, formErrors.kodeBarang && "border-rose-500")}
                      value={form.kodeBarang}
                      onChange={(e) => setForm({ ...form, kodeBarang: e.target.value })}
                      placeholder="Contoh: 3.1.01.01"
                    />
                  </Field>
                </div>

                <hr className="border-slate-200/60" />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Kategori Utama" required error={formErrors.category}>
                    <select
                      className={cn(fieldClass, formErrors.category && "border-rose-500")}
                      value={form.category}
                      onChange={(e) => onCategoryChange(e.target.value)}
                    >
                      <option value="" disabled>
                        Pilih Kategori Utama
                      </option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Sub Kategori" required error={formErrors.subCategory}>
                    <select
                      className={cn(fieldClass, formErrors.subCategory && "border-rose-500")}
                      value={form.subCategory}
                      onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
                    >
                      <option value="" disabled>
                        {form.category ? "Pilih Sub Kategori" : "Pilih Kategori Utama Dahulu"}
                      </option>
                      {formSubs.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="No. Pabrik / Rangka / Mesin">
                    <input
                      className={fieldClass}
                      value={form.noPabrik}
                      onChange={(e) => setForm({ ...form, noPabrik: e.target.value })}
                      placeholder="Kosongkan jika tidak ada"
                    />
                  </Field>
                  <Field label="No. Polisi (Kendaraan)">
                    <input
                      className={fieldClass}
                      value={form.noPolisi}
                      onChange={(e) => setForm({ ...form, noPolisi: e.target.value })}
                      placeholder="Contoh: B 1234 CD"
                    />
                  </Field>
                </div>

                <hr className="border-slate-200/60" />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <Field label="Asal Usul" required className="lg:col-span-2" error={formErrors.asalUsul}>
                    <select
                      className={cn(fieldClass, formErrors.asalUsul && "border-rose-500")}
                      value={form.asalUsul}
                      onChange={(e) => setForm({ ...form, asalUsul: e.target.value })}
                    >
                      <option value="" disabled>
                        Pilih Asal Usul
                      </option>
                      {ASAL_USUL.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Kuantitas" required error={formErrors.qty}>
                    <input
                      type="number"
                      min={1}
                      className={cn(fieldClass, formErrors.qty && "border-rose-500")}
                      value={form.qty}
                      onChange={(e) =>
                        setForm({ ...form, qty: Number(e.target.value) || 0 })
                      }
                    />
                  </Field>
                  <Field label="Kondisi" required error={formErrors.condition}>
                    <select
                      className={cn(fieldClass, formErrors.condition && "border-rose-500")}
                      value={form.condition}
                      onChange={(e) => setForm({ ...form, condition: e.target.value })}
                    >
                      <option value="" disabled>
                        {form.category ? "Pilih Status" : "Pilih Kategori Utama Dahulu"}
                      </option>
                      {formConds.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="Tahun Pembelian" required error={formErrors.tahun}>
                    <input
                      type="number"
                      min={1900}
                      max={2100}
                      className={cn(fieldClass, formErrors.tahun && "border-rose-500")}
                      value={form.tahun}
                      onChange={(e) => setForm({ ...form, tahun: e.target.value })}
                    />
                  </Field>
                  <Field label="Harga Satuan (Rp)" required error={formErrors.price}>
                    <input
                      type="number"
                      min={0}
                      className={cn(fieldClass, formErrors.price && "border-rose-500")}
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: Number(e.target.value) || 0 })
                      }
                    />
                  </Field>
                  <Field label="Lokasi / Penempatan">
                    <input
                      className={fieldClass}
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="Contoh: Ruang IT"
                    />
                  </Field>
                </div>
              </div>
            </div>
            <div className="z-10 flex justify-end gap-3 border-t border-slate-100 bg-white px-6 py-5 sm:px-8">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={validateAndSave}
                disabled={saveMutation.isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-bold text-white shadow-glow hover:bg-brand-700 disabled:opacity-60"
              >
                {saveMutation.isPending ? "Menyimpan..." : "Simpan Data"}
                <Save className="size-4" />
              </button>
            </div>
          </div>
        </Modal>
      ) : null}

      {detailAsset ? (
        <Modal onClose={() => setDetailAsset(null)}>
          <div className="flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl">
            <div className="print-hide sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/50 px-6 py-5 backdrop-blur-xl sm:px-8">
              <h3 className="flex items-center gap-3 text-xl font-extrabold text-slate-800">
                <span className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                  <Info className="size-5" />
                </span>
                Detail Aset
              </h3>
              <CloseBtn onClick={() => setDetailAsset(null)} />
            </div>
            <AssetDetailBody asset={detailAsset} />
            <div className="print-hide z-10 flex justify-end gap-3 border-t border-slate-100 bg-white px-6 py-5 sm:px-8">
              <button
                type="button"
                onClick={() => setDetailAsset(null)}
                className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => printDetail(detailAsset)}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-6 py-2.5 text-sm font-bold text-white shadow-glow hover:bg-slate-900"
              >
                Cetak Detail
                <Printer className="size-4" />
              </button>
            </div>
          </div>
        </Modal>
      ) : null}

      {deleteTarget ? (
        <Modal onClose={() => setDeleteTarget(null)}>
          <div className="flex w-full max-w-sm flex-col overflow-hidden rounded-3xl border border-white bg-white shadow-2xl">
            <div className="relative overflow-hidden px-6 py-8 text-center">
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-rose-50 opacity-50" />
              <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-500 shadow-inner">
                <Trash2 className="size-8" />
              </div>
              <h3 className="mb-2 text-xl font-extrabold text-slate-800">Hapus Aset?</h3>
              <p className="text-sm font-medium text-slate-500">
                Hapus <strong>{deleteTarget.name}</strong> secara permanen?
              </p>
            </div>
            <div className="flex gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(deleteTarget.id)}
                className="flex-1 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-200 hover:bg-rose-600 disabled:opacity-60"
              >
                {deleteMutation.isPending ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </Modal>
      ) : null}

      {zoom ? (
        <div className="print-hide fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/95 backdrop-blur-md"
            onClick={() => setZoom(null)}
            aria-label="Tutup"
          />
          <div className="relative z-10 flex max-h-[90vh] w-full max-w-5xl flex-col items-center justify-center">
            <img
              src={zoom.src}
              alt={zoom.title}
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl ring-1 ring-white/10"
            />
            <p className="mt-5 rounded-full border border-white/10 bg-slate-800/50 px-4 py-2 text-lg font-bold text-white backdrop-blur-sm">
              {zoom.title}
            </p>
          </div>
        </div>
      ) : null}

      <div id="detail-print-root" className="hidden">
        {printAsset ? (
          <div className="bg-white p-8">
            <div className="mb-6 border-b-2 border-slate-800 pb-4 text-center">
              <h1 className="text-2xl font-extrabold tracking-widest text-slate-900 uppercase">
                Detail Informasi Aset
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Dicetak pada: {printedAt || formatDateTime()}
              </p>
            </div>
            <AssetDetailBody asset={printAsset} compact />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  tone: "brand" | "good" | "repair";
}) {
  const tones = {
    brand: "bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white",
    good: "bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white",
    repair: "bg-rose-50 text-rose-500 group-hover:bg-rose-500 group-hover:text-white",
  };
  return (
    <div className="group flex items-center gap-5 overflow-hidden rounded-2xl border border-white bg-white/80 p-6 shadow-soft backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
      <div
        className={cn(
          "flex h-16 w-16 items-center justify-center rounded-2xl transition-colors duration-300",
          tones[tone],
        )}
      >
        {icon}
      </div>
      <div>
        <p className="mb-1 text-sm font-bold tracking-wider text-slate-400 uppercase">
          {label}
        </p>
        <p className="text-4xl font-extrabold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function IconBtn({
  children,
  title,
  className,
  onClick,
}: {
  children: ReactNode;
  title: string;
  className?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn("rounded-xl p-2", className)}
    >
      {children}
    </button>
  );
}

function CloseBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl bg-slate-50 p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
      aria-label="Tutup"
    >
      <X className="size-5" />
    </button>
  );
}

function Modal({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="print-hide fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Tutup dialog"
      />
      <div className="relative z-10 w-full max-w-max">{children}</div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
  className,
  error,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  error?: boolean;
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label} {required ? <span className="text-rose-500">*</span> : null}
      </label>
      {children}
      {error ? <p className="mt-1 text-xs font-medium text-rose-500">Wajib diisi</p> : null}
    </div>
  );
}

function AssetDetailBody({ asset, compact }: { asset: Asset; compact?: boolean }) {
  return (
    <div className={cn("flex-grow overflow-y-auto bg-slate-50/30 px-6 py-6 sm:px-8", compact && "bg-white p-0")}>
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="w-full flex-shrink-0 md:w-1/3">
          <div className="rounded-2xl border border-slate-100 bg-white p-2 shadow-sm">
            {asset.image ? (
              <img
                src={asset.image}
                alt={asset.name}
                className="w-full rounded-xl bg-slate-50 object-cover"
              />
            ) : (
              <div className="flex aspect-square w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-400">
                <ImageIcon className="mb-2 size-10" />
                <span className="text-sm font-medium">Tidak ada foto</span>
              </div>
            )}
          </div>
          <div className="mt-4 text-center">
            <ConditionBadge condition={asset.condition} />
          </div>
        </div>
        <div className="w-full md:w-2/3">
          <div className="mb-6">
            <p className="mb-1 text-xs font-bold tracking-wider text-brand-600 uppercase">
              {asset.id}
            </p>
            <h2 className="text-2xl font-extrabold text-slate-800">{asset.name}</h2>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-5 text-sm sm:grid-cols-2">
            <DetailItem label="Kategori Utama" value={asset.category} />
            <DetailItem label="Sub Kategori" value={asset.subCategory} />
            <DetailItem label="No. Register" value={asset.noRegister} />
            <DetailItem label="Kode Barang" value={asset.kodeBarang} />
            <DetailItem label="No. Pabrik / Mesin" value={asset.noPabrik || "-"} />
            <DetailItem label="No. Polisi" value={asset.noPolisi || "-"} />
            <DetailItem label="Asal Usul" value={asset.asalUsul} />
            <DetailItem label="Tahun Pembelian" value={asset.tahun} />
            <DetailItem label="Lokasi / Penempatan" value={asset.location || "-"} />
            <DetailItem label="Kuantitas" value={`${asset.qty} Unit`} />
          </div>
          <div className="mt-8 flex flex-col justify-between gap-4 rounded-2xl border border-brand-100 bg-brand-50/50 p-5 sm:flex-row">
            <div>
              <p className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
                Harga Satuan
              </p>
              <p className="text-lg font-bold text-slate-800">{formatRupiah(asset.price)}</p>
            </div>
            <div className="sm:text-right">
              <p className="mb-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
                Total Nilai Aset
              </p>
              <p className="text-xl font-extrabold text-brand-600">
                {formatRupiah(asset.price * asset.qty)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-0.5 font-medium text-slate-500">{label}</p>
      <p className="font-bold text-slate-800">{value}</p>
    </div>
  );
}
