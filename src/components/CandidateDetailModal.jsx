import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Calendar, MapPin, Phone, GraduationCap, Briefcase, Star, FileText, ArrowLeft } from "lucide-react";

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            {candidate.candidate_name}
            <div className="flex gap-2">
              {candidate.vote && (
                <Badge className={getVoteColor(candidate.vote)}>
                  {candidate.vote}/10
                </Badge>
              )}
              {candidate.consideration && (
                <Badge className={getConsiderationColor(candidate.consideration)}>
                  {candidate.consideration}
                </Badge>
              )}
            </div>
          </DialogTitle>
          <Button 
            onClick={onClose}
            variant="outline"
            className="flex items-center gap-2 ml-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to List
          </Button>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                {candidate.email ? (
                  <a href={`mailto:${candidate.email}`} className="text-blue-600 hover:underline">
                    {candidate.email}
                  </a>
                ) : (
                  <span className="text-gray-500">-</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>{candidate.phone || "-"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>{candidate.city || "-"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>DOB: {formatDate(candidate.date_of_birth)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Evaluation Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="w-5 h-5" />
                Evaluation Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>Evaluated: {formatDate(candidate.evaluation_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-gray-500" />
                <span>Score: {candidate.vote ? `${candidate.vote}/10` : "-"}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span>Status: {candidate.consideration || "-"}</span>
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {candidate.education || "No education information provided."}
              </p>
            </CardContent>
          </Card>

          {/* Job History */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Job History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {candidate.job_history || "No job history information provided."}
              </p>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="w-5 h-5" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {candidate.skills || "No skills information provided."}
              </p>
            </CardContent>
          </Card>

          {/* AI Summary */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                AI Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {candidate.ai_summary || "No AI summary available."}
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
