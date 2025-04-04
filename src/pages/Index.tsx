
import { Button } from "@/components/ui/button";
import JobDescription from "@/components/JobDescription";
import MatchResults from "@/components/MatchResults";
import ResumeUpload from "@/components/ResumeUpload";
import { AnalysisResult, ResumeData } from "@/types";
import { useState } from "react";
import { analyzeResume } from "@/services/gemini";
import AnalysisProgress from "@/components/AnalysisProgress";
import ResumeRankings from "@/components/ResumeRankings";

const Index = () => {
  const [resumeData, setResumeData] = useState<ResumeData[]>([]);
  const [analyzingResumes, setAnalyzingResumes] = useState<string[]>([]);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);

  const handleResumeUpload = (data: ResumeData[]) => {
    setResumeData(data);
    
    // If we're removing resumes, remove their results too
    if (data.length < resumeData.length) {
      const currentIds = data.map(r => r.id);
      setResults(prev => prev.filter(r => currentIds.includes(r.resumeId)));
      if (selectedResumeId && !currentIds.includes(selectedResumeId)) {
        setSelectedResumeId(null);
      }
    }
  };

  const handleAnalyze = async (jobDescription: string) => {
    if (resumeData.length === 0) {
      toast.error("Please upload at least one resume");
      return;
    }
    
    // Reset previous results
    setResults([]);
    setSelectedResumeId(null);
    
    const newAnalyzingResumes = resumeData.map(r => r.id);
    setAnalyzingResumes(newAnalyzingResumes);
    
    try {
      const allResults: AnalysisResult[] = [];
      
      // Analyze each resume
      for (const resume of resumeData) {
        const analysisResult = await analyzeResume({
          resumeText: resume.text,
          jobDescription,
          resumeId: resume.id,
          fileName: resume.fileName
        });
        
        allResults.push(analysisResult);
        
        // Update the list of resumes still being analyzed
        setAnalyzingResumes(prev => prev.filter(id => id !== resume.id));
        
        // Update results as they come in
        setResults(prev => [...prev, analysisResult]);
      }
      
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setAnalyzingResumes([]);
    }
  };

  const handleViewDetails = (resumeId: string) => {
    setSelectedResumeId(resumeId);
  };

  const handleReset = () => {
    setResumeData([]);
    setResults([]);
    setSelectedResumeId(null);
    setAnalyzingResumes([]);
  };

  const isAnalyzing = analyzingResumes.length > 0;
  const selectedResult = selectedResumeId 
    ? results.find(r => r.resumeId === selectedResumeId) 
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-brand-purple">Resume</span>
                <span className="text-brand-blue">Match</span>
              </h1>
              <p className="text-sm text-gray-500">
                Optimize your resume for your dream job
              </p>
            </div>
            
            {(resumeData.length > 0 || results.length > 0) && (
              <Button variant="outline" onClick={handleReset}>
                Start Over
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        {selectedResult ? (
          <div className="space-y-4">
            <Button 
              variant="outline" 
              onClick={() => setSelectedResumeId(null)}
              className="mb-4"
            >
              ← Back to Rankings
            </Button>
            <MatchResults results={selectedResult} />
          </div>
        ) : results.length > 0 ? (
          <ResumeRankings results={results} onViewDetails={handleViewDetails} />
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <ResumeUpload 
              onResumeUpload={handleResumeUpload} 
              uploadedResumes={resumeData}
            />
            
            <div className="space-y-4">
              <JobDescription 
                onSubmit={handleAnalyze} 
                isLoading={isAnalyzing} 
                resumeUploaded={resumeData.length > 0}
              />
              
              {isAnalyzing && (
                <AnalysisProgress 
                  totalResumes={resumeData.length} 
                  completedResumes={resumeData.length - analyzingResumes.length} 
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t bg-white">
        <div className="container mx-auto py-4 px-4 text-center text-sm text-gray-500">
          <p>Powered by Google Gemini API</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
