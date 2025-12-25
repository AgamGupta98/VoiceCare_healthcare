import { BaseEntity } from "./base-entity"

export interface IReminder {
  id?: string
  user_id: string
  title: string
  medication_name: string
  dosage: string
  frequency: "daily" | "twice_daily" | "thrice_daily" | "weekly" | "as_needed"
  time: string
  is_active?: boolean
  next_reminder?: string
  created_date?: string
  updated_date?: string
}

export class Reminder extends BaseEntity {
  static entityName = "reminders"

  static async getAll(): Promise<IReminder[]> {
    return super.getAll<IReminder>()
  }

  static async getById(id: string): Promise<IReminder | null> {
    return super.getById<IReminder>(id)
  }

  static async filter(criteria: Partial<IReminder>): Promise<IReminder[]> {
    return super.filter<IReminder>(criteria)
  }

  static async create(data: Omit<IReminder, "id" | "created_date" | "updated_date">): Promise<IReminder> {
    const reminderData = {
      ...data,
      is_active: data.is_active !== undefined ? data.is_active : true,
    }
    return super.create<IReminder>(reminderData)
  }

  static async update(id: string, data: Partial<IReminder>): Promise<IReminder | null> {
    return super.update<IReminder>(id, data)
  }

  static async getActiveByUser(userId: string): Promise<IReminder[]> {
    return this.filter({ user_id: userId, is_active: true })
  }

  static async toggleActive(id: string): Promise<IReminder | null> {
    const reminder = await this.getById(id)
    if (!reminder) return null
    return this.update(id, { is_active: !reminder.is_active })
  }
}
