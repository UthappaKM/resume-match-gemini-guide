
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import { useState } from "react";

interface JobDescriptionProps {
  onSubmit: (description: string) => void;
  isLoading: boolean;
  resumeUploaded: boolean;
}

const JobDescription = ({ onSubmit, isLoading, resumeUploaded }: JobDescriptionProps) => {
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      onSubmit(description);
    }
  };

  const sampleDescription = `
Front-End Developer (React/TypeScript)

We're looking for a skilled Front-End Developer to join our team. The ideal candidate has experience with React, TypeScript, and modern web development practices.

Requirements:
- 3+ years experience with React
- Strong TypeScript skills
- Experience with state management (Redux, Context API)
- Proficiency with CSS and responsive design
- Knowledge of testing frameworks (Jest, React Testing Library)
- Experience with REST APIs and data fetching

Responsibilities:
- Develop and maintain user interfaces using React
- Collaborate with designers and backend developers
- Write clean, maintainable, and testable code
- Optimize applications for performance
- Participate in code reviews and team meetings

Bonus Skills:
- Experience with Next.js
- Knowledge of GraphQL
- Experience with CI/CD pipelines
`;

  const loadSampleDescription = () => {
    setDescription(sampleDescription.trim());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-brand-blue">
          <FileText className="h-5 w-5" />
          Job Description
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Paste the job description here..."
            className="min-h-[200px] resize-y"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <Button 
              type="button" 
              variant="outline"
              onClick={loadSampleDescription}
            >
              Load Sample
            </Button>
            <Button 
              type="submit" 
              className="bg-brand-blue hover:bg-brand-blue/90"
              disabled={!description.trim() || isLoading || !resumeUploaded}
            >
              {isLoading ? "Analyzing..." : "Analyze Match"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobDescription;
