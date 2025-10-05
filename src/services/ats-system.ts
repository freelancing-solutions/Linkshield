/**
 * ATS (Applicant Tracking System) Service
 * 
 * Provides functionality for managing job applications, candidate tracking,
 * and recruitment processes within the LinkShield platform.
 */

import { vectorStore } from '@/lib/vector-store';

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  status: 'new' | 'screening' | 'interviewing' | 'offer' | 'hired' | 'rejected';
  appliedDate: Date;
  lastUpdated: Date;
  skills: string[];
  experience: number; // years
  education: Array<{
    degree: string;
    institution: string;
    year: number;
  }>;
  notes: string[];
}

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  level: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  description: string;
  requirements: string[];
  skills: string[];
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  status: 'draft' | 'active' | 'paused' | 'closed';
  createdDate: Date;
  closingDate?: Date;
  hiringManager: string;
}

export interface Application {
  id: string;
  candidateId: string;
  jobId: string;
  status: 'submitted' | 'under_review' | 'shortlisted' | 'rejected' | 'withdrawn';
  appliedDate: Date;
  coverLetter?: string;
  customAnswers?: Record<string, string>;
  score?: number;
  feedback?: string[];
  interviewScheduled?: Date;
}

export interface CandidateMatch {
  candidate: Candidate;
  matchScore: number;
  matchReasons: string[];
  skillsMatch: {
    matched: string[];
    missing: string[];
    additional: string[];
  };
}

/**
 * ATS System Service Class
 */
class ATSSystemService {
  private candidates = new Map<string, Candidate>();
  private jobPostings = new Map<string, JobPosting>();
  private applications = new Map<string, Application>();

  constructor() {
    this.initializeSampleData();
  }

  /**
   * Initialize sample data for demo purposes
   */
  private initializeSampleData(): void {
    // Sample job postings
    const sampleJobs: JobPosting[] = [
      {
        id: 'job-001',
        title: 'Senior Frontend Developer',
        department: 'Engineering',
        location: 'Remote',
        type: 'full-time',
        level: 'senior',
        description: 'We are looking for a senior frontend developer to join our team...',
        requirements: [
          '5+ years of React experience',
          'TypeScript proficiency',
          'Experience with modern build tools',
        ],
        skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Git'],
        salaryRange: {
          min: 90000,
          max: 130000,
          currency: 'USD',
        },
        status: 'active',
        createdDate: new Date('2024-01-15'),
        hiringManager: 'john.doe@linkshield.com',
      },
      {
        id: 'job-002',
        title: 'Cybersecurity Analyst',
        department: 'Security',
        location: 'New York, NY',
        type: 'full-time',
        level: 'mid',
        description: 'Join our security team to help protect our platform...',
        requirements: [
          '3+ years in cybersecurity',
          'Security certifications preferred',
          'Incident response experience',
        ],
        skills: ['Security Analysis', 'Incident Response', 'Risk Assessment', 'Compliance'],
        salaryRange: {
          min: 75000,
          max: 105000,
          currency: 'USD',
        },
        status: 'active',
        createdDate: new Date('2024-01-20'),
        hiringManager: 'jane.smith@linkshield.com',
      },
    ];

    sampleJobs.forEach(job => {
      this.jobPostings.set(job.id, job);
    });
  }

  /**
   * Get all job postings
   */
  async getJobPostings(filters?: {
    status?: JobPosting['status'];
    department?: string;
    type?: JobPosting['type'];
  }): Promise<JobPosting[]> {
    let jobs = Array.from(this.jobPostings.values());

    if (filters) {
      if (filters.status) {
        jobs = jobs.filter(job => job.status === filters.status);
      }
      if (filters.department) {
        jobs = jobs.filter(job => job.department === filters.department);
      }
      if (filters.type) {
        jobs = jobs.filter(job => job.type === filters.type);
      }
    }

    return jobs;
  }

  /**
   * Get job posting by ID
   */
  async getJobPosting(jobId: string): Promise<JobPosting | null> {
    return this.jobPostings.get(jobId) || null;
  }

  /**
   * Create new job posting
   */
  async createJobPosting(jobData: Omit<JobPosting, 'id' | 'createdDate'>): Promise<JobPosting> {
    const job: JobPosting = {
      ...jobData,
      id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdDate: new Date(),
    };

    this.jobPostings.set(job.id, job);

    // Add to vector store for semantic search
    await vectorStore.addDocument(
      `${job.title} ${job.description} ${job.requirements.join(' ')} ${job.skills.join(' ')}`,
      {
        type: 'job_posting',
        jobId: job.id,
        title: job.title,
        department: job.department,
      }
    );

    return job;
  }

  /**
   * Update job posting
   */
  async updateJobPosting(jobId: string, updates: Partial<JobPosting>): Promise<JobPosting | null> {
    const existing = this.jobPostings.get(jobId);
    if (!existing) return null;

    const updated = { ...existing, ...updates };
    this.jobPostings.set(jobId, updated);

    return updated;
  }

