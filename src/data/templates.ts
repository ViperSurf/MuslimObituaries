export interface DuaTemplate {
  arabic: string
  transliteration: string
  english: string
}

/** Authentic dua templates (Arabic + transliteration + English), ported
 *  from the original Al-Baqaa build's data bank. */
export const DUA_TEMPLATES: DuaTemplate[] = [
  {
    arabic: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ',
    transliteration: "Inna lillahi wa inna ilayhi raji'un",
    english: 'Verily we belong to Allah, and truly to Him shall we return.',
  },
  {
    arabic: 'اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ',
    transliteration: "Allahumma-ghfir lahu warhamhu wa 'afihi wa'fu 'anhu",
    english: 'O Allah, forgive him/her, have mercy on him/her, grant him/her peace and pardon him/her.',
  },
  {
    arabic: 'اللَّهُمَّ أَدْخِلْهُ الْجَنَّةَ وَأَعِذْهُ مِنْ عَذَابِ الْقَبْرِ',
    transliteration: "Allahumma adkhilhu-l-jannata wa a'idhhu min 'adhabi-l-qabr",
    english: 'O Allah, admit him/her to Paradise and protect him/her from the punishment of the grave.',
  },
  {
    arabic: 'اللَّهُمَّ اغْفِرْ لِحَيِّنَا وَمَيِّتِنَا وَشَاهِدِنَا وَغَائِبِنَا',
    transliteration: "Allahumma-ghfir lihayyina wa mayyitina wa shahidina wa gha'ibina",
    english: 'O Allah, forgive our living and our deceased, those present and those absent.',
  },
]
