
export interface ResumeData {
  text: string;
  fileName: string;
}

export interface AnalysisResult {
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
}
