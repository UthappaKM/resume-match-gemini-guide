
export interface ResumeData {
  text: string;
  fileName: string;
  id: string; // Unique identifier for each resume
}

export interface AnalysisResult {
  resumeId: string; // To link results back to the specific resume
  fileName: string;
  matchPercentage: number;
  strengths: string[];
  improvements: string[];
  keywordMatches: {
    matched: string[];
    missing: string[];
  };
  detailedFeedback: string;
}

export interface AnalysisRequest {
  resumeText: string;
  jobDescription: string;
  resumeId: string;
  fileName: string;
}
