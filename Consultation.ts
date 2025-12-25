import { BaseEntity } from "./base-entity"

export interface IConsultation {
  id?: string
  user_id: string
  doctor_name: string
  doctor_phone?: string
  specialization?: string
  appointment_date: string
  consultation_type: "phone" | "video" | "in_person"
  status?: "scheduled" | "completed" | "cancelled" | "missed"
  notes?: string
  cost?: number
  created_date?: string
  updated_date?: string
}

export class Consultation extends BaseEntity {
  static entityName = "consultations"

  static async getAll(): Promise<IConsultation[]> {
    return super.getAll<IConsultation>()
  }

  static async getById(id: string): Promise<IConsultation | null> {
    return super.getById<IConsultation>(id)
  }

  static async filter(criteria: Partial<IConsultation>): Promise<IConsultation[]> {
    return super.filter<IConsultation>(criteria)
  }

  static async create(data: Omit<IConsultation, "id" | "created_date" | "updated_date">): Promise<IConsultation> {
    const consultationData = {
      ...data,
      status: data.status || "scheduled",
    }
    return super.create<IConsultation>(consultationData)
  }

  static async update(id: string, data: Partial<IConsultation>): Promise<IConsultation | null> {
    return super.update<IConsultation>(id, data)
  }

  static async getUpcomingByUser(userId: string): Promise<IConsultation[]> {
    const consultations = await this.filter({ user_id: userId })
    const now = new Date().toISOString()

    return consultations
      .filter((c) => c.status === "scheduled" && c.appointment_date >= now)
      .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())
  }
}
