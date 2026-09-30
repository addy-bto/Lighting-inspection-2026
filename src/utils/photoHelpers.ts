/**
 * Photo evidence helpers and sample asset references for Big Tree Outdoor Lighting Inspection.
 * Generates realistic lighting photos and watermarks for every zone, week, and site.
 */

// Curated realistic outdoor advertising & lighting inspection photos
export const SAMPLE_NIGHT_ILLUMINATION_PHOTOS = [
  'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80', // Night highway unipole lighting
  'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=800&q=80', // Highway overhead lighting gantry
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80', // Urban highway illuminated billboard
  'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80', // Night highway arch & streetlight
  'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80', // High-power LED floodlight fixture
  'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80', // City expressway nighttime lighting
];

export const SAMPLE_DAY_FIXTURE_PHOTOS = [
  'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80', // Structural unipole column inspection
  'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80', // Overhead bridge / gantry inspection
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', // Commercial display structure
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', // Foundation & wiring inspection
];

export const SAMPLE_CONTROL_TIMER_PHOTOS = [
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', // DB electrical cabinet with MCB switches
  'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=800&q=80', // Power distribution panel & timer relay
  'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80', // Digital lux meter testing device
];

export const SAMPLE_DEFECT_PHOTOS = [
  'https://images.unsplash.com/photo-1516216628859-9bcceabb84ca?auto=format&fit=crop&w=800&q=80', // Dim / partial night illumination
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80', // Dark / unlit structure night
  'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=800&q=80', // Faulty wiring & cable repair needed
];

/**
 * Returns realistic photo evidence URLs for a site based on its status and hash.
 */
export function getSitePhotoEvidence(
  siteCode: string,
  status: string,
  existingPhotos?: string[],
  week?: string
): {
  nightIllumination: string;
  dayFixture: string;
  controlTimer: string;
  hasCustomUpload: boolean;
} {
  // If inspector uploaded custom photos, prioritize them!
  const hasCustom0 = !!(existingPhotos && existingPhotos[0] && existingPhotos[0].length > 10);
  const hasCustom1 = !!(existingPhotos && existingPhotos[1] && existingPhotos[1].length > 10);
  const hasCustom2 = !!(existingPhotos && existingPhotos[2] && existingPhotos[2].length > 10);

  // Derive stable hash from siteCode
  let hash = 0;
  const key = `${siteCode}-${week || 'w'}`;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const isLighted = status.trim().toLowerCase() === 'lighted' || status.trim().toLowerCase() === 'working';
  const isPartiallyLit = status.trim().toLowerCase().includes('partial') || status.trim().toLowerCase().includes('half');
  const isNotLighted = status.trim().toLowerCase().includes('not') || status.trim().toLowerCase().includes('cable');

  let defaultNight: string;
  if (isNotLighted) {
    defaultNight = SAMPLE_DEFECT_PHOTOS[1]; // Dark / unlit night
  } else if (isPartiallyLit) {
    defaultNight = SAMPLE_DEFECT_PHOTOS[0]; // Dim / partial
  } else {
    defaultNight = SAMPLE_NIGHT_ILLUMINATION_PHOTOS[absHash % SAMPLE_NIGHT_ILLUMINATION_PHOTOS.length];
  }

  const defaultDay = SAMPLE_DAY_FIXTURE_PHOTOS[absHash % SAMPLE_DAY_FIXTURE_PHOTOS.length];
  const defaultControl = SAMPLE_CONTROL_TIMER_PHOTOS[absHash % SAMPLE_CONTROL_TIMER_PHOTOS.length];

  return {
    nightIllumination: hasCustom1 ? existingPhotos![1] : hasCustom0 ? existingPhotos![0] : defaultNight,
    dayFixture: hasCustom0 ? existingPhotos![0] : defaultDay,
    controlTimer: hasCustom2 ? existingPhotos![2] : defaultControl,
    hasCustomUpload: hasCustom0 || hasCustom1 || hasCustom2,
  };
}

