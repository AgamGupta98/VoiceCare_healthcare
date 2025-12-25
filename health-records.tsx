"use client"
import { ArrowLeft, FileText, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface HealthRecordsProps {
  onBack: () => void
  userName: string
}

export default function HealthRecords({ onBack, userName }: HealthRecordsProps) {
  const records = [
    {
      id: 1,
      type: "Consultation",
      doctor: "Dr. Priya Sharma",
      date: "2024-01-15",
      diagnosis: "Common Cold",
      notes: "Prescribed rest and fluids",
    },
    {
      id: 2,
      type: "Lab Test",
      facility: "City Lab",
      date: "2024-01-10",
      test: "Blood Test - Complete Blood Count",
      result: "Normal",
    },
  ]

  const vitals = {
    bloodPressure: "120/80",
    heartRate: "72 bpm",
    temperature: "98.6°F",
    weight: "70 kg",
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white/80 backdrop-blur-sm border-b-2 border-teal-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Button onClick={onBack} variant="ghost" className="text-teal-600">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center mx-auto mb-4">
            <FileText className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-teal-900 mb-3">Health Records</h2>
          <p className="text-xl text-gray-700">Your medical history at a glance</p>
        </div>

        <Card className="p-6 mb-8 bg-gradient-to-r from-purple-500 to-violet-500 border-none text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
              <User className="h-8 w-8" />
            </div>
            <div>
              <p className="text-lg opacity-90">Patient</p>
              <p className="text-2xl font-bold">{userName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm opacity-90">Blood Pressure</p>
              <p className="text-xl font-bold">{vitals.bloodPressure}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Heart Rate</p>
              <p className="text-xl font-bold">{vitals.heartRate}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Temperature</p>
              <p className="text-xl font-bold">{vitals.temperature}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Weight</p>
              <p className="text-xl font-bold">{vitals.weight}</p>
            </div>
          </div>
        </Card>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">Recent Records</h3>

        <div className="space-y-4">
          {records.map((record) => (
            <Card key={record.id} className="p-6 bg-white border-2 border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge className="mb-2 bg-purple-100 text-purple-700 border-purple-300">{record.type}</Badge>
                  <h4 className="text-xl font-bold text-gray-900">
                    {"doctor" in record ? record.doctor : record.test}
                  </h4>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-5 w-5" />
                  <span>{new Date(record.date).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="space-y-2 text-gray-700">
                {"diagnosis" in record && (
                  <p>
                    <span className="font-semibold">Diagnosis:</span> {record.diagnosis}
                  </p>
                )}
                {"result" in record && (
                  <p>
                    <span className="font-semibold">Result:</span> {record.result}
                  </p>
                )}
                {"notes" in record && <p className="text-gray-600">{record.notes}</p>}
                {"facility" in record && <p className="text-gray-600">At {record.facility}</p>}
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
