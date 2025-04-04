
import { AnalysisRequest, AnalysisResult } from "@/types";
import { toast } from "sonner";

// This function calculates keyword matches between resume text and job description
const calculateKeywordMatches = (resumeText: string, jobDescription: string) => {
  // Convert both texts to lowercase for case-insensitive matching
  const resumeLower = resumeText.toLowerCase();
  const jobLower = jobDescription.toLowerCase();
  
  // Common keywords to look for in job descriptions
  const commonKeywords = [
    "javascript", "typescript", "react", "node", "python", "java", "c++", "sql", 
    "database", "api", "cloud", "aws", "azure", "docker", "kubernetes", "devops",
    "agile", "scrum", "leadership", "team", "project management", "communication",
    "problem solving", "analytics", "data science", "machine learning", "ai", 
    "ui/ux", "frontend", "backend", "fullstack", "testing", "qa", "security",
    "mobile", "android", "ios", "responsive", "design", "architecture"
  ];
  
  // Find keywords from job description
  const jobKeywords = commonKeywords.filter(keyword => jobLower.includes(keyword));
  
  // Check which keywords are in the resume
  const matched = jobKeywords.filter(keyword => resumeLower.includes(keyword));
  const missing = jobKeywords.filter(keyword => !resumeLower.includes(keyword));
  
  return { matched, missing };
};

// Calculate match percentage based on keyword matches and content similarity
const calculateMatchPercentage = (resumeText: string, jobDescription: string, keywordMatches: { matched: string[], missing: string[] }) => {
  const totalKeywords = keywordMatches.matched.length + keywordMatches.missing.length;
  
  // Base score from keyword matches (60% of the total score)
  let matchScore = totalKeywords > 0 
    ? (keywordMatches.matched.length / totalKeywords) * 60 
    : 30; // Default to middle score if no keywords detected
  
  // Enhance the base score for better matching percentages
  if (keywordMatches.matched.length > 0) {
    // Bonus points for having more matched keywords
    matchScore += Math.min(15, keywordMatches.matched.length * 3);
  }
  
  // Add points for resume sections (up to 25%)
  let sectionScore = 0;
  if (resumeText.toLowerCase().includes("experience")) sectionScore += 8;
  if (resumeText.toLowerCase().includes("education")) sectionScore += 7;
  if (resumeText.toLowerCase().includes("skills")) sectionScore += 10;
  
  // Check for specific section quality
  if (resumeText.toLowerCase().includes("project") && 
      resumeText.toLowerCase().includes("develop")) {
    sectionScore += 5;
  }
  
  // Length and content quality bonus (up to 10 points)
  const contentQualityScore = Math.min(10, Math.max(5, resumeText.length / 500));
  
  // Calculate final score and ensure it's between 55-98%
  const rawScore = matchScore + sectionScore + contentQualityScore;
  return Math.min(98, Math.max(55, Math.round(rawScore)));
};

// Generate realistic strengths based on keyword matches
const generateStrengths = (resumeText: string, keywordMatches: { matched: string[] }) => {
  const strengths: string[] = [];
  
  if (keywordMatches.matched.length > 0) {
    strengths.push(`Strong match with key skills: ${keywordMatches.matched.slice(0, 3).join(", ")}`);
  }
  
  if (resumeText.toLowerCase().includes("experience")) {
    strengths.push("Has relevant professional experience");
  }
  
  if (resumeText.toLowerCase().includes("education")) {
    strengths.push("Has educational qualifications in the field");
  }
  
  if (resumeText.toLowerCase().includes("project")) {
    strengths.push("Demonstrates project experience");
  }
  
  // Add some generic strengths if we don't have enough
  const genericStrengths = [
    "Shows relevant technical background",
    "Has experience with similar responsibilities",
    "Demonstrates problem-solving abilities",
    "Shows teamwork and collaboration skills"
  ];
  
  while (strengths.length < 3) {
    const randomStrength = genericStrengths[Math.floor(Math.random() * genericStrengths.length)];
    if (!strengths.includes(randomStrength)) {
      strengths.push(randomStrength);
    }
  }
  
  return strengths.slice(0, 4); // Return at most 4 strengths
};

// Generate realistic improvement suggestions based on missing keywords
const generateImprovements = (resumeText: string, keywordMatches: { missing: string[] }) => {
  const improvements: string[] = [];
  
  if (keywordMatches.missing.length > 0) {
    improvements.push(`Add missing keywords: ${keywordMatches.missing.slice(0, 3).join(", ")}`);
  }
  
  if (!resumeText.toLowerCase().includes("achievement") && !resumeText.toLowerCase().includes("accomplish")) {
    improvements.push("Add more quantifiable achievements and accomplishments");
  }
  
  const genericImprovements = [
    "Use more action verbs to describe your experience",
    "Tailor your resume summary to better match this specific job",
    "Include more specific metrics and results in your experience",
    "Consider reorganizing sections to highlight most relevant experience first",
    "Add specific certifications related to this position"
  ];
  
  while (improvements.length < 3) {
    const randomImprovement = genericImprovements[Math.floor(Math.random() * genericImprovements.length)];
    if (!improvements.includes(randomImprovement)) {
      improvements.push(randomImprovement);
    }
  }
  
  return improvements.slice(0, 4); // Return at most 4 improvements
};

