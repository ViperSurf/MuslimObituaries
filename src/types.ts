export type Sect = 'Sunni' | 'Shia' | 'Non-denominational'

export interface Janazah {
  mosque: string
  address: string
  /** ISO datetime of the Janazah prayer */
  datetime: string
  /** e.g. "After Dhuhr" */
  afterPrayer?: string
  notes?: string
}

export interface CharityCause {
  name: string
  goal: number
  raised: number
  url?: string
}

export interface Obituary {
  id: string
  name: string
  arabicName?: string
  age?: number
  city: string
  state: string
  biography: string
  sect: Sect
  /** ISO date (yyyy-mm-dd) */
  dateOfDeath: string
  janazah?: Janazah
  burial?: { cemetery: string; address: string }
  /** Surviving family, free text */
  family: string
  charity?: CharityCause
  duaCount: number
  createdAt: string
}

export type ObituaryInput = Omit<Obituary, 'id' | 'duaCount' | 'createdAt'>

export interface Condolence {
  id: string
  obituaryId: string
  author: string
  message: string
  createdAt: string
}

export type VendorCategory =
  | 'Funeral Home'
  | 'Mosque / Ghusl'
  | 'Cemetery'
  | 'Legal / Wasiyyah'

export interface Vendor {
  id: string
  name: string
  category: VendorCategory
  city: string
  state: string
  phone: string
  address: string
  notes: string
}

export interface AlertSubscription {
  id: string
  email: string
  phone?: string
  city: string
  radiusMiles: number
  createdAt: string
}

export interface ObituaryFilters {
  q?: string
  city?: string
  sect?: Sect | ''
  janazah?: 'upcoming' | 'past' | 'any'
}
