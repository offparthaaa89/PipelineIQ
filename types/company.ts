export type CompanyStatus = "active" | "inactive" | "archived";

export type Company = {
  id: string;
  user_id: string;
  name: string;
  website: string | null;
  industry: string | null;
  size: string | null;
  location: string | null;
  status: CompanyStatus;
  created_at: string;
  updated_at: string;
};

export type NewCompanyInput = {
  name: string;
  website: string;
  industry: string;
  size: string;
  location: string;
};