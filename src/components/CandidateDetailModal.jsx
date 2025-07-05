
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Calendar, MapPin, Phone, GraduationCap, Briefcase, Star, FileText, ArrowLeft, X } from "lucide-react";

export function CandidateDetailModal({ candidate, isOpen, onClose }) {
  if (!candidate) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
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

  const formatSkills = (skillsText) => {
    if (!skillsText) return "No skills information provided.";
    
    // Split by common delimiters and create tags
    const skills = skillsText.split(/[,;|\n]/).map(skill => skill.trim()).filter(skill => skill);
    
    if (skills.length <= 1) {
      return skillsText;
    }
    
    return skills;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-5xl max-h-[95vh] overflow-hidden p-0 gap-0 rounded-lg shadow-2xl"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4 border-b bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center gap-4">
            <Button 
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to List
            </Button>
          </div>
          
          <DialogTitle className="text-2xl font-bold flex items-center gap-3 flex-1 justify-center">
            {candidate.candidate_name}
            <div className="flex gap-2">
              {candidate.vote && (
                <Badge className={`${getVoteColor(candidate.vote)} font-semibold px-3 py-1`}>
                  {candidate.vote}/10
                </Badge>
              )}
              {candidate.consideration && (
                <Badge className={`${getConsiderationColor(candidate.consideration)} font-medium px-3 py-1`}>
                  {candidate.consideration}
                </Badge>
              )}
            </div>
          </DialogTitle>

          <Button 
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-100px)] p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card className="shadow-sm border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <Phone className="w-5 h-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  {candidate.email ? (
                    <a 
                      href={`mailto:${candidate.email}`} 
                      className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                    >
                      {candidate.email}
                    </a>
                  ) : (
                    <span className="text-gray-500">No email provided</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  {candidate.phone ? (
                    <a 
                      href={`tel:${candidate.phone}`} 
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {candidate.phone}
                    </a>
                  ) : (
                    <span className="text-gray-500">No phone provided</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span>{candidate.city || "Location not specified"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span>DOB: {formatDate(candidate.date_of_birth)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Evaluation Details */}
            <Card className="shadow-sm border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-green-700 dark:text-green-400">
                  <Star className="w-5 h-5" />
                  Evaluation Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span>Evaluated: {formatDate(candidate.evaluation_date)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span>Score: {candidate.vote ? `${candidate.vote}/10` : "Not scored"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span>Status: {candidate.consideration || "Under review"}</span>
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="lg:col-span-2 shadow-sm border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-purple-700 dark:text-purple-400">
                  <GraduationCap className="w-5 h-5" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap text-sm leading-6">
                    {candidate.education || "No education information provided."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Job History */}
            <Card className="lg:col-span-2 shadow-sm border-l-4 border-l-orange-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-orange-700 dark:text-orange-400">
                  <Briefcase className="w-5 h-5" />
                  Job History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap text-sm leading-6">
                    {candidate.job_history || "No job history information provided."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="lg:col-span-2 shadow-sm border-l-4 border-l-indigo-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                  <Star className="w-5 h-5" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {(() => {
                    const skills = formatSkills(candidate.skills);
                    if (Array.isArray(skills)) {
                      return (
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary" 
                              className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 px-3 py-1"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      );
                    }
                    return (
                      <p className="whitespace-pre-wrap text-sm leading-6">
                        {skills}
                      </p>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>

            {/* AI Summary */}
            <Card className="lg:col-span-2 shadow-sm border-l-4 border-l-teal-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-teal-700 dark:text-teal-400">
                  <FileText className="w-5 h-5" />
                  AI Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap text-sm leading-6">
                    {candidate.ai_summary || "No AI summary available."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
