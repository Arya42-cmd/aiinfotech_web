export interface Job {
  id: string;
  title: string;
  category: string;
  type: string;
  location: string;
  experience?: string;
  salaryRange?: string;
  description?: string;
  summary?: string;
  responsibilities: string[];
  qualifications?: string[];
  requirements?: string[];
  status?: string;
}

export interface Application {
  id: string;
  job_id: string;
  full_name: string;
  email: string;
  phone: string;
  cover_letter: string;
  resume_url?: string | null;
  status: string;
  created_at?: string;
  job_title?: string;
  job_category?: string;
}
