import type { Obituary, Vendor } from '../types'

/**
 * Sample seed data so the platform is understandable on first run.
 * Clearly fictional; replaced by real submissions in production (V2: database).
 */
export const seedObituaries: Obituary[] = [
  {
    id: 'sample-1',
    name: 'Hajjah Maryam Abdullah',
    arabicName: 'مريم عبد الله',
    age: 84,
    city: 'Champaign',
    state: 'IL',
    biography:
      'A beloved mother, grandmother, and longtime teacher of the community Sunday school. She was known for her open door, her Qur\'an circle, and the soup she brought to every family in hardship. May Allah have mercy on her and grant her Jannat al-Firdaws.',
    sect: 'Sunni',
    dateOfDeath: '2026-11-08',
    janazah: {
      mosque: 'Central Illinois Mosque & Islamic Center (CIMIC)',
      address: '106 S Lincoln Ave, Urbana, IL 61801',
      datetime: new Date(Date.now() + 26 * 3600 * 1000).toISOString(),
      afterPrayer: 'After Dhuhr',
      notes: 'Parking in the rear lot. Ghusl completed at the mosque.',
    },
    burial: { cemetery: 'Mount Hope Cemetery', address: '611 E Pennsylvania Ave, Champaign, IL 61820' },
    family: 'Survived by her children Fatima, Yusuf, and Bilal, and nine grandchildren.',
    charity: {
      name: 'Solar water well in her name — Sadaqah Jariyah',
      goal: 2500,
      raised: 1675,
    },
    duaCount: 213,
    createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
  },
  {
    id: 'sample-2',
    name: 'Br. Omar Haddad',
    arabicName: 'عمر حداد',
    age: 57,
    city: 'Chicago',
    state: 'IL',
    biography:
      'A carpenter by trade and a quiet pillar of his neighbourhood masjid, where he maintained the building for two decades without ever asking to be thanked. He leaves behind a community that prayed in a house he helped keep standing.',
    sect: 'Sunni',
    dateOfDeath: '2026-11-05',
    janazah: {
      mosque: 'Mosque Foundation',
      address: '7360 W 93rd St, Bridgeview, IL 60455',
      datetime: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
      afterPrayer: 'After Jumu\'ah',
    },
    burial: { cemetery: 'Evergreen Cemetery', address: '3401 W 87th St, Evergreen Park, IL 60805' },
    family: 'Survived by his wife Laila and sons Kareem and Sami.',
    duaCount: 148,
    createdAt: new Date(Date.now() - 90 * 3600 * 1000).toISOString(),
  },
  {
    id: 'sample-3',
    name: 'Sr. Zainab Rizvi',
    arabicName: 'زينب رضوي',
    age: 71,
    city: 'Urbana',
    state: 'IL',
    biography:
      'A retired nurse who volunteered at the free clinic for fifteen years and organised the community\'s blood drives. Her family asks that, in lieu of flowers, friends donate blood or give to the clinic in her memory.',
    sect: 'Shia',
    dateOfDeath: '2026-11-09',
    janazah: {
      mosque: 'Urbana Islamic Center',
      address: 'Urbana, IL',
      datetime: new Date(Date.now() + 50 * 3600 * 1000).toISOString(),
      afterPrayer: 'After Asr',
      notes: 'Condolences (Azza) at the family home the following two evenings, 6–9 pm.',
    },
    family: 'Survived by her husband Syed and daughters Amina and Noor.',
    charity: {
      name: 'Free clinic fund in her name',
      goal: 5000,
      raised: 940,
    },
    duaCount: 96,
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
  },
]

export const seedVendors: Vendor[] = [
  {
    id: 'v-1',
    name: 'Noor Funeral Services (sample)',
    category: 'Funeral Home',
    city: 'Chicago',
    state: 'IL',
    phone: '(312) 555-0148',
    address: 'Sample address — replace with verified listing',
    notes: 'Licensed Muslim funeral home offering Ghusl, Kafan, and Janazah coordination.',
  },
  {
    id: 'v-2',
    name: 'CIMIC — Ghusl Facilities (sample)',
    category: 'Mosque / Ghusl',
    city: 'Urbana',
    state: 'IL',
    phone: '(217) 555-0119',
    address: '106 S Lincoln Ave, Urbana, IL 61801',
    notes: 'Mosque with Ghusl facilities; contact the office to arrange.',
  },
  {
    id: 'v-3',
    name: 'Muslim Section — Mount Hope (sample)',
    category: 'Cemetery',
    city: 'Champaign',
    state: 'IL',
    phone: '(217) 555-0173',
    address: '611 E Pennsylvania Ave, Champaign, IL 61820',
    notes: 'Cemetery with a Muslim burial section.',
  },
  {
    id: 'v-4',
    name: 'Halal Wills & Estates (sample)',
    category: 'Legal / Wasiyyah',
    city: 'Chicago',
    state: 'IL',
    phone: '(312) 555-0126',
    address: 'Sample address — replace with verified listing',
    notes: 'Sharia-compliant Wasiyyah (will) and estate planning advisors.',
  },
]
