"use client"

import { useState, useEffect } from "react"
import {
  Phone,
  Ambulance,
  Hospital,
  Shield,
  Flame,
  HeartPulse,
  AlertCircle,
  ArrowLeft,
  Navigation,
  MapPin,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { EmergencyContact, type IEmergencyContact } from "@/entities/EmergencyContact"
import { Clinic, type IClinic } from "@/entities/Clinic"

interface EmergencyProps {
  onBack?: () => void
}

export default function Emergency({ onBack }: EmergencyProps) {
  const [emergencyContacts, setEmergencyContacts] = useState<IEmergencyContact[]>([])
  const [nearbyEmergencyClinics, setNearbyEmergencyClinics] = useState<IClinic[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadEmergencyData()
  }, [])

  const loadEmergencyData = async () => {
    try {
      setIsLoading(true)

      const contacts = await EmergencyContact.getAll()
      setEmergencyContacts(contacts)

      // Get clinics with emergency services
      const allClinics = await Clinic.getAll()
      const emergencyClinics = allClinics.filter((clinic) => clinic.has_emergency)
      setNearbyEmergencyClinics(emergencyClinics)

      setIsLoading(false)
    } catch (error) {
      console.error("[v0] Error loading emergency data:", error)
      setIsLoading(false)
    }
  }

  const makeEmergencyCall = (phone: string, name: string) => {
    if (confirm(`Call ${name} at ${phone}?`)) {
      window.location.href = `tel:${phone}`
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "ambulance":
        return <Ambulance className="w-6 h-6" />
      case "hospital":
        return <Hospital className="w-6 h-6" />
      case "police":
        return <Shield className="w-6 h-6" />
      case "fire":
        return <Flame className="w-6 h-6" />
      case "poison_control":
        return <HeartPulse className="w-6 h-6" />
      case "women_helpline":
        return <Phone className="w-6 h-6" />
      default:
        return <Phone className="w-6 h-6" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "ambulance":
        return "from-red-500 to-red-600"
      case "hospital":
        return "from-blue-500 to-blue-600"
      case "police":
        return "from-indigo-500 to-indigo-600"
      case "fire":
        return "from-orange-500 to-orange-600"
      case "poison_control":
        return "from-purple-500 to-purple-600"
      case "women_helpline":
        return "from-pink-500 to-pink-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  const getTypeBg = (type: string) => {
    switch (type) {
      case "ambulance":
        return "bg-red-100"
      case "hospital":
        return "bg-blue-100"
      case "police":
        return "bg-indigo-100"
      case "fire":
        return "bg-orange-100"
      case "poison_control":
        return "bg-purple-100"
      case "women_helpline":
        return "bg-pink-100"
      default:
        return "bg-gray-100"
    }
  }

  const openMaps = (latitude?: number, longitude?: number, address?: string) => {
    if (latitude && longitude) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, "_blank")
    } else if (address) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, "_blank")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 pb-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <AlertCircle className="w-7 h-7 animate-pulse" />
              Emergency Services
            </h1>
            <p className="text-red-100">आपातकालीन सेवाएं • Quick Help</p>
          </div>
        </div>

        <Alert className="bg-white/20 border-white/30 text-white">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="text-white">
            In case of emergency, call 108 for immediate ambulance service or 112 for all emergencies.
            <br />
            आपातकाल में तुरंत 108 या 112 पर कॉल करें।
          </AlertDescription>
        </Alert>
      </div>

      <div className="p-4 -mt-4 space-y-6">
        {/* Primary Emergency Numbers */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Phone className="w-5 h-5 text-red-600" />
            Primary Emergency Numbers • प्राथमिक नंबर
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => makeEmergencyCall("108", "Ambulance")}
              className="p-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow active:scale-95"
            >
              <Ambulance className="w-10 h-10 mx-auto mb-2" />
              <p className="font-bold text-2xl">108</p>
              <p className="text-sm text-red-100">Ambulance • एम्बुलेंस</p>
            </button>

            <button
              onClick={() => makeEmergencyCall("102", "Medical Emergency")}
              className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow active:scale-95"
            >
              <HeartPulse className="w-10 h-10 mx-auto mb-2" />
              <p className="font-bold text-2xl">102</p>
              <p className="text-sm text-blue-100">Medical • चिकित्सा</p>
            </button>

            <button
              onClick={() => makeEmergencyCall("112", "All Emergencies")}
              className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow active:scale-95"
            >
              <AlertCircle className="w-10 h-10 mx-auto mb-2" />
              <p className="font-bold text-2xl">112</p>
              <p className="text-sm text-purple-100">All Emergency • सभी</p>
            </button>

            <button
              onClick={() => makeEmergencyCall("100", "Police")}
              className="p-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow active:scale-95"
            >
              <Shield className="w-10 h-10 mx-auto mb-2" />
              <p className="font-bold text-2xl">100</p>
              <p className="text-sm text-indigo-100">Police • पुलिस</p>
            </button>
          </div>
        </div>

        {/* All Emergency Contacts */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">All Emergency Contacts • सभी आपातकालीन संपर्क</h2>
          <div className="space-y-3">
            {isLoading ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">Loading emergency contacts...</CardContent>
              </Card>
            ) : emergencyContacts.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">No emergency contacts found</CardContent>
              </Card>
            ) : (
              emergencyContacts.map((contact) => (
                <Card key={contact.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-14 h-14 ${getTypeBg(contact.type)} rounded-xl flex items-center justify-center`}
                      >
                        {getTypeIcon(contact.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                        <p className="text-sm text-gray-600">{contact.description}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {contact.type.replace("_", " ")}
                          </Badge>
                          {contact.is_toll_free && (
                            <Badge className="bg-green-500 text-white text-xs">Toll Free • मुफ्त</Badge>
                          )}
                          {contact.availability && (
                            <span className="text-xs text-gray-500">{contact.availability}</span>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => makeEmergencyCall(contact.phone, contact.name)}
                        className={`bg-gradient-to-r ${getTypeColor(contact.type)} text-white`}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        {contact.phone}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Nearby Emergency Hospitals */}
        {nearbyEmergencyClinics.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Hospital className="w-5 h-5 text-blue-600" />
              Nearby Emergency Hospitals • नज़दीकी अस्पताल
            </h2>
            <div className="space-y-3">
              {nearbyEmergencyClinics.map((clinic) => (
                <Card key={clinic.id} className="hover:shadow-md transition-shadow border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Hospital className="w-6 h-6 text-red-700" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{clinic.name}</h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span className="line-clamp-1">{clinic.address}</span>
                        </div>
                        {clinic.emergency_phone && (
                          <p className="text-sm text-red-600 font-medium mt-1">Emergency: {clinic.emergency_phone}</p>
                        )}
                        <div className="flex gap-1 mt-2 flex-wrap">
                          <Badge className="bg-red-500 text-white text-xs">24/7 Emergency</Badge>
                          {clinic.has_ambulance && (
                            <Badge className="bg-orange-500 text-white text-xs">Ambulance Available</Badge>
                          )}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            onClick={() => makeEmergencyCall(clinic.emergency_phone || clinic.phone, clinic.name)}
                            className="flex-1 bg-red-600"
                          >
                            <Phone className="w-4 h-4 mr-1" />
                            Call • कॉल
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openMaps(clinic.latitude, clinic.longitude, clinic.address)}
                            className="flex-1"
                          >
                            <Navigation className="w-4 h-4 mr-1" />
                            Navigate • मार्ग
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Emergency Tips */}
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <AlertCircle className="w-5 h-5" />
              Emergency Tips • आपातकालीन सुझाव
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>Stay calm and speak clearly when calling emergency services</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>Provide your exact location and nature of emergency</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>Don't hang up until the operator tells you to</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>Keep emergency contacts saved in your phone</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
