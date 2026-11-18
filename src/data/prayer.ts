import type { Lang } from '../i18n'

/**
 * How to Pray Janazah — step content in all six site languages.
 *
 * Accuracy note: the four schools differ on small points (what is read
 * after the first Takbir, raising the hands, one salam or two). The steps
 * below present the widely shared structure; `schoolNotes` names the
 * differences and the standing advice is to follow the imam. These texts
 * should be reviewed by a trusted local scholar before being treated as
 * final — see the review note shown on the page itself.
 */

export type Pose = 'rows' | 'takbir' | 'folded' | 'salam-right' | 'salam-left'
export type School = 'hanafi' | 'shafii' | 'maliki' | 'hanbali'
export const SCHOOLS: School[] = ['hanafi', 'shafii', 'maliki', 'hanbali']

export interface PrayerStep {
  pose: Pose
  title: string
  action: string
  /** Label above the recitation, e.g. "You say quietly" */
  saidLabel?: string
  arabic?: string
  translit?: string
  said?: string
  /** Step-1 recitation differs by school — keyed overrides. */
  saidBySchool?: Partial<Record<School, string>>
}

export interface PrayerContent {
  heading: string
  intro: string
  play: string
  pause: string
  back: string
  next: string
  allSteps: string
  stepByStep: string
  print: string
  schoolLabel: string
  followImam: string
  reviewNote: string
  stepOf: (n: number, total: number) => string
  schools: Record<School, string>
  schoolNotes: Record<School, string>
  steps: PrayerStep[]
}

const DUA_AR = 'اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ، وَأَكْرِمْ نُزُلَهُ، وَوَسِّعْ مُدْخَلَهُ'
const DUA_TR = 'Allahumma-ghfir lahu warhamhu wa ‘afihi wa‘fu ‘anhu, wa akrim nuzulahu wa wassi‘ mudkhalahu'
const FATIHA_AR = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ…'
const SALAWAT_AR = 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ'
const THANA_AR = 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَىٰ جَدُّكَ، وَلَا إِلَٰهَ غَيْرُكَ'
const SALAM_AR = 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ'

const en: PrayerContent = {
  heading: 'How to pray Janazah',
  intro:
    'The funeral prayer is short, prayed standing, with no bowing or prostration. It has four takbirs (saying Allahu Akbar). Do not worry about getting everything perfect — your presence and your dua are what matter most.',
  play: 'Play',
  pause: 'Pause',
  back: 'Back',
  next: 'Next',
  allSteps: 'All steps on one page',
  stepByStep: 'Step by step',
  print: 'Print this guide',
  schoolLabel: 'School of thought',
  followImam: 'If anything differs from what you see around you, simply follow the imam.',
  reviewNote:
    'This guide presents the widely shared structure of the prayer. Small details differ between schools — when in doubt, follow the imam leading the prayer.',
  stepOf: (n, total) => `Step ${n} of ${total}`,
  schools: { hanafi: 'Hanafi', shafii: "Shafi'i", maliki: 'Maliki', hanbali: 'Hanbali' },
  schoolNotes: {
    hanafi: 'Hanafi: after the first Takbir the opening praise (Thana) is read instead of Al-Fatiha; hands are raised only for the first Takbir; the prayer ends with two salams.',
    shafii: "Shafi'i: Al-Fatiha is read after the first Takbir; hands are raised at each Takbir; one salam is required (a second is recommended).",
    maliki: 'Maliki: each Takbir is followed by dua rather than set recitations, including after the first; hands are raised only for the first Takbir; one salam.',
    hanbali: 'Hanbali: Al-Fatiha is read after the first Takbir, then dua after the remaining Takbirs; hands are raised at each Takbir; one salam.',
  },
  steps: [
    {
      pose: 'rows',
      title: 'Before you begin',
      action:
        'Make wudu, stand in the rows facing the qibla, and make your intention to pray the funeral prayer. The imam stands in front of the deceased. There is no bowing and no prostration in this prayer — if you arrive late, join the row and follow the imam from wherever he is.',
      saidLabel: 'Remember',
      said: 'Stand quietly and follow the imam. Everything after the takbirs is said silently, in your heart or under your breath.',
    },
    {
      pose: 'takbir',
      title: 'First Takbir — Allahu Akbar',
      action: 'The imam says Allahu Akbar aloud and raises his hands; raise yours with him, then fold them over your chest.',
      saidLabel: 'You say quietly',
      arabic: FATIHA_AR,
      translit: 'Bismillahir-Rahmanir-Rahim. Alhamdu lillahi Rabbil-‘alamin…',
      said: 'Surah Al-Fatiha is read quietly.',
      saidBySchool: {
        hanafi: 'The opening praise is read quietly: ' + THANA_AR,
        maliki: 'A short dua and praise of Allah is made quietly; no set surah is prescribed.',
      },
    },
    {
      pose: 'takbir',
      title: 'Second Takbir — Allahu Akbar',
      action: 'Raise your hands with the takbir as your school teaches (or keep them folded), then fold them again.',
      saidLabel: 'You say quietly',
      arabic: SALAWAT_AR,
      translit: 'Allahumma salli ‘ala Muhammadin wa ‘ala ali Muhammad, kama sallayta ‘ala Ibrahima wa ‘ala ali Ibrahim, innaka Hamidun Majid',
      said: 'Send blessings on the Prophet ﷺ — the Salawat (Durood Ibrahim), the same as in the regular prayer.',
    },
    {
      pose: 'takbir',
      title: 'Third Takbir — Allahu Akbar',
      action: 'This is the heart of the prayer: the dua for the deceased. Raise your hands with the takbir as before, then pray for them sincerely.',
      saidLabel: 'You say quietly — dua for the deceased',
      arabic: DUA_AR,
      translit: DUA_TR,
      said: '“O Allah, forgive him, have mercy on him, grant him health (in the hereafter) and pardon him; honour his arrival and widen his entrance.” Continue with any personal dua for them.',
    },
    {
      pose: 'folded',
      title: 'Fourth Takbir — Allahu Akbar',
      action: 'After the fourth takbir, make a short general dua for the deceased, their family, and all the believers — or remain silent briefly.',
      saidLabel: 'You say quietly',
      said: 'A short dua, for example: “O Allah, do not deprive us of his reward and do not test us after him.”',
    },
    {
      pose: 'salam-right',
      title: 'Taslim — ending the prayer',
      action: 'Turn your head to the right (and then to the left, as your imam does) with the salam. The prayer is complete. If you can, stay for the burial — it is a great act of love and reward.',
      saidLabel: 'You say',
      arabic: SALAM_AR,
      translit: 'As-salamu ‘alaykum wa rahmatullah',
      said: '“Peace be upon you, and the mercy of Allah.”',
    },
  ],
}

