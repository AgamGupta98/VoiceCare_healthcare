import { BaseEntity } from "./base-entity"

export interface IEmergencyContact {
  id?: string
  name: string
  phone: string
  type: "ambulance" | "hospital" | "police" | "fire" | "poison_control" | "women_helpline"
  description?: string
  is_toll_free?: boolean
  availability?: string
  coverage_area?: string
  created_date?: string
  updated_date?: string
}

export class EmergencyContact extends BaseEntity {
  static entityName = "emergency_contacts"

  static async getAll(): Promise<IEmergencyContact[]> {
    return super.getAll<IEmergencyContact>()
  }

  static async getById(id: string): Promise<IEmergencyContact | null> {
    return super.getById<IEmergencyContact>(id)
  }

  static async filter(criteria: Partial<IEmergencyContact>): Promise<IEmergencyContact[]> {
    return super.filter<IEmergencyContact>(criteria)
  }

  static async create(
    data: Omit<IEmergencyContact, "id" | "created_date" | "updated_date">,
  ): Promise<IEmergencyContact> {
    const contactData = {
      ...data,
      is_toll_free: data.is_toll_free !== undefined ? data.is_toll_free : true,
    }
    return super.create<IEmergencyContact>(contactData)
  }

  static async update(id: string, data: Partial<IEmergencyContact>): Promise<IEmergencyContact | null> {
    return super.update<IEmergencyContact>(id, data)
  }

  static async getByType(type: string): Promise<IEmergencyContact[]> {
    return this.filter({ type: type as any })
  }

  static async initializeSampleData(): Promise<void> {
    const existing = await this.getAll()
    if (existing.length > 0) return

    const sampleContacts: Omit<IEmergencyContact, "id" | "created_date" | "updated_date">[] = [
      {
        name: "National Ambulance Service",
        phone: "108",
        type: "ambulance",
        description: "Free emergency ambulance service",
        is_toll_free: true,
        availability: "24/7",
        coverage_area: "National",
      },
      {
        name: "Emergency Medical Services",
        phone: "102",
        type: "ambulance",
        description: "Emergency medical ambulance",
        is_toll_free: true,
        availability: "24/7",
        coverage_area: "National",
      },
      {
        name: "Police Emergency",
        phone: "100",
        type: "police",
        description: "Police emergency helpline",
        is_toll_free: true,
        availability: "24/7",
        coverage_area: "National",
      },
      {
        name: "Fire Emergency",
        phone: "101",
        type: "fire",
        description: "Fire brigade emergency",
        is_toll_free: true,
        availability: "24/7",
        coverage_area: "National",
      },
      {
        name: "Women Helpline",
        phone: "1091",
        type: "women_helpline",
        description: "Women in distress helpline",
        is_toll_free: true,
        availability: "24/7",
        coverage_area: "National",
      },
    ]

    for (const contact of sampleContacts) {
      await this.create(contact)
    }
  }
}
