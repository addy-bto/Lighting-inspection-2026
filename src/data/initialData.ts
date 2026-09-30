import { ZoneData, InspectorProfile, InspectorName, ZoneRegion, InspectionStatus, SiteStatus } from '../types';

export const INSPECTORS: Record<string, InspectorProfile> = {
  Nusir: {
    name: 'Nusir',
    role: 'Senior Lighting Specialist',
    color: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      text: 'text-emerald-700',
      border: 'border-emerald-300',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      hex: '#059669',
    },
    totalZones: 7,
    totalSites: 52,
    completedSites: 48,
    phone: '+60 12-345 6781',
    email: 'nusir.insp@bigtree.com.my',
  },
  Yana: {
    name: 'Yana',
    role: 'Field Inspection Engineer',
    color: {
      bg: 'bg-purple-50 text-purple-800 border-purple-200',
      text: 'text-purple-700',
      border: 'border-purple-300',
      badgeBg: 'bg-purple-100 text-purple-800',
      hex: '#7c3aed',
    },
    totalZones: 5,
    totalSites: 62,
    completedSites: 58,
    phone: '+60 13-987 6542',
    email: 'yana.insp@bigtree.com.my',
  },
  Fadrul: {
    name: 'Fadrul',
    role: 'Infrastructure Maintenance Tech',
    color: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      text: 'text-amber-700',
      border: 'border-amber-300',
      badgeBg: 'bg-amber-100 text-amber-800',
      hex: '#d97706',
    },
    totalZones: 7,
    totalSites: 44,
    completedSites: 40,
    phone: '+60 17-234 5673',
    email: 'fadrul.insp@bigtree.com.my',
  },
  Asyaqif: {
    name: 'Asyaqif',
    role: 'Highways & Expressways Specialist',
    color: {
      bg: 'bg-sky-50 text-sky-800 border-sky-200',
      text: 'text-sky-700',
      border: 'border-sky-300',
      badgeBg: 'bg-sky-100 text-sky-800',
      hex: '#0284c7',
    },
    totalZones: 5,
    totalSites: 46,
    completedSites: 44,
    phone: '+60 19-345 6784',
    email: 'asyaqif.insp@bigtree.com.my',
  },
  Ray: {
    name: 'Ray',
    role: 'Regional Audit Lead',
    color: {
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      text: 'text-rose-700',
      border: 'border-rose-300',
      badgeBg: 'bg-rose-100 text-rose-800',
      hex: '#e11d48',
    },
    totalZones: 7,
    totalSites: 74,
    completedSites: 69,
    phone: '+60 11-456 7895',
    email: 'ray.insp@bigtree.com.my',
  },
};

const ZONE_SITE_CONFIG: Record<number, { prefix: string; locations: string[] }> = {
  1: {
    prefix: 'KL',
    locations: [
      'Jalan Bukit Bintang (Hadapan Pavilion KL)',
      'Jalan Raja Chulan (Menara Maybank)',
      'Jalan Sultan Ismail (Monorail Bukit Nanas)',
      'Jalan Ampang (Susur Utama KLCC)',
      'Dataran Merdeka (Persiaran Raja)',
      'Jalan Imbi (Lintasan Monorail)',
      'Jalan Tun Perak (LRT Masjid Jamek)',
    ],
  },
  2: {
    prefix: 'PRL',
    locations: [
      'AKLEH Highway KM 3.2 (Arah Barat)',
      'SUKE Expressway KM 12.5 (Plaza Tol Ampang)',
      'DASH Highway KM 8.1 (Susur Denai Alam)',
      'GUTHRIE Highway KM 5.0 (Plaza Tol Elmina)',
      'MEX Highway Salak South Interchange',
      'Prolintas Central Depot Frontage',
      'Loke Yew Elevated Flyover',
      'SUKE Link Segment A (Kajang Bound)',
      'SUKE Link Segment B (Sri Petaling Bound)',
    ],
  },
  3: {
    prefix: 'AMP',
    locations: [
      'Ampang Point Susur Keluar MRR2',
      'Jalan Ampang Utama (Hospital Ampang Puteri)',
      'Bukit Bintang Commercial Strip',
      'Jalan Pandan Utama (Pandan Indah)',
      'MRR2 Ampang Exit Flyover',
      'Jalan Merdeka Ampang Jaya',
      'Flamington Road Corner',
    ],
  },
  4: {
    prefix: 'BNG',
    locations: [
      'Jalan Maarof (Pintu Masuk BSC)',
      'Jalan Telawi 3 (Kawasan Komersial)',
      'Bangsar Utama Stesen LRT',
      'Jalan Bangsar Main Arterial',
      'Jalan RTM Angkasapuri Ramp',
      'Pantai Dalam Elevated Link',
      'Jalan Kerinchi (Bangsar South Entrance)',
      'Mid Valley Link Flyover',
      'Jalan Arunasalam Intersection',
      'Jalan Laksamana Ramp',
      'Jalan Universiti Intersection',
      'Federal Highway Bangsar Exit',
    ],
  },
  5: {
    prefix: 'OKR',
    locations: [
      'Jalan Klang Lama KM 2.1 (Jambatan Sungai Klang)',
      'Batu 3 1/2 Old Klang Road',
      'Mid Valley Flyover Ramp',
      'Taman Desa Intersection',
      'Jalan Seputeh Junction',
    ],
  },
  6: {
    prefix: 'CHR',
    locations: [
      'Cheras Highway KM 5.2 (Plaza Tol Cheras)',
      'Taman Connaught Flyover Interchange',
      'Jalan Loke Yew Arterial Road',
      'Cheras Hartamas Main Entry',
      'Taman Segar Commercial Link',
      'Bandar Tun Razak Exit Ramp',
      'Cheras Selatan Toll Plaza',
      'MRR2 Cheras Interchange',
      'Bandar Sri Permaisuri Hub',
      'Cheras Awana Main Road',
      'Balakong Link Expressway',
    ],
  },
  7: {
    prefix: 'PJ',
    locations: [
      'PJ State Seksyen 52 (Menara MBPJ)',
      'Jalan Barat PJ (Hotel Hilton)',
      'Jalan Utara PJ Interchange',
      'Seksyen 14 Commercial Hub',
      'SS2 Commercial Centre',
      'Jalan Sultan PJ Crossing',
      'Taman Jaya Lake Park Frontage',
    ],
  },
  8: {
    prefix: 'PJ',
    locations: [
      'SS2/24 Main Arterial Road',
      'Damansara Utama Uptown (Jalan SS21/1)',
      'Jalan SS22/25 Damansara Jaya',
      'Atria Shopping Gallery Crossing',
      'Kayu Ara Riverbank Link',
      'SPRINT Damansara Exit Ramp',
      'Seksyen 17 Market Square',
      'Jalan Universiti PJ Boundary',
      'Taman Bahagia LRT Station',
      'Kelana Jaya Park Link',
    ],
  },
  9: {
    prefix: 'FED',
    locations: [
      'Federal Highway KM 12.5 (Arah Barat)',
      'Federal Highway KM 13.0 (Arah Timur)',
      'Subang Jaya Interchange Ramp',
      'Batu Tiga Toll Plaza Approach',
      'Lorong Motosikal Subang Ramp A',
      'Lorong Motosikal Subang Ramp B',
      'Subang Parade Exit Ramp',
      'Sunway Pyramid Flyover Link',
      'Glenmarie Industrial Ramp',
      'Federal Highway KM 15.2',
      'Federal Highway KM 16.0',
      'Federal Highway KM 17.1',
      'Federal Highway KM 18.0',
      'Federal Highway KM 19.5',
      'Federal Highway KM 20.2',
      'Federal Highway KM 21.0',
      'Federal Highway KM 22.4',
    ],
  },
  10: {
    prefix: 'KUR',
    locations: [
      'Jambatan Sungai Klang (KM 24.1)',
      'Susur Masuk Bandar Klang (Pintu Gerbang)',
      'Persiaran Raja Muda Musa (KM 2.0)',
      'Persiaran Bukit Raja (Junction)',
      'Simpang Jalan Meru',
      'Jalan Kapar Interchange',
      'Jalan Tengku Kelana (Heritage Walk)',
      'Port Klang Highway (KM 1.5)',
      'Persiaran Botanik Exit Ramp',
      'Plaza Tol Sungai Rasau Approach',
      'Pandamaran Roundabout',
      'Jambatan Teluk Pulai',
      'Jalan Istana Klang Intersection',
      'Bukit Tinggi Commercial Center',
      'Klang Parade Frontage',
      'West Port Highway Access',
    ],
  },
  11: {
    prefix: 'SPR',
    locations: [
      'Sprint Highway Damansara Link KM 1',
      'Plaza Tol Bukit Kiara Canopy',
      'Mont Kiara Exit Ramp',
      'Sri Hartamas Crossing',
      'Jalan Semantan Overhead Flyover',
      'Pusat Bandar Damansara Station',
      'Sprint Highway KM 4.5',
      'Kerinchi Link North Portal',
      'Kerinchi Link South Portal',
    ],
  },
  12: {
    prefix: 'SPR',
    locations: [
      'Kerinchi Link Elevated Viaduct A',
      'Kerinchi Link Elevated Viaduct B',
      'Pantai Hillpark Access Ramp',
      'Bukit Gasing Tunnel Entrance',
      'Sprint Expressway Toll Plaza B',
      'Phileo Damansara Interchange',
      'Jalan SS21 Damansara Exit',
      'TTDI Flyover Ramp',
      'Sprint Highway KM 7.2',
    ],
  },
  13: {
    prefix: 'DUT',
    locations: [
      'Jalan Duta Flyover Overpass',
      'Semantan Underpass Lighting',
      'Istana Negara Gate Approach',
      'Jalan Tuanku Abdul Halim Interchange',
      'Kompleks Kerajaan Jalan Duta',
      'MAHSA Avenue Junction',
      'Damansara Heights Ramp',
      'Penchala Link Junction Ramp',
      'Bukit Tunku Access Road',
    ],
  },
  14: {
    prefix: 'PNC',
    locations: [
      'Penchala Tunnel Portal West (Inbound)',
      'Penchala Tunnel Interior Segment A',
      'Penchala Tunnel Interior Segment B',
      'Penchala Tunnel Portal East (Outbound)',
      'Mont Kiara Toll Plaza Access',
      'Kampung Sungai Penchala Flyover',
      'Taman Tun Dr Ismail Access',
      'Penchala Elevated Structure KM 2.1',
      'Penchala Link KM 3.5 Exit',
    ],
  },
  15: {
    prefix: 'MRR',
    locations: [
      'MRR2 North Loop KM 18.2',
      'Batu Caves Roundabout Flyover',
      'Gombak Toll Plaza Approach',
      'UAM / Wangsa Maju Interchange',
      'Ampang Jaya Exit Ramp',
      'Pandan Indah Flyover',
      'Cheras MRR2 Overhead Bridge',
      'Bandar Tasik Selatan Interchange',
    ],
  },
  16: {
    prefix: 'KPG',
    locations: [
      'Jalan Kepong Main Trunk',
      'Metro Prima MRT Station Link',
      'Kepong Baru Commercial Strip',
      'Taman Sri Sinar Interchange',
      'Desa ParkCity Entrance Roundabout',
      'Kepong Industrial Park Access',
      'Jalan Kuching Kepong Flyover',
      'Jinjang Utara Crossing',
      'Taman Wahyu Boundary Pole',
    ],
  },
  17: {
    prefix: 'KLI',
    locations: [
      'KLIA Expressway KM 1.5 (Airport Approach)',
      'KLIA Terminal 1 Departure Ramp',
      'KLIA Terminal 2 Arrival Access',
      'Cargo Terminal High-Mast Lighting',
      'Sepang Circuit Junction',
      'Mitsui Outlet Park Entrance',
      'KLIA Mosque Roundabout',
      'KLIA Central Maintenance Complex',
      'Salak Tinggi Link Road',
      'Bandar Enstek Border Ramp',
      'KLIA South Perimeter Road',
    ],
  },
  18: {
    prefix: 'ELT',
    locations: [
      'E6 Elite Expressway KM 5.0',
      'Shah Alam Toll Plaza Approach',
      'USJ Toll Interchange Ramp',
      'Putra Heights Flyover Bridge',
      'Bandar Saujana Putra Exit',
      'KLIA East Highway Link',
      'Elite Expressway KM 12.4',
      'Elite Highway KM 18.0',
      'Nilai Utama Link Ramp',
    ],
  },
  19: {
    prefix: 'ELT',
    locations: [
      'Elite South Section KM 22.1',
      'Saujana Putra Interchange',
      'Gamuda Cove Entrance Ramp',
      'Cyberjaya South Toll Plaza',
      'Dengkil Rest Area (R&R)',
      'Elite Expressway KM 28.5',
      'Bandar Enstek Interchange',
      'Nilai Toll Plaza Exit',
    ],
  },
  20: {
    prefix: 'SHA',
    locations: [
      'Seksyen 7 Shah Alam Commercial Strip',
      'Persiaran Sukan (Stadium Shah Alam)',
      'Federal Highway Shah Alam Ramp',
      'Seksyen 13 Commercial Hub',
      'Persiaran Kayangan Intersection',
      'Persiaran Masjid (Masjid Negeri)',
    ],
  },
  21: {
    prefix: 'GUT',
    locations: [
      'Guthrie Corridor Expressway (GCE) KM 3.0',
      'Elmina Toll Plaza Approach',
      'Bukit Jelutong North Interchange',
      'Denai Alam Junction Ramp',
      'Lagong Toll Plaza Access',
    ],
  },
  22: {
    prefix: 'MEX',
    locations: [
      'MEX Highway Salak South Interchange',
      'Seri Kembangan Toll Plaza',
      'Putrajaya Toll Plaza Approach',
      'Cyberjaya North Access Highway',
    ],
  },
  23: {
    prefix: 'LDP',
    locations: [
      'LDP KM 1.2 Kelana Jaya Link',
      'LDP KM 4.5 Damansara Utama Uptown',
      'LDP KM 8.0 SS2 Flyover',
      'LDP KM 12.1 Taman Bahagia Bridge',
      'LDP KM 15.0 Sunway Toll Plaza',
      'LDP KM 18.2 Puchong Jaya Flyover',
      'LDP KM 21.0 IOI Mall Crossing',
      'LDP KM 24.5 Bandar Puteri Interchange',
      'LDP KM 27.0 Puchong Utama Toll',
      'LDP KM 30.1 Seri Kembangan Link',
      'LDP KM 32.5 Cyberjaya Entrance',
      'LDP TTDI Tunnel Segment',
      'LDP Sunway Mentari Viaduct',
      'LDP Kelana Centre Point Ramp',
      'LDP Paradigm Mall Ramp',
    ],
  },
  24: {
    prefix: 'NPE',
    locations: [
      'NPE Elevated Highway KM 2.0 (Pantai)',
      'Plaza Tol PJS 2 (Arah Barat)',
      'Plaza Tol PJS 5 (Arah Timur)',
      'Sunway Pyramid NPE Interchange',
      'Kuchai Lama Link Flyover',
      'Bangsar South NPE Access',
      'Pantai Dalam Elevated Portal',
      'NPE KM 8.5 Subang Bound',
      'NPE KM 11.2 Mid Valley Bound',
      'PJS 8 Mentari Crossing',
      'NPE Salak South Junction',
      'Taman Medan Exit Ramp',
      'Subang Jaya NPE Boundary',
      'Old Klang Road NPE Connector',
    ],
  },
  25: {
    prefix: 'NKV',
    locations: [
      'NKVE Jalan Duta Toll Plaza Entrance',
      'NKVE KM 28.5 Bukit Lanjan Junction',
      'NKVE Jalan Duta Flyover Overpass',
      'Damansara Toll Plaza Approach',
      'Subang NKVE Interchange',
      'Shah Alam NKVE Toll Entrance',
      'Setia Alam Interchange Flyover',
      'Bukit Raja Toll Plaza',
      'NKVE KM 15.2 Petaling Jaya',
      'NKVE KM 21.0 Kota Damansara Exit',
    ],
  },
  26: {
    prefix: 'NKV',
    locations: [
      'Subang Toll Plaza Canopy Lights',
      'Glenmarie Industrial Park Exit',
      'Ara Damansara NKVE Link',
      'SAAS Airport Highway Junction',
      'NKVE KM 11.5 Subang Bound',
      'Bukit Jelutong Access Ramp',
      'Guthrie NKVE Interchange',
      'Subang Jaya Section 13 Link',
      'Federal Highway NKVE Connector',
    ],
  },
  27: {
    prefix: 'MET',
    locations: [
      'East-West Link Expressway KM 1.0',
      'Salak Expressway Toll Plaza',
      'Taman Connaught Metramac Flyover',
      'Cheras Metramac Interchange',
      'Mid Valley Metramac Connector',
      'Salak South Station Entrance',
      'Metramac Elevated Segment B',
    ],
  },
  28: {
    prefix: 'SGB',
    locations: [
      'Sungai Besi PLUS Toll Plaza Approach',
      'Sungai Besi High-Mast Pole 1',
      'Sungai Besi High-Mast Pole 2',
      'Bandar Tasik Selatan Entrance Ramp',
      'PLUS Highway KM 310.5',
    ],
  },
  29: {
    prefix: 'BES',
    locations: [
      'Besraya Highway Shamelin Stretch',
      'Besraya Toll Plaza Mines',
      'Pandan Indah Besraya Link',
      'Kerdau Elevated Flyover',
      'Serdang Besraya Interchange',
      'Sungai Besi LRT Link',
      'Besraya Highway KM 8.2',
    ],
  },
  30: {
    prefix: 'BNI',
    locations: [
      'Bangi PLUS Toll Entrance',
      'Persiaran Kemajuan Bandar Baru Bangi',
      'UKM Bangi Intersection',
      'Bangi Section 9 Commercial Centre',
      'Persiaran Bandar Bangi South',
    ],
  },
  31: {
    prefix: 'KTA',
    locations: [
      'Ara Damansara Township Main Road',
      'Kota Damansara Flyover Interchange',
      'Persiaran Surian (Sunway Giza)',
      'Persiaran Tropicana Crossing',
      'Dataran Sunway Commercial Hub',
      'Ara Damansara LRT Station Access',
      'Persiaran Mahogani Kota Damansara',
      'Kota Damansara Toll Plaza',
      'Subang Bestari Boundary Pole',
    ],
  },
};

