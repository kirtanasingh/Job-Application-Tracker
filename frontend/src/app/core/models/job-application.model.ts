export interface JobApplication {
  id?: number;
  company: string;
  jobRole: string;
  location: string;
  applicationDate: string;
  jobType: string; // Full-time, Part-time, Internship, Contract
  status: string;  // Applied, Shortlisted, Interview, Selected, Rejected
  salary?: number | null;
  jobUrl?: string;
  notes?: string;
}

export interface ApplicationStats {
  total: number;
  applied: number;
  shortlisted: number;
  interview: number;
  selected: number;
  rejected: number;
}
