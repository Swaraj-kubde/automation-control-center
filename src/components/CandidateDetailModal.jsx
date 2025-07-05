
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, Calendar, MapPin, Phone, GraduationCap, Briefcase, Star, FileText, ArrowLeft, X } from "lucide-react";
import { useEffect } from "react";

export function CandidateDetailModal({ candidate, isOpen, onClose }) {
  // Handle Esc key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent background scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

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

  const formatSkills = (skills) => {
    if (!skills) return [];
    return skills.split(/[,;•\n]/)
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] max-h-[90vh] p-0 overflow-hidden flex flex-col m-4">
        {/* Fixed Header - Always visible */}
        <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4 border-b bg-white dark:bg-gray-950 flex-shrink-0 min-h-0">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <Button 
              onClick={onClose}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to List
            </Button>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
                {candidate.candidate_name}
              </DialogTitle>
              <div className="flex gap-2 mt-2 flex-wrap">
                {candidate.vote && (
                  <Badge className={`${getVoteColor(candidate.vote)} font-semibold flex-shrink-0`}>
                    {candidate.vote}/10
                  </Badge>
                )}
                {candidate.consideration && (
                  <Badge className={`${getConsiderationColor(candidate.consideration)} flex-shrink-0`}>
                    {candidate.consideration}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button 
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        {/* Scrollable Content Area - Takes remaining space */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              {/* Contact Information */}
              <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <Phone className="w-5 h-5 text-blue-600" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      {candidate.email ? (
                        <a 
                          href={`mailto:${candidate.email}`} 
                          className="text-blue-600 hover:text-blue-800 hover:underline break-all transition-colors"
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
                          className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        >
                          {candidate.phone}
                        </a>
                      ) : (
                        <span className="text-gray-500">No phone provided</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{candidate.city || "Location not specified"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">DOB: {formatDate(candidate.date_of_birth)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Evaluation Details */}
              <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <Star className="w-5 h-5 text-yellow-600" />
                    Evaluation Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-gray-500">Evaluated On</div>
                        <div className="font-medium text-gray-700 dark:text-gray-300">{formatDate(candidate.evaluation_date)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Star className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-gray-500">Score</div>
                        <div className="font-medium text-gray-700 dark:text-gray-300">
                          {candidate.vote ? `${candidate.vote}/10` : "Not scored"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-gray-500">Status</div>
                        <div className="font-medium text-gray-700 dark:text-gray-300">{candidate.consideration || "Under review"}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Education */}
              <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <GraduationCap className="w-5 h-5 text-purple-600" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    {candidate.education ? (
                      <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                        {candidate.education}
                      </p>
                    ) : (
                      <p className="text-gray-500 italic">No education information provided.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Job History */}
              <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <Briefcase className="w-5 h-5 text-green-600" />
                    Job History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    {candidate.job_history ? (
                      <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                        {candidate.job_history}
                      </p>
                    ) : (
                      <p className="text-gray-500 italic">No job history information provided.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <Star className="w-5 h-5 text-orange-600" />
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {candidate.skills ? (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {formatSkills(candidate.skills).map((skill, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      {formatSkills(candidate.skills).length === 0 && (
                        <div className="prose prose-sm max-w-none">
                          <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                            {candidate.skills}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No skills information provided.</p>
                  )}
                </CardContent>
              </Card>

              {/* AI Summary */}
              <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    AI Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    {candidate.ai_summary ? (
                      <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                        {candidate.ai_summary}
                      </p>
                    ) : (
                      <p className="text-gray-500 italic">No AI summary available.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Extra padding at bottom for better scroll experience */}
              <div className="h-6"></div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