const ar: PrayerContent = {
  heading: 'كيف تصلي صلاة الجنازة',
  intro:
    'صلاة الجنازة قصيرة، تُصلّى قيامًا، ولا ركوع فيها ولا سجود. فيها أربع تكبيرات. لا تقلق من الكمال — حضورك ودعاؤك هما الأهم.',
  play: 'تشغيل',
  pause: 'إيقاف',
  back: 'السابق',
  next: 'التالي',
  allSteps: 'كل الخطوات في صفحة واحدة',
  stepByStep: 'خطوة بخطوة',
  print: 'اطبع هذا الدليل',
  schoolLabel: 'المذهب',
  followImam: 'إذا اختلف شيء عما تراه حولك، فاتبع الإمام ببساطة.',
  reviewNote: 'يعرض هذا الدليل الصورة المشتركة لصلاة الجنازة. تختلف تفاصيل صغيرة بين المذاهب — وعند الشك اتبع الإمام.',
  stepOf: (n, total) => `الخطوة ${n} من ${total}`,
  schools: { hanafi: 'حنفي', shafii: 'شافعي', maliki: 'مالكي', hanbali: 'حنبلي' },
  schoolNotes: {
    hanafi: 'الحنفية: بعد التكبيرة الأولى يُقرأ الثناء بدل الفاتحة، ولا تُرفع اليدان إلا في الأولى، ويُسلّم تسليمتين.',
    shafii: 'الشافعية: تُقرأ الفاتحة بعد التكبيرة الأولى، وتُرفع اليدان عند كل تكبيرة، وتسليمة واحدة واجبة والثانية مستحبة.',
    maliki: 'المالكية: بعد كل تكبيرة دعاء لا قراءة معينة، ولا تُرفع اليدان إلا في الأولى، وتسليمة واحدة.',
    hanbali: 'الحنابلة: تُقرأ الفاتحة بعد الأولى ثم الدعاء بعد الباقي، وتُرفع اليدان عند كل تكبيرة، وتسليمة واحدة.',
  },
  steps: [
    {
      pose: 'rows',
      title: 'قبل أن تبدأ',
      action: 'توضأ، وقف في الصف مستقبلًا القبلة، وانوِ صلاة الجنازة. يقف الإمام أمام الجنازة. لا ركوع ولا سجود في هذه الصلاة — وإن جئت متأخرًا فادخل الصف واتبع الإمام من حيث هو.',
      saidLabel: 'تذكّر',
      said: 'قف بخشوع واتبع الإمام. كل ما بعد التكبيرات يُقال سرًّا.',
    },
    {
      pose: 'takbir',
      title: 'التكبيرة الأولى — الله أكبر',
      action: 'يكبّر الإمام جهرًا ويرفع يديه؛ فارفع يديك معه ثم ضعهما على صدرك.',
      saidLabel: 'تقول سرًّا',
      arabic: FATIHA_AR,
      translit: 'Bismillahir-Rahmanir-Rahim. Alhamdu lillahi Rabbil-‘alamin…',
      said: 'تُقرأ سورة الفاتحة سرًّا.',
      saidBySchool: {
        hanafi: 'يُقرأ الثناء سرًّا: ' + THANA_AR,
        maliki: 'يُدعى ويُثنى على الله سرًّا دون سورة معينة.',
      },
    },
    {
      pose: 'takbir',
      title: 'التكبيرة الثانية — الله أكبر',
      action: 'ارفع يديك مع التكبيرة كما يعلّم مذهبك (أو أبقِهما مطويتين)، ثم ضعهما على صدرك.',
      saidLabel: 'تقول سرًّا',
      arabic: SALAWAT_AR,
      translit: 'Allahumma salli ‘ala Muhammadin wa ‘ala ali Muhammad…',
      said: 'الصلاة على النبي ﷺ — الصلاة الإبراهيمية كما في الصلاة المعتادة.',
    },
    {
      pose: 'takbir',
      title: 'التكبيرة الثالثة — الله أكبر',
      action: 'هذه قلب الصلاة: الدعاء للميت. ارفع يديك مع التكبيرة ثم ادعُ له بإخلاص.',
      saidLabel: 'تقول سرًّا — الدعاء للميت',
      arabic: DUA_AR,
      translit: DUA_TR,
      said: 'ثم أكمل بدعائك الخاص له.',
    },
    {
      pose: 'folded',
      title: 'التكبيرة الرابعة — الله أكبر',
      action: 'بعد التكبيرة الرابعة ادعُ دعاءً عامًّا قصيرًا للميت وأهله وجميع المؤمنين، أو اسكت قليلًا.',
      saidLabel: 'تقول سرًّا',
      said: 'دعاء قصير، مثل: اللهم لا تحرمنا أجره ولا تفتنا بعده.',
    },
    {
      pose: 'salam-right',
      title: 'التسليم — ختام الصلاة',
      action: 'التفت يمينًا (ثم يسارًا كما يفعل إمامك) بالسلام. انتهت الصلاة. وإن استطعت فاحضر الدفن — فهو عمل عظيم الأجر.',
      saidLabel: 'تقول',
      arabic: SALAM_AR,
      translit: 'As-salamu ‘alaykum wa rahmatullah',
      said: 'السلام عليكم ورحمة الله.',
    },
  ],
}