// Helper function to generate mock site details for each zone
const ZONE_1_EXACT_SITES: Array<{ siteCode: string; name: string }> = [
  { siteCode: 'P0001', name: 'Jalan Kuching ke Jalan Kinabalu berhampiran Kondo Putra Villa (P0001)' },
  { siteCode: 'UP0001', name: 'Jalan Tun Razak (Hadapan IJN / HKL) - Site UP0001' },
  { siteCode: 'UP0002', name: 'Jalan Sultan Ismail / Persimpangan Jalan Ampang - Site UP0002' },
  { siteCode: 'KUR0002', name: 'Jalan Kuching ke Jalan Kinabalu berhampiran Kondo Putra Villa' },
  { siteCode: 'KUR0062', name: 'Jalan Kuching menuju ke Jalan Kinabalu/Jalan Sultan Ismail' },
  { siteCode: 'KJ0012-1', name: 'Laluan Putra LRT dari Puduraya ke Brickfields berhampiran Pasar Seni' },
  { siteCode: 'KJ0012-2', name: 'Laluan Putra LRT dari Puduraya ke Brickfields berhampiran Pasar Seni' },
  { siteCode: 'KJ0012-3', name: 'Laluan Putra LRT dari Brickfields ke Puduraya berhampiran Pasar Seni' },
  { siteCode: 'KJ0012-4', name: 'Laluan Putra LRT dari Brickfields ke Puduraya berhampiran Pasar Seni' },
  { siteCode: 'KJ0149', name: 'Di Jalan Ampang(Jejantas pejalan kaki berhampiran Stesen Dang Wangi)' },
];

const ZONE_2_EXACT_SITES: Array<{ siteCode: string; name: string }> = [
  { siteCode: 'PL0001', name: 'KM0.00 Jejambat di jalan susur masuk ke Lebuhraya PROLINTAS dari Jalan Sultan Ismail' },
  { siteCode: 'PL0002', name: 'KM1.65 Jejambat di laluan susur keluar ke Jalan Tun Razak di Lebuhraya PROLINTAS' },
  { siteCode: 'PL0004', name: 'KM1.95 (A) Di laluan Lebuhraya PROLINTAS merentangi laluan baru bertingkat Jalan Tun Razak' },
  { siteCode: 'PL0005', name: 'KM1.95 (B) Jejambat di laluan Lebuhraya Prolintas merentangi laluan baru bertingkat Jln Tun Razak' },
  { siteCode: 'PL0013', name: 'KM7.50 (underpass) Jejambat di laluan Lebuhraya Prolintas merentangi Jln Ampang' },
  { siteCode: 'PL0034', name: 'KM0.00 Jejambat dari jalan susur masuk ke Lebuhraya PROLINTAS dari Jalan Sultan Ismail' },
  { siteCode: 'PL0035', name: "Dinding Bangunan Tol Plaza Dato' Keramat, Lebuhraya Prolintas" },
  { siteCode: 'PL0036', name: "Di Lebuhraya Prolintas berhampiran Plaza Toll Dato' Keramat dari Ampang menuju ke KL" },
  { siteCode: 'KJ0081', name: 'Di laluan Putra LRT merentangi Lebuhraya Prolintas berhampiran Tol Plaza' },
];

