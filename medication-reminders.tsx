"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Pill, Plus, Clock, Bell, Mic, Volume2, Edit, Trash2, CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

import { Reminder, type IReminder } from "@/entities/Reminder"

interface MedicationRemindersProps {
  onBack: () => void
  userName?: string
}

export default function MedicationReminders({ onBack, userName }: MedicationRemindersProps) {
  const [reminders, setReminders] = useState<IReminder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingReminder, setEditingReminder] = useState<IReminder | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    medication_name: "",
    dosage: "",
    frequency: "daily" as IReminder["frequency"],
    time: "09:00",
    is_active: true,
  })

  useEffect(() => {
    loadReminders()
  }, [])

  const loadReminders = async () => {
    try {
      setIsLoading(true)
      const userId = userName || "demo_user"
      const userReminders = await Reminder.getActiveByUser(userId)
      setReminders(userReminders)
      setIsLoading(false)
    } catch (error) {
      console.error("[v0] Error loading reminders:", error)
      setIsLoading(false)
    }
  }

  const handleAddReminder = async () => {
    try {
      const userId = userName || "demo_user"
      await Reminder.create({
        ...formData,
        user_id: userId,
      })
      await loadReminders()
      setShowAddDialog(false)
      resetForm()
    } catch (error) {
      console.error("[v0] Error adding reminder:", error)
    }
  }

  const handleUpdateReminder = async () => {
    if (!editingReminder?.id) return
    try {
      await Reminder.update(editingReminder.id, formData)
      await loadReminders()
      setEditingReminder(null)
      resetForm()
    } catch (error) {
      console.error("[v0] Error updating reminder:", error)
    }
  }

  const handleDeleteReminder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this reminder?")) return
    try {
      await Reminder.delete(id)
      await loadReminders()
    } catch (error) {
      console.error("[v0] Error deleting reminder:", error)
    }
  }

  const handleToggleActive = async (id: string) => {
    try {
      await Reminder.toggleActive(id)
      await loadReminders()
    } catch (error) {
      console.error("[v0] Error toggling reminder:", error)
    }
  }

  const speakReminder = (reminder: IReminder) => {
    const text = `समय हो गया है ${reminder.medication_name} लेने का। ${reminder.dosage} लें। It's time to take ${reminder.medication_name}, ${reminder.dosage}.`
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "hi-IN"
      speechSynthesis.speak(utterance)
    }
  }

  const openAddDialog = () => {
    resetForm()
    setEditingReminder(null)
    setShowAddDialog(true)
  }

  const openEditDialog = (reminder: IReminder) => {
    setFormData({
      title: reminder.title,
      medication_name: reminder.medication_name,
      dosage: reminder.dosage,
      frequency: reminder.frequency,
      time: reminder.time,
      is_active: reminder.is_active !== false,
    })
    setEditingReminder(reminder)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      medication_name: "",
      dosage: "",
      frequency: "daily",
      time: "09:00",
      is_active: true,
    })
  }

  const getNextReminderTime = () => {
    if (reminders.length === 0) return null
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()

    const upcomingReminders = reminders
      .map((r) => {
        const [hours, minutes] = r.time.split(":").map(Number)
        const reminderTime = hours * 60 + minutes
        return { ...r, reminderTime }
      })
      .filter((r) => r.reminderTime >= currentTime)
      .sort((a, b) => a.reminderTime - b.reminderTime)

    return upcomingReminders[0] || null
  }

  const nextReminder = getNextReminderTime()

  const getFrequencyColor = (frequency: string) => {
    const colorMap: Record<string, string> = {
      daily: "bg-blue-100 text-blue-800",
      twice_daily: "bg-green-100 text-green-800",
      thrice_daily: "bg-orange-100 text-orange-800",
      weekly: "bg-purple-100 text-purple-800",
      as_needed: "bg-gray-100 text-gray-800",
    }
    return colorMap[frequency] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 pb-8 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Medication Reminders</h1>
              <p className="text-purple-100">दवा अनुस्मारक • Medicine Alerts</p>
            </div>
          </div>
          <Button onClick={openAddDialog} className="bg-white text-purple-600 hover:bg-purple-50">
            <Plus className="w-5 h-5 mr-2" />
            Add
          </Button>
        </div>

        {/* Next Reminder Card */}
        {nextReminder && (
          <Card className="bg-white/20 backdrop-blur-sm border-white/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-sm opacity-90">Next Medication • अगली दवा</p>
                  <p className="text-2xl font-bold">{nextReminder.medication_name}</p>
                  <p className="text-lg">{nextReminder.time}</p>
                </div>
                <Bell className="w-10 h-10 animate-pulse" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="p-4 -mt-4 space-y-4">
        {/* Statistics */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <Pill className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{reminders.length}</p>
              <p className="text-xs text-gray-600">Active • सक्रिय</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {reminders.filter((r) => r.frequency === "daily").length}
              </p>
              <p className="text-xs text-gray-600">Daily • दैनिक</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Bell className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {reminders.reduce((acc, r) => {
                  if (r.frequency === "twice_daily") return acc + 2
                  if (r.frequency === "thrice_daily") return acc + 3
                  return acc + 1
                }, 0)}
              </p>
              <p className="text-xs text-gray-600">Today • आज</p>
            </CardContent>
          </Card>
        </div>

        {/* Reminders List */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">All Reminders • सभी अनुस्मारक</h2>
          {isLoading ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">Loading reminders...</CardContent>
            </Card>
          ) : reminders.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Pill className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No medication reminders yet</p>
                <p className="text-sm text-gray-400 mt-1">Add your first reminder to get started</p>
                <Button onClick={openAddDialog} className="mt-4 bg-purple-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Reminder
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {reminders.map((reminder) => (
                <Card
                  key={reminder.id}
                  className={`hover:shadow-md transition-shadow ${!reminder.is_active ? "opacity-60" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Pill className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{reminder.medication_name}</h3>
                            <p className="text-sm text-gray-600">{reminder.title}</p>
                          </div>
                          <Switch
                            checked={reminder.is_active}
                            onCheckedChange={() => handleToggleActive(reminder.id!)}
                          />
                        </div>
                        <p className="text-sm text-purple-700 font-medium mb-2">{reminder.dosage}</p>
                        <div className="flex items-center gap-2 flex-wrap mb-3">
                          <Badge className={getFrequencyColor(reminder.frequency)}>
                            {reminder.frequency.replace("_", " ")}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            {reminder.time}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => speakReminder(reminder)}
                            className="flex-1"
                          >
                            <Volume2 className="w-4 h-4 mr-1" />
                            Listen
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(reminder)}
                            className="flex-1"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteReminder(reminder.id!)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Voice Reminders Info */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4 flex items-start gap-3">
            <Mic className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-blue-900 mb-1">Voice Reminders • आवाज़ अनुस्मारक</h4>
              <p className="text-sm text-blue-800">
                MedEcho will notify you with voice alerts in Hindi and English when it's time to take your medication
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog
        open={showAddDialog || editingReminder !== null}
        onOpenChange={(open) => {
          if (!open) {
            setShowAddDialog(false)
            setEditingReminder(null)
            resetForm()
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingReminder ? "Edit Reminder" : "Add New Reminder"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="medication_name">Medication Name • दवा का नाम</Label>
              <Input
                id="medication_name"
                value={formData.medication_name}
                onChange={(e) => setFormData({ ...formData, medication_name: e.target.value })}
                placeholder="e.g., Paracetamol"
              />
            </div>
            <div>
              <Label htmlFor="title">Reminder Title • शीर्षक</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Pain relief medicine"
              />
            </div>
            <div>
              <Label htmlFor="dosage">Dosage • खुराक</Label>
              <Input
                id="dosage"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                placeholder="e.g., 500mg tablet"
              />
            </div>
            <div>
              <Label htmlFor="frequency">Frequency • आवृत्ति</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value: IReminder["frequency"]) => setFormData({ ...formData, frequency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Once Daily • दिन में एक बार</SelectItem>
                  <SelectItem value="twice_daily">Twice Daily • दिन में दो बार</SelectItem>
                  <SelectItem value="thrice_daily">Thrice Daily • दिन में तीन बार</SelectItem>
                  <SelectItem value="weekly">Weekly • साप्ताहिक</SelectItem>
                  <SelectItem value="as_needed">As Needed • आवश्यकतानुसार</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="time">Time • समय</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={editingReminder ? handleUpdateReminder : handleAddReminder}
                className="flex-1 bg-purple-600"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {editingReminder ? "Update" : "Add"} Reminder
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddDialog(false)
                  setEditingReminder(null)
                  resetForm()
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
