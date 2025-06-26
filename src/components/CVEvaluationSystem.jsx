
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, RefreshCw, Upload, ArrowUpDown } from "lucide-react";
import { useCVEvaluations } from "@/hooks/useCVEvaluations";
import { useToast } from "@/hooks/use-toast";

export function CVEvaluationSystem() {
  const { data: cvEvaluations = [], isLoading, refetch } = useCVEvaluations();
  const { toast } = useToast();
  const [sortField, setSortField] = useState("evaluation_date");
  const [sortDirection, setSortDirection] = useState("desc");

  const handleUploadClick = () => {
    window.open("https://swarajevolvyn.app.n8n.cloud/form/2a87705d-8ba1-41f1-80ef-85f364ce253e", "_blank");
  };

  const handleRefresh = async () => {
    try {
      await refetch();
      toast({
        title: "Success",
        description: "CV evaluations refreshed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh data",
        variant: "destructive",
      });
    }
  };

  const getVoteColor = (vote) => {
    if (!vote) return "bg-gray-100 text-gray-800";
    if (vote >= 1 && vote <= 4) return "bg-red-100 text-red-800";
    if (vote >= 5 && vote <= 7) return "bg-yellow-100 text-yellow-800";
    if (vote >= 8 && vote <= 10) return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  const getConsiderationColor = (consideration) => {
    switch (consideration?.toLowerCase()) {
      case "shortlist":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "under review":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedEvaluations = [...cvEvaluations].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === "evaluation_date") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortField === "vote") {
      aValue = aValue || 0;
      bValue = bValue || 0;
    }

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            AI CV Evaluation System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Submit a candidate's CV and job description to evaluate them using AI. The system will automatically score and store the results.
          </div>
          <Button onClick={handleUploadClick} className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Upload CV / Resume
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Candidate Evaluation Results</CardTitle>
          <Button onClick={handleRefresh} variant="outline" size="sm" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-gray-500">Loading evaluations...</div>
            </div>
          ) : cvEvaluations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No CV evaluations found. Upload a CV to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => handleSort("evaluation_date")}
                    >
                      <div className="flex items-center gap-1">
                        DATE
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => handleSort("candidate_name")}
                    >
                      <div className="flex items-center gap-1">
                        NAME
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </TableHead>
                    <TableHead>PHONE</TableHead>
                    <TableHead>CITY</TableHead>
                    <TableHead>EMAIL</TableHead>
                    <TableHead>D.O.B</TableHead>
                    <TableHead>EDUCATION</TableHead>
                    <TableHead>JOB HISTORY</TableHead>
                    <TableHead>SKILLS</TableHead>
                    <TableHead>SUMMARIZE</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => handleSort("vote")}
                    >
                      <div className="flex items-center gap-1">
                        VOTE
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </TableHead>
                    <TableHead>CONSIDERATION</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedEvaluations.map((evaluation) => (
                    <TableRow key={evaluation.id}>
                      <TableCell>{formatDate(evaluation.evaluation_date)}</TableCell>
                      <TableCell className="font-medium">{evaluation.candidate_name || "-"}</TableCell>
                      <TableCell>{evaluation.phone || "-"}</TableCell>
                      <TableCell>{evaluation.city || "-"}</TableCell>
                      <TableCell>{evaluation.email || "-"}</TableCell>
                      <TableCell>{formatDate(evaluation.date_of_birth)}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={evaluation.education}>
                        {evaluation.education || "-"}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate" title={evaluation.job_history}>
                        {evaluation.job_history || "-"}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate" title={evaluation.skills}>
                        {evaluation.skills || "-"}
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate" title={evaluation.ai_summary}>
                        {evaluation.ai_summary || "-"}
                      </TableCell>
                      <TableCell>
                        {evaluation.vote ? (
                          <Badge className={getVoteColor(evaluation.vote)}>
                            {evaluation.vote}/10
                          </Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {evaluation.consideration ? (
                          <Badge className={getConsiderationColor(evaluation.consideration)}>
                            {evaluation.consideration}
                          </Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
