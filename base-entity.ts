// Base entity class with common CRUD operations
export class BaseEntity {
  static entityName: string

  // Simulate database storage using localStorage
  static getStorageKey(): string {
    return `medecho_${this.entityName}`
  }

  static async getAll<T>(): Promise<T[]> {
    const data = localStorage.getItem(this.getStorageKey())
    return data ? JSON.parse(data) : []
  }

  static async getById<T>(id: string): Promise<T | null> {
    const all = await this.getAll<T & { id: string }>()
    return all.find((item) => item.id === id) || null
  }

  static async filter<T>(criteria: Partial<T>): Promise<T[]> {
    const all = await this.getAll<T>()
    return all.filter((item) => {
      return Object.entries(criteria).every(([key, value]) => {
        return (item as any)[key] === value
      })
    })
  }

  static async create<T extends { id?: string }>(data: Omit<T, "id" | "created_date" | "updated_date">): Promise<T> {
    const all = await this.getAll<T>()
    const newItem = {
      ...data,
      id: Date.now().toString(),
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
    } as T

    all.push(newItem)
    localStorage.setItem(this.getStorageKey(), JSON.stringify(all))
    return newItem
  }

  static async update<T extends { id: string }>(id: string, data: Partial<T>): Promise<T | null> {
    const all = await this.getAll<T>()
    const index = all.findIndex((item) => item.id === id)

    if (index === -1) return null

    all[index] = {
      ...all[index],
      ...data,
      updated_date: new Date().toISOString(),
    }

    localStorage.setItem(this.getStorageKey(), JSON.stringify(all))
    return all[index]
  }

  static async delete(id: string): Promise<boolean> {
    const all = await this.getAll()
    const filtered = all.filter((item: any) => item.id !== id)

    if (filtered.length === all.length) return false

    localStorage.setItem(this.getStorageKey(), JSON.stringify(filtered))
    return true
  }

  static async deleteAll(): Promise<void> {
    localStorage.removeItem(this.getStorageKey())
  }
}