const ZONE_3_EXACT_SITES: Array<{ siteCode: string; name: string }> = [
  { siteCode: 'BT0391', name: 'Jalan Imbi, dari Raja Chulan menuju ke Bukit Bintang, Kuala Lumpur' },
  { siteCode: 'BT0641 (KJ0077)', name: 'Di Jejantas pejalan kaki berhampiran stesen Jelatek di Jalan Jelatek' },
  { siteCode: 'BT0640 (KJ0149)', name: 'Di jejantas pejalan kaki berhampiran stesen Dang Wangi di Jln Ampang' },
  { siteCode: 'KJ0158', name: 'Dinding Stesen Rapid KL ,Jalan Jelatek' },
  { siteCode: 'UP0068', name: 'Jln Ampang berhampiran Kompleks Ampang Point' },
  { siteCode: 'UP0090', name: 'Jalan Kinabalu/ Jalan Bandar Pusat Seni Dewan Bandaraya KL' },
  { siteCode: 'WGT-250', name: 'Jln Raja Muda Abdul Aziz/ Stadium TPCA, Kampung Baru' },
];

const ZONE_4_EXACT_SITES: Array<{ siteCode: string; name: string }> = [
  { siteCode: 'KJ0073', name: 'Laluan Putra LRT di Jalan Maarof menuju ke Mid Valley' },
  { siteCode: 'KJ0096', name: 'Di laluan stesen PUTRA LRT Kerinchi / Lebuhraya Persekutuan' },
  { siteCode: 'KJ0002', name: 'Di jejambat pejalan kaki stesen Abdullah Hukum di Jalan Bangsar' },
  { siteCode: 'KJ0082', name: 'Jejambat sebelum memasuki stesen KL Sentral dari Bangsar' },
  { siteCode: 'KJ0085', name: 'Selepas jalan keluar dari stesen KL Sentral menuju ke tempat letak kereta KL Sentral' },
  { siteCode: 'KJ0011', name: 'Laluan Putra LRT dari Jalan Damansara menuju ke Istana Negara/Sg. Besi' },
  { siteCode: 'NPE0004', name: 'Jalan Pantai Bahru' },
  { siteCode: 'SP0028', name: 'Di tetiang Jalan Pantai Baru/ Bangsar berdekatan UM (Pillar 4)' },
  { siteCode: 'SP0029', name: 'Di tetiang Jalan Pantai Baru/ Bangsar berdekatan UM (Pillar 5)' },
  { siteCode: 'SP0030', name: 'Di tetiang Jalan Pantai Baru/ Bangsar berdekatan UM (Pillar 6)' },
  { siteCode: 'SP0031', name: 'Di tetiang Jalan Pantai Baru/ Bangsar berdekatan UM (Pillar 7)' },
  { siteCode: 'SP0032', name: 'Di tetiang Jalan Pantai Baru/ Bangsar berdekatan UM (Pillar 8)' },
];

const ZONE_5_EXACT_SITES: Array<{ siteCode: string; name: string }> = [
  { siteCode: 'KL-041A', name: 'Jln Hujan Emas/ Jln Awan Besar/ Right, Kuala Lumpur' },
  { siteCode: 'BT0486', name: 'Jalan Hujan Emas / Jalan Klang Lama, Taman Yarl (kiri)' },
  { siteCode: 'BT0487', name: 'Jalan Hujan Emas / Jalan Kelang Lama, Taman Yarl (kanan)' },
  { siteCode: 'BT0489', name: 'Jalan Puchong berhampiran Kem Tentera Kinrara' },
  { siteCode: 'AP0583', name: 'Jejambat Pejalan Kaki Stesen LRT IOI Puchong Jaya,Lebuhraya Damansara Puchong' },
  { siteCode: 'BT0498', name: 'Di Lebuhraya Damansara Puchong / Jalan Kampung Kenangan' },
  { siteCode: 'KL-076', name: 'Jln Puchong/ Simpang Jln Kinrara, Kuala Lumpur' },
];

const ZONE_6_EXACT_SITES: Array<{ siteCode: string; name: string }> = [
  { siteCode: 'BT0473', name: 'KM C3.0 di Pesimpangan Salak Selatan dari Jln Sg Besi Lama menuju ke Salak Selatan (To KL nb)' },
  { siteCode: 'BT0475', name: 'Di Taman Connaught yang merentangi Lebuhraya Timur-Barat' },
  { siteCode: 'BT0476', name: 'Jejambat dari Taman Connaught menuju ke Bandar Tun Razak' },
  { siteCode: 'BT0477', name: 'KM C6.3 Lebuhraya Timur-Barat (East-West Link) dari Tol Plaza Metramac ke Taman Connaught' },
  { siteCode: 'BT0478', name: 'KM C7.7 Di Lebuhraya Timur-Barat (East-West Link) Dari Taman Connaught ke Tol Plaza Metramac' },
  { siteCode: 'ME0003', name: 'KM2.35 Lebuhraya KL-Putrajaya merentangi Jalan Loke Yew' },
  { siteCode: 'BT0473', name: 'KM C3.0 di Pesimpangan Salak Selatan dari Jln Sg Besi Lama menuju ke Salak Selatan' },
  { siteCode: 'BT0054', name: 'Di Jejambat Lebuhraya Persekutuan dari Salak South menuju ke mid Valley' },
  { siteCode: 'BT0588', name: 'Di Jalan Cheras/ Jalan Loke Yew KL' },
  { siteCode: 'BT0711', name: 'Di Jalan Cheras near BHP petrol Station/ Taman Midah MRT Station,Cheras' },
  { siteCode: 'WGT-264', name: 'Jejambat Jalan Cheras/MRR2 (heading towards Sri Petaling)' },
];

const ZONE_7_EXACT_SITES: Array<{ siteCode: string; name: string }> = [
  { siteCode: 'KJ0063', name: 'Laluan PUTRA LRT di Jalan Timur, Berdekatan Dengan Amcorp Mall dan Stesen Taman Jaya' },
  { siteCode: 'KJ0007', name: 'Laluan PUTRA LRT dari Jalan Semangat/Seksyen 14 menuju ke persimpangan Federal Highway' },
  { siteCode: 'KUR0081', name: 'Di Persimpangan Jalan Semangat / Jalan Utara berhampiran SMK (L) BB, PJ' },
  { siteCode: 'BT0012', name: 'Di Persimpangan Jalan Semangat / Jalan Utara berhampiran SMK (L) BB, PJ' },
  { siteCode: 'KUR0051', name: 'Jalan Utara - Jalan Bukit 11/2, PJ.' },
  { siteCode: 'KUR0091', name: 'Jln Gasing berhadapan Rumah Kedai & Stesen Minyak BHP. Site 1' },
  { siteCode: 'KUR0092', name: 'Jln Gasing berhadapan Rumah Kedai & Stesen Minyak BHP. Site 2' },
];

const ZONE_8_EXACT_SITES: Array<{ siteCode: string; name: string }> = [
  { siteCode: 'UP0022-2', name: 'Jalan 17/1, Petaling Jaya. Berhampiran Jalan Universiti.' },
  { siteCode: 'SEL-125', name: 'Persimpangan Jalan Universiti, Jalan 17/1A.' },
  { siteCode: 'KUR0122', name: 'Jalan Universiti / Jalan 17/1' },
  { siteCode: 'UP0002', name: 'Jalan 19/8, Jalan Harapan, Petaling Jaya' },
  { siteCode: 'UP0001', name: 'Jalan 19/8, Jalan Harapan, Petaling Jaya' },
  { siteCode: 'KUR0098', name: 'Jalan 19/8, menghala ke SS2' },
  { siteCode: 'KUR0097', name: 'Jalan 19/8 menuju ke Bulatan Rothmans, Petaling Jaya' },
  { siteCode: 'KUR0063', name: 'Jalan SS2/24, Berhampiran Sekolah Jnis Keb (Cina) Puay Chai' },
  { siteCode: 'UP0027', name: 'Jalan 21/34, Jalan SS2/16, Berhampiran Sek. Men. Keb. Taman Sea.' },
  { siteCode: 'UP0022-1', name: 'Jalan 17/1, Petaling Jaya. Berhampiran Jalan Universiti.' },
  { siteCode: 'UP0030', name: 'Jalan Dato Abdul Aziz/Jalan 14/20 Petaling Jaya' },
];

const ZONE_9_EXACT_SITES: Array<{ siteCode: string; name: string }> = [
  { siteCode: 'SP0045', name: 'KM6.65, Lebuhraya Persekutuan/ Kerinchi Link (ke KL)' },
  { siteCode: 'SP0046', name: 'KM6.65, Lebuhraya Persekutuan/ Kerinchi Link (ke PJ)' },
  { siteCode: 'KUR0014', name: 'Lebuhraya Persekutuan, Astaka Kompleks' },
  { siteCode: 'KJ0006', name: 'Di laluan PUTRA LRT dari Shah Alam menuju ke Kuala Lumpur berhampiran Hotel Armada/PJ Hilton' },
  { siteCode: 'KUR0016', name: 'Di Lebuhraya Persekutuan, Jalan 51/205, berhampiran Jalan 222/ Lam Soon' },
  { siteCode: 'KUR0017', name: 'Di Jalan 51A/205, berhampiran Bangunan Ford' },
  { siteCode: 'BT0655', name: 'KM18.00 KL menuju ke Shah Alam/ Klang, Lebuhraya Persekutuan 2' },
  { siteCode: 'BT0654', name: 'KM15.10 KL menuju ke Shah Alam/ Klang, Lebuhraya Persekutuan 2' },
  { siteCode: 'BT0648', name: 'KM15.00 Jalan Batu Tiga/ Sungai Buloh merentangi Lebuhraya Persekutuan' },
  { siteCode: 'EL0012', name: 'Lebuhraya Elite merentangi FHR2 di KM 2.40' },
  { siteCode: 'BT0653', name: 'KM14.30 KL menuju ke Shah Alam/ Klang Lebuhraya Persekutuan 2' },
  { siteCode: 'UP0574', name: 'Bulatan Melawati/ Lebuhraya Persekutuan 2, Seksyen 12, Shah Alam' },
  { siteCode: 'BT0310', name: 'Persiaran Raja Muda melintasi Lebuhraya Persekutuan 2 berhampiran UiTM, Shah Alam' },
];

