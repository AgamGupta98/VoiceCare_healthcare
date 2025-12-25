"use client"

import { User, Phone, Mail, MapPin, Calendar, Heart, LogOut, Settings } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ProfileProps {
  userName: string
  onLogout: () => void
}

export default function Profile({ userName, onLogout }: ProfileProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4">
            <User className="h-12 w-12 md:h-16 md:w-16 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{userName}</h2>
          <p className="text-lg md:text-xl text-gray-600">Patient Profile</p>
        </div>

        <Card className="p-6 md:p-8 bg-white border-2 border-gray-200 mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Personal Information</h3>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Phone className="h-6 w-6 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold text-gray-900">+91 98765 43210</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Mail className="h-6 w-6 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-900">{userName.toLowerCase().replace(" ", ".")}@example.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <MapPin className="h-6 w-6 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold text-gray-900">Mumbai, Maharashtra</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Calendar className="h-6 w-6 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-semibold text-gray-900">January 2025</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 md:p-8 bg-white border-2 border-gray-200 mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Health Stats</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg text-center">
              <Heart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">72</p>
              <p className="text-sm text-gray-600">Heart Rate</p>
            </div>

            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg text-center">
              <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">5</p>
              <p className="text-sm text-gray-600">Appointments</p>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          <Button className="w-full h-14 text-lg bg-gray-100 text-gray-900 hover:bg-gray-200">
            <Settings className="h-6 w-6 mr-2" />
            Account Settings
          </Button>

          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full h-14 text-lg border-2 border-red-300 text-red-700 hover:bg-red-50 bg-transparent"
          >
            <LogOut className="h-6 w-6 mr-2" />
            Logout
          </Button>
        </div>
      </main>
    </div>
  )
}
