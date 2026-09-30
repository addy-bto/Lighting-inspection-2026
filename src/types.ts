export type InspectorName = 'Nusir' | 'Yana' | 'Fadrul' | 'Asyaqif' | 'Ray' | string;

export type ZoneRegion = 'Kuala Lumpur / City' | 'Highways & Expressway' | 'Petaling Jaya & Subang' | 'South & Outskirts';

export type InspectionStatus = 'Completed' | 'In Progress' | 'Pending' | 'Needs Maintenance';

export type SiteStatus =
  | 'Lighted'
  | 'Partially Lit'
  | 'Lighting Greenish'
  | 'Lighting Yellowish'
  | 'Not Lighted'
  | 'Half Not Lit'
  | 'Lighting Arm Shifted'
  | 'TNB Cable fault'
  | 'Vandalism-Electrical fittings faulty'
  | 'View blocking by tree'
  | 'Timer switch malfunction'
  | 'Others'
  | string;

export interface PhysicalChecklistItems {
  fixtureSecure?: boolean;
  poleAligned?: boolean;
  timerFunctioning?: boolean;
  wiringOk?: boolean;
  noVandalism?: boolean;
}

export interface SiteInspectionRecord {
  inspector?: string;
  inspectionDate?: string;
  status: SiteStatus;
  luxLevel?: number;
  checklistItems?: PhysicalChecklistItems;
  defectPriority?: 'Low' | 'Medium' | 'High' | 'Critical';
  notes?: string;
  weatherCondition?: 'Clear' | 'Rainy' | 'Thunderstorm' | 'Cloudy' | 'Haze' | string;
  maintenanceLog?: string;
  photoUrl?: string;
  photos?: string[]; // Up to 3 photo proof URLs
  updatedAt?: string;
}

export interface SiteDetail {
  id: string;
  siteCode: string;
  name: string;
  fixtureType: 'Unipole' | 'Overhead Panel' | 'freestanding' | 'Mini Pole' | 'Gantry arch';
  status: SiteStatus;
  luxLevel?: number;
  lastInspectedDate?: string;
  notes?: string;
  photos?: string[];
  week2Report?: SiteInspectionRecord;
  week4Report?: SiteInspectionRecord;
}

export interface ZoneData {
  id: number;
  zoneNo: number;
  description: string;
  week2Inspector: InspectorName;
  week4Inspector: InspectorName;
  siteCount: number;
  region: ZoneRegion;
  status: InspectionStatus;
  week2Status: 'Done' | 'Pending' | 'In Progress';
  week4Status: 'Done' | 'Pending' | 'In Progress';
  defectCount: number;
  sites?: SiteDetail[];
  lastInspected?: string;
  remarks?: string;
}

export interface InspectorProfile {
  name: InspectorName;
  role: string;
  color: {
    bg: string;
    text: string;
    border: string;
    badgeBg: string;
    hex: string;
  };
  totalZones: number;
  totalSites: number;
  completedSites: number;
  phone: string;
  email: string;
}

export interface InspectionReportHeader {
  documentNo: string;
  title: string;
  period: string;
  week2Dates: string;
  week4Dates: string;
  preparedBy: string;
  approvedBy: string;
  createdDate: string;
  companyName: string;
}
