
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ResumeData } from "@/types";
import { FileUp, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { extractTextFromPDF } from "@/services/gemini";
import { v4 as uuidv4 } from "uuid";

interface ResumeUploadProps {
  onResumeUpload: (resumeData: ResumeData[]) => void;
  uploadedResumes: ResumeData[];
}

const ResumeUpload = ({ onResumeUpload, uploadedResumes }: ResumeUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleFiles = async (files: FileList) => {
    const fileArray = Array.from(files);
    const pdfFiles = fileArray.filter(file => file.type === "application/pdf");
    
    if (pdfFiles.length === 0) {
      toast.error("Please upload PDF files only");
      return;
    }

    if (pdfFiles.some(file => file.size > 5 * 1024 * 1024)) {
      toast.error("One or more files exceed the 5MB limit");
      return;
    }

    try {
      setIsUploading(true);
      
      const newResumes: ResumeData[] = [];
      
      // Process each file in sequence
      for (const file of pdfFiles) {
        const text = await extractTextFromPDF(file);
        newResumes.push({
          text,
          fileName: file.name,
          id: uuidv4()
        });
      }
      
      const updatedResumes = [...uploadedResumes, ...newResumes];
      onResumeUpload(updatedResumes);
      
      toast.success(`${pdfFiles.length} resume${pdfFiles.length > 1 ? 's' : ''} uploaded successfully!`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to process resumes. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFiles(e.target.files);
    }
  };

  const handleRemoveResume = (id: string) => {
    const updatedResumes = uploadedResumes.filter(resume => resume.id !== id);
    onResumeUpload(updatedResumes);
    toast.info("Resume removed");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-brand-purple">
          <FileUp className="h-5 w-5" />
          Upload Resumes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
            dragActive
              ? "border-brand-purple bg-brand-purple/5"
              : "border-gray-200 hover:border-brand-purple/50"
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <FileUp
              className={`h-10 w-10 ${
                dragActive ? "text-brand-purple" : "text-gray-400"
              }`}
            />
            <div>
              <p className="text-sm font-medium">
                {isUploading ? (
                  "Processing..."
                ) : (
                  <>
                    <span className="font-semibold">Click to upload</span> or drag
                    and drop multiple resumes
                  </>
                )}
              </p>
              <p className="text-xs text-gray-500 mt-1">PDF files only (max 5MB each)</p>
            </div>
            <Input
              id="resume-upload"
              type="file"
              multiple
              accept=".pdf"
              className="hidden"
              onChange={handleFileInput}
              disabled={isUploading}
            />
            <Button
              asChild
              variant="outline"
              className="border-brand-purple text-brand-purple hover:bg-brand-purple/10"
              disabled={isUploading}
            >
              <label htmlFor="resume-upload" className="cursor-pointer">
                {isUploading ? "Processing..." : "Select files"}
              </label>
            </Button>
          </div>
        </div>

        {uploadedResumes.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="font-medium text-sm text-gray-700">Uploaded Resumes:</h4>
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {uploadedResumes.map((resume) => (
                <li 
                  key={resume.id} 
                  className="flex justify-between items-center p-2 bg-gray-50 rounded-md text-sm"
                >
                  <span className="truncate mr-2">{resume.fileName}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-gray-500 hover:text-red-500"
                    onClick={() => handleRemoveResume(resume.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeUpload;
