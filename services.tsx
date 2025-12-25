"use client"

import { useState } from "react"
import { MapPin, Navigation, Phone, Clock, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Services() {
  const [doctors, setDoctors] = useState([
    {
      id: 1,
      name: "Dr. Ramesh Kumar",
      specialty: "General Physician",
      distance: "1.2 km",
      rating: 4.5,
      experience: "15 years",
      phone: "9876543210",
      address: "MG Road, Bangalore",
      timing: "9 AM - 6 PM",
      available: true,
    },
    {
      id: 2,
      name: "Dr. Priya Sharma",
      specialty: "Pediatrician",
      distance: "2.5 km",
      rating: 4.8,
      experience: "12 years",
      phone: "9876543211",
      address: "Indiranagar, Bangalore",
      timing: "10 AM - 7 PM",
      available: true,
    },
    {
      id: 3,
      name: "Dr. Anil Patel",
      specialty: "Cardiologist",
      distance: "3.1 km",
      rating: 4.6,
      experience: "20 years",
      phone: "9876543212",
      address: "Koramangala, Bangalore",
      timing: "11 AM - 5 PM",
      available: false,
    },
  ])

  const [clinics, setClinics] = useState([
    {
      id: 1,
      name: "Apollo Clinic",
      services: ["General", "Lab Tests", "X-Ray"],
      distance: "0.8 km",
      rating: 4.7,
      phone: "9876543220",
      address: "HSR Layout, Bangalore",
      timing: "24/7",
      hasEmergency: true,
    },
    {
      id: 2,
      name: "City Health Center",
      services: ["General", "Dental", "Physiotherapy"],
      distance: "1.5 km",
      rating: 4.4,
      phone: "9876543221",
      address: "BTM Layout, Bangalore",
      timing: "8 AM - 10 PM",
      hasEmergency: false,
    },
    {
      id: 3,
      name: "Lifeline Medical Center",
      services: ["General", "Surgery", "Emergency"],
      distance: "2.3 km",
      rating: 4.9,
      phone: "9876543222",
      address: "JP Nagar, Bangalore",
      timing: "24/7",
      hasEmergency: true,
    },
  ])

  const [medicalStores, setMedicalStores] = useState([
    {
      id: 1,
      name: "MedPlus Pharmacy",
      distance: "0.5 km",
      rating: 4.5,
      phone: "9876543230",
      address: "Main Road, Bangalore",
      timing: "24/7",
      hasDelivery: true,
    },
    {
      id: 2,
      name: "Apollo Pharmacy",
      distance: "1.2 km",
      rating: 4.7,
      phone: "9876543231",
      address: "MG Road, Bangalore",
      timing: "8 AM - 11 PM",
      hasDelivery: true,
    },
    {
      id: 3,
      name: "Wellness Forever",
      distance: "1.8 km",
      rating: 4.3,
      phone: "9876543232",
      address: "Koramangala, Bangalore",
      timing: "9 AM - 9 PM",
      hasDelivery: false,
    },
  ])

  const callNumber = (number) => {
    window.location.href = `tel:${number}`
  }

  const getDirections = (address) => {
    const query = encodeURIComponent(address)
    window.open(`https://www.google.com/maps/search/${query}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Nearby Services</h1>
        <p className="text-emerald-100">नज़दीकी सेवाएं • Find healthcare services near you</p>
      </div>

      <div className="p-4">
        <Tabs defaultValue="doctors" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="doctors">Doctors</TabsTrigger>
            <TabsTrigger value="clinics">Clinics</TabsTrigger>
            <TabsTrigger value="stores">Pharmacies</TabsTrigger>
          </TabsList>

          <TabsContent value="doctors" className="space-y-4">
            {doctors.map((doctor) => (
              <Card key={doctor.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">{doctor.name}</h3>
                      <p className="text-emerald-600 font-medium">{doctor.specialty}</p>
                      <p className="text-sm text-gray-500">{doctor.experience} experience</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{doctor.rating}</span>
                      </div>
                      {doctor.available && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Available
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {doctor.address} • {doctor.distance}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{doctor.timing}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => callNumber(doctor.phone)}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                    <Button onClick={() => getDirections(doctor.address)} variant="outline" className="flex-1">
                      <Navigation className="w-4 h-4 mr-2" />
                      Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="clinics" className="space-y-4">
            {clinics.map((clinic) => (
              <Card key={clinic.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">{clinic.name}</h3>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {clinic.services.map((service, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{clinic.rating}</span>
                      </div>
                      {clinic.hasEmergency && <Badge className="bg-red-500 hover:bg-red-600">24/7</Badge>}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {clinic.address} • {clinic.distance}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{clinic.timing}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => callNumber(clinic.phone)}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                    <Button onClick={() => getDirections(clinic.address)} variant="outline" className="flex-1">
                      <Navigation className="w-4 h-4 mr-2" />
                      Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="stores" className="space-y-4">
            {medicalStores.map((store) => (
              <Card key={store.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">{store.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">Medical Store & Pharmacy</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{store.rating}</span>
                      </div>
                      {store.hasDelivery && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Home Delivery
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {store.address} • {store.distance}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{store.timing}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => callNumber(store.phone)}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                    <Button onClick={() => getDirections(store.address)} variant="outline" className="flex-1">
                      <Navigation className="w-4 h-4 mr-2" />
                      Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
