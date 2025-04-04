
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ResumeData } from "@/types";
import { FileUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { extractTextFromPDF } from "@/services/gemini";

interface ResumeUploadProps {
  onResumeUpload: (resumeData: ResumeData) => void;
}

const ResumeUpload = ({ onResumeUpload }: ResumeUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit");
      return;
    }

    try {
      setIsUploading(true);
      setFileName(file.name);
      
      const text = await extractTextFromPDF(file);
      
      onResumeUpload({
        text,
        fileName: file.name
      });
      toast.success("Resume uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to process resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFile(e.target.files[0]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-brand-purple">
          <FileUp className="h-5 w-5" />
          Upload Resume
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
                ) : fileName ? (
                  <span className="text-brand-purple">{fileName}</span>
                ) : (
                  <>
                    <span className="font-semibold">Click to upload</span> or drag
                    and drop
                  </>
                )}
              </p>
              <p className="text-xs text-gray-500 mt-1">PDF (max 5MB)</p>
            </div>
            <Input
              id="resume-upload"
              type="file"
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
                {isUploading ? "Processing..." : "Select file"}
              </label>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeUpload;