const ZONE_10_EXACT_SITES: Array<{ siteCode: string; name: string }> = [
  { siteCode: 'KJ0013', name: 'Di laluan PUTRA LRT dari Kuala Lumpur menuju ke PJ berhampiran Kg. Kerinchi' },
  { siteCode: 'TRC-006', name: 'Lebuhraya Persekutuan berdekatan Plaza Pantai/ Kg. Kerinchi' },
  { siteCode: 'WGT-247', name: 'Lebuhraya Persekutuan/ Flyover ke Tmn Seputeh' },
  { siteCode: 'BT0196', name: 'Di atas bumbung Bangunan Sonali di Lebuhraya Mahameru menuju ke KL Sentral/Muzium Negara' },
  { siteCode: 'KUR0057', name: 'Jln Syed Putra berhampiran Kg. Attap/ Bangunan Public Bank' },
  { siteCode: 'KUR0058', name: 'Jln Syed Putra berhampiran Bangunan UMBC/ Wisma Tun Sambanthan' },
  { siteCode: 'KJ0066', name: 'Laluan Putra LRT dari Jalan Kinabalu menuju ke Jalan Sultan Hishamuddin' },
  { siteCode: 'SP0020', name: 'Di Tetiang Lebuhraya Persekutuan/ Kerinchi Link, Lebuhraya Sprint (1)' },
  { siteCode: 'SP0021', name: 'Di Tetiang Lebuhraya Persekutuan/ Kerinchi Link, Lebuhraya Sprint (2)' },
  { siteCode: 'SP0022', name: 'Di Tetiang Lebuhraya Persekutuan/ Kerinchi Link, Lebuhraya Sprint (3)' },
  { siteCode: 'SP0023', name: 'Di Tetiang Lebuhraya Persekutuan/ Kerinchi Link, Lebuhraya Sprint (4)' },
  { siteCode: 'SP0024', name: 'Di Tetiang Lebuhraya Persekutuan/ Kerinchi Link, Lebuhraya Sprint (5)' },
  { siteCode: 'BT0710', name: 'Di JalanSyed Putra/Lebuhraya Persekutuan berhampiran Mid Valley..' },
  { siteCode: 'SP0026', name: 'Paparan iklan di Tetiang Lebuhraya Persekutuan/ Kerinchi Link, Lebuhraya Sprint (5)' },
  { siteCode: 'SP0015', name: 'KM 5.1 WB, Berhampiran Jalan Susur dari Mid Valley (KL ke PJ)' },
  { siteCode: 'SP0016', name: 'KM 5.1 WB, Berhampiran Jalan Susur dari Mid Valley (PJ ke KL)' },
];

const ZONE_11_EXACT_SITES: Array<{ siteCode: string; name: string }> = [
  { siteCode: 'UP0035', name: 'Di Persimpangan Lebuhraya Sprint / Jalan SS23/23, Persiaran Petaling Jaya' },
  { siteCode: 'SP0052', name: 'KM0.55 persimpangan Kayu Ara, PJ- Site 1' },
  { siteCode: 'SP0053', name: 'KM0.55 persimpangan Kayu Ara, PJ- Site 2' },
  { siteCode: 'SP0054', name: 'KM0.55 persimpangan Kayu Ara, PJ- Site 3' },
  { siteCode: 'SP0002', name: 'Persimpangan Damansara Jaya Lebuhraya Sprint' },
  { siteCode: 'KUR0055', name: 'Jalan Tanjung Bandar Utama, near Riana Green Condo, PJ.' },
  { siteCode: 'KUR0012', name: 'Jalan SS21/64 & Jalan SS21/33, berdekatan Balai Polis Damansara' },
  { siteCode: 'SP0036', name: 'KM 2.0 SRJK (C) Damansara Intan, Lebuhraya Sprint' },
  { siteCode: 'SP0012', name: 'KM 2.05 Berhampiran Damansara Intan, Jalan Damansara, KL' },
];

const ZONE_12_EXACT_SITES: Array<{ siteCode: string; name: string }> = [
  { siteCode: 'SP0011', name: 'KM4.1, Jalan Damansara/ persimpangan Sec 16, Sprint' },
  { siteCode: 'SP0038', name: 'KM4.05 Persimpangan Jalan Dato Abu Bakar, Lebuhraya Sprint' },
  { siteCode: 'SP0010', name: 'Jalan 17/1, Jalan Damansara Berhampiran Seksyen 16 Reservoir' },
  { siteCode: 'SP0042', name: 'KM2.60, Jalan Damansara/ TTDI menghala ke KL Lebuhraya Sprint' },
  { siteCode: 'BT0590', name: 'Di Jalan Damansara menuju ke One Utama/ berhampiran Pasar Besar TTDI' },
  { siteCode: 'KUR0059', name: 'Jalan Damansara/Taman Tun Dr. Ismail, bdktn Pizza Hut.' },
  { siteCode: 'UP0599', name: 'Di Jalan Damansara menuju ke One Utama/ berhadapan Balai Bomba' },
  { siteCode: 'SEL-332', name: 'Di Jalan Damansara menuju ke One Utama/ berhadapan Ambank' },
  { siteCode: 'SP0043', name: 'KM2.60 (wb) Jalan Damansara/ TTDI (KL-Damansara), Sprint' },
  { siteCode: 'SP0069 (KGPA0004)', name: 'Jalan Damansara/ Bukit Kiara - Tapak D' },
  { siteCode: 'SP0004', name: 'Jalan Damansara/ persimpangan Kiara Lebuhraya Sprint' },
];

const ZONE_13_EXACT_SITES: Array<{ siteCode: string; name: string }> = [
  { siteCode: 'KUR0125', name: 'KM 6.55 East Bound, Maarof Interchange, Sprint Highway' },
  { siteCode: 'SP0057', name: "Bukit Kiara Interchange, KM5.9 (Facing Traffic from KL-D'sara)" },
  { siteCode: 'SP0033', name: 'KM 5.8 infront of Victoria Station, Medan Damansara' },
  { siteCode: 'SP0013', name: 'KM 5.75, Jalan Damansara, near Victoria Station' },
  { siteCode: 'KL-050', name: 'Jln Semantan/Jln Duta, Kuala Lumpur' },
  { siteCode: 'PS0419', name: 'KM31.40 Jalan Duta Plaza Toll' },
  { siteCode: 'BT0709', name: 'Lebuhraya Sultan Iskandar/ Jalan Bukit Tunku' },
  { siteCode: 'KL-051', name: 'Jejambat Jalan Tun Razak/ Jalan Ipoh' },
  { siteCode: 'PS0419', name: 'KM31.40 Jalan Duta Plaza Toll' },
];

const ZONE_14_EXACT_SITES: Array<{ siteCode: string; name: string }> = [
  { siteCode: 'BT0614', name: 'Di Lebuhraya Persekutuan, susur masuk ke Lebuhraya Kerinchi (Universiti Malaya)' },
  { siteCode: 'KUR0127', name: 'Bukit Kiara Interchange, Sprint Highway' },
  { siteCode: 'SP0035', name: 'INTAN, Jln Bkt Kiara/ Sri Hartamas' },
  { siteCode: 'SP0034', name: 'Sek. Men. Sri Hartamas, Jln Bkt Kiara' },
  { siteCode: 'SP0040', name: 'KM 2.2, Sri Hartamas Interchange, Jln Bukit Kiara, Kerinci Link' },
  { siteCode: 'SP0049', name: 'At the OHB, KM 2.2 Sri Hartamas Interchange, Jln Bkt Kiara, Kerinci Link' },
  { siteCode: 'SP0050', name: 'At the OHB, KM 2.2 Sri Hartamas Interchange, Jln Bkt Kiara, Kerinci Link' },
  { siteCode: 'KUR0060', name: 'KM 4.35, Sprint Penchala Link, near Penchala Tunnel from LDP' },
  { siteCode: 'KUR0072', name: 'On side Of OHB at KM 5.3, Penchala Link, SPRINT Highway - Site 4,5 & 6' },
  { siteCode: 'KUR0073', name: 'On side Of OHB at KM 5.3, Penchala Link, SPRINT Highway - Site 4,5 & 6' },
  { siteCode: 'KUR0074', name: 'On side Of OHB at KM 5.3, Penchala Link, SPRINT Highway - Site 4,5 & 6' },
  { siteCode: 'KUR0069', name: 'On side Of OHB at KM 5.3, Penchala Link, SPRINT Highway - Site 1,2 & 3' },
  { siteCode: 'KUR0071', name: 'On side Of OHB at KM 5.3, Penchala Link, SPRINT Highway - Site 1,2 & 3' },
  { siteCode: 'KUR0072', name: 'On side Of OHB at KM 5.3, Penchala Link, SPRINT Highway - Site 1,2 & 3' },
];

const ZONE_15_EXACT_SITES: Array<{ siteCode: string; name: string }> = [
  { siteCode: 'KUR0037', name: 'Junction of Jln Lingkaran Tgh/Jln Perusahaan/Jln Bt. Caves' },
  { siteCode: 'KUR0038', name: 'Junct of Jln Lingkaran Tengah II/Jln Perusahaan/Jln Batu Caves infront of Batu Caves Indian Temple' },
  { siteCode: 'KUR0039', name: 'MRRII, near East Coast Highway Interchange/Tmn Sri Gombak, Selayang' },
  { siteCode: 'KUR0040', name: 'MRRII Intersection, near Taman Desa Minang, Batu Caves, Selayang' },
  { siteCode: 'KUR0041', name: 'Selayang-Kepong Highway Intersection, near Taman Bidara, Selayang' },
  { siteCode: 'KUR0042', name: "After Selayang-Kepong H'way Intersection, Prima Selayang Ind. Park" },
  { siteCode: 'KUR0043', name: 'Jalan SMI, Sunway Batu Caves / MRR II, Selayang CTV Site' },
  { siteCode: 'KUR0044', name: "Before Selayang-Kepong H'way Intersection,near Prima Selayang Ind. Park" },
];

const ZONE_16_EXACT_SITES: Array<{ siteCode: string; name: string }> = [
  { siteCode: 'KUR0075', name: 'On Sides of OHB at Jln Sg. Buloh/Jln Kepong,near Kompleks Desa-Site 1' },
  { siteCode: 'KUR0076', name: 'On Sides of OHB at Jln Sg. Buloh/Jln Kepong,near Kompleks Desa-Site 2' },
  { siteCode: 'KUR0077', name: 'On Sides of OHB at Jln Sg. Buloh/Jln Kepong,near Kompleks Desa-Site 3' },
  { siteCode: 'KUR0078', name: 'On Sides of OHB at Jln Sg. Buloh/Jln Kepong,near Kompleks Desa-Site 4' },
  { siteCode: 'KUR0079', name: 'On Sides of OHB at Jln Sg. Buloh/Jln Kepong,near Kompleks Desa-Site 5' },
  { siteCode: 'KUR0080', name: 'On Sides of OHB at Jln Sg. Buloh/Jln Kepong,near Kompleks Desa-Site 6' },
  { siteCode: 'WGT263', name: 'Jejambat Jln Damansara/Jln Travers, Kuala Lumpur' },
  { siteCode: 'BT0488', name: 'Di bulatan Mergastua / Stesen Keretapi Kepong' },
  { siteCode: 'KUR0003', name: 'Jalan Kuching (near by MRR2, Kg. Bt Caves)' },
];

