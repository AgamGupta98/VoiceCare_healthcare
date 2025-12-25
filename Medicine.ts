import { BaseEntity } from "./base-entity"

export interface IMedicine {
  id?: string
  name: string
  generic_name?: string
  brand?: string
  category: "prescription" | "over_the_counter" | "ayurvedic" | "homeopathic"
  type: "tablet" | "capsule" | "syrup" | "injection" | "cream" | "drops" | "inhaler"
  strength?: string
  pack_size?: string
  price: number
  mrp?: number
  uses?: string
  side_effects?: string
  precautions?: string
  requires_prescription?: boolean
  in_stock?: boolean
  created_date?: string
  updated_date?: string
}

export class Medicine extends BaseEntity {
  static entityName = "medicines"

  static async getAll(): Promise<IMedicine[]> {
    return super.getAll<IMedicine>()
  }

  static async getById(id: string): Promise<IMedicine | null> {
    return super.getById<IMedicine>(id)
  }

  static async filter(criteria: Partial<IMedicine>): Promise<IMedicine[]> {
    return super.filter<IMedicine>(criteria)
  }

  static async create(data: Omit<IMedicine, "id" | "created_date" | "updated_date">): Promise<IMedicine> {
    const medicineData = {
      ...data,
      requires_prescription: data.requires_prescription !== undefined ? data.requires_prescription : true,
      in_stock: data.in_stock !== undefined ? data.in_stock : true,
    }
    return super.create<IMedicine>(medicineData)
  }

  static async update(id: string, data: Partial<IMedicine>): Promise<IMedicine | null> {
    return super.update<IMedicine>(id, data)
  }

  static async search(query: string): Promise<IMedicine[]> {
    const all = await this.getAll()
    const lowerQuery = query.toLowerCase()
    return all.filter(
      (med) =>
        med.name.toLowerCase().includes(lowerQuery) ||
        (med.generic_name && med.generic_name.toLowerCase().includes(lowerQuery)) ||
        (med.brand && med.brand.toLowerCase().includes(lowerQuery)),
    )
  }

  static async initializeSampleData(): Promise<void> {
    const existing = await this.getAll()
    if (existing.length > 0) return

    const sampleMedicines: Omit<IMedicine, "id" | "created_date" | "updated_date">[] = [
      {
        name: "Paracetamol",
        generic_name: "Acetaminophen",
        brand: "Crocin",
        category: "over_the_counter",
        type: "tablet",
        strength: "500mg",
        pack_size: "15 tablets",
        price: 25,
        mrp: 30,
        uses: "Relief from fever and mild to moderate pain",
        side_effects: "Rare: nausea, allergic reactions",
        precautions: "Do not exceed recommended dose",
        requires_prescription: false,
        in_stock: true,
      },
      {
        name: "Amoxicillin",
        generic_name: "Amoxicillin",
        brand: "Amoxil",
        category: "prescription",
        type: "capsule",
        strength: "500mg",
        pack_size: "10 capsules",
        price: 120,
        mrp: 150,
        uses: "Treatment of bacterial infections",
        side_effects: "Nausea, diarrhea, rash",
        precautions: "Complete the full course as prescribed",
        requires_prescription: true,
        in_stock: true,
      },
    ]

    for (const medicine of sampleMedicines) {
      await this.create(medicine)
    }
  }
}