const ur: PrayerContent = {
  heading: 'نمازِ جنازہ کیسے پڑھیں',
  intro:
    'نمازِ جنازہ مختصر ہے، کھڑے ہو کر پڑھی جاتی ہے، اس میں رکوع اور سجدہ نہیں۔ اس میں چار تکبیریں ہیں۔ کمال کی فکر نہ کریں — آپ کی حاضری اور دعا سب سے اہم ہے۔',
  play: 'چلائیں',
  pause: 'روکیں',
  back: 'پیچھے',
  next: 'آگے',
  allSteps: 'تمام مراحل ایک صفحے پر',
  stepByStep: 'مرحلہ وار',
  print: 'یہ رہنما چھاپیں',
  schoolLabel: 'مسلک',
  followImam: 'اگر کچھ آپ کے اردگرد سے مختلف ہو تو بس امام کی پیروی کریں۔',
  reviewNote: 'یہ رہنما نمازِ جنازہ کی مشترکہ صورت پیش کرتا ہے۔ مسالک میں چھوٹے اختلافات ہیں — شک ہو تو امام کی پیروی کریں۔',
  stepOf: (n, total) => `مرحلہ ${n} از ${total}`,
  schools: { hanafi: 'حنفی', shafii: 'شافعی', maliki: 'مالکی', hanbali: 'حنبلی' },
  schoolNotes: {
    hanafi: 'حنفی: پہلی تکبیر کے بعد فاتحہ کی بجائے ثنا پڑھی جاتی ہے؛ ہاتھ صرف پہلی تکبیر پر اٹھائے جاتے ہیں؛ آخر میں دو سلام۔',
    shafii: 'شافعی: پہلی تکبیر کے بعد فاتحہ پڑھی جاتی ہے؛ ہر تکبیر پر ہاتھ اٹھائے جاتے ہیں؛ ایک سلام واجب، دوسرا مستحب۔',
    maliki: 'مالکی: ہر تکبیر کے بعد مقررہ تلاوت کی بجائے دعا کی جاتی ہے؛ ہاتھ صرف پہلی تکبیر پر؛ ایک سلام۔',
    hanbali: 'حنبلی: پہلی تکبیر کے بعد فاتحہ، باقی کے بعد دعا؛ ہر تکبیر پر ہاتھ اٹھائے جاتے ہیں؛ ایک سلام۔',
  },
  steps: [
    {
      pose: 'rows',
      title: 'شروع سے پہلے',
      action: 'وضو کریں، قبلہ رخ صف میں کھڑے ہوں اور نمازِ جنازہ کی نیت کریں۔ امام میت کے سامنے کھڑا ہوتا ہے۔ اس نماز میں رکوع و سجدہ نہیں — دیر سے پہنچیں تو صف میں شامل ہو کر امام کی پیروی کریں۔',
      saidLabel: 'یاد رکھیں',
      said: 'خاموشی سے کھڑے رہیں اور امام کی پیروی کریں۔ تکبیروں کے بعد سب کچھ آہستہ کہا جاتا ہے۔',
    },
    {
      pose: 'takbir',
      title: 'پہلی تکبیر — اللہ اکبر',
      action: 'امام بلند آواز سے تکبیر کہتا اور ہاتھ اٹھاتا ہے؛ آپ بھی اٹھائیں، پھر سینے پر باندھ لیں۔',
      saidLabel: 'آپ آہستہ کہتے ہیں',
      arabic: FATIHA_AR,
      translit: 'Bismillahir-Rahmanir-Rahim. Alhamdu lillahi Rabbil-‘alamin…',
      said: 'سورۃ الفاتحہ آہستہ پڑھی جاتی ہے۔',
      saidBySchool: {
        hanafi: 'ثنا آہستہ پڑھی جاتی ہے: ' + THANA_AR,
        maliki: 'آہستہ دعا اور اللہ کی حمد کی جاتی ہے؛ کوئی مقررہ سورۃ نہیں۔',
      },
    },
    {
      pose: 'takbir',
      title: 'دوسری تکبیر — اللہ اکبر',
      action: 'اپنے مسلک کے مطابق تکبیر کے ساتھ ہاتھ اٹھائیں (یا باندھے رکھیں)، پھر دوبارہ باندھ لیں۔',
      saidLabel: 'آپ آہستہ کہتے ہیں',
      arabic: SALAWAT_AR,
      translit: 'Allahumma salli ‘ala Muhammadin wa ‘ala ali Muhammad…',
      said: 'نبی ﷺ پر درود — درودِ ابراہیمی، جیسے عام نماز میں پڑھا جاتا ہے۔',
    },
    {
      pose: 'takbir',
      title: 'تیسری تکبیر — اللہ اکبر',
      action: 'یہ نماز کا دل ہے: میت کے لیے دعا۔ تکبیر کے ساتھ ہاتھ اٹھائیں اور اخلاص سے ان کے لیے دعا کریں۔',
      saidLabel: 'آپ آہستہ کہتے ہیں — میت کے لیے دعا',
      arabic: DUA_AR,
      translit: DUA_TR,
      said: '’’اے اللہ! اسے بخش دے، اس پر رحم فرما، اسے عافیت دے اور درگزر فرما؛ اس کی آمد کو عزت دے اور اس کی منزل وسیع فرما۔‘‘ پھر اپنی دعا جاری رکھیں۔',
    },
    {
      pose: 'folded',
      title: 'چوتھی تکبیر — اللہ اکبر',
      action: 'چوتھی تکبیر کے بعد میت، اس کے اہل اور تمام مومنوں کے لیے مختصر عمومی دعا کریں، یا تھوڑی دیر خاموش رہیں۔',
      saidLabel: 'آپ آہستہ کہتے ہیں',
      said: 'مختصر دعا، مثلاً: ’’اے اللہ! ہمیں اس کے اجر سے محروم نہ فرما اور اس کے بعد ہمیں آزمائش میں نہ ڈال۔‘‘',
    },
    {
      pose: 'salam-right',
      title: 'تسلیم — نماز کا اختتام',
      action: 'سلام کے ساتھ سر دائیں (پھر بائیں، جیسے آپ کا امام کرے) پھیریں۔ نماز مکمل ہوئی۔ ہو سکے تو تدفین میں ضرور شریک ہوں۔',
      saidLabel: 'آپ کہتے ہیں',
      arabic: SALAM_AR,
      translit: 'As-salamu ‘alaykum wa rahmatullah',
      said: '’’تم پر سلامتی ہو اور اللہ کی رحمت۔‘‘',
    },
  ],
}

