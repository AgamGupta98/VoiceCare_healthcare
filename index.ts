// Central export for all entities
export { BaseEntity } from "./base-entity"
export { HealthRecord, type IHealthRecord } from "./HealthRecord"
export { Reminder, type IReminder } from "./Reminder"
export { Consultation, type IConsultation } from "./Consultation"
export { Doctor, type IDoctor } from "./Doctor"
export { Clinic, type IClinic } from "./Clinic"
export { MedicalStore, type IMedicalStore } from "./MedicalStore"
export { Medicine, type IMedicine } from "./Medicine"
export { EmergencyContact, type IEmergencyContact } from "./EmergencyContact"
export { User, type IUser } from "./User"

// Initialize sample data for all entities
export async function initializeAllSampleData() {
  const { Doctor } = await import("./Doctor")
  const { Clinic } = await import("./Clinic")
  const { MedicalStore } = await import("./MedicalStore")
  const { Medicine } = await import("./Medicine")
  const { EmergencyContact } = await import("./EmergencyContact")
  const { User } = await import("./User")

  await Doctor.initializeSampleData()
  await Clinic.initializeSampleData()
  await MedicalStore.initializeSampleData()
  await Medicine.initializeSampleData()
  await EmergencyContact.initializeSampleData()
  await User.initializeSampleData()
}
