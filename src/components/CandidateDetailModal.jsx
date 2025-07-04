import { X, ArrowLeft, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CandidateDetailModal({ candidate, onClose }) {
  if (!candidate) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getVoteBadgeColor = (vote) => {
    if (vote >= 70) return "bg-green-100 text-green-800 border-green-200";
    if (vote >= 50) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getConsiderationBadge = (consideration) => {
    const colors = {
      "shortlist": "bg-green-100 text-green-800 border-green-200",
      "rejected": "bg-red-100 text-red-800 border-red-200",
      "under review": "bg-blue-100 text-blue-800 border-blue-200"
    };
    return colors[consideration?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const renderSkills = (skills) => {
    if (!skills) return "N/A";
    
    const skillsList = skills.split(',').map(skill => skill.trim());
    return (
      <div className="flex flex-wrap gap-2">
        {skillsList.map((skill, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {skill}
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to List</span>
            </Button>
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {candidate.candidate_name}
              </h2>
              <Badge className={`${getVoteBadgeColor(candidate.vote)} font-medium`}>
                {candidate.vote}/10
              </Badge>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-blue-500" />
                    <a 
                      href={`mailto:${candidate.email}`} 
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {candidate.email || "N/A"}
                    </a>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone</label>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-green-500" />
                    <a 
                      href={`tel:${candidate.phone}`} 
                      className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                    >
                      {candidate.phone || "N/A"}
                    </a>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">City</label>
                  <p className="text-gray-900 dark:text-gray-100">{candidate.city || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Date of Birth</label>
                  <p className="text-gray-900 dark:text-gray-100">{formatDate(candidate.date_of_birth)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Evaluation Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Evaluation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Evaluation Date</label>
                  <p className="text-gray-900 dark:text-gray-100">{formatDate(candidate.evaluation_date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Vote Score</label>
                  <Badge className={`${getVoteBadgeColor(candidate.vote)} font-medium`}>
                    {candidate.vote}/10
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Consideration Status</label>
                  <Badge className={`${getConsiderationBadge(candidate.consideration)} font-medium`}>
                    {candidate.consideration || "N/A"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Education</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap leading-relaxed">
                  {candidate.education || "N/A"}
                </p>
              </CardContent>
            </Card>

            {/* Job History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Job History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap leading-relaxed">
                  {candidate.job_history || "N/A"}
                </p>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                {renderSkills(candidate.skills)}
              </CardContent>
            </Card>

            {/* AI Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap leading-relaxed">
                  {candidate.ai_summary || "N/A"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
