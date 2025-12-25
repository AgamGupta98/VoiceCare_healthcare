import { BaseEntity } from "./base-entity"

export interface IHealthRecord {
  id?: string
  user_id: string
  symptoms: string
  severity: "low" | "medium" | "high" | "emergency"
  ai_recommendation?: string
  status?: "pending" | "resolved" | "follow_up_needed"
  consultation_type?: "ai_only" | "human_requested" | "emergency"
  voice_transcript?: string
  created_date?: string
  updated_date?: string
}

export class HealthRecord extends BaseEntity {
  static entityName = "health_records"

  static async getAll(): Promise<IHealthRecord[]> {
    return super.getAll<IHealthRecord>()
  }

  static async getById(id: string): Promise<IHealthRecord | null> {
    return super.getById<IHealthRecord>(id)
  }

  static async filter(criteria: Partial<IHealthRecord>): Promise<IHealthRecord[]> {
    return super.filter<IHealthRecord>(criteria)
  }

  static async create(data: Omit<IHealthRecord, "id" | "created_date" | "updated_date">): Promise<IHealthRecord> {
    return super.create<IHealthRecord>(data)
  }

  static async update(id: string, data: Partial<IHealthRecord>): Promise<IHealthRecord | null> {
    return super.update<IHealthRecord>(id, data)
  }

  static async getByUserId(userId: string): Promise<IHealthRecord[]> {
    return this.filter({ user_id: userId })
  }

  static async getRecentByUser(userId: string, limit = 10): Promise<IHealthRecord[]> {
    const records = await this.getByUserId(userId)
    return records
      .sort((a, b) => new Date(b.created_date!).getTime() - new Date(a.created_date!).getTime())
      .slice(0, limit)
  }
}
