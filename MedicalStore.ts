import { BaseEntity } from "./base-entity"

export interface IMedicalStore {
  id?: string
  name: string
  owner_name?: string
  license_number?: string
  address: string
  phone: string
  operating_hours?: string
  latitude?: number
  longitude?: number
  distance_km?: number
  services?: string[]
  has_delivery?: boolean
  is_24_hours?: boolean
  accepts_insurance?: boolean
  created_date?: string
  updated_date?: string
}

export class MedicalStore extends BaseEntity {
  static entityName = "medical_stores"

  static async getAll(): Promise<IMedicalStore[]> {
    return super.getAll<IMedicalStore>()
  }

  static async getById(id: string): Promise<IMedicalStore | null> {
    return super.getById<IMedicalStore>(id)
  }

  static async filter(criteria: Partial<IMedicalStore>): Promise<IMedicalStore[]> {
    return super.filter<IMedicalStore>(criteria)
  }

  static async create(data: Omit<IMedicalStore, "id" | "created_date" | "updated_date">): Promise<IMedicalStore> {
    return super.create<IMedicalStore>(data)
  }

  static async update(id: string, data: Partial<IMedicalStore>): Promise<IMedicalStore | null> {
    return super.update<IMedicalStore>(id, data)
  }

  static async searchNearby(latitude: number, longitude: number, radiusKm = 5): Promise<IMedicalStore[]> {
    const all = await this.getAll()
    return all
      .filter((store) => {
        if (!store.latitude || !store.longitude) return false
        const distance = this.calculateDistance(latitude, longitude, store.latitude, store.longitude)
        return distance <= radiusKm
      })
      .map((store) => ({
        ...store,
        distance_km: this.calculateDistance(latitude, longitude, store.latitude!, store.longitude!),
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

    const sampleStores: Omit<IMedicalStore, "id" | "created_date" | "updated_date">[] = [
      {
        name: "Apollo Pharmacy",
        owner_name: "Raj Pharmacist",
        license_number: "DL/PH/12345",
        address: "789 Market Road, Delhi",
        phone: "+91-11-34567890",
        operating_hours: "24 Hours",
        latitude: 28.6139,
        longitude: 77.209,
        services: ["Prescription", "OTC", "Home Delivery"],
        has_delivery: true,
        is_24_hours: true,
        accepts_insurance: true,
      },
      {
        name: "MedPlus",
        owner_name: "Suresh Kumar",
        license_number: "MH/PH/67890",
        address: "321 Station Road, Mumbai",
        phone: "+91-22-45678901",
        operating_hours: "8:00 AM - 10:00 PM",
        latitude: 19.076,
        longitude: 72.8777,
        services: ["Prescription", "OTC", "Diagnostic Tests"],
        has_delivery: true,
        is_24_hours: false,
        accepts_insurance: false,
      },
    ]

    for (const store of sampleStores) {
      await this.create(store)
    }
  }
}
