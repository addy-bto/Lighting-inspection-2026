import { ZoneData } from '../types';

export function getSiteCodeRange(zone: ZoneData): string {
  if (zone.sites && zone.sites.length > 0) {
    const first = zone.sites[0].siteCode.trim().split(' ')[0];
    const last = zone.sites[zone.sites.length - 1].siteCode.trim().split(' ')[0];
    if (first === last) return first;
    return `${first} - ${last}`;
  }
  const startNum = ((zone.zoneNo - 1) * 10 + 1).toString().padStart(4, '0');
  const endNum = ((zone.zoneNo - 1) * 10 + zone.siteCount).toString().padStart(4, '0');
  return `UP${startNum} - UP${endNum}`;
}

export function getSiteCodesList(zone: ZoneData): string[] {
  if (zone.sites && zone.sites.length > 0) {
    const codes = zone.sites.map((s) => s.siteCode.trim().split(' ')[0]);
    return Array.from(new Set(codes));
  }
  return Array.from({ length: zone.siteCount }, (_, i) => {
    const num = ((zone.zoneNo - 1) * 10 + i + 1).toString().padStart(4, '0');
    return `UP${num}`;
  });
}