const ZONE_17_EXACT_SITES: Array<{ siteCode: string; name: string }> = [
  { siteCode: 'UP0073', name: 'Di KM A2.4, KLIA Expressway (Lot 9174, Projek Felcra Bukit Serdang, Sepang Selangor)' },
  { siteCode: 'SEL331A', name: 'KM A4.20 (NB) Elite Highway to KLIA (Solar LED)' },
  { siteCode: 'BT0584', name: 'KM A 3.9 (Southbound)' },
  { siteCode: 'BT0583', name: 'KM A 3.9 (Southbound)' },
  { siteCode: 'BT0388', name: 'KM A4.50 Di Jejambat dari Plaza Tol KLIA menuju ke KLIA' },
  { siteCode: 'KUR0028', name: 'KM A 4.65 (Southbound)' },
  { siteCode: 'KUR0034', name: 'KM A 5.05, (Southbound)' },
  { siteCode: 'KUR0029', name: 'KM A 5.15 (Southbound)' },
  { siteCode: 'KUR0030', name: 'KM A 5.4 (Southbound)' },
  { siteCode: 'EL0053', name: 'KM A5.90 Dari Plaza Tol KLIA menuju ke KLIA' },
  { siteCode: 'SEL323C', name: 'KLIA/3km after Toll Plaza, Selangor' },
];

const ZONE_18_EXACT_SITES: Array<{ siteCode: string; name: string }> = [
  { siteCode: 'KJ0220', name: 'Paparan iklan di laluan Putra LRT, dari Persimpangan Seafield menuju ke Persimpangan USJ di KM 8.00' },
  { siteCode: 'EL0130', name: 'KM 7.95 Seafield I/C menuju KLIA, Elite' },
  { siteCode: 'EL0055', name: 'KM10.50 (nb) Jejantas dr persimpangan Putrajaya (UEP) ke USJ I/C - (To Shah Alam)' },
  { siteCode: 'EL0034', name: 'KM11.90 (sb) Dari persimpangan Putrajaya menuju ke persimpangan USJ (UEP)' },
  { siteCode: 'BT0242', name: 'KM11.90 (nb) Dari persimpangan Putrajaya menuju ke persimpangan USJ (UEP)' },
  { siteCode: 'EL0056', name: 'KM13.20 (sb) I/C Putra Heights' },
  { siteCode: 'EL0123', name: 'KM14.00 (nb) Dari persimpangan Putrajaya menuju ke persimpangan USJ' },
  { siteCode: 'EL0170', name: 'KM16.40 I/C Saujana Putra Elite' },
  { siteCode: 'EL0100', name: 'KM19.80 Di persimpangan KLIA' },
];

const ZONE_19_EXACT_SITES: Array<{ siteCode: string; name: string }> = [
  { siteCode: 'EL0097', name: 'KM21.20 (sb) Di persimpangan Putrajaya' },
  { siteCode: 'EL0057', name: 'KM21.20 Di Jejambat persimpangan Putrajaya' },
  { siteCode: 'EL0124', name: 'KM22.90 (nb) Dari persimpangan KLIA ke persimpangan Putrajaya berhampiran Kawasan Rehat Dengkil' },
  { siteCode: 'EL0102', name: 'KM26.00 (nb) Dari persimpangan KLIA menuju ke persimpangan Putrajaya' },
  { siteCode: 'EL0021', name: 'KM28.00 (sb) Dari persimpangan Putrajaya menuju ke persimpangan KLIA' },
  { siteCode: 'EL0096', name: 'KM29.70 (nb) Dari persimpangan KLIA ke persimpangan Putrajaya (Heading towards Shah Alam)' },
  { siteCode: 'EL0063', name: 'KM A1.75 (sb) Dari persimpangan KLIA menuju ke Plaza Tol KLIA' },
  { siteCode: 'EL0103', name: 'KM A1.65 (nb) berhampiran dengan Plaza Tol KLIA' },
];

const ZONE_20_EXACT_SITES: Array<{ siteCode: string; name: string }> = [
  { siteCode: 'TRC/MMC-020', name: 'Jalan Sungai Buluh junction to Giant Hypermarket,Shah Alam' },
  { siteCode: 'TRC/MMC-021', name: 'Jalan Sungai Buluh junction to Giant Hypermarket,Shah Alam' },
  { siteCode: 'UP0048', name: 'Di Jalan Subang / Jalan Subang Lama ke TTDI Jaya, Shah Alam' },
  { siteCode: 'KUR0099', name: 'Di persimpangan Kuala Selangor /Jalan subang Utama berhampiran Stesen Minyak BHP' },
  { siteCode: 'KUR0100', name: 'Di persimpangan Kuala Selangor /Jalan subang Utama berhampiran Stesen Minyak BHP' },
];

const ZONE_21_EXACT_SITES: Array<{ siteCode: string; name: string }> = [
  { siteCode: 'GT0003', name: 'KM2.30 at Jelutong Sentral I/C' },
  { siteCode: 'GT0007', name: 'KM9.00 at Bukit Subang I/C' },
  { siteCode: 'GT0009', name: 'KM11.60 at Elmina I/C' },
  { siteCode: 'GT0016', name: 'KM21.2 Di Persimpangan Lagong.' },
  { siteCode: 'GT0019', name: 'KM2.30 Di Persimpangan Jelutong Sentral' },
  { siteCode: 'PS0488', name: 'KM452.05 Dari persimpangan Rawang menuju ke persimpangan Sungai Buloh' },
  { siteCode: 'PS0631', name: 'KM440.45 Dari persimpangan Rawang menuju ke persimpangan Sungai Buaya' },
];

const ZONE_22_EXACT_SITES: Array<{ siteCode: string; name: string }> = [
  { siteCode: 'BT0498', name: 'Lebuhraya Damansara Puchong / Jln Kampung Perahu (From Puchong)' },
  { siteCode: 'KUR0020', name: 'At KM15.8, LDP- near Icon City, Petaling Jaya' },
  { siteCode: 'KUR0021', name: 'KM 18.8, Lebuhraya Damansara-Puchong, near Sunway Toll Plaza' },
  { siteCode: 'KUR0049', name: 'LDP/Jalan SS4B/10, near Sekolah Menengah Kelana Jaya.' },
  { siteCode: 'KUR0050', name: 'LDP/Jalan SS4B/10, near Sekolah Menengah Kelana Jaya.' },
  { siteCode: 'KUR0052', name: 'Junction of Jalan SS24/2 - Jalan SS24/9, Taman Megah, PJ.' },
  { siteCode: 'KUR0064', name: 'Junction of Jln SS 21/56 dan LDP, near BP petrol station, D/sara Utama' },
  { siteCode: 'KUR0117-1', name: 'LDP Highway / SS25, Taman Mayang, PJ. (To Damansara)' },
  { siteCode: 'KUR0117-2', name: 'LDP Highway / SS25, Taman Mayang, PJ. (To Puchong)' },
  { siteCode: 'KJ0065', name: 'Di jejantas pejalan kaki dari Kelana Jaya menuju ke Jalan SS2/Damansara' },
  { siteCode: 'KJ0076', name: 'Laluan PUTRA LRT dr Kelana Jaya menuju ke Damansara berhampiran simpang ke Seksyen SS25' },
  { siteCode: 'UP0035', name: 'Di Persimpangan Lebuhraya Sprint/ Jalan SS23/23, Persiaran Petaling Jaya' },
  { siteCode: 'UP0576-1', name: 'Jalan SS25/ Taman Mayang, LDP PJ' },
  { siteCode: 'UP0576-2', name: 'Jalan SS25/ Taman Mayang, LDP PJ' },
  { siteCode: 'UP0008', name: 'Lebuhraya Damansara-Puchong' },
  { siteCode: 'UP0009', name: 'LDP/ Simpang Jalan SS24/9, Taman Megah, PJ' },
];

const ZONE_23_EXACT_SITES: Array<{ siteCode: string; name: string }> = [
  { siteCode: 'BT0498', name: 'Lebuhraya Damansara Puchong / Jln Kampung Perahu (From Puchong)' },
  { siteCode: 'KUR0020', name: 'At KM15.8, LDP- near Icon City, Petaling Jaya' },
  { siteCode: 'KUR0021', name: 'KM 18.8, Lebuhraya Damansara-Puchong, near Sunway Toll Plaza' },
  { siteCode: 'KUR0049', name: 'LDP/Jalan SS4B/10, near Sekolah Menengah Kelana Jaya.' },
  { siteCode: 'KUR0050', name: 'LDP/Jalan SS4B/10, near Sekolah Menengah Kelana Jaya.' },
  { siteCode: 'KUR0052', name: 'Junction of Jalan SS24/2 - Jalan SS24/9, Taman Megah, PJ.' },
  { siteCode: 'KUR0064', name: 'Junction of Jln SS 21/56 dan LDP, near BP petrol station, D/sara Utama' },
  { siteCode: 'KUR0117-1', name: 'LDP Highway / SS25, Taman Mayang, PJ. (To Damansara)' },
  { siteCode: 'KUR0117-2', name: 'LDP Highway / SS25, Taman Mayang, PJ. (To Puchong)' },
  { siteCode: 'KJ0065', name: 'Di jejantas pejalan kaki dari Kelana Jaya menuju ke Jalan SS2/Damansara' },
  { siteCode: 'KJ0076', name: 'Laluan PUTRA LRT dr Kelana Jaya menuju ke Damansara berhampiran simpang ke Seksyen SS25' },
  { siteCode: 'UP0035', name: 'Di Persimpangan Lebuhraya Sprint/ Jalan SS23/23, Persiaran Petaling Jaya' },
  { siteCode: 'UP0576-1', name: 'Jalan SS25/ Taman Mayang, LDP PJ' },
  { siteCode: 'UP0576-2', name: 'Jalan SS25/ Taman Mayang, LDP PJ' },
  { siteCode: 'UP0008', name: 'Lebuhraya Damansara-Puchong' },
  { siteCode: 'UP0009', name: 'LDP/ Simpang Jalan SS24/9, Taman Megah, PJ' },
];

const ZONE_24_EXACT_SITES: Array<{ siteCode: string; name: string }> = [
  { siteCode: 'KUR0019-1', name: 'Junc of Jln PJS 10/7 & Jln PJS 10/2, near NPE & Sunway, Petaling Jaya' },
  { siteCode: 'KUR0019-2', name: 'Junc of Jln PJS 10/7 & Jln PJS 10/2, near NPE & Sunway, Petaling Jaya' },
  { siteCode: 'KUR0099', name: 'Cross junct. of Persiaran K. Selangor/Jln Subang Utama, near BHP Station' },
  { siteCode: 'KUR0100', name: 'Cross junct. of Persiaran K. Selangor/Jln Subang Utama/ near BHP Station' },
  { siteCode: 'NPE0001', name: 'KM 1.85, New Pantai Expressway, Subang Jaya' },
  { siteCode: 'NPE0002', name: 'KM 1.6 New Pantai Expressway, Subang Jaya' },
  { siteCode: 'NPE0003', name: 'KM 0.4 New Pantai Expressway, Subang Jaya' },
  { siteCode: 'KJ0218', name: 'Persiaran Jengka berhampiran First subang mall, subang jaya' },
  { siteCode: 'KJ0222', name: 'Di Jejambat laluan Putra LRT berhampiran stesen LRT SS15, Subang jaya' },
  { siteCode: 'KJ0223', name: 'Laluan Putra LRT, Persimpangan persiaran Kemajuan Subang/Persiaran Jengka,Subang Jaya' },
  { siteCode: 'KJ0224', name: 'Laluan Putra LRT, Persiaran Kewajipan berdekatan The Summit,USJ,Subang Jaya' },
  { siteCode: 'KJ0227', name: 'Di persiaran Kewajipan berdekatan Da Men Mall,USJ,Subang Jaya' },
];

