
import { Button } from "@/components/ui/button";
import JobDescription from "@/components/JobDescription";
import MatchResults from "@/components/MatchResults";
import ResumeUpload from "@/components/ResumeUpload";
import { AnalysisResult, ResumeData } from "@/types";
import { useState } from "react";
import { analyzeResume } from "@/services/gemini";
import AnalysisProgress from "@/components/AnalysisProgress";

const Index = () => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);

  const handleResumeUpload = (data: ResumeData) => {
    setResumeData(data);
    // Reset any previous results
    setResults(null);
  };

  const handleAnalyze = async (jobDescription: string) => {
    if (!resumeData) return;
    
    setIsAnalyzing(true);
    setResults(null);
    
    try {
      const analysisResult = await analyzeResume({
        resumeText: resumeData.text,
        jobDescription
      });
      
      setResults(analysisResult);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResumeData(null);
    setResults(null);
  };

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
            
            {(resumeData || results) && (
              <Button variant="outline" onClick={handleReset}>
                Start Over
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        {results ? (
          <MatchResults results={results} />
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <ResumeUpload onResumeUpload={handleResumeUpload} />
            
            <div className="space-y-4">
              <JobDescription 
                onSubmit={handleAnalyze} 
                isLoading={isAnalyzing} 
                resumeUploaded={!!resumeData}
              />
              
              {isAnalyzing && <AnalysisProgress />}
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
