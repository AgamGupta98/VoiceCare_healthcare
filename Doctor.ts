import { BaseEntity } from "./base-entity"

export interface IDoctor {
  id?: string
  name: string
  phone: string
  email?: string
  specialization:
    | "general_medicine"
    | "cardiology"
    | "pediatrics"
    | "gynecology"
    | "orthopedics"
    | "dermatology"
    | "ent"
    | "psychiatry"
    | "neurology"
    | "oncology"
  qualification?: string
  experience_years?: number
  consultation_fee?: number
  languages?: string[]
  availability?: {
    days: string[]
    hours: string
  }
  clinic_address?: string
  latitude?: number
  longitude?: number
  rating?: number
  consultation_modes?: ("phone" | "video" | "in_person")[]
  is_available_now?: boolean
  created_date?: string
  updated_date?: string
}

export class Doctor extends BaseEntity {
  static entityName = "doctors"

  static async getAll(): Promise<IDoctor[]> {
    return super.getAll<IDoctor>()
  }

  static async getById(id: string): Promise<IDoctor | null> {
    return super.getById<IDoctor>(id)
  }

  static async filter(criteria: Partial<IDoctor>): Promise<IDoctor[]> {
    return super.filter<IDoctor>(criteria)
  }

  static async create(data: Omit<IDoctor, "id" | "created_date" | "updated_date">): Promise<IDoctor> {
    return super.create<IDoctor>(data)
  }

  static async update(id: string, data: Partial<IDoctor>): Promise<IDoctor | null> {
    return super.update<IDoctor>(id, data)
  }

  static async searchBySpecialization(specialization: string): Promise<IDoctor[]> {
    const all = await this.getAll()
    return all.filter((d) => d.specialization === specialization)
  }

  static async searchNearby(latitude: number, longitude: number, radiusKm = 10): Promise<IDoctor[]> {
    const all = await this.getAll()
    return all.filter((doctor) => {
      if (!doctor.latitude || !doctor.longitude) return false
      const distance = this.calculateDistance(latitude, longitude, doctor.latitude, doctor.longitude)
      return distance <= radiusKm
    })
  }

  static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1)
    const dLon = this.toRad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  static toRad(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  static async initializeSampleData(): Promise<void> {
    const existing = await this.getAll()
    if (existing.length > 0) return

    const sampleDoctors: Omit<IDoctor, "id" | "created_date" | "updated_date">[] = [
      {
        name: "Dr. Rajesh Kumar",
        phone: "+91-9876543210",
        email: "dr.rajesh@clinic.com",
        specialization: "general_medicine",
        qualification: "MBBS, MD",
        experience_years: 15,
        consultation_fee: 500,
        languages: ["Hindi", "English"],
        availability: { days: ["Mon", "Tue", "Wed", "Thu", "Fri"], hours: "9:00 AM - 6:00 PM" },
        clinic_address: "Central Hospital, Delhi",
        latitude: 28.6139,
        longitude: 77.209,
        rating: 4.5,
        consultation_modes: ["phone", "video", "in_person"],
        is_available_now: true,
      },
      {
        name: "Dr. Priya Sharma",
        phone: "+91-9876543211",
        email: "dr.priya@heartcare.com",
        specialization: "cardiology",
        qualification: "MBBS, MD, DM (Cardiology)",
        experience_years: 20,
        consultation_fee: 1000,
        languages: ["Hindi", "English", "Punjabi"],
        availability: { days: ["Mon", "Wed", "Fri"], hours: "10:00 AM - 4:00 PM" },
        clinic_address: "Heart Care Center, Mumbai",
        latitude: 19.076,
        longitude: 72.8777,
        rating: 4.8,
        consultation_modes: ["video", "in_person"],
        is_available_now: false,
      },
      {
        name: "Dr. Amit Patel",
        phone: "+91-9876543212",
        email: "dr.amit@childcare.com",
        specialization: "pediatrics",
        qualification: "MBBS, MD (Pediatrics)",
        experience_years: 12,
        consultation_fee: 600,
        languages: ["Hindi", "English", "Gujarati"],
        availability: { days: ["Mon", "Tue", "Thu", "Sat"], hours: "8:00 AM - 2:00 PM" },
        clinic_address: "Child Care Hospital, Ahmedabad",
        latitude: 23.0225,
        longitude: 72.5714,
        rating: 4.6,
        consultation_modes: ["phone", "video", "in_person"],
        is_available_now: true,
      },
    ]

    for (const doctor of sampleDoctors) {
      await this.create(doctor)
    }
  }
}
