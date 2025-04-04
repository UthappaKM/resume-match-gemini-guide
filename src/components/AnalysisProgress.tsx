
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

const AnalysisProgress = () => {
  return (
    <Card className="border-brand-blue/30 shadow-lg">
      <CardContent className="p-6 space-y-4">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="text-xl font-semibold text-brand-blue animate-pulse-opacity">
            Analyzing Your Resume
          </div>
          <p className="text-sm text-gray-500">
            Comparing skills, experience, and qualifications with job requirements...
          </p>
        </div>
        
        <Progress value={65} className="h-2 bg-gray-100" />
        
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-500">Identifying Keywords</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-gray-500">Generating Recommendations</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisProgress;
