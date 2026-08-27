create table if not exists assets (
  id text primary key,
  no_register text not null,
  kode_barang text not null,
  no_pabrik text not null default '',
  no_polisi text not null default '',
  name text not null,
  category text not null,
  sub_category text not null,
  asal_usul text not null,
  qty integer not null check (qty >= 1),
  price integer not null check (price >= 0),
  condition text not null,
  location text not null default '',
  tahun text not null,
  image text,
  created_at timestamptz not null default now()
);

create index if not exists assets_category_idx on assets (category);
create index if not exists assets_tahun_idx on assets (tahun);
create index if not exists assets_created_at_idx on assets (created_at desc);

insert into assets (
  id, no_register, kode_barang, no_pabrik, no_polisi, name,
  category, sub_category, asal_usul, qty, price, condition, location, tahun
) values
  (
    'AST-2026-001', '0001', '3.1.02.01', 'M3-2024-X', '',
    'Laptop MacBook Pro M3', 'Peralatan dan Mesin', 'Peralatan Komputer TI',
    'Pembelian', 2, 25000000, 'Baik', 'Ruang IT / Lantai 2', '2026'
  ),
  (
    'AST-2026-002', '0015', '3.1.04.05', 'HONDA-2991', 'KT 1234 A',
    'Motor Operasional Honda Vario', 'Peralatan dan Mesin', 'Kendaraan',
    'Hibah', 1, 22000000, 'Baik', 'Parkiran Kantor', '2024'
  ),
  (
    'AST-2026-003', '0008', '2.1.01.01', '', '',
    'Gedung Kantor Utama', 'Tanah dan Bangunan', 'Bangunan',
    'Pembelian', 1, 1850000000, 'Baik', 'Kompleks Perkantoran', '2018'
  ),
  (
    'AST-2026-004', '0022', '3.1.05.02', 'EPSON-L3210', '',
    'Printer Epson L3210', 'Peralatan dan Mesin', 'Alat Kantor dan Rumah Tangga',
    'Pembelian', 4, 3200000, 'Rusak Ringan', 'Ruang Administrasi', '2023'
  ),
  (
    'AST-2026-005', '0101', '5.2.01.03', '', '',
    'Lisensi Microsoft 365 Business', 'Aset Tak Berwujud', 'Lisensi Perangkat Lunak',
    'Pembelian', 25, 890000, 'Aktif', 'Divisi IT', '2025'
  ),
  (
    'AST-2026-006', '0030', '3.1.06.01', 'UBNT-AP-09', '',
    'Access Point Kantor Lantai 1', 'Peralatan dan Mesin', 'Alat Komunikasi dan Studio',
    'Pembelian', 6, 1750000, 'Rusak Berat', 'Gudang IT', '2021'
  )
on conflict (id) do nothing;
