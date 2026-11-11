export type Sect = 'Sunni' | 'Shia' | 'Non-denominational'

export interface Janazah {
  mosque: string
  address: string
  /** ISO datetime of the Janazah prayer */
  datetime: string
  /** e.g. "After Dhuhr Prayer (1:15 PM)" */
  afterPrayer?: string
  notes?: string
  cemetery?: string
  cemeteryAddress?: string
  burialTime?: string
}

export interface SadaqahProject {
  id: string
  title: string
  organization: string
  category: 'Water Well' | 'Mosque Construction' | 'Orphan Care' | 'Quran Distribution' | 'Medical Relief' | 'Other'
  goal: number
  raised: number
  donationUrl?: string
  description: string
}

export interface CondolenceWindow {
  startDate: string
  endDate: string
  visitationAddress?: string
  visitationHours?: string
}

export interface Obituary {
  id: string
  name: string
  arabicName?: string
  /** YYYY-MM-DD, optional (not always known, e.g. some scholars) */
  dateOfBirth?: string
  /** YYYY-MM-DD */
  dateOfPassing: string
  hijriPassingDate?: string
  age?: number
  city: string
  state: string
  country?: string
  photoUrl?: string
  biography: string
  sect: Sect
  /** Surviving family, free text */
  family: string
  familyMembers?: string[]
  janazah?: Janazah
  condolenceWindow?: CondolenceWindow
  sadaqah?: SadaqahProject[]
  duaCount: number
  verified?: boolean
  /** 'community' = regular obituary · 'scholar' = verified notable passing */
  kind: 'community' | 'scholar'
  createdAt: string
}

export type ObituaryInput = Omit<Obituary, 'id' | 'duaCount' | 'createdAt' | 'kind'> & { kind?: Obituary['kind'] }

export interface Condolence {
  id: string
  obituaryId: string
  author: string
  relationship?: string
  message: string
  arabicDua?: string
  duaCount: number
  createdAt: string
}

export type VendorCategory =
  | 'Licensed Funeral Home'
  | 'Local Mosque'
  | 'Muslim Cemetery'
  | 'Ghusl & Preparation'
  | 'Legal & Wasiyyah'

export interface Vendor {
  id: string
  name: string
  category: VendorCategory
  city: string
  state: string
  phone: string
  email?: string
  website?: string
  address: string
  rating?: number
  reviewCount?: number
  verified?: boolean
  services: string[]
  notes?: string
}

export interface AlertSubscription {
  id: string
  email: string
  phone?: string
  city: string
  radiusMiles: number
  createdAt: string
}

export interface PlatformTip {
  id: string
  amount: number
  donorName?: string
  createdAt: string
}

/** The canonical, shared dataset — served from /data/database.json so every
 *  visitor sees the same records. Updated by committing a new file
 *  (the Admin panel exports it). */
export interface Database {
  version: number
  updatedAt: string
  obituaries: Obituary[]
  condolences: Condolence[]
  vendors: Vendor[]
}

export interface ObituaryFilters {
  q?: string
  city?: string
  sect?: Sect | ''
  janazah?: 'upcoming' | 'past' | 'today' | 'any'
  year?: string
  kind?: 'community' | 'scholar' | 'any'
}