const ZONE_25_EXACT_SITES: Array<{ siteCode: string; name: string }> = [
  { siteCode: 'BT0440', name: 'KM22.90 Jalan Duta menuju ke Shah Alam/ Sungai Buloh' },
  { siteCode: 'BT0441', name: 'KM23.90 Jalan Duta menujue ke Shah Alam/ Sungai Buloh' },
  { siteCode: 'KUR0018', name: 'KM 20.35 NKVE' },
  { siteCode: 'PS0414', name: 'KM24.40 (nb-offside) Jalan Duta - Damansara / Sg. Buloh, NKVE.' },
  { siteCode: 'PS0415', name: 'KM25.50 (sb) Bukit Lanjan - Jalan Duta Plaza Toll, NKVE' },
  { siteCode: 'PS0418', name: 'KM29.20 (sb) Jalan Duta I/C' },
  { siteCode: 'PS0557', name: 'KM19.70 Persilangan Kota Damansara' },
  { siteCode: 'SP0039', name: 'KM 0.5 Persimpangan Jalan Duta Lebuhraya Sprint' },
  { siteCode: 'KL-050', name: 'Jln Semantan/Jln Duta, Kuala Lumpur' },
];

const ZONE_26_EXACT_SITES: Array<{ siteCode: string; name: string }> = [
  { siteCode: 'PS0395', name: 'KM13.90 Subang I/C' },
  { siteCode: 'PS0399', name: 'KM13.90 (wb) Subang I/C' },
  { siteCode: 'PS0405', name: 'KM17.20 (sb) Damansara I/C' },
  { siteCode: 'KJ0001', name: 'Dilaluan PUTRA LRT dr persimpangan Damansara menuju ke persimpangan Subang NKVE' },
  { siteCode: 'BT0407', name: 'KM17.20 selepas Plaza Tol Damansara berhampiran dengan Jejambat Bandar Utama' },
  { siteCode: 'BT0766', name: 'KM17.20 selepas Plaza Tol Damansara berhampiran dengan Jejambat Bandar Utama' },
  { siteCode: 'BT0767', name: 'KM17.20 selepas Plaza Tol Damansara berhampiran dengan Jejambat Bandar Utama' },
  { siteCode: 'PS0866', name: 'KM 3.30 (nb) Setia Alam I/C' },
  { siteCode: 'PS0871', name: 'KM3.30 Setia Alam I/C, NKVE' },
];

const ZONE_27_EXACT_SITES: Array<{ siteCode: string; name: string }> = [
  { siteCode: 'BT0514', name: 'Di Persimpangan Lebuhraya KL - Seremban dan Lebuhraya Metramac' },
  { siteCode: 'ME0006', name: 'Di Persimpangan Kuchai Lama dari Kuala Lumpur menuju ke Seremban' },
  { siteCode: 'BT0586 (MC0058)', name: 'Di Persimpangan Kuchai Lama KM D2.4 dari Seremban menuju ke KL.' },
  { siteCode: 'BS0004', name: 'KM13.4 Lebuhraya Sg. Besi merentangi Lebuhraya KL-Seremban' },
  { siteCode: 'BT0663 (MC0012)', name: 'Di Lebuhraya KL-Seremban dari Pusat Bandar/ Kuala Lumpur menuju ke Plaza Tol Sungai Besi' },
  { siteCode: 'BT0665 (MC0066)', name: 'Dari Seremban/Plaza Tol Sungai Besi menuju ke Salak South/Pusat Bandar' },
  { siteCode: 'BT0585', name: 'Di Jejambat Lebuhraya Kuala Lumpur -Seremban berhampiran  Mint Hotel di KM D7.7' },
];

const ZONE_28_EXACT_SITES: Array<{ siteCode: string; name: string }> = [
  { siteCode: 'PS0729', name: 'KM 309.40 SB Di Lebuhraya Kuala Lumpur - Seremban' },
  { siteCode: 'PS0728', name: 'KM 309.00 SB Di Lebuhraya Kuala Lumpur - Seremban' },
  { siteCode: 'PS0507', name: 'KM 306.80 Di Lebuhraya Kuala Lumpur - Seremban' },
  { siteCode: 'BS0001', name: 'KM1.0, Lebuhraya Sg Besi' },
  { siteCode: 'BT0239', name: 'KM 305.40 Di Jejambat Dari Persimpangan UPM Menuju ke Plaza Tol Sg. Besi' },
];

const ZONE_29_EXACT_SITES: Array<{ siteCode: string; name: string }> = [
  { siteCode: 'BS0002', name: 'KM 1.0 Lebuhraya Sg. Besi' },
  { siteCode: 'BS0003', name: 'KM 3.0 Lebuhraya Sg. Besi' },
  { siteCode: 'KUR0045', name: 'Jalan Balakong/Jalan Dulang, infront of The Mines Resort Entrance' },
  { siteCode: 'KUR0061', name: 'KM 6.3, Lebuhraya Sungei Besi' },
  { siteCode: 'PS0078', name: 'KM 302.80 Di Persimpangan Kajang' },
  { siteCode: 'BT0508', name: 'KM302.10 NB dari Persimpangan Bangi menuju ke Persimpangan Kajang' },
  { siteCode: 'BT0582', name: 'Di KM 8.80 ,dari Kg Pandan Jaya menuju ke Salak Selatan,Lebuhraya Besraya' },
];

const ZONE_30_EXACT_SITES: Array<{ siteCode: string; name: string }> = [
  { siteCode: 'TRC/MMC-023', name: 'Persiaran Kemajuan & Persiaran Pusat Bandar, near Okumura Metal' },
  { siteCode: 'SEL-303', name: 'KM 296.00 SB Lebuhraya Utara-Selatan/ Kg Teras Jenang Bangi' },
  { siteCode: 'SEL-165', name: 'KM 296.00 (sb) Kg. Teras Jernang/KL-Seremban Hway/Bangi' },
  { siteCode: 'SEL-165A', name: 'KM 296.00 (nb-offside) Kg. Teras Jernang/KL-Seremban Hway/Bangi' },
  { siteCode: 'BGT-073', name: 'Kampung Teras Jernang/KL-Seremban Highway' },
  { siteCode: 'BT0508', name: 'Di Km 302.10(nb) Dari Persimpangan Bangi ke Persimpangan Kajang berhampiran LLM Bangi' },
];

const ZONE_31_EXACT_SITES: Array<{ siteCode: string; name: string }> = [
  { siteCode: 'BT0594', name: 'Di Jalan PJU1A/1 Ara Damansara Petaling Jaya' },
  { siteCode: 'BT0314', name: 'Di Persiaran Kenanga/ Jalan Camar, Dari Plaza Tol Kota Damansara' },
  { siteCode: 'PS0490', name: 'KM455.90 Di persimpangan Sg Buloh' },
  { siteCode: 'UP0051', name: 'Di Jalan Kuala Selangor/ Jalan Bukit Rahman Putra Sg Buloh' },
  { siteCode: 'UP0600', name: 'Di persimpangan Persiaran Mahogani /Jalan PJU/5/14,Kota Damansara' },
  { siteCode: 'UP0601', name: 'Di persimpangan Persiaran Mahogani /Jalan PJU/5/19,Kota Damansara' },
  { siteCode: 'UP0602', name: 'Di persimpangan Persiaran Mahogani /Jalan PJU/5/19,Kota Damansara' },
  { siteCode: 'KUR0123', name: 'Jalan PJU 1A/3,Ara Damansara, Petaling Jaya' },
  { siteCode: 'KUR0019', name: 'Jalan PJU 1A/3,Ara Damansara, Petaling Jaya' },
  { siteCode: 'MRT058', name: 'Jalan Sungai Buloh ,KG Selamat MRT Station' },
];

