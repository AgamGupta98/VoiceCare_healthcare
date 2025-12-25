"use client"

import type React from "react"
import { Home, Stethoscope, MessageSquare, User, Mic } from "lucide-react"

interface MainLayoutProps {
  children: React.ReactNode
  currentPageName: string
  onNavigate: (page: string) => void
}

export default function MainLayout({ children, currentPageName, onNavigate }: MainLayoutProps) {
  const navItems = [
    { name: "Home", icon: Home, page: "Dashboard" },
    { name: "Services", icon: Stethoscope, page: "Services" },
    { name: "VoiceCare", icon: Mic, page: "VoiceCare", isCentral: true },
    { name: "Messages", icon: MessageSquare, page: "Messages" },
    { name: "Profile", icon: User, page: "Profile" },
  ]

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>
      <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_-3px_rgba(0,0,0,0.1)] z-50">
        <nav className="flex justify-around items-center h-16 max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive = currentPageName === item.page
            if (item.isCentral) {
              return (
                <button
                  key={item.name}
                  onClick={() => onNavigate(item.page)}
                  className="-mt-8 z-10 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 rounded-full"
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all
                    ${isActive ? "bg-emerald-600 shadow-lg scale-105" : "bg-emerald-500 shadow-md hover:bg-emerald-600 hover:scale-105"}
                    text-white`}
                  >
                    <item.icon className="w-8 h-8" />
                  </div>
                </button>
              )
            }
            return (
              <button
                key={item.name}
                onClick={() => onNavigate(item.page)}
                className="flex flex-col items-center justify-center space-y-1 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 rounded-lg px-2 py-1"
              >
                <item.icon className={`w-6 h-6 transition-colors ${isActive ? "text-emerald-500" : "text-gray-500"}`} />
                <span
                  className={`text-xs transition-colors ${isActive ? "text-emerald-500 font-semibold" : "text-gray-500"}`}
                >
                  {item.name}
                </span>
              </button>
            )
          })}
        </nav>
      </footer>
    </div>
  )
}
