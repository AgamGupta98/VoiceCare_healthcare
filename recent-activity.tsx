"use client"

import { Clock, AlertTriangle, CheckCircle, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import type { IHealthRecord } from "@/entities/HealthRecord"

interface RecentActivityProps {
  records: IHealthRecord[]
}

export default function RecentActivity({ records }: RecentActivityProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "emergency":
        return "bg-red-100 text-red-800 border-red-300"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 border-green-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "emergency":
      case "high":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently"
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (hours < 1) return "Just now"
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" })
  }

  if (records.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-600" />
            Recent Activity • हाल की गतिविधि
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No recent health consultations</p>
            <p className="text-sm text-gray-400 mt-1">Start by using VoiceCare to check your symptoms</p>
            <p className="text-sm text-gray-400">लक्षणों की जांच के लिए VoiceCare का उपयोग करें</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-600" />
          Recent Activity • हाल की गतिविधि
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {records.map((record) => (
          <div
            key={record.id}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {getSeverityIcon(record.severity)}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{record.symptoms}</p>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{record.ai_recommendation}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge className={getSeverityColor(record.severity)}>{record.severity}</Badge>
                <span className="text-xs text-gray-500">{formatDate(record.created_date)}</span>
                {record.consultation_type && (
                  <Badge variant="outline" className="text-xs">
                    {record.consultation_type.replace("_", " ")}
                  </Badge>
                )}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
