
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AnalysisResult } from "@/types";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface MatchResultsProps {
  results: AnalysisResult;
}

const MatchResults = ({ results }: MatchResultsProps) => {
  const { matchPercentage, strengths, improvements, keywordMatches, detailedFeedback } = results;
  
  // Determine color based on match percentage
  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-500";
    if (percentage >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const getMatchBackground = (percentage: number) => {
    if (percentage >= 80) return "bg-green-100";
    if (percentage >= 60) return "bg-amber-100";
    return "bg-red-100";
  };

  return (
    <div className="space-y-6">
      {/* Match Score */}
      <Card className="border-brand-purple shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-center">Resume Match Score</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex justify-center">
            <div className={`text-7xl font-bold ${getMatchColor(matchPercentage)}`}>
              {matchPercentage}%
            </div>
          </div>
          <p className="mt-2 text-center text-gray-500 text-sm">
            {matchPercentage >= 80
              ? "Excellent match! Your resume aligns well with this position."
              : matchPercentage >= 60
              ? "Good match with room for improvement. See suggestions below."
              : "Consider significant improvements to increase your chances."}
          </p>
        </CardContent>
      </Card>

      {/* Strengths and Improvements */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-green-600 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Suggested Improvements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500 mt-1 flex-shrink-0" />
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Keywords */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Keyword Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2 text-green-700">Matched Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {keywordMatches.matched.map((keyword, index) => (
                  <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2 text-red-700">Missing Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {keywordMatches.missing.map((keyword, index) => (
                  <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Feedback */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Detailed Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 whitespace-pre-line">{detailedFeedback}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchResults;