const generateSites = (zoneNo: number, count: number, zoneName: string) => {
  const fixtureTypes: Array<'Unipole' | 'Overhead Panel' | 'freestanding' | 'Mini Pole' | 'Gantry arch'> = [
    'Unipole', 'Overhead Panel', 'freestanding', 'Mini Pole', 'Gantry arch'
  ];

  const cfg = ZONE_SITE_CONFIG[zoneNo] || { prefix: 'UP', locations: [] };
  const prefix = cfg.prefix;

  return Array.from({ length: count }, (_, idx) => {
    const siteNum = idx + 1;
    const isDefect = (zoneNo + siteNum) % 9 === 0;
    const isTimerIssue = (zoneNo + siteNum) % 13 === 0;

    let status: SiteStatus = 'Lighted';
    let notes = 'Pencahayaan lengkap dan normal. Visual audit memuaskan.';

    if (isDefect) {
      status = 'Not Lighted';
      notes = 'Lampu tidak menyala. Perlu tindakan teknikal segera.';
    } else if (isTimerIssue) {
      status = 'Partially Lit';
      notes = 'Pencahayaan separa (Partially Lit). Cadangan semakan bekalan pemula.';
    }

    let siteCode = `${prefix}${siteNum.toString().padStart(3, '0')}`;
    let siteLocation = cfg.locations[idx] || `${zoneName} - Site Location #${siteNum}`;

    if (zoneNo === 1 && idx < ZONE_1_EXACT_SITES.length) {
      siteCode = ZONE_1_EXACT_SITES[idx].siteCode;
      siteLocation = ZONE_1_EXACT_SITES[idx].name;
    } else if (zoneNo === 2 && idx < ZONE_2_EXACT_SITES.length) {
      siteCode = ZONE_2_EXACT_SITES[idx].siteCode;
      siteLocation = ZONE_2_EXACT_SITES[idx].name;
    } else if (zoneNo === 3 && idx < ZONE_3_EXACT_SITES.length) {
      siteCode = ZONE_3_EXACT_SITES[idx].siteCode;
      siteLocation = ZONE_3_EXACT_SITES[idx].name;
    } else if (zoneNo === 4 && idx < ZONE_4_EXACT_SITES.length) {
      siteCode = ZONE_4_EXACT_SITES[idx].siteCode;
      siteLocation = ZONE_4_EXACT_SITES[idx].name;
    } else if (zoneNo === 5 && idx < ZONE_5_EXACT_SITES.length) {
      siteCode = ZONE_5_EXACT_SITES[idx].siteCode;
      siteLocation = ZONE_5_EXACT_SITES[idx].name;
    } else if (zoneNo === 6 && idx < ZONE_6_EXACT_SITES.length) {
      siteCode = ZONE_6_EXACT_SITES[idx].siteCode;
      siteLocation = ZONE_6_EXACT_SITES[idx].name;
    } else if (zoneNo === 7 && idx < ZONE_7_EXACT_SITES.length) {
      siteCode = ZONE_7_EXACT_SITES[idx].siteCode;
      siteLocation = ZONE_7_EXACT_SITES[idx].name;
    } else if (zoneNo === 8 && idx < ZONE_8_EXACT_SITES.length) {
      siteCode = ZONE_8_EXACT_SITES[idx].siteCode;
      siteLocation = ZONE_8_EXACT_SITES[idx].name;
    } else if (zoneNo === 9 && idx < ZONE_9_EXACT_SITES.length) {
      siteCode = ZONE_9_EXACT_SITES[idx].siteCode;
      siteLocation = ZONE_9_EXACT_SITES[idx].name;
    } else if (zoneNo === 10 && idx < ZONE_10_EXACT_SITES.length) {
      siteCode = ZONE_10_EXACT_SITES[idx].siteCode;
      siteLocation = ZONE_10_EXACT_SITES[idx].name;
    } else if (zoneNo === 11 && idx < ZONE_11_EXACT_SITES.length) {
      siteCode = ZONE_11_EXACT_SITES[idx].siteCode;
      siteLocation = ZONE_11_EXACT_SITES[idx].name;
    } else if (zoneNo === 12 && idx < ZONE_12_EXACT_SITES.length) {
      siteCode = ZONE_12_EXACT_SITES[idx].siteCode;
      siteLocation = ZONE_12_EXACT_SITES[idx].name;
    } else if (zoneNo === 13 && idx < ZONE_13_EXACT_SITES.length) {
      siteCode = ZONE_13_EXACT_SITES[idx].siteCode;
      siteLocation = ZONE_13_EXACT_SITES[idx].name;
    } else if (zoneNo === 14 && idx < ZONE_14_EXACT_SITES.length) {
      siteCode = ZONE_14_EXACT_SITES[idx].siteCode;
      siteLocation = ZONE_14_EXACT_SITES[idx].name;
    } else if (zoneNo === 15 && idx < ZONE_15_EXACT_SITES.length) {
      siteCode = ZONE_15_EXACT_SITES[idx].siteCode;
      siteLocation = ZONE_15_EXACT_SITES[idx].name;
    } else if (zoneNo === 16 && idx < ZONE_16_EXACT_SITES.length) {
      siteCode = ZONE_16_EXACT_SITES[idx].siteCode;
      siteLocation = ZONE_16_EXACT_SITES[idx].name;
    } else if (zoneNo === 17 && idx < ZONE_17_EXACT_SITES.length) {
      siteCode = ZONE_17_EXACT_SITES[idx].siteCode;
      siteLocation = ZONE_17_EXACT_SITES[idx].name;
    } else if (zoneNo === 18 && idx < ZONE_18_EXACT_SITES.length) {
      siteCode = ZONE_18_EXACT_SITES[idx].siteCode;
      siteLocation = ZONE_18_EXACT_SITES[idx].name;
    } else if (zoneNo === 19 && idx < ZONE_19_EXACT_SITES.length) {
      siteCode = ZONE_19_EXACT_SITES[idx].siteCode;
      siteLocation = ZONE_19_EXACT_SITES[idx].name;
    } else if (zoneNo === 20 && idx < ZONE_20_EXACT_SITES.length) {
      siteCode = ZONE_20_EXACT_SITES[idx].siteCode;
      siteLocation = ZONE_20_EXACT_SITES[idx].name;
    } else if (zoneNo === 21 && idx < ZONE_21_EXACT_SITES.length) {
      siteCode = ZONE_21_EXACT_SITES[idx].siteCode;
      siteLocation = ZONE_21_EXACT_SITES[idx].name;
    } else if (zoneNo === 22 && idx < ZONE_22_EXACT_SITES.length) {
      siteCode = ZONE_22_EXACT_SITES[idx].siteCode;
      siteLocation = ZONE_22_EXACT_SITES[idx].name;
    } else if (zoneNo === 23 && idx < ZONE_23_EXACT_SITES.length) {
      siteCode = ZONE_23_EXACT_SITES[idx].siteCode;
      siteLocation = ZONE_23_EXACT_SITES[idx].name;
    } else if (zoneNo === 24 && idx < ZONE_24_EXACT_SITES.length) {
      siteCode = ZONE_24_EXACT_SITES[idx].siteCode;
      siteLocation = ZONE_24_EXACT_SITES[idx].name;
    } else if (zoneNo === 25 && idx < ZONE_25_EXACT_SITES.length) {
      siteCode = ZONE_25_EXACT_SITES[idx].siteCode;
      siteLocation = ZONE_25_EXACT_SITES[idx].name;
    } else if (zoneNo === 26 && idx < ZONE_26_EXACT_SITES.length) {
      siteCode = ZONE_26_EXACT_SITES[idx].siteCode;
      siteLocation = ZONE_26_EXACT_SITES[idx].name;
    } else if (zoneNo === 27 && idx < ZONE_27_EXACT_SITES.length) {
      siteCode = ZONE_27_EXACT_SITES[idx].siteCode;
      siteLocation = ZONE_27_EXACT_SITES[idx].name;
    } else if (zoneNo === 28 && idx < ZONE_28_EXACT_SITES.length) {
      siteCode = ZONE_28_EXACT_SITES[idx].siteCode;
      siteLocation = ZONE_28_EXACT_SITES[idx].name;
    } else if (zoneNo === 29 && idx < ZONE_29_EXACT_SITES.length) {
      siteCode = ZONE_29_EXACT_SITES[idx].siteCode;
      siteLocation = ZONE_29_EXACT_SITES[idx].name;
    } else if (zoneNo === 30 && idx < ZONE_30_EXACT_SITES.length) {
      siteCode = ZONE_30_EXACT_SITES[idx].siteCode;
      siteLocation = ZONE_30_EXACT_SITES[idx].name;
    } else if (zoneNo === 31 && idx < ZONE_31_EXACT_SITES.length) {
      siteCode = ZONE_31_EXACT_SITES[idx].siteCode;
      siteLocation = ZONE_31_EXACT_SITES[idx].name;
    }

    return {
      id: `z${zoneNo}-s${siteNum}`,
      siteCode,
      name: siteLocation,
      fixtureType: fixtureTypes[siteNum % fixtureTypes.length],
      status,
      luxLevel: status === 'Lighted' ? 120 + ((siteNum * 7) % 35) : 32 + ((siteNum * 3) % 15),
      lastInspectedDate: `2026-08-${(siteNum % 12 + 2).toString().padStart(2, '0')}`,
      notes,
    };
  });
};

