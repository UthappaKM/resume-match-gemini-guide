
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalysisResult } from "@/types";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ArrowUpDown, FileText } from "lucide-react";
import { useState } from "react";

interface ResumeRankingsProps {
  results: AnalysisResult[];
  onViewDetails: (resumeId: string) => void;
}

const ResumeRankings = ({ results, onViewDetails }: ResumeRankingsProps) => {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  const sortedResults = [...results].sort((a, b) => {
    return sortOrder === "desc" 
      ? b.matchPercentage - a.matchPercentage
      : a.matchPercentage - b.matchPercentage;
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-brand-purple flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Resume Rankings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Resume</TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-0 h-auto font-medium flex items-center gap-1"
                  onClick={toggleSortOrder}
                >
                  Match %
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedResults.map((result, index) => (
              <TableRow key={result.resumeId}>
                <TableCell className="font-medium">#{index + 1}</TableCell>
                <TableCell className="max-w-xs truncate">{result.fileName}</TableCell>
                <TableCell className={`font-semibold ${getMatchColor(result.matchPercentage)}`}>
                  {result.matchPercentage}%
                </TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onViewDetails(result.resumeId)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ResumeRankings;
