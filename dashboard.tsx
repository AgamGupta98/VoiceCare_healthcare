"use client"

import { useState, useEffect } from "react"
import { Search, Heart, Tablet, ShoppingBasket, Calendar, Bell, MapPin, Phone, Mic } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

import HealthMetrics from "./home/health-metrics"
import RecentActivity from "./home/recent-activity"
import HealthTips from "./home/health-tips"
import NotificationBell from "./notifications/notification-bell"
import ReminderCard from "./notifications/reminder-card"

import { HealthRecord, type IHealthRecord } from "@/entities/HealthRecord"
import { Reminder, type IReminder } from "@/entities/Reminder"
import { Consultation, type IConsultation } from "@/entities/Consultation"
import { initializeAllSampleData } from "@/entities"

interface DashboardProps {
  userName?: string
  onNavigate?: (page: string) => void
}

export default function Dashboard({ userName, onNavigate }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [recentRecords, setRecentRecords] = useState<IHealthRecord[]>([])
  const [activeReminders, setActiveReminders] = useState<IReminder[]>([])
  const [todaysReminders, setTodaysReminders] = useState<IReminder[]>([])
  const [upcomingConsultations, setUpcomingConsultations] = useState<IConsultation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)

      // Initialize sample data on first load
      await initializeAllSampleData()

      // Get user ID (in real app, this would come from auth)
      const userId = userName || "demo_user"

      // Load health records
      const records = await HealthRecord.getRecentByUser(userId, 5)
      setRecentRecords(records)

      // Load active reminders
      const reminders = await Reminder.getActiveByUser(userId)
      setActiveReminders(reminders)

      // Filter today's due reminders (within 2 hours)
      const now = new Date()
      const currentHour = now.getHours()
      const todaysDue = reminders.filter((reminder) => {
        const [hour] = reminder.time.split(":")
        return Number.parseInt(hour) >= currentHour - 1 && Number.parseInt(hour) <= currentHour + 2
      })
      setTodaysReminders(todaysDue)

      // Load upcoming consultations
      const consultations = await Consultation.getUpcomingByUser(userId)
      setUpcomingConsultations(consultations.slice(0, 3))

      setIsLoading(false)
    } catch (error) {
      console.error("[v0] Error loading dashboard data:", error)
      setIsLoading(false)
    }
  }

  const handleReminderTaken = async (reminder: IReminder) => {
    console.log("[v0] Marking reminder as taken:", reminder.id)
    setTodaysReminders((prev) => prev.filter((r) => r.id !== reminder.id))
    // In real app, we would update the reminder's last_taken timestamp
  }

  const handleQuickAction = (page: string) => {
    if (onNavigate) {
      onNavigate(page)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 rounded-b-3xl text-white">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">MedEcho</h1>
            <p className="text-emerald-100">आपका स्वास्थ्य साथी • Your Health Companion</p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell count={todaysReminders.length} />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="बोलें या टाइप करें • Speak or Type symptoms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-emerald-100 rounded-xl"
          />
        </div>
      </div>

      <div className="p-4 space-y-6 -mt-4">
        {/* Health Metrics */}
        <HealthMetrics />

        {/* Urgent Reminders Alert */}
        {todaysReminders.length > 0 && (
          <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-red-800">
                <Bell className="w-5 h-5 animate-pulse" />
                Medicine Time! • दवा का समय!
                <Badge className="bg-red-500 text-white">Urgent • तत्काल</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaysReminders.slice(0, 2).map((reminder) => (
                  <ReminderCard key={reminder.id} reminder={reminder} onTaken={handleReminderTaken} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions • त्वरित सेवा</h3>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <button
                onClick={() => handleQuickAction("VoiceCare")}
                className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                  <Mic className="w-6 h-6 text-emerald-600" />
                </div>
                <span className="text-xs font-medium text-gray-700 text-center">
                  Voice Check
                  <br />
                  आवाज़ जांच
                </span>
              </button>

              <button
                onClick={() => handleQuickAction("Services")}
                className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-gray-700 text-center">
                  Book Doctor
                  <br />
                  डॉक्टर बुक
                </span>
              </button>

              <button
                onClick={() => handleQuickAction("Locations")}
                className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-xs font-medium text-gray-700 text-center">
                  Near Me
                  <br />
                  नज़दीकी
                </span>
              </button>

              <button
                onClick={() => handleQuickAction("Services")}
                className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                  <ShoppingBasket className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-xs font-medium text-gray-700 text-center">
                  Shop
                  <br />
                  खरीदें
                </span>
              </button>
            </div>

            {/* Emergency Button */}
            <button
              onClick={() => handleQuickAction("Emergency")}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
            >
              <Phone className="w-5 h-5" />
              <span className="font-semibold">Emergency • आपातकाल</span>
            </button>
          </CardContent>
        </Card>

        {upcomingConsultations.length > 0 && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Calendar className="w-5 h-5" />
                Upcoming Appointments • आगामी अपॉइंटमेंट
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {upcomingConsultations.map((consultation) => (
                  <div key={consultation.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{consultation.doctor_name}</p>
                      <p className="text-sm text-gray-600">{consultation.specialization}</p>
                      <p className="text-xs text-blue-600 mt-1">
                        {new Date(consultation.appointment_date).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-blue-700 border-blue-300">
                      {consultation.consultation_type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <RecentActivity records={recentRecords} />

        {/* Today's Reminders */}
        {activeReminders.length > 0 && (
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Tablet className="w-5 h-5" />
                Today's Reminders • आज की दवाएं
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {activeReminders.slice(0, 3).map((reminder) => (
                  <div key={reminder.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{reminder.medication_name}</p>
                      <p className="text-sm text-gray-600">
                        {reminder.dosage} • {reminder.time}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-green-700 border-green-300">
                      {reminder.frequency.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Health Shopping */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <ShoppingBasket className="w-5 h-5 text-emerald-600" />
              Health & Wellness • स्वास्थ्य शॉपिंग
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleQuickAction("Services")}
                className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:shadow-md transition-shadow"
              >
                <Tablet className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Medicines</h3>
                <p className="text-sm text-gray-600">Order prescriptions • दवाएं</p>
              </button>
              <button
                onClick={() => handleQuickAction("Services")}
                className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg hover:shadow-md transition-shadow"
              >
                <Heart className="w-8 h-8 text-orange-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Health Devices</h3>
                <p className="text-sm text-gray-600">BP monitors, etc • यंत्र</p>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Health Tips */}
        <HealthTips />
      </div>
    </div>
  )
}
