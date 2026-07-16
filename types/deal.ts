export type DealStage =
  | "new"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost";

export type DealStatus = "open" | "won" | "lost" | "archived";

export type DealCurrency = "INR" | "USD" | "EUR" | "GBP";

export type Deal = {
  id: string;
  owner_id: string;
  company_id: string;
  contact_id: string | null;
  title: string;
  value: number;
  currency: DealCurrency;
  stage: DealStage;
  status: DealStatus;
  expected_close_date: string | null;
  created_at: string;
  updated_at: string;
};

export type DealWithRelations = Deal & {
  companies: {
    id: string;
    name: string;
  } | null;
  contacts: {
    id: string;
    first_name: string;
    last_name: string | null;
  } | null;
};

export type NewDealInput = {
  company_id: string;
  contact_id: string;
  title: string;
  value: string;
  currency: DealCurrency;
  stage: DealStage;
  expected_close_date: string;
};