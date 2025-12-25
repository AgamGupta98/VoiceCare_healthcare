import { BaseEntity } from "./base-entity"

export interface IUser {
  id?: string
  email: string
  name?: string
  phone?: string
  date_of_birth?: string
  gender?: "male" | "female" | "other"
  blood_group?: string
  address?: string
  emergency_contact?: string
  medical_history?: string[]
  allergies?: string[]
  current_medications?: string[]
  preferred_language?: "english" | "hindi" | "punjabi" | "bengali" | "tamil"
  created_date?: string
  updated_date?: string
}

export class User extends BaseEntity {
  static entityName = "users"
  private static currentUser: IUser | null = null

  static async getAll(): Promise<IUser[]> {
    return super.getAll<IUser>()
  }

  static async getById(id: string): Promise<IUser | null> {
    return super.getById<IUser>(id)
  }

  static async filter(criteria: Partial<IUser>): Promise<IUser[]> {
    return super.filter<IUser>(criteria)
  }

  static async create(data: Omit<IUser, "id" | "created_date" | "updated_date">): Promise<IUser> {
    return super.create<IUser>(data)
  }

  static async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return super.update<IUser>(id, data)
  }

  // Authentication methods
  static async loginWithRedirect(redirectUrl: string): Promise<void> {
    // For demo purposes, we'll simulate Google OAuth login
    // In a real app, this would redirect to Google OAuth
    const mockEmail = "demo@medecho.com"
    const mockName = "Demo User"

    // Create or get user
    const existingUsers = await this.filter({ email: mockEmail })
    let user: IUser

    if (existingUsers.length > 0) {
      user = existingUsers[0]
    } else {
      user = await this.create({
        email: mockEmail,
        name: mockName,
        preferred_language: "english",
      })
    }

    // Store in session
    this.currentUser = user
    localStorage.setItem("medecho_current_user", JSON.stringify(user))

    // Redirect
    window.location.href = redirectUrl
  }

  static async me(): Promise<IUser> {
    // Check if user is in memory
    if (this.currentUser) {
      return this.currentUser
    }

    // Check localStorage
    const storedUser = localStorage.getItem("medecho_current_user")
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser)
      return this.currentUser!
    }

    // No user found
    throw new Error("User not authenticated")
  }

  static async logout(): Promise<void> {
    this.currentUser = null
    localStorage.removeItem("medecho_current_user")
  }

  static async updateProfile(data: Partial<IUser>): Promise<IUser> {
    const currentUser = await this.me()
    if (!currentUser.id) {
      throw new Error("User ID not found")
    }

    const updated = await this.update(currentUser.id, data)
    if (updated) {
      this.currentUser = updated
      localStorage.setItem("medecho_current_user", JSON.stringify(updated))
      return updated
    }

    throw new Error("Failed to update profile")
  }
}
