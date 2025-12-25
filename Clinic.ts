import { BaseEntity } from "./base-entity"

export interface IClinic {
  id?: string
  name: string
  address: string
  phone: string
  emergency_phone?: string
  email?: string
  type: "primary_health_center" | "community_health_center" | "hospital" | "clinic" | "nursing_home"
  services?: string[]
  specializations?: string[]
  operating_hours?: string
  latitude?: number
  longitude?: number
  distance_km?: number
  has_emergency?: boolean
  has_ambulance?: boolean
  rating?: number
  created_date?: string
  updated_date?: string
}

export class Clinic extends BaseEntity {
  static entityName = "clinics"

  static async getAll(): Promise<IClinic[]> {
    return super.getAll<IClinic>()
  }

  static async getById(id: string): Promise<IClinic | null> {
    return super.getById<IClinic>(id)
  }

  static async filter(criteria: Partial<IClinic>): Promise<IClinic[]> {
    return super.filter<IClinic>(criteria)
  }

  static async create(data: Omit<IClinic, "id" | "created_date" | "updated_date">): Promise<IClinic> {
    return super.create<IClinic>(data)
  }

  static async update(id: string, data: Partial<IClinic>): Promise<IClinic | null> {
    return super.update<IClinic>(id, data)
  }

  static async searchNearby(latitude: number, longitude: number, radiusKm = 10): Promise<IClinic[]> {
    const all = await this.getAll()
    return all
      .filter((clinic) => {
        if (!clinic.latitude || !clinic.longitude) return false
        const distance = this.calculateDistance(latitude, longitude, clinic.latitude, clinic.longitude)
        return distance <= radiusKm
      })
      .map((clinic) => ({
        ...clinic,
        distance_km: this.calculateDistance(latitude, longitude, clinic.latitude!, clinic.longitude!),
      }))
      .sort((a, b) => (a.distance_km || 0) - (b.distance_km || 0))
  }

  static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371
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

    const sampleClinics: Omit<IClinic, "id" | "created_date" | "updated_date">[] = [
      {
        name: "City General Hospital",
        address: "123 Main Road, Delhi - 110001",
        phone: "+91-11-12345678",
        emergency_phone: "+91-11-11111111",
        email: "info@cityhospital.com",
        type: "hospital",
        services: ["Emergency", "ICU", "Surgery", "Diagnostics"],
        specializations: ["Cardiology", "Neurology", "Orthopedics"],
        operating_hours: "24/7",
        latitude: 28.6139,
        longitude: 77.209,
        has_emergency: true,
        has_ambulance: true,
        rating: 4.5,
      },
      {
        name: "Community Health Center",
        address: "456 Park Street, Mumbai - 400001",
        phone: "+91-22-23456789",
        emergency_phone: "+91-22-22222222",
        type: "community_health_center",
        services: ["OPD", "Vaccination", "Diagnostics"],
        specializations: ["General Medicine", "Pediatrics"],
        operating_hours: "8:00 AM - 8:00 PM",
        latitude: 19.076,
        longitude: 72.8777,
        has_emergency: false,
        has_ambulance: true,
        rating: 4.2,
      },
    ]

    for (const clinic of sampleClinics) {
      await this.create(clinic)
    }
  }
}
