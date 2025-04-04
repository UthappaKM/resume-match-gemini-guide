
import { AnalysisRequest, AnalysisResult } from "@/types";
import { toast } from "sonner";

export const analyzeResume = async (
  data: AnalysisRequest
): Promise<AnalysisResult> => {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    console.log("Analyzing with job description:", data.jobDescription.substring(0, 100) + "...");
    console.log("And resume text:", data.resumeText.substring(0, 100) + "...");
    
    // Mock response - in a real implementation, this would be replaced with a call to Gemini API
    const matchPercentage = Math.floor(Math.random() * 31) + 60; // Random match between 60-90%
    
    return {
      resumeId: data.resumeId,
      fileName: data.fileName,
      matchPercentage,
      strengths: [
        "Strong technical background in required skills",
        "Relevant experience in similar roles",
        "Good educational qualifications"
      ],
      improvements: [
        "Add more quantifiable achievements",
        "Highlight experience with specific tools mentioned in the job",
        "Tailor your resume summary to match the job description better"
      ],
      keywordMatches: {
        matched: ["project management", "communication", "teamwork"],
        missing: ["agile methodology", "specific tool experience", "industry certification"]
      },
      detailedFeedback: "Your resume shows strong foundational skills, but could be better tailored to this specific position. Consider highlighting your experience with relevant tools and methodologies mentioned in the job description. Quantifying your achievements would make your experience more compelling. Adding industry-specific keywords would improve your visibility in automated screening systems."
    };
    
  } catch (error) {
    console.error("Analysis error:", error);
    toast.error("Failed to analyze resume. Please try again.");
    throw error;
  }
};

// Mock function to parse PDF text - in a real app, you'd use a PDF parsing library
export const extractTextFromPDF = async (file: File): Promise<string> => {
  // In reality, you would use a library like pdf.js or make an API call to extract text
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Sample extracted text from ${file.name}. This would be the actual content of the resume in a real implementation.`);
    }, 1000);
  });
};
