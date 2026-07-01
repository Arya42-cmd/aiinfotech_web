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
}
