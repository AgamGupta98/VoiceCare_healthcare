"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Mic,
  MapPin,
  Star,
  Calendar,
  Phone,
  Stethoscope,
  Volume2,
  Clock,
  Filter,
  CheckCircle,
  Video,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import { Doctor, type IDoctor } from "@/entities/Doctor"
import { Consultation, type IConsultation } from "@/entities/Consultation"

interface DoctorBookingProps {
  onBack: () => void
  userName?: string
}

export default function DoctorBooking({ onBack, userName }: DoctorBookingProps) {
  const [doctors, setDoctors] = useState<IDoctor[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<IDoctor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState<IDoctor | null>(null)
  const [showBookingDialog, setShowBookingDialog] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [specializationFilter, setSpecializationFilter] = useState<string>("all")
  const [bookingData, setBookingData] = useState({
    appointment_date: "",
    appointment_time: "10:00",
    consultation_type: "video" as IConsultation["consultation_type"],
    notes: "",
  })

  useEffect(() => {
    loadDoctors()
  }, [])

  useEffect(() => {
    filterDoctors()
  }, [searchQuery, specializationFilter, doctors])

  const loadDoctors = async () => {
    try {
      setIsLoading(true)
      const allDoctors = await Doctor.getAll()
      setDoctors(allDoctors)
      setFilteredDoctors(allDoctors)
      setIsLoading(false)
    } catch (error) {
      console.error("[v0] Error loading doctors:", error)
      setIsLoading(false)
    }
  }

  const filterDoctors = () => {
    let filtered = [...doctors]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (doc) =>
          doc.name.toLowerCase().includes(query) ||
          doc.specialization.toLowerCase().includes(query) ||
          (doc.clinic_address && doc.clinic_address.toLowerCase().includes(query)),
      )
    }

    if (specializationFilter !== "all") {
      filtered = filtered.filter((doc) => doc.specialization === specializationFilter)
    }

    setFilteredDoctors(filtered)
  }

  const startVoiceSearch = async () => {
    setIsListening(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" })
        const formData = new FormData()
        formData.append("file", audioBlob, "audio.webm")
        formData.append("model_id", "scribe_v1")

        try {
          const response = await fetch("https://elevenlabs-proxy-server-lipn.onrender.com/v1/speech-to-text", {
            method: "POST",
            headers: {
              customerId: "null",
              Authorization: "Bearer xxx",
            },
            body: formData,
          })

          const data = await response.json()
          setSearchQuery(data.text || "")
        } catch (error) {
          console.error("[v0] Error with STT:", error)
        }

        stream.getTracks().forEach((track) => track.stop())
        setIsListening(false)
      }

      mediaRecorder.start()
      setTimeout(() => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop()
        }
      }, 5000)
    } catch (error) {
      console.error("[v0] Error with voice search:", error)
      setIsListening(false)
    }
  }

  const openBookingDialog = (doctor: IDoctor) => {
    setSelectedDoctor(doctor)
    setShowBookingDialog(true)
    // Set minimum date to today
    const today = new Date().toISOString().split("T")[0]
    setBookingData({ ...bookingData, appointment_date: today })
  }

  const confirmBooking = async () => {
    if (!selectedDoctor || !bookingData.appointment_date) return

    try {
      const userId = userName || "demo_user"
      const appointmentDateTime = `${bookingData.appointment_date}T${bookingData.appointment_time}:00`

      await Consultation.create({
        user_id: userId,
        doctor_name: selectedDoctor.name,
        doctor_phone: selectedDoctor.phone,
        specialization: selectedDoctor.specialization,
        appointment_date: appointmentDateTime,
        consultation_type: bookingData.consultation_type,
        notes: bookingData.notes,
        cost: selectedDoctor.consultation_fee,
      })

      setBookingSuccess(true)
      setTimeout(() => {
        setShowBookingDialog(false)
        setBookingSuccess(false)
        setSelectedDoctor(null)
        setBookingData({
          appointment_date: "",
          appointment_time: "10:00",
          consultation_type: "video",
          notes: "",
        })
      }, 2000)
    } catch (error) {
      console.error("[v0] Error booking consultation:", error)
    }
  }

  const makeCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  const getConsultationIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />
      case "phone":
        return <Phone className="w-4 h-4" />
      case "in_person":
        return <User className="w-4 h-4" />
      default:
        return null
    }
  }

  const specializations = Array.from(new Set(doctors.map((d) => d.specialization)))

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 pb-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Find a Doctor</h1>
            <p className="text-blue-100">डॉक्टर खोजें • Book Consultation</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Search by name, specialty, location... • खोजें"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-4 py-3 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-blue-100 rounded-xl"
            />
          </div>
          <Button
            size="icon"
            onClick={startVoiceSearch}
            disabled={isListening}
            className="bg-white text-blue-600 hover:bg-blue-50 rounded-xl w-12 h-12 flex-shrink-0"
          >
            {isListening ? <Volume2 className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
          </Button>
        </div>

        {/* Filter */}
        <div className="mt-3">
          <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
            <SelectTrigger className="bg-white/20 backdrop-blur-sm border-white/30 text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Specializations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specializations • सभी विशेषज्ञता</SelectItem>
              {specializations.map((spec) => (
                <SelectItem key={spec} value={spec}>
                  {spec.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-4 -mt-4 space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">Loading doctors...</CardContent>
          </Card>
        ) : filteredDoctors.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No doctors found • कोई डॉक्टर नहीं मिला</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        ) : (
          filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Stethoscope className="w-8 h-8 text-blue-700" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{doctor.name}</h3>
                        <p className="text-sm text-gray-600">{doctor.qualification}</p>
                      </div>
                      {doctor.is_available_now && <Badge className="bg-green-500 text-white">Available • उपलब्ध</Badge>}
                    </div>
                    <Badge variant="outline" className="mb-2">
                      {doctor.specialization.replace("_", " ")}
                    </Badge>
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      {doctor.experience_years && (
                        <p className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {doctor.experience_years}+ years experience
                        </p>
                      )}
                      {doctor.clinic_address && (
                        <p className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {doctor.clinic_address}
                        </p>
                      )}
                      {doctor.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium">{doctor.rating}</span>
                        </div>
                      )}
                      {doctor.consultation_fee && (
                        <p className="text-green-600 font-medium">Consultation: ₹{doctor.consultation_fee}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => openBookingDialog(doctor)} className="flex-1 bg-blue-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        Book • बुक करें
                      </Button>
                      <Button onClick={() => makeCall(doctor.phone)} variant="outline" className="flex-1">
                        <Phone className="w-4 h-4 mr-1" />
                        Call • कॉल
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-md">
          {bookingSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
              <p className="text-gray-600">Your consultation has been scheduled successfully</p>
              <p className="text-sm text-gray-500 mt-1">आपकी बुकिंग हो गई है</p>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Book Consultation • परामर्श बुक करें</DialogTitle>
              </DialogHeader>
              {selectedDoctor && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="font-semibold text-gray-900">{selectedDoctor.name}</p>
                    <p className="text-sm text-gray-600">{selectedDoctor.specialization.replace("_", " ")}</p>
                    {selectedDoctor.consultation_fee && (
                      <p className="text-sm text-green-600 mt-1">Fee: ₹{selectedDoctor.consultation_fee}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="appointment_date">Appointment Date • तारीख</Label>
                    <Input
                      id="appointment_date"
                      type="date"
                      value={bookingData.appointment_date}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setBookingData({ ...bookingData, appointment_date: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="appointment_time">Time • समय</Label>
                    <Input
                      id="appointment_time"
                      type="time"
                      value={bookingData.appointment_time}
                      onChange={(e) => setBookingData({ ...bookingData, appointment_time: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="consultation_type">Consultation Type • परामर्श प्रकार</Label>
                    <Select
                      value={bookingData.consultation_type}
                      onValueChange={(value: IConsultation["consultation_type"]) =>
                        setBookingData({ ...bookingData, consultation_type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">
                          <div className="flex items-center gap-2">
                            <Video className="w-4 h-4" />
                            Video Call • वीडियो कॉल
                          </div>
                        </SelectItem>
                        <SelectItem value="phone">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Phone Call • फोन कॉल
                          </div>
                        </SelectItem>
                        <SelectItem value="in_person">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            In Person • व्यक्तिगत
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes • टिप्पणी (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Describe your symptoms or reason for consultation..."
                      value={bookingData.notes}
                      onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={confirmBooking} className="flex-1 bg-blue-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Confirm Booking
                    </Button>
                    <Button variant="outline" onClick={() => setShowBookingDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