const bn: PrayerContent = {
  heading: 'জানাজার নামাজ কীভাবে পড়বেন',
  intro:
    'জানাজার নামাজ সংক্ষিপ্ত, দাঁড়িয়ে পড়া হয়, এতে রুকু বা সিজদা নেই। এতে চারটি তাকবির আছে। নিখুঁত হওয়া নিয়ে দুশ্চিন্তা করবেন না — আপনার উপস্থিতি ও দোয়াই সবচেয়ে গুরুত্বপূর্ণ।',
  play: 'চালান',
  pause: 'থামান',
  back: 'পেছনে',
  next: 'সামনে',
  allSteps: 'সব ধাপ এক পৃষ্ঠায়',
  stepByStep: 'ধাপে ধাপে',
  print: 'এই নির্দেশিকা ছাপুন',
  schoolLabel: 'মাযহাব',
  followImam: 'আশেপাশের থেকে কিছু আলাদা দেখলে শুধু ইমামকে অনুসরণ করুন।',
  reviewNote: 'এই নির্দেশিকা জানাজার নামাজের প্রচলিত কাঠামো তুলে ধরে। মাযহাবগুলোর মধ্যে ছোটখাটো পার্থক্য আছে — সন্দেহ হলে ইমামকে অনুসরণ করুন।',
  stepOf: (n, total) => `ধাপ ${n} / ${total}`,
  schools: { hanafi: 'হানাফি', shafii: 'শাফেয়ি', maliki: 'মালেকি', hanbali: 'হাম্বলি' },
  schoolNotes: {
    hanafi: 'হানাফি: প্রথম তাকবিরের পর ফাতিহার বদলে সানা পড়া হয়; হাত শুধু প্রথম তাকবিরে ওঠে; শেষে দুটি সালাম।',
    shafii: 'শাফেয়ি: প্রথম তাকবিরের পর ফাতিহা পড়া হয়; প্রতিটি তাকবিরে হাত ওঠে; একটি সালাম আবশ্যক, দ্বিতীয়টি সুপারিশকৃত।',
    maliki: 'মালেকি: প্রতিটি তাকবিরের পর নির্দিষ্ট তিলাওয়াতের বদলে দোয়া করা হয়; হাত শুধু প্রথম তাকবিরে; একটি সালাম।',
    hanbali: 'হাম্বলি: প্রথম তাকবিরের পর ফাতিহা, বাকিগুলোর পর দোয়া; প্রতিটি তাকবিরে হাত ওঠে; একটি সালাম।',
  },
  steps: [
    {
      pose: 'rows',
      title: 'শুরু করার আগে',
      action: 'ওজু করুন, কিবলামুখী হয়ে সারিতে দাঁড়ান এবং জানাজার নামাজের নিয়ত করুন। ইমাম মৃতের সামনে দাঁড়ান। এই নামাজে রুকু-সিজদা নেই — দেরিতে এলে সারিতে যোগ দিয়ে ইমামকে অনুসরণ করুন।',
      saidLabel: 'মনে রাখুন',
      said: 'শান্তভাবে দাঁড়িয়ে ইমামকে অনুসরণ করুন। তাকবিরের পরের সবকিছু নীরবে বলা হয়।',
    },
    {
      pose: 'takbir',
      title: 'প্রথম তাকবির — আল্লাহু আকবার',
      action: 'ইমাম উচ্চস্বরে তাকবির বলেন ও হাত ওঠান; আপনিও ওঠান, তারপর বুকে বাঁধুন।',
      saidLabel: 'আপনি নীরবে বলেন',
      arabic: FATIHA_AR,
      translit: 'Bismillahir-Rahmanir-Rahim. Alhamdu lillahi Rabbil-‘alamin…',
      said: 'সূরা ফাতিহা নীরবে পড়া হয়।',
      saidBySchool: {
        hanafi: 'সানা নীরবে পড়া হয়: ' + THANA_AR,
        maliki: 'নীরবে দোয়া ও আল্লাহর প্রশংসা করা হয়; নির্দিষ্ট কোনো সূরা নেই।',
      },
    },
    {
      pose: 'takbir',
      title: 'দ্বিতীয় তাকবির — আল্লাহু আকবার',
      action: 'আপনার মাযহাব অনুযায়ী তাকবিরের সাথে হাত ওঠান (অথবা বাঁধা রাখুন), তারপর আবার বাঁধুন।',
      saidLabel: 'আপনি নীরবে বলেন',
      arabic: SALAWAT_AR,
      translit: 'Allahumma salli ‘ala Muhammadin wa ‘ala ali Muhammad…',
      said: 'নবী ﷺ-এর প্রতি দরুদ — দরুদে ইব্রাহিম, সাধারণ নামাজের মতোই।',
    },
    {
      pose: 'takbir',
      title: 'তৃতীয় তাকবির — আল্লাহু আকবার',
      action: 'এটি নামাজের প্রাণ: মৃতের জন্য দোয়া। তাকবিরের সাথে হাত ওঠান এবং আন্তরিকভাবে তাঁর জন্য দোয়া করুন।',
      saidLabel: 'আপনি নীরবে বলেন — মৃতের জন্য দোয়া',
      arabic: DUA_AR,
      translit: DUA_TR,
      said: '“হে আল্লাহ, তাঁকে ক্ষমা করুন, তাঁর প্রতি দয়া করুন, তাঁকে সুস্থতা (পরকালে) ও ক্ষমা দান করুন; তাঁর আগমনকে সম্মানিত করুন ও তাঁর প্রবেশস্থল প্রশস্ত করুন।” তারপর নিজের ভাষায় দোয়া চালিয়ে যান।',
    },
    {
      pose: 'folded',
      title: 'চতুর্থ তাকবির — আল্লাহু আকবার',
      action: 'চতুর্থ তাকবিরের পর মৃত, তাঁর পরিবার ও সকল মুমিনের জন্য সংক্ষিপ্ত সাধারণ দোয়া করুন, অথবা কিছুক্ষণ নীরব থাকুন।',
      saidLabel: 'আপনি নীরবে বলেন',
      said: 'সংক্ষিপ্ত দোয়া, যেমন: “হে আল্লাহ, আমাদের তাঁর সওয়াব থেকে বঞ্চিত করবেন না এবং তাঁর পরে আমাদের পরীক্ষায় ফেলবেন না।”',
    },
    {
      pose: 'salam-right',
      title: 'তাসলিম — নামাজের সমাপ্তি',
      action: 'সালামের সাথে মাথা ডানে (তারপর বামে, ইমাম যেমন করেন) ঘোরান। নামাজ শেষ। সম্ভব হলে দাফনে থাকুন — এটি ভালোবাসা ও সওয়াবের বড় কাজ।',
      saidLabel: 'আপনি বলেন',
      arabic: SALAM_AR,
      translit: 'As-salamu ‘alaykum wa rahmatullah',
      said: '“আপনাদের প্রতি শান্তি ও আল্লাহর রহমত বর্ষিত হোক।”',
    },
  ],
}