  /**
   * Get all candidates
   */
  async getCandidates(filters?: {
    status?: Candidate['status'];
    skills?: string[];
    minExperience?: number;
  }): Promise<Candidate[]> {
    let candidates = Array.from(this.candidates.values());

    if (filters) {
      if (filters.status) {
        candidates = candidates.filter(candidate => candidate.status === filters.status);
      }
      if (filters.skills && filters.skills.length > 0) {
        candidates = candidates.filter(candidate =>
          filters.skills!.some(skill =>
            candidate.skills.some(candidateSkill =>
              candidateSkill.toLowerCase().includes(skill.toLowerCase())
            )
          )
        );
      }
      if (filters.minExperience !== undefined) {
        candidates = candidates.filter(candidate => candidate.experience >= filters.minExperience!);
      }
    }

    return candidates;
  }

  /**
   * Get candidate by ID
   */
  async getCandidate(candidateId: string): Promise<Candidate | null> {
    return this.candidates.get(candidateId) || null;
  }

  /**
   * Create new candidate
   */
  async createCandidate(candidateData: Omit<Candidate, 'id' | 'appliedDate' | 'lastUpdated'>): Promise<Candidate> {
    const candidate: Candidate = {
      ...candidateData,
      id: `candidate-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      appliedDate: new Date(),
      lastUpdated: new Date(),
    };

    this.candidates.set(candidate.id, candidate);

    // Add to vector store for semantic search
    await vectorStore.addDocument(
      `${candidate.firstName} ${candidate.lastName} ${candidate.skills.join(' ')} ${candidate.notes.join(' ')}`,
      {
        type: 'candidate',
        candidateId: candidate.id,
        name: `${candidate.firstName} ${candidate.lastName}`,
        skills: candidate.skills,
      }
    );

    return candidate;
  }

  /**
   * Update candidate
   */
  async updateCandidate(candidateId: string, updates: Partial<Candidate>): Promise<Candidate | null> {
    const existing = this.candidates.get(candidateId);
    if (!existing) return null;

    const updated = { ...existing, ...updates, lastUpdated: new Date() };
    this.candidates.set(candidateId, updated);

    return updated;
  }

  /**
   * Submit job application
   */
  async submitApplication(applicationData: Omit<Application, 'id' | 'appliedDate'>): Promise<Application> {
    const application: Application = {
      ...applicationData,
      id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      appliedDate: new Date(),
    };

    this.applications.set(application.id, application);

    // Update candidate status
    const candidate = await this.getCandidate(application.candidateId);
    if (candidate && candidate.status === 'new') {
      await this.updateCandidate(application.candidateId, { status: 'screening' });
    }

    return application;
  }

  /**
   * Get applications for a job
   */
  async getJobApplications(jobId: string): Promise<Application[]> {
    return Array.from(this.applications.values()).filter(app => app.jobId === jobId);
  }

  /**
   * Get applications for a candidate
   */
  async getCandidateApplications(candidateId: string): Promise<Application[]> {
    return Array.from(this.applications.values()).filter(app => app.candidateId === candidateId);
  }

  /**
   * Find matching candidates for a job
   */
  async findMatchingCandidates(jobId: string, limit = 10): Promise<CandidateMatch[]> {
    const job = await this.getJobPosting(jobId);
    if (!job) return [];

    const candidates = await this.getCandidates();
    const matches: CandidateMatch[] = [];

    for (const candidate of candidates) {
      const matchScore = this.calculateMatchScore(candidate, job);
      const matchReasons = this.generateMatchReasons(candidate, job);
      const skillsMatch = this.analyzeSkillsMatch(candidate.skills, job.skills);

      matches.push({
        candidate,
        matchScore,
        matchReasons,
        skillsMatch,
      });
    }

    // Sort by match score and return top matches
    matches.sort((a, b) => b.matchScore - a.matchScore);
    return matches.slice(0, limit);
  }

  /**
   * Search candidates using semantic search
   */
  async searchCandidates(query: string, limit = 10): Promise<Candidate[]> {
    const results = await vectorStore.searchSimilar(query, limit);
    const candidateIds = results
      .filter(result => result.document.metadata?.type === 'candidate')
      .map(result => result.document.metadata?.candidateId)
      .filter(Boolean);

    const candidates = [];
    for (const candidateId of candidateIds) {
      const candidate = await this.getCandidate(candidateId);
      if (candidate) candidates.push(candidate);
    }

    return candidates;
  }

  /**
   * Get ATS analytics
   */
  async getAnalytics(): Promise<{
    totalCandidates: number;
    totalJobs: number;
    totalApplications: number;
    candidatesByStatus: Record<string, number>;
    jobsByDepartment: Record<string, number>;
    applicationsByStatus: Record<string, number>;
  }> {
    const candidates = await this.getCandidates();
    const jobs = await this.getJobPostings();
    const applications = Array.from(this.applications.values());

    const candidatesByStatus = candidates.reduce((acc, candidate) => {
      acc[candidate.status] = (acc[candidate.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const jobsByDepartment = jobs.reduce((acc, job) => {
      acc[job.department] = (acc[job.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const applicationsByStatus = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCandidates: candidates.length,
      totalJobs: jobs.length,
      totalApplications: applications.length,
      candidatesByStatus,
      jobsByDepartment,
      applicationsByStatus,
    };
  }

  /**
   * Calculate match score between candidate and job
   */
  private calculateMatchScore(candidate: Candidate, job: JobPosting): number {
    let score = 0;

    // Skills match (40% weight)
    const skillsMatch = this.analyzeSkillsMatch(candidate.skills, job.skills);
    const skillsScore = (skillsMatch.matched.length / job.skills.length) * 40;
    score += skillsScore;

    // Experience level match (30% weight)
    const experienceScore = this.calculateExperienceScore(candidate.experience, job.level) * 30;
    score += experienceScore;

    // Education match (20% weight)
    const educationScore = this.calculateEducationScore(candidate.education, job.requirements) * 20;
    score += educationScore;

    // Location preference (10% weight)
    const locationScore = 10; // Assume all candidates are flexible for now

    return Math.min(100, Math.round(score + locationScore));
  }

  /**
   * Generate match reasons
   */
  private generateMatchReasons(candidate: Candidate, job: JobPosting): string[] {
    const reasons = [];
    const skillsMatch = this.analyzeSkillsMatch(candidate.skills, job.skills);

    if (skillsMatch.matched.length > 0) {
      reasons.push(`Matches ${skillsMatch.matched.length} required skills: ${skillsMatch.matched.join(', ')}`);
    }

    if (candidate.experience >= this.getMinExperienceForLevel(job.level)) {
      reasons.push(`Has sufficient experience (${candidate.experience} years) for ${job.level} level`);
    }

    if (skillsMatch.additional.length > 0) {
      reasons.push(`Additional relevant skills: ${skillsMatch.additional.slice(0, 3).join(', ')}`);
    }

    return reasons;
  }

  /**
   * Analyze skills match between candidate and job
   */
  private analyzeSkillsMatch(candidateSkills: string[], jobSkills: string[]): CandidateMatch['skillsMatch'] {
    const matched = [];
    const missing = [];
    const additional = [];

    const normalizedCandidateSkills = candidateSkills.map(skill => skill.toLowerCase());
    const normalizedJobSkills = jobSkills.map(skill => skill.toLowerCase());

    for (const jobSkill of jobSkills) {
      const found = normalizedCandidateSkills.some(candidateSkill =>
        candidateSkill.includes(jobSkill.toLowerCase()) ||
        jobSkill.toLowerCase().includes(candidateSkill)
      );

      if (found) {
        matched.push(jobSkill);
      } else {
        missing.push(jobSkill);
      }
    }

    for (const candidateSkill of candidateSkills) {
      const isJobSkill = normalizedJobSkills.some(jobSkill =>
        jobSkill.includes(candidateSkill.toLowerCase()) ||
        candidateSkill.toLowerCase().includes(jobSkill)
      );

      if (!isJobSkill) {
        additional.push(candidateSkill);
      }
    }

    return { matched, missing, additional };
  }

  /**
   * Calculate experience score
   */
  private calculateExperienceScore(candidateExperience: number, jobLevel: JobPosting['level']): number {
    const minExperience = this.getMinExperienceForLevel(jobLevel);
    const maxExperience = this.getMaxExperienceForLevel(jobLevel);

    if (candidateExperience < minExperience) {
      return Math.max(0, (candidateExperience / minExperience) * 0.7);
    }

    if (candidateExperience > maxExperience) {
      return Math.max(0.8, 1 - ((candidateExperience - maxExperience) / 10) * 0.2);
    }

    return 1;
  }

  /**
   * Calculate education score
   */
  private calculateEducationScore(education: Candidate['education'], requirements: string[]): number {
    // Simple scoring based on degree level
    const hasRelevantDegree = education.some(edu =>
      requirements.some(req =>
        req.toLowerCase().includes('degree') ||
        req.toLowerCase().includes('bachelor') ||
        req.toLowerCase().includes('master')
      )
    );

    return hasRelevantDegree ? 1 : 0.5;
  }

  /**
   * Get minimum experience for job level
   */
  private getMinExperienceForLevel(level: JobPosting['level']): number {
    const experienceMap = {
      entry: 0,
      mid: 3,
      senior: 5,
      lead: 8,
      executive: 12,
    };

    return experienceMap[level] || 0;
  }

  /**
   * Get maximum experience for job level
   */
  private getMaxExperienceForLevel(level: JobPosting['level']): number {
    const experienceMap = {
      entry: 2,
      mid: 7,
      senior: 12,
      lead: 20,
      executive: 30,
    };

    return experienceMap[level] || 30;
  }
}

// Export service instance
export const atsSystemService = new ATSSystemService();

export default atsSystemService;