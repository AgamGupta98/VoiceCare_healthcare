"use client"

import { useState, useEffect } from "react"
import { MapPin, Search, Phone, Navigation, Star, Clock, ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Doctor, type IDoctor } from "@/entities/Doctor"
import { Clinic, type IClinic } from "@/entities/Clinic"
import { MedicalStore, type IMedicalStore } from "@/entities/MedicalStore"

interface LocationsProps {
  onBack?: () => void
}

export default function Locations({ onBack }: LocationsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [doctors, setDoctors] = useState<IDoctor[]>([])
  const [clinics, setClinics] = useState<IClinic[]>([])
  const [medicalStores, setMedicalStores] = useState<IMedicalStore[]>([])
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("doctors")

  useEffect(() => {
    loadLocations()
    getUserLocation()
  }, [])

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          console.log("[v0] Location access denied:", error)
          // Use default location (Delhi)
          setUserLocation({ latitude: 28.6139, longitude: 77.209 })
        },
      )
    } else {
      // Use default location
      setUserLocation({ latitude: 28.6139, longitude: 77.209 })
    }
  }

  const loadLocations = async () => {
    try {
      setIsLoading(true)

      const [doctorsList, clinicsList, storesList] = await Promise.all([
        Doctor.getAll(),
        Clinic.getAll(),
        MedicalStore.getAll(),
      ])

      setDoctors(doctorsList)
      setClinics(clinicsList)
      setMedicalStores(storesList)

      setIsLoading(false)
    } catch (error) {
      console.error("[v0] Error loading locations:", error)
      setIsLoading(false)
    }
  }

  const filterDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filterClinics = clinics.filter(
    (clinic) =>
      clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filterStores = medicalStores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const makeCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  const openMaps = (latitude?: number, longitude?: number, address?: string) => {
    if (latitude && longitude) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, "_blank")
    } else if (address) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, "_blank")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 pb-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold">Nearby Healthcare</h1>
            <p className="text-purple-100">नज़दीकी स्वास्थ्य सेवाएं</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search doctors, clinics, stores... • खोजें"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-purple-100 rounded-xl"
          />
        </div>

        {userLocation && (
          <div className="flex items-center gap-2 mt-3 text-purple-100 text-sm">
            <Navigation className="w-4 h-4" />
            <span>Using your current location • आपका स्थान</span>
          </div>
        )}
      </div>

      <div className="p-4 -mt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm">
            <TabsTrigger value="doctors">Doctors • डॉक्टर</TabsTrigger>
            <TabsTrigger value="clinics">Clinics • क्लिनिक</TabsTrigger>
            <TabsTrigger value="stores">Stores • दुकानें</TabsTrigger>
          </TabsList>

          {/* Doctors Tab */}
          <TabsContent value="doctors" className="space-y-3 mt-4">
            {isLoading ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">Loading doctors...</CardContent>
              </Card>
            ) : filterDoctors.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p>No doctors found • कोई डॉक्टर नहीं मिला</p>
                </CardContent>
              </Card>
            ) : (
              filterDoctors.map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-700 font-bold text-lg">
                          {doctor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                        <p className="text-sm text-gray-600">{doctor.qualification}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {doctor.specialization.replace("_", " ")}
                          </Badge>
                          {doctor.experience_years && (
                            <span className="text-xs text-gray-500">{doctor.experience_years}+ yrs exp</span>
                          )}
                        </div>
                        {doctor.rating && (
                          <div className="flex items-center gap-1 mt-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium text-gray-700">{doctor.rating}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span className="line-clamp-1">{doctor.clinic_address}</span>
                        </div>
                        {doctor.consultation_fee && (
                          <p className="text-sm text-green-600 font-medium mt-2">Fee: ₹{doctor.consultation_fee}</p>
                        )}
                        {doctor.is_available_now && (
                          <Badge className="bg-green-500 text-white mt-2">Available Now • अभी उपलब्ध</Badge>
                        )}
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" onClick={() => makeCall(doctor.phone)} className="flex-1 bg-blue-600">
                            <Phone className="w-4 h-4 mr-1" />
                            Call • कॉल
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openMaps(doctor.latitude, doctor.longitude, doctor.clinic_address)}
                            className="flex-1"
                          >
                            <MapPin className="w-4 h-4 mr-1" />
                            Map • मानचित्र
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Clinics Tab */}
          <TabsContent value="clinics" className="space-y-3 mt-4">
            {isLoading ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">Loading clinics...</CardContent>
              </Card>
            ) : filterClinics.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p>No clinics found • कोई क्लिनिक नहीं मिला</p>
                </CardContent>
              </Card>
            ) : (
              filterClinics.map((clinic) => (
                <Card key={clinic.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-green-700" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{clinic.name}</h3>
                        <Badge variant="outline" className="text-xs mt-1">
                          {clinic.type.replace("_", " ")}
                        </Badge>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{clinic.address}</span>
                        </div>
                        {clinic.operating_hours && (
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{clinic.operating_hours}</span>
                          </div>
                        )}
                        {clinic.distance_km && (
                          <p className="text-sm text-purple-600 font-medium mt-1">
                            {clinic.distance_km.toFixed(1)} km away
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {clinic.has_emergency && (
                            <Badge className="bg-red-500 text-white text-xs">Emergency • आपातकाल</Badge>
                          )}
                          {clinic.has_ambulance && (
                            <Badge className="bg-orange-500 text-white text-xs">Ambulance</Badge>
                          )}
                        </div>
                        {clinic.rating && (
                          <div className="flex items-center gap-1 mt-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium text-gray-700">{clinic.rating}</span>
                          </div>
                        )}
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" onClick={() => makeCall(clinic.phone)} className="flex-1 bg-green-600">
                            <Phone className="w-4 h-4 mr-1" />
                            Call • कॉल
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openMaps(clinic.latitude, clinic.longitude, clinic.address)}
                            className="flex-1"
                          >
                            <MapPin className="w-4 h-4 mr-1" />
                            Map • मानचित्र
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Medical Stores Tab */}
          <TabsContent value="stores" className="space-y-3 mt-4">
            {isLoading ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">Loading stores...</CardContent>
              </Card>
            ) : filterStores.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p>No stores found • कोई दुकान नहीं मिली</p>
                </CardContent>
              </Card>
            ) : (
              filterStores.map((store) => (
                <Card key={store.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-orange-700 font-bold text-lg">
                          {store.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{store.name}</h3>
                        {store.owner_name && <p className="text-sm text-gray-600">{store.owner_name}</p>}
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{store.address}</span>
                        </div>
                        {store.operating_hours && (
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{store.operating_hours}</span>
                          </div>
                        )}
                        {store.distance_km && (
                          <p className="text-sm text-purple-600 font-medium mt-1">
                            {store.distance_km.toFixed(1)} km away
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {store.is_24_hours && (
                            <Badge className="bg-blue-500 text-white text-xs">24 Hours • 24 घंटे</Badge>
                          )}
                          {store.has_delivery && (
                            <Badge className="bg-green-500 text-white text-xs">Home Delivery</Badge>
                          )}
                          {store.accepts_insurance && (
                            <Badge variant="outline" className="text-xs">
                              Insurance
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" onClick={() => makeCall(store.phone)} className="flex-1 bg-orange-600">
                            <Phone className="w-4 h-4 mr-1" />
                            Call • कॉल
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openMaps(store.latitude, store.longitude, store.address)}
                            className="flex-1"
                          >
                            <MapPin className="w-4 h-4 mr-1" />
                            Map • मानचित्र
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
