export interface PCSTEMPLATE {
  id: number;
  customers: string;
  buildings: string;
  floors: string;
  bleaddress: string;
  lastresponsetime: string;
  noofresponses: number;
  bleId: string;
  noofresponsesTillNow: number;
  startDate?: any;
  areaName: string[];
  status: any;
  subject?: string;
  comments?: string;
  resReview?: any;
  areaType?: any;
  openArea?: boolean;
  blgtimezone?: any;
}

export interface DESKTEMPLATE {
  id: number;
  customers: string;
  buildings: string;
  floors: string;
  bleaddress: string;
  lastresponsetime: string;
  noofresponses: number;
  bleId: string;
  noofresponsesTillNow: number;
  areaName: string[];
  status: any;
  subject?: string;
  comments?: string;
  resReview?: any;
  timezone?: string;
  areaType?: any;
  startDate?: any;
  blgtimezone?: any;
}

export interface BUILDINGSELECT {
  alias?: string;
  id?: string;
  timezone?: string;
  disabled?: boolean;
}

export interface SITESELECT {
  disabled?: boolean;
  name?: string;
  buildings?: BUILDINGSELECT[];
  isRoom?: boolean; isDesk?: boolean; isSegment?: boolean;
}

export interface MAILTEMPLATE {
  subject: string;
  customers: CUSTOMERDATA[];
}
export interface CUSTOMERDATA {
  customer: string;
  building: string;
  floorName: string;
  addressIssues: BLEDATA[];
}
export interface BLEDATA {
  bleAddress: string;
  notes: string;
  roomName: string;
}

export interface ChartModule {
  name: string;
  y: number;
}