const es: PrayerContent = {
  heading: 'Cómo rezar el Janazah',
  intro:
    'La oración fúnebre es breve, se reza de pie, sin inclinaciones ni postraciones. Tiene cuatro takbirs (decir Allahu Akbar). No te preocupes por la perfección: tu presencia y tu dua son lo más importante.',
  play: 'Reproducir',
  pause: 'Pausar',
  back: 'Atrás',
  next: 'Siguiente',
  allSteps: 'Todos los pasos en una página',
  stepByStep: 'Paso a paso',
  print: 'Imprimir esta guía',
  schoolLabel: 'Escuela de pensamiento',
  followImam: 'Si algo difiere de lo que ves a tu alrededor, sigue simplemente al imam.',
  reviewNote: 'Esta guía presenta la estructura ampliamente compartida de la oración. Algunos detalles difieren entre escuelas: ante la duda, sigue al imam que dirige la oración.',
  stepOf: (n, total) => `Paso ${n} de ${total}`,
  schools: { hanafi: 'Hanafí', shafii: 'Shafií', maliki: 'Malikí', hanbali: 'Hanbalí' },
  schoolNotes: {
    hanafi: 'Hanafí: tras el primer Takbir se lee la alabanza inicial (Thana) en lugar de Al-Fatiha; las manos se levantan solo en el primer Takbir; la oración termina con dos salams.',
    shafii: 'Shafií: se lee Al-Fatiha tras el primer Takbir; las manos se levantan en cada Takbir; un salam es obligatorio (el segundo es recomendado).',
    maliki: 'Malikí: tras cada Takbir se hace dua en lugar de recitaciones fijas; las manos se levantan solo en el primer Takbir; un salam.',
    hanbali: 'Hanbalí: se lee Al-Fatiha tras el primer Takbir y dua tras los demás; las manos se levantan en cada Takbir; un salam.',
  },
  steps: [
    {
      pose: 'rows',
      title: 'Antes de empezar',
      action: 'Haz wudu, ponte en las filas mirando a la qibla y haz tu intención de rezar la oración fúnebre. El imam se coloca frente al difunto. En esta oración no hay inclinación ni postración: si llegas tarde, únete a la fila y sigue al imam desde donde esté.',
      saidLabel: 'Recuerda',
      said: 'Permanece de pie en silencio y sigue al imam. Todo lo que sigue a los takbirs se dice en silencio.',
    },
    {
      pose: 'takbir',
      title: 'Primer Takbir — Allahu Akbar',
      action: 'El imam dice Allahu Akbar en voz alta y levanta las manos; levanta las tuyas con él y luego crúzalas sobre el pecho.',
      saidLabel: 'Dices en silencio',
      arabic: FATIHA_AR,
      translit: 'Bismillahir-Rahmanir-Rahim. Alhamdu lillahi Rabbil-‘alamin…',
      said: 'Se lee la sura Al-Fatiha en silencio.',
      saidBySchool: {
        hanafi: 'Se lee en silencio la alabanza inicial: ' + THANA_AR,
        maliki: 'Se hace una breve dua y alabanza a Alá en silencio; no se prescribe una sura fija.',
      },
    },
    {
      pose: 'takbir',
      title: 'Segundo Takbir — Allahu Akbar',
      action: 'Levanta las manos con el takbir como enseña tu escuela (o mantenlas cruzadas) y vuelve a cruzarlas.',
      saidLabel: 'Dices en silencio',
      arabic: SALAWAT_AR,
      translit: 'Allahumma salli ‘ala Muhammadin wa ‘ala ali Muhammad…',
      said: 'Envía bendiciones al Profeta ﷺ: el Salawat (Durood Ibrahim), igual que en la oración habitual.',
    },
    {
      pose: 'takbir',
      title: 'Tercer Takbir — Allahu Akbar',
      action: 'Este es el corazón de la oración: la dua por el difunto. Levanta las manos con el takbir y reza por él con sinceridad.',
      saidLabel: 'Dices en silencio — dua por el difunto',
      arabic: DUA_AR,
      translit: DUA_TR,
      said: '«Oh Alá, perdónalo, ten misericordia de él, concédele bienestar y perdón; honra su llegada y ensancha su entrada». Continúa con tu dua personal por él.',
    },
    {
      pose: 'folded',
      title: 'Cuarto Takbir — Allahu Akbar',
      action: 'Tras el cuarto takbir, haz una breve dua general por el difunto, su familia y todos los creyentes, o guarda silencio un momento.',
      saidLabel: 'Dices en silencio',
      said: 'Una dua breve, por ejemplo: «Oh Alá, no nos prives de su recompensa ni nos pongas a prueba después de él».',
    },
    {
      pose: 'salam-right',
      title: 'Taslim — fin de la oración',
      action: 'Gira la cabeza a la derecha (y luego a la izquierda, como haga tu imam) con el salam. La oración ha terminado. Si puedes, quédate para el entierro: es un gran acto de amor y recompensa.',
      saidLabel: 'Dices',
      arabic: SALAM_AR,
      translit: 'As-salamu ‘alaykum wa rahmatullah',
      said: '«La paz sea con vosotros, y la misericordia de Alá».',
    },
  ],
}

