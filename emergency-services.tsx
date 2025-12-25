"use client"

import { useState } from "react"
import { Phone, MapPin, Ambulance, Heart, AlertTriangle, Navigation } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function EmergencyServices() {
  const [nearbyHospitals, setNearbyHospitals] = useState([
    {
      id: 1,
      name: "City General Hospital",
      distance: "1.2 km",
      phone: "+91 98765 00001",
      address: "Main Road, City Center",
      hasEmergency: true,
    },
    {
      id: 2,
      name: "Medical Center",
      distance: "2.8 km",
      phone: "+91 98765 00002",
      address: "Park Street, Central Area",
      hasEmergency: true,
    },
    {
      id: 3,
      name: "Community Hospital",
      distance: "4.5 km",
      phone: "+91 98765 00003",
      address: "Green Valley, North Zone",
      hasEmergency: true,
    },
  ])

  const callNumber = (number: string) => {
    window.location.href = `tel:${number}`
  }

  const getDirections = (address: string) => {
    // Open Google Maps with the address
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, "_blank")
  }

  const nationalEmergencyNumbers = [
    { name: "Medical Emergency", number: "108", icon: Heart, color: "bg-red-500" },
    { name: "Police", number: "100", icon: AlertTriangle, color: "bg-blue-500" },
    { name: "Fire Brigade", number: "101", icon: AlertTriangle, color: "bg-orange-500" },
    { name: "Women Helpline", number: "1091", icon: Heart, color: "bg-purple-500" },
  ]

  return (
    <div className="min-h-screen bg-red-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Emergency Services</h1>
        </div>
        <p className="text-red-100">आपातकालीन सेवाएं • Immediate Help Available</p>
      </div>

      <div className="p-4 space-y-6">
        {/* National Emergency Numbers */}
        <Card className="border-2 border-red-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Phone className="w-5 h-5 text-red-600" />
              National Emergency Numbers
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {nationalEmergencyNumbers.map((emergency) => {
              const Icon = emergency.icon
              return (
                <Button
                  key={emergency.number}
                  onClick={() => callNumber(emergency.number)}
                  className={`${emergency.color} hover:opacity-90 h-auto flex-col py-4 text-white`}
                >
                  <Icon className="w-6 h-6 mb-2" />
                  <div className="text-xs font-medium mb-1">{emergency.name}</div>
                  <div className="text-xl font-bold">{emergency.number}</div>
                </Button>
              )
            })}
          </CardContent>
        </Card>

        {/* Quick SOS Button */}
        <Card className="border-2 border-red-300 bg-gradient-to-r from-red-50 to-orange-50">
          <CardContent className="p-4">
            <Button
              onClick={() => callNumber("108")}
              className="w-full bg-red-600 hover:bg-red-700 h-16 text-xl font-bold text-white animate-pulse"
            >
              <Ambulance className="w-8 h-8 mr-3" />
              Call Ambulance - 108
            </Button>
          </CardContent>
        </Card>

        {/* Nearby Emergency Hospitals */}
        <Card className="border-2 border-red-200">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              Nearby Emergency Hospitals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {nearbyHospitals.map((hospital) => (
              <Card key={hospital.id} className="border border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{hospital.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Navigation className="w-4 h-4" />
                        <span>{hospital.distance} away</span>
                      </div>
                      <p className="text-xs text-gray-500">{hospital.address}</p>
                    </div>
                    {hospital.hasEmergency && (
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-300">24/7 Emergency</Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => callNumber(hospital.phone)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                    <Button
                      onClick={() => getDirections(hospital.address)}
                      variant="outline"
                      className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Emergency Tips */}
        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              Emergency Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-700">
            <p>• Stay calm and speak clearly when calling emergency services</p>
            <p>• Provide your exact location and the nature of emergency</p>
            <p>• Follow the operator's instructions carefully</p>
            <p>• Keep important medical information accessible</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
