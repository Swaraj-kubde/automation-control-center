
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export function CVEvaluationFilters({ onFilterChange, onSearchChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [considerationFilter, setConsiderationFilter] = useState("all");

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleFilterChange = (value) => {
    setConsiderationFilter(value);
    onFilterChange(value);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={considerationFilter} onValueChange={handleFilterChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Candidates</SelectItem>
          <SelectItem value="shortlist">Shortlisted</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
          <SelectItem value="under review">Under Review</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
