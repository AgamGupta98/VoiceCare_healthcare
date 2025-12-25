import { Heart, Activity, TrendingUp, Target } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function HealthMetrics() {
  const metrics = [
    {
      icon: Heart,
      label: "Heart Rate",
      value: "72 bpm",
      trend: "+2%",
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      icon: Activity,
      label: "Steps",
      value: "8,432",
      trend: "+15%",
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      icon: Target,
      label: "Sleep",
      value: "7.2h",
      trend: "-5%",
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        return (
          <Card key={index} className="shadow-sm">
            <CardContent className="p-4">
              <div className={`w-10 h-10 ${metric.bg} rounded-lg flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-600">{metric.label}</p>
                <p className="font-bold text-gray-900">{metric.value}</p>
                <div className="flex items-center gap-1">
                  <TrendingUp
                    className={`w-3 h-3 ${metric.trend.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                  />
                  <span className={`text-xs ${metric.trend.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                    {metric.trend}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
