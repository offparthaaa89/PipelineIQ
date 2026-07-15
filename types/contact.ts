export type ContactStatus = "active" | "inactive" | "archived";

export type Contact = {
  id: string;
  user_id: string;
  company_id: string;
  first_name: string;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  job_title: string | null;
  status: ContactStatus;
  created_at: string;
  updated_at: string;
};

export type ContactWithCompany = Contact & {
  companies: {
    id: string;
    name: string;
  } | null;
};

export type NewContactInput = {
  company_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  job_title: string;
};