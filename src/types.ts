export interface ScoringWeights {
  skills: number;
  experience: number;
  education: number;
}

export interface JobRequirements {
  experienceYears: number;
  field: string;
  skills: string[];
  weights: ScoringWeights;
}

export interface Job {
  id: string;
  title: string;
  requirements: JobRequirements;
  createdAt: string;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Candidate {
  id: string;
  jobId: string;
  name: string;
  jobTitle: string;
  score: number;
  strengths: string[];
  missingSkills: string[];
  redFlags: string[];
  summary: string;
  experienceYears: number;
  status: 'pending' | 'shortlisted' | 'rejected';
  cvFile?: File;
  cvUrl?: string;
  comments: Comment[];
  votes: number;
}