const hi: PrayerContent = {
  heading: 'जनाज़ा नमाज़ कैसे पढ़ें',
  intro:
    'जनाज़ा नमाज़ छोटी होती है, खड़े होकर पढ़ी जाती है, इसमें न रुकू है न सजदा। इसमें चार तकबीरें हैं। पूर्णता की चिंता न करें — आपकी उपस्थिति और दुआ सबसे महत्वपूर्ण है।',
  play: 'चलाएं',
  pause: 'रोकें',
  back: 'पीछे',
  next: 'आगे',
  allSteps: 'सभी चरण एक पृष्ठ पर',
  stepByStep: 'चरण-दर-चरण',
  print: 'यह मार्गदर्शिका छापें',
  schoolLabel: 'विचारधारा (मस्लक)',
  followImam: 'यदि कुछ आपके आसपास से अलग हो, तो बस इमाम का अनुसरण करें।',
  reviewNote: 'यह मार्गदर्शिका जनाज़ा नमाज़ की व्यापक रूप से साझा संरचना प्रस्तुत करती है। मस्लकों में छोटे अंतर हैं — संदेह हो तो इमाम का अनुसरण करें।',
  stepOf: (n, total) => `चरण ${n} / ${total}`,
  schools: { hanafi: 'हनफ़ी', shafii: 'शाफ़िई', maliki: 'मालिकी', hanbali: 'हंबली' },
  schoolNotes: {
    hanafi: 'हनफ़ी: पहली तकबीर के बाद फ़ातिहा की जगह सना पढ़ी जाती है; हाथ केवल पहली तकबीर पर उठते हैं; अंत में दो सलाम।',
    shafii: 'शाफ़िई: पहली तकबीर के बाद फ़ातिहा पढ़ी जाती है; हर तकबीर पर हाथ उठते हैं; एक सलाम अनिवार्य, दूसरा अनुशंसित।',
    maliki: 'मालिकी: हर तकबीर के बाद निश्चित तिलावत की जगह दुआ की जाती है; हाथ केवल पहली तकबीर पर; एक सलाम।',
    hanbali: 'हंबली: पहली तकबीर के बाद फ़ातिहा, बाकी के बाद दुआ; हर तकबीर पर हाथ उठते हैं; एक सलाम।',
  },
  steps: [
    {
      pose: 'rows',
      title: 'शुरू करने से पहले',
      action: 'वुज़ू करें, क़िबला की ओर मुंह करके पंक्तियों में खड़े हों और जनाज़ा नमाज़ की नीयत करें। इमाम मृतक के सामने खड़ा होता है। इस नमाज़ में रुकू और सजदा नहीं है — देर से पहुंचें तो पंक्ति में शामिल होकर इमाम का अनुसरण करें।',
      saidLabel: 'याद रखें',
      said: 'शांति से खड़े रहें और इमाम का अनुसरण करें। तकबीरों के बाद सब कुछ मन में या धीरे से कहा जाता है।',
    },
    {
      pose: 'takbir',
      title: 'पहली तकबीर — अल्लाहु अकबर',
      action: 'इमाम ऊंची आवाज़ में तकबीर कहता है और हाथ उठाता है; आप भी उठाएं, फिर छाती पर बांध लें।',
      saidLabel: 'आप धीरे से कहते हैं',
      arabic: FATIHA_AR,
      translit: 'Bismillahir-Rahmanir-Rahim. Alhamdu lillahi Rabbil-‘alamin…',
      said: 'सूरह अल-फ़ातिहा धीरे से पढ़ी जाती है।',
      saidBySchool: {
        hanafi: 'सना धीरे से पढ़ी जाती है: ' + THANA_AR,
        maliki: 'धीरे से दुआ और अल्लाह की प्रशंसा की जाती है; कोई निश्चित सूरह नहीं है।',
      },
    },
    {
      pose: 'takbir',
      title: 'दूसरी तकबीर — अल्लाहु अकबर',
      action: 'अपने मस्लक के अनुसार तकबीर के साथ हाथ उठाएं (या बांधे रखें), फिर दोबारा बांध लें।',
      saidLabel: 'आप धीरे से कहते हैं',
      arabic: SALAWAT_AR,
      translit: 'Allahumma salli ‘ala Muhammadin wa ‘ala ali Muhammad…',
      said: 'पैग़ंबर ﷺ पर सलावात — दुरूदे इब्राहीम, जैसे सामान्य नमाज़ में पढ़ा जाता है।',
    },
    {
      pose: 'takbir',
      title: 'तीसरी तकबीर — अल्लाहु अकबर',
      action: 'यह नमाज़ का हृदय है: मृतक के लिए दुआ। तकबीर के साथ हाथ उठाएं और सच्चे मन से उनके लिए दुआ करें।',
      saidLabel: 'आप धीरे से कहते हैं — मृतक के लिए दुआ',
      arabic: DUA_AR,
      translit: DUA_TR,
      said: '“हे अल्लाह, उसे क्षमा कर दे, उस पर दया कर, उसे (परलोक में) कुशलता और क्षमा दे; उसके आगमन का सम्मान कर और उसका प्रवेश विस्तृत कर दे।” फिर अपनी दुआ जारी रखें।',
    },
    {
      pose: 'folded',
      title: 'चौथी तकबीर — अल्लाहु अकबर',
      action: 'चौथी तकबीर के बाद मृतक, उसके परिवार और सभी ईमान वालों के लिए संक्षिप्त सामान्य दुआ करें, या थोड़ी देर शांत रहें।',
      saidLabel: 'आप धीरे से कहते हैं',
      said: 'संक्षिप्त दुआ, उदाहरण: “हे अल्लाह, हमें उसके सवाब से वंचित न कर और उसके बाद हमारी परीक्षा न ले।”',
    },
    {
      pose: 'salam-right',
      title: 'तस्लीम — नमाज़ की समाप्ति',
      action: 'सलाम के साथ सिर दाईं ओर (फिर बाईं ओर, जैसे आपका इमाम करे) मोड़ें। नमाज़ पूर्ण हुई। यदि संभव हो तो दफ़न में शामिल हों — यह प्रेम और सवाब का महान कार्य है।',
      saidLabel: 'आप कहते हैं',
      arabic: SALAM_AR,
      translit: 'As-salamu ‘alaykum wa rahmatullah',
      said: '“तुम पर शांति हो, और अल्लाह की दया।”',
    },
  ],
}

export const PRAYER: Record<Lang, PrayerContent> = { en, ar, ur, bn, es, hi }
