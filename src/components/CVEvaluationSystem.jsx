
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, RefreshCw, Upload, ArrowUpDown } from "lucide-react";
import { useCVEvaluations } from "@/hooks/useCVEvaluations";
import { useToast } from "@/hooks/use-toast";
import { CVEvaluationFilters } from "./CVEvaluationFilters";
import { CandidateDetailModal } from "./CandidateDetailModal";

export function CVEvaluationSystem() {
  const { data: cvEvaluations = [], isLoading, refetch } = useCVEvaluations();
  const { toast } = useToast();
  const [sortField, setSortField] = useState("evaluation_date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [considerationFilter, setConsiderationFilter] = useState("all");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleUploadClick = () => {
    window.open("https://aicoslyn.app.n8n.cloud/form/2a87705d-8ba1-41f1-80ef-85f364ce253e", "_blank");
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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredAndSortedEvaluations = useMemo(() => {
    let filtered = [...cvEvaluations];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(evaluation => 
        evaluation.candidate_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluation.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply consideration filter
    if (considerationFilter !== "all") {
      filtered = filtered.filter(evaluation => 
        evaluation.consideration?.toLowerCase() === considerationFilter.toLowerCase()
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "evaluation_date") {
        // Parse DD/MM/YYYY format for sorting
        const parseDate = (dateString) => {
          if (!dateString) return new Date(0);
          if (dateString.includes('/')) {
            const parts = dateString.split('/');
            if (parts.length === 3) {
              const [day, month, year] = parts;
              return new Date(`${month}/${day}/${year}`);
            }
          }
          return new Date(dateString);
        };
        aValue = parseDate(aValue);
        bValue = parseDate(bValue);
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

    return filtered;
  }, [cvEvaluations, searchTerm, considerationFilter, sortField, sortDirection]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    
    // Handle DD/MM/YYYY format from database
    if (dateString.includes('/')) {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        // Convert DD/MM/YYYY to MM/DD/YYYY for JavaScript Date constructor
        const [day, month, year] = parts;
        const formattedDateString = `${month}/${day}/${year}`;
        const date = new Date(formattedDateString);
        
        if (isNaN(date.getTime())) {
          return "Invalid Date";
        }
        
        return date.toLocaleDateString('en-GB', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric' 
        });
      }
    }
    
    // Fallback for other date formats
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const handleRowClick = (candidate) => {
    setSelectedCandidate(candidate);
    setIsDetailModalOpen(true);
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
          <CVEvaluationFilters 
            onFilterChange={setConsiderationFilter}
            onSearchChange={setSearchTerm}
          />

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-gray-500">Loading evaluations...</div>
            </div>
          ) : filteredAndSortedEvaluations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {cvEvaluations.length === 0 
                ? "No CV evaluations found. Upload a CV to get started."
                : "No candidates match your current filters."
              }
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              <Table className="w-full">
                <TableHeader className="bg-gray-50 dark:bg-gray-800">
                  <TableRow className="border-b border-gray-200 dark:border-gray-700">
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold text-xs uppercase tracking-wide py-4"
                      onClick={() => handleSort("candidate_name")}
                    >
                      <div className="flex items-center gap-1">
                        NAME
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold text-xs uppercase tracking-wide"
                      onClick={() => handleSort("vote")}
                    >
                      <div className="flex items-center gap-1">
                        SCORE
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wide">EMAIL</TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wide">CITY</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold text-xs uppercase tracking-wide"
                      onClick={() => handleSort("evaluation_date")}
                    >
                      <div className="flex items-center gap-1">
                        DATE
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedEvaluations.map((evaluation, index) => (
                    <TableRow 
                      key={evaluation.id} 
                      className={`
                        border-b border-gray-100 dark:border-gray-800 
                        hover:bg-gray-50 dark:hover:bg-gray-900 
                        cursor-pointer transition-colors
                        ${index % 2 === 0 ? 'bg-white dark:bg-gray-950' : 'bg-gray-50/50 dark:bg-gray-900/50'}
                      `}
                      onClick={() => handleRowClick(evaluation)}
                    >
                      <TableCell className="py-4 font-semibold text-sm">
                        {evaluation.candidate_name || "-"}
                      </TableCell>
                      <TableCell>
                        {evaluation.vote ? (
                          <Badge className={`${getVoteColor(evaluation.vote)} font-semibold`}>
                            {evaluation.vote}/10
                          </Badge>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {evaluation.email ? (
                          <a 
                            href={`mailto:${evaluation.email}`} 
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {evaluation.email}
                          </a>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {evaluation.city || "-"}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {formatDate(evaluation.evaluation_date)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <CandidateDetailModal 
        candidate={selectedCandidate}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
}
