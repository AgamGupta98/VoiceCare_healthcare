"use client"

import { useState } from "react"
import Home from "@/components/home"
import MainLayout from "@/components/main-layout"
import Dashboard from "@/components/dashboard"
import Services from "@/components/services"
import VoiceCare from "@/components/voice-care"
import Messages from "@/components/messages"
import Profile from "@/components/profile"
import Locations from "@/components/locations"
import Emergency from "@/components/emergency"
import MedicationReminders from "@/components/medication-reminders"
import DoctorBooking from "@/components/doctor-booking"

export default function MedEchoApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentPage, setCurrentPage] = useState<string>("Dashboard")
  const [userName, setUserName] = useState("")

  const handleLogin = (name: string) => {
    setUserName(name)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserName("")
    localStorage.removeItem("medecho_current_user")
  }

  const renderPage = () => {
    switch (currentPage) {
      case "Dashboard":
        return <Dashboard userName={userName} onNavigate={setCurrentPage} />
      case "Services":
        return <Services />
      case "VoiceCare":
        return <VoiceCare userName={userName} />
      case "Messages":
        return <Messages />
      case "Profile":
        return <Profile userName={userName} onLogout={handleLogout} />
      case "Locations":
        return <Locations onBack={() => setCurrentPage("Dashboard")} />
      case "Emergency":
        return <Emergency onBack={() => setCurrentPage("Dashboard")} />
      case "Reminders":
        return <MedicationReminders onBack={() => setCurrentPage("Dashboard")} userName={userName} />
      case "Booking":
        return <DoctorBooking onBack={() => setCurrentPage("Dashboard")} userName={userName} />
      default:
        return <Dashboard userName={userName} onNavigate={setCurrentPage} />
    }
  }

  if (!isAuthenticated) {
    return <Home onLogin={handleLogin} />
  }

  return (
    <MainLayout currentPageName={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </MainLayout>
  )
}