export const ZONE_REAL_COORDINATES: Record<number, { lat: number; lng: number; highway: string }> = {
  1: { lat: 3.1488, lng: 101.7133, highway: 'KL City Centre / Bukit Bintang' },
  2: { lat: 3.1642, lng: 101.7456, highway: 'AKLEH / SUKE Prolintas' },
  3: { lat: 3.1579, lng: 101.7512, highway: 'Jalan Ampang / Bukit Bintang' },
  4: { lat: 3.1292, lng: 101.6704, highway: 'Bangsar / Jalan Maarof' },
  5: { lat: 3.0908, lng: 101.6761, highway: 'Jalan Klang Lama (OKR)' },
  6: { lat: 3.1068, lng: 101.7356, highway: 'Cheras Highway / Taman Connaught' },
  7: { lat: 3.1003, lng: 101.6423, highway: 'Petaling Jaya Seksyen 52 / Federal' },
  8: { lat: 3.1258, lng: 101.6226, highway: 'PJ SS2 / Damansara Utama' },
  9: { lat: 3.0815, lng: 101.5945, highway: 'Federal Highway (Subang - Shah Alam)' },
  10: { lat: 3.0485, lng: 101.4485, highway: 'Federal Highway (Klang Corridor)' },
  11: { lat: 3.1415, lng: 101.6468, highway: 'SPRINT Highway (Damansara Link)' },
  12: { lat: 3.1285, lng: 101.6612, highway: 'SPRINT Highway (Kerinchi Link)' },
  13: { lat: 3.1538, lng: 101.6685, highway: 'Jalan Semantan / Jalan Duta' },
  14: { lat: 3.1625, lng: 101.6195, highway: 'Penchala Link Tunnel & Mont Kiara' },
  15: { lat: 3.2185, lng: 101.7254, highway: 'MRR2 North Loop (Gombak - Ampang)' },
  16: { lat: 3.2142, lng: 101.6385, highway: 'Jalan Kepong / Metro Prima' },
  17: { lat: 2.7545, lng: 101.7022, highway: 'KLIA Expressway Corridor' },
  18: { lat: 3.0215, lng: 101.5582, highway: 'ELITE Expressway (USJ - Seafield)' },
  19: { lat: 2.9485, lng: 101.5762, highway: 'ELITE South (Saujana Putra - KLIA)' },
  20: { lat: 3.0738, lng: 101.5183, highway: 'Shah Alam Town & Persiaran Sultan' },
  21: { lat: 3.1852, lng: 101.5265, highway: 'Guthrie Corridor Expressway (Elmina)' },
  22: { lat: 3.1522, lng: 101.6012, highway: 'LDP North (Damansara - Kelana Jaya)' },
  23: { lat: 3.0425, lng: 101.6175, highway: 'LDP South (Sunway - Puchong)' },
  24: { lat: 3.0762, lng: 101.6352, highway: 'New Pantai Expressway (NPE)' },
  25: { lat: 3.1782, lng: 101.6512, highway: 'NKVE Jalan Duta Interchange' },
  26: { lat: 3.1052, lng: 101.5812, highway: 'NKVE Subang Toll & Glenmarie' },
  27: { lat: 3.0985, lng: 101.7012, highway: 'Metramac / Salak East-West Link' },
  28: { lat: 3.0462, lng: 101.7065, highway: 'Sungai Besi PLUS Toll Approach' },
  29: { lat: 3.0892, lng: 101.7245, highway: 'Besraya Expressway (Sungai Besi)' },
  30: { lat: 2.9362, lng: 101.7685, highway: 'Bangi / PLUS South Corridor' },
  31: { lat: 3.1325, lng: 101.5845, highway: 'Kota Damansara & Ara Damansara' },
};

export function getSiteLatLng(zoneNo: number, siteIndex: number): { lat: number; lng: number } {
  const base = ZONE_REAL_COORDINATES[zoneNo] || { lat: 3.1390, lng: 101.6869 };
  const angle = (siteIndex * 137.5 * Math.PI) / 180;
  const radius = 0.0022 * Math.sqrt(siteIndex + 1);
  const lat = Number((base.lat + Math.cos(angle) * radius).toFixed(5));
  const lng = Number((base.lng + Math.sin(angle) * radius).toFixed(5));
  return { lat, lng };
}

/**
 * Returns GPS coordinates string for Kuala Lumpur / Klang Valley expressway sites.
 */
export function getSiteCoordinates(zoneNo: number, siteIndex: number): string {
  const { lat, lng } = getSiteLatLng(zoneNo, siteIndex);
  return `${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E`;
}