export const INITIAL_ZONES: ZoneData[] = [
  {
    id: 1,
    zoneNo: 1,
    description: 'Zone 1 (Kuala Lumpur Area)',
    week2Inspector: 'Nusir',
    week4Inspector: 'Nusir',
    siteCount: 7,
    region: 'Kuala Lumpur / City',
    status: 'Completed',
    week2Status: 'Done',
    week4Status: 'Done',
    defectCount: 1,
    lastInspected: '2026-08-04',
    remarks: 'Central Business District lighting grid verified.',
  },
  {
    id: 2,
    zoneNo: 2,
    description: 'Zone 2 (Prolintas)',
    week2Inspector: 'Nusir',
    week4Inspector: 'Nusir',
    siteCount: 9,
    region: 'Highways & Expressway',
    status: 'Completed',
    week2Status: 'Done',
    week4Status: 'Done',
    defectCount: 0,
    lastInspected: '2026-08-05',
    remarks: 'Elevated highway gantries operating normally.',
  },
  {
    id: 3,
    zoneNo: 3,
    description: 'Zone 3 (Bukit Bintang-Ampang)',
    week2Inspector: 'Nusir',
    week4Inspector: 'Nusir',
    siteCount: 7,
    region: 'Kuala Lumpur / City',
    status: 'In Progress',
    week2Status: 'Done',
    week4Status: 'In Progress',
    defectCount: 1,
    lastInspected: '2026-08-14',
    remarks: 'High density commercial strip. Photocell timer adjusted at Ampang point.',
  },
  {
    id: 4,
    zoneNo: 4,
    description: 'Zone 4 (Bangsar area)',
    week2Inspector: 'Yana',
    week4Inspector: 'Yana',
    siteCount: 12,
    region: 'Kuala Lumpur / City',
    status: 'Completed',
    week2Status: 'Done',
    week4Status: 'Done',
    defectCount: 2,
    lastInspected: '2026-08-15',
    remarks: 'Jalan Maarof main arterial poles checked. 2 bulb replacements logged.',
  },
  {
    id: 5,
    zoneNo: 5,
    description: 'Zone 5 (Jln Klang Lama)',
    week2Inspector: 'Fadrul',
    week4Inspector: 'Fadrul',
    siteCount: 5,
    region: 'Kuala Lumpur / City',
    status: 'Completed',
    week2Status: 'Done',
    week4Status: 'Done',
    defectCount: 0,
    lastInspected: '2026-08-03',
    remarks: 'Old Klang Road bridge & intersection lamps tested.',
  },
  {
    id: 6,
    zoneNo: 6,
    description: 'Zone 6 (Cheras)',
    week2Inspector: 'Fadrul',
    week4Inspector: 'Fadrul',
    siteCount: 11,
    region: 'Kuala Lumpur / City',
    status: 'In Progress',
    week2Status: 'Done',
    week4Status: 'In Progress',
    defectCount: 1,
    lastInspected: '2026-08-16',
    remarks: 'MRR2 interchange & Cheras flyover visual inspection active.',
  },
  {
    id: 7,
    zoneNo: 7,
    description: 'Zone 7 (Petaling Jaya)',
    week2Inspector: 'Yana',
    week4Inspector: 'Yana',
    siteCount: 7,
    region: 'Petaling Jaya & Subang',
    status: 'Completed',
    week2Status: 'Done',
    week4Status: 'Done',
    defectCount: 0,
    lastInspected: '2026-08-04',
    remarks: 'PJ State & Seksyen 14 commercial zone clean.',
  },
  {
    id: 8,
    zoneNo: 8,
    description: 'Zone 8 (Petaling Jaya 2)',
    week2Inspector: 'Yana',
    week4Inspector: 'Yana',
    siteCount: 11,
    region: 'Petaling Jaya & Subang',
    status: 'Completed',
    week2Status: 'Done',
    week4Status: 'Done',
    defectCount: 1,
    lastInspected: '2026-08-06',
    remarks: 'SS2 & Damansara Utama arterial lights functioning.',
  },
  {
    id: 9,
    zoneNo: 9,
    description: 'Zone 9 (Federal Highway 2)',
    week2Inspector: 'Yana',
    week4Inspector: 'Yana',
    siteCount: 13,
    region: 'Highways & Expressway',
    status: 'In Progress',
    week2Status: 'Done',
    week4Status: 'In Progress',
    defectCount: 2,
    lastInspected: '2026-08-17',
    remarks: 'Heavy traffic corridor. Night inspection verified for high mast poles.',
  },
  {
    id: 10,
    zoneNo: 10,
    description: 'Zone 10 (Federal Highway)',
    week2Inspector: 'Yana',
    week4Inspector: 'Yana',
    siteCount: 16,
    region: 'Highways & Expressway',
    status: 'Completed',
    week2Status: 'Done',
    week4Status: 'Done',
    defectCount: 1,
    lastInspected: '2026-08-18',
    remarks: 'Subang Jaya interchange to Klang border checked.',
  },
  {
    id: 11,
    zoneNo: 11,
    description: 'Zone 11 (Sprint Highway)',
    week2Inspector: 'Asyaqif',
    week4Inspector: 'Asyaqif',
    siteCount: 9,
    region: 'Highways & Expressway',
    status: 'Completed',
    week2Status: 'Done',
    week4Status: 'Done',
    defectCount: 0,
    lastInspected: '2026-08-05',
    remarks: 'Damansara link & toll plaza canopy lights ok.',
  },
  {
    id: 12,
    zoneNo: 12,
    description: 'Zone 12 (Sprint Highway 2)',
    week2Inspector: 'Asyaqif',
    week4Inspector: 'Asyaqif',
    siteCount: 11,
    region: 'Highways & Expressway',
    status: 'Completed',
    week2Status: 'Done',
    week4Status: 'Done',
    defectCount: 1,
    lastInspected: '2026-08-07',
    remarks: 'Kerinchi link elevated section inspected.',
  },
  {
    id: 13,
    zoneNo: 13,
    description: 'Zone 13 (Sprint, Semantan Duta)',
    week2Inspector: 'Nusir',
    week4Inspector: 'Nusir',
    siteCount: 9,
    region: 'Highways & Expressway',
    status: 'Completed',
    week2Status: 'Done',
    week4Status: 'Done',
    defectCount: 0,
    lastInspected: '2026-08-08',
    remarks: 'Jalan Duta flyovers & Semantan underpass checked.',
  },
  {
    id: 14,
    zoneNo: 14,
    description: 'Zone 14 (Penchala Link 2)',
    week2Inspector: 'Nusir',
    week4Inspector: 'Nusir',
    siteCount: 14,
    region: 'Highways & Expressway',
    status: 'Completed',
    week2Status: 'Done',
    week4Status: 'Done',
    defectCount: 0,
    lastInspected: '2026-08-09',
    remarks: 'Penchala tunnel illumination & portal lighting verified.',
  },
  {
    id: 15,
    zoneNo: 15,
    description: 'Zone 15 (MRR2)',
    week2Inspector: 'Ray',
    week4Inspector: 'Ray',
    siteCount: 8,
    region: 'Highways & Expressway',
    status: 'Completed',
    week2Status: 'Done',
    week4Status: 'Done',
    defectCount: 1,
    lastInspected: '2026-08-02',
    remarks: 'Middle Ring Road 2 north loop inspected.',
  },
  {
    id: 16,
    zoneNo: 16,
    description: 'Zone 16 (Kepong)',
    week2Inspector: 'Ray',
    week4Inspector: 'Ray',
    siteCount: 9,
    region: 'Kuala Lumpur / City',
    status: 'Completed',
    week2Status: 'Done',
    week4Status: 'Done',
    defectCount: 0,
    lastInspected: '2026-08-04',
    remarks: 'Jalan Kepong & Metro Prima poles clear.',
  },
  {
    id: 17,
    zoneNo: 17,
    description: 'Zone 17 (KLIA)',
    week2Inspector: 'Ray',
    week4Inspector: 'Ray',
    siteCount: 11,
    region: 'South & Outskirts',
    status: 'In Progress',
    week2Status: 'Done',
    week4Status: 'In Progress',
    defectCount: 2,
    lastInspected: '2026-08-16',
    remarks: 'Airport expressway access & terminal approach lights.',
  },
  {
    id: 18,
    zoneNo: 18,
    description: 'Zone 18 (Elite)',
    week2Inspector: 'Ray',
    week4Inspector: 'Ray',
    siteCount: 9,
    region: 'Highways & Expressway',
    status: 'Completed',
    week2Status: 'Done',
    week4Status: 'Done',
    defectCount: 1,
    lastInspected: '2026-08-10',
    remarks: 'E6 North-South Expressway Central Link clear.',
  },
  {
    id: 19,
    zoneNo: 19,
    description: 'Zone 19 (Elite 2)',
    week2Inspector: 'Ray',
    week4Inspector: 'Ray',
    siteCount: 8,
    region: 'Highways & Expressway',
    status: 'Completed',
    week2Status: 'Done',
    week4Status: 'Done',
    defectCount: 0,
    lastInspected: '2026-08-11',
    remarks: 'Elite South section towards Saujana Putra.',
  },
  {
    id: 20,
    zoneNo: 20,
    description: 'Zone 20 (Shah Alam)',
    week2Inspector: 'Nusir',
    week4Inspector: 'Nusir',
    siteCount: 5,
    region: 'Petaling Jaya & Subang',
    status: 'Completed',
    week2Status: 'Done',
    week4Status: 'Done',
    defectCount: 0,
    lastInspected: '2026-08-12',
    remarks: 'Jalan Sungai Buluh & Jalan Subang junctions verified.',
  },
  {
    id: 21,
    zoneNo: 21,
    description: 'Zone 21 (Guthrie)',
    week2Inspector: 'Nusir',
    week4Inspector: 'Nusir',
    siteCount: 7,
    region: 'Highways & Expressway',
    status: 'Completed',
    week2Status: 'Done',
    week4Status: 'Done',
    defectCount: 1,
    lastInspected: '2026-08-13',
    remarks: 'Guthrie Corridor Expressway & Rawang junctions inspected.',
  },
  {
    id: 22,
    zoneNo: 22,
    description: 'Zone 22 (LDP / Damansara Puchong)',
    week2Inspector: 'Fadrul',
    week4Inspector: 'Fadrul',
    siteCount: 16,
    region: 'Highways & Expressway',
    status: 'Completed',
    week2Status: 'Done',
    week4Status: 'Done',
    defectCount: 0,
    lastInspected: '2026-08-04',
    remarks: 'LDP Highway & Petaling Jaya links verified.',
  },
  {
    id: 23,
    zoneNo: 23,
    description: 'Zone 23 (LDP)',
    week2Inspector: 'Ray',
    week4Inspector: 'Ray',
    siteCount: 16,
    region: 'Highways & Expressway',
    status: 'In Progress',
    week2Status: 'Done',
    week4Status: 'In Progress',
    defectCount: 2,
    lastInspected: '2026-08-17',
    remarks: 'Lebuhraya Damansara-Puchong main trunk line audit.',
  },
  {
    id: 24,
    zoneNo: 24,
    description: 'Zone 24 (NPE)',
    week2Inspector: 'Ray',
    week4Inspector: 'Ray',
    siteCount: 12,
    region: 'Highways & Expressway',
    status: 'Completed',
    week2Status: 'Done',
    week4Status: 'Done',
    defectCount: 1,
    lastInspected: '2026-08-15',
    remarks: 'New Pantai Expressway elevated structure ok.',
  },
  {
    id: 25,
    zoneNo: 25,
    description: 'Zone 25 (NKVE-Jln Duta)',
    week2Inspector: 'Asyaqif',
    week4Inspector: 'Asyaqif',
    siteCount: 9,
    region: 'Highways & Expressway',
    status: 'Completed',
    week2Status: 'Done',
    week4Status: 'Done',
    defectCount: 1,
    lastInspected: '2026-08-08',
    remarks: 'Jalan Duta toll plaza & NKVE interchange.',
  },
  {
    id: 26,
    zoneNo: 26,
    description: 'Zone 26 (NKVE1- Subang)',
    week2Inspector: 'Asyaqif',
    week4Inspector: 'Asyaqif',
    siteCount: 9,
    region: 'Highways & Expressway',
    status: 'Completed',
    week2Status: 'Done',
    week4Status: 'Done',
    defectCount: 0,
    lastInspected: '2026-08-09',
    remarks: 'Subang toll plaza & Glenmarie exit ramps.',
  },
  {
    id: 27,
    zoneNo: 27,
    description: 'Zone 27 (Metramac)',
    week2Inspector: 'Fadrul',
    week4Inspector: 'Fadrul',
    siteCount: 7,
    region: 'Highways & Expressway',
    status: 'Completed',
    week2Status: 'Done',
    week4Status: 'Done',
    defectCount: 0,
    lastInspected: '2026-08-10',
    remarks: 'East-West Link Expressway inspection complete.',
  },
  {
    id: 28,
    zoneNo: 28,
    description: 'Zone 28 (Sungai Besi - PLUS)',
    week2Inspector: 'Fadrul',
    week4Inspector: 'Fadrul',
    siteCount: 5,
    region: 'Highways & Expressway',
    status: 'Completed',
    week2Status: 'Done',
    week4Status: 'Done',
    defectCount: 1,
    lastInspected: '2026-08-11',
    remarks: 'Sungai Besi toll plaza approach high-mast lights.',
  },
  {
    id: 29,
    zoneNo: 29,
    description: 'Zone 29 (Besraya)',
    week2Inspector: 'Fadrul',
    week4Inspector: 'Fadrul',
    siteCount: 7,
    region: 'Highways & Expressway',
    status: 'Completed',
    week2Status: 'Done',
    week4Status: 'Done',
    defectCount: 0,
    lastInspected: '2026-08-12',
    remarks: 'Besraya Highway Shamelin stretch verified.',
  },
  {
    id: 30,
    zoneNo: 30,
    description: 'Zone 30 (Bangi)',
    week2Inspector: 'Fadrul',
    week4Inspector: 'Fadrul',
    siteCount: 6,
    region: 'South & Outskirts',
    status: 'Completed',
    week2Status: 'Done',
    week4Status: 'Done',
    defectCount: 0,
    lastInspected: '2026-08-13',
    remarks: 'Bangi toll entrance & main arterial streetlamps.',
  },
  {
    id: 31,
    zoneNo: 31,
    description: 'Zone 31 (Kota & Ara Damansara)',
    week2Inspector: 'Asyaqif',
    week4Inspector: 'Asyaqif',
    siteCount: 10,
    region: 'Petaling Jaya & Subang',
    status: 'Completed',
    week2Status: 'Done',
    week4Status: 'Done',
    defectCount: 0,
    lastInspected: '2026-08-14',
    remarks: 'Ara Damansara township & Kota Damansara flyover.',
  },
].map((zone) => ({
  ...zone,
  region: zone.region as ZoneRegion,
  status: zone.status as InspectionStatus,
  week2Status: zone.week2Status as 'Done' | 'Pending' | 'In Progress',
  week4Status: zone.week4Status as 'Done' | 'Pending' | 'In Progress',
  sites: generateSites(zone.zoneNo, zone.siteCount, zone.description),
}));