// Generate detailed feedback based on the analysis
const generateDetailedFeedback = (
  resumeText: string, 
  jobDescription: string, 
  matchPercentage: number, 
  keywordMatches: { matched: string[], missing: string[] }
) => {
  let feedback = "";
  
  if (matchPercentage >= 80) {
    feedback += "Your resume is a strong match for this position. ";
  } else if (matchPercentage >= 60) {
    feedback += "Your resume shows good potential for this position, but could use some improvements. ";
  } else {
    feedback += "There's a gap between your resume and this job description. Consider the suggested improvements. ";
  }
  
  if (keywordMatches.matched.length > 0) {
    feedback += `You've included important keywords like ${keywordMatches.matched.slice(0, 3).join(", ")}. `;
  }
  
  if (keywordMatches.missing.length > 0) {
    feedback += `Consider adding missing keywords such as ${keywordMatches.missing.slice(0, 3).join(", ")}. `;
  }
  
  // Add section-specific feedback
  if (!resumeText.toLowerCase().includes("achievement") && !resumeText.toLowerCase().includes("accomplish")) {
    feedback += "Try to quantify your achievements with specific metrics and results. ";
  }
  
  // Add job-specific tailoring advice
  feedback += "Remember to tailor your resume to highlight experiences most relevant to this specific position. ";
  
  return feedback;
};

export const analyzeResume = async (
  data: AnalysisRequest
): Promise<AnalysisResult> => {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    console.log("Analyzing with job description:", data.jobDescription.substring(0, 100) + "...");
    console.log("And resume text:", data.resumeText.substring(0, 100) + "...");
    
    // Perform more accurate analysis
    const keywordMatches = calculateKeywordMatches(data.resumeText, data.jobDescription);
    const matchPercentage = calculateMatchPercentage(data.resumeText, data.jobDescription, keywordMatches);
    const strengths = generateStrengths(data.resumeText, keywordMatches);
    const improvements = generateImprovements(data.resumeText, keywordMatches);
    const detailedFeedback = generateDetailedFeedback(
      data.resumeText, 
      data.jobDescription, 
      matchPercentage, 
      keywordMatches
    );
    
    return {
      resumeId: data.resumeId,
      fileName: data.fileName,
      matchPercentage,
      strengths,
      improvements,
      keywordMatches,
      detailedFeedback
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
      // Generate some mock content based on the file name to simulate different resumes
      const fileNameLower = file.name.toLowerCase();
      let mockContent = `Sample extracted text from ${file.name}. `;
      
      // Add different content based on filename to simulate different resumes
      if (fileNameLower.includes("developer") || fileNameLower.includes("engineer")) {
        mockContent += "Experience: 5 years of software development experience. Skills: JavaScript, TypeScript, React, Node.js, AWS, Docker. " +
          "Education: Bachelor's degree in Computer Science. Projects: Built a responsive web application using React and TypeScript. " +
          "Achievements: Reduced application load time by 40% through code optimization. Collaborated with cross-functional teams to deliver features.";
      } else if (fileNameLower.includes("manager") || fileNameLower.includes("lead")) {
        mockContent += "Experience: 8 years of team leadership and project management. Skills: Agile, Scrum, team building, communication, strategic planning. " +
          "Education: MBA in Business Administration. Projects: Led a team of 10 developers to deliver a complex system on time and under budget. " +
          "Achievements: Increased team productivity by 30% through process improvements. Successfully delivered 12 major projects.";
      } else if (fileNameLower.includes("design") || fileNameLower.includes("ui")) {
        mockContent += "Experience: 4 years in UI/UX design. Skills: Figma, Sketch, user research, wireframing, prototyping, responsive design. " +
          "Education: Degree in Graphic Design. Projects: Redesigned the company's main product interface resulting in 25% increase in user engagement. " +
          "Achievements: Created design system that reduced development time by 20%. Conducted user testing with over 100 participants.";
      } else if (fileNameLower.includes("data") || fileNameLower.includes("analyst")) {
        mockContent += "Experience: 6 years in data analysis and science. Skills: Python, SQL, machine learning, data visualization, statistics, AWS. " +
          "Education: Master's degree in Data Science. Projects: Developed predictive models that increased conversion rates by 15%. " +
          "Achievements: Automated reporting processes saving 10 hours per week. Created dashboards used by executive leadership for decision making.";
      } else {
        mockContent += "Experience: Various professional roles. Skills: Communication, teamwork, problem-solving, project management. " +
          "Education: Bachelor's degree. Projects: Contributed to multiple team initiatives with positive outcomes. " +
          "Achievements: Consistently met or exceeded performance targets. Received recognition for contributions to team success.";
      }
      
      resolve(mockContent);
    }, 1000);
  });
};
