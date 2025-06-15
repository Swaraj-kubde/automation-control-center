
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, 
  TrendingUp, 
  Clock, 
  Users, 
  Zap, 
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Timer,
  Brain
} from "lucide-react";

// Mock data representing what would come from n8n workflows
const pipelineStages = [
  { name: "New Leads", count: 42, color: "bg-blue-500" },
  { name: "Contacted", count: 28, color: "bg-yellow-500" },
  { name: "Qualified", count: 18, color: "bg-green-500" },
  { name: "Demo Scheduled", count: 12, color: "bg-purple-500" },
  { name: "Proposal Sent", count: 8, color: "bg-orange-500" },
];

const qualifiedLeads = [
  {
    id: 1,
    name: "TechCorp Solutions",
    contact: "Sarah Johnson",
    email: "sarah@techcorp.com",
    score: 92,
    stage: "Demo Scheduled",
    lastActivity: "2 hours ago",
    source: "Website Form",
    companySize: "50-100",
    priority: "High",
    engagementLevel: 85,
    nextAction: "Demo call at 2 PM today",
    aiInsights: "High buying intent - mentioned budget approval in last email"
  },
  {
    id: 2,
    name: "GrowthScale Inc",
    contact: "Mike Chen",
    email: "mike@growthscale.com",
    score: 87,
    stage: "Qualified",
    lastActivity: "1 day ago",
    source: "LinkedIn",
    companySize: "100-500",
    priority: "High",
    engagementLevel: 78,
    nextAction: "Schedule demo call",
    aiInsights: "Decision maker confirmed - showing strong interest in automation"
  },
  {
    id: 3,
    name: "DataFlow Systems",
    contact: "Lisa Rodriguez",
    email: "lisa@dataflow.com",
    score: 76,
    stage: "Contacted",
    lastActivity: "3 hours ago",
    source: "Referral",
    companySize: "20-50",
    priority: "Medium",
    engagementLevel: 65,
    nextAction: "Follow-up email scheduled",
    aiInsights: "Exploring options - needs ROI case study"
  },
  {
    id: 4,
    name: "AutoMate Pro",
    contact: "David Kim",
    email: "david@automatepr.com",
    score: 94,
    stage: "Proposal Sent",
    lastActivity: "30 minutes ago",
    source: "Website",
    companySize: "200+",
    priority: "Hot",
    engagementLevel: 92,
    nextAction: "Follow up on proposal",
    aiInsights: "Ready to close - legal team reviewing contract terms"
  },
];

const teamPerformance = [
  { name: "Alex Thompson", responseTime: "12 min", conversionRate: "28%", leadsAssigned: 15 },
  { name: "Maria Garcia", responseTime: "8 min", conversionRate: "32%", leadsAssigned: 18 },
  { name: "John Williams", responseTime: "15 min", conversionRate: "24%", leadsAssigned: 12 },
];

const automationMetrics = {
  leadsProcessed: 156,
  autoResponses: 89,
  qualificationAccuracy: 94,
  timesSaved: "47 hours",
};

export function LeadQualificationPipeline() {
  const [selectedLead, setSelectedLead] = useState(null);

  const getScoreColor = (score) => {
    if (score >= 90) return "text-red-600 bg-red-50";
    if (score >= 80) return "text-orange-600 bg-orange-50";
    if (score >= 70) return "text-yellow-600 bg-yellow-50";
    return "text-gray-600 bg-gray-50";
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Hot": return "bg-red-100 text-red-800 border-red-200";
      case "High": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Lead Qualification Pipeline</h2>
          <p className="text-gray-600 dark:text-gray-400">AI-powered lead scoring and qualification automation</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Zap className="w-3 h-3 mr-1" />
            n8n Active
          </Badge>
          <Button variant="outline" size="sm">
            <Brain className="w-4 h-4 mr-2" />
            Configure AI
          </Button>
        </div>
      </div>

      {/* Pipeline Overview */}
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Pipeline Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center space-x-4">
            {pipelineStages.map((stage, index) => (
              <div key={stage.name} className="flex-1">
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full ${stage.color} text-white flex items-center justify-center mx-auto mb-2 text-lg font-bold`}>
                    {stage.count}
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{stage.name}</p>
                </div>
                {index < pipelineStages.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-gray-400 mx-auto mt-2" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Automation Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Leads Processed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{automationMetrics.leadsProcessed}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Auto Responses</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{automationMetrics.autoResponses}</p>
              </div>
              <Zap className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">AI Accuracy</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{automationMetrics.qualificationAccuracy}%</p>
              </div>
              <Brain className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Time Saved</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{automationMetrics.timesSaved}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="qualified-leads" className="space-y-4">
        <TabsList>
          <TabsTrigger value="qualified-leads">Qualified Leads</TabsTrigger>
          <TabsTrigger value="team-performance">Team Performance</TabsTrigger>
          <TabsTrigger value="hot-alerts">Hot Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="qualified-leads">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle>AI-Qualified Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qualifiedLeads.map((lead) => (
                  <div key={lead.id} className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{lead.name}</h3>
                        <Badge className={getPriorityColor(lead.priority)}>
                          {lead.priority}
                        </Badge>
                        <Badge className={`${getScoreColor(lead.score)} border`}>
                          Score: {lead.score}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{lead.stage}</p>
                        <p className="text-xs text-gray-500">{lead.lastActivity}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Contact</p>
                        <p className="text-sm font-medium dark:text-gray-100">{lead.contact}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Company Size</p>
                        <p className="text-sm font-medium dark:text-gray-100">{lead.companySize}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Source</p>
                        <p className="text-sm font-medium dark:text-gray-100">{lead.source}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Engagement</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={lead.engagementLevel} className="h-2 flex-1" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{lead.engagementLevel}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-3 mb-3">
                      <div className="flex items-start space-x-2">
                        <Brain className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">AI Insights</p>
                          <p className="text-sm text-blue-800 dark:text-blue-300">{lead.aiInsights}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Timer className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Next: {lead.nextAction}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        <Button size="sm">
                          Take Action
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team-performance">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamPerformance.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{member.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{member.leadsAssigned} leads assigned</p>
                    </div>
                    <div className="flex space-x-6 text-center">
                      <div>
                        <p className="text-sm text-gray-500">Response Time</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{member.responseTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Conversion Rate</p>
                        <p className="font-semibold text-green-600">{member.conversionRate}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hot-alerts">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                Hot Alerts & Urgent Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <div>
                      <p className="font-medium text-red-800 dark:text-red-300">AutoMate Pro - Proposal Response Overdue</p>
                      <p className="text-sm text-red-600 dark:text-red-400">High-value lead hasn't responded to proposal sent 2 days ago</p>
                    </div>
                  </div>
                  <Button size="sm" variant="destructive">
                    Follow Up Now
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <div>
                      <p className="font-medium text-orange-800 dark:text-orange-300">TechCorp Solutions - Demo in 1 hour</p>
                      <p className="text-sm text-orange-600 dark:text-orange-400">Prepare demo materials and case studies</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Prepare Demo
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-300">3 New High-Score Leads</p>
                      <p className="text-sm text-green-600 dark:text-green-400">AI identified 3 leads with 85+ scores requiring immediate contact</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Review Leads
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
