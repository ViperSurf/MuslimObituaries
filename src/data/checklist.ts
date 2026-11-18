import type { Lang } from '../i18n'

/** "When a loved one passes" — a calm first-24-hours checklist.
 *  Practical, in rough order, no legal advice beyond "ask for help".
 *
 *  ORDERING NOTE (Bara, 2026-11-17, from the scholarly source he supplied —
 *  ash-Shafi'i, Ahmad and at-Tirmidhi from Abu Hurayrah: "The soul of the
 *  believer is held back by his debt until it is paid off on his behalf"):
 *  settling the deceased's debts and obligations comes EARLY — before the
 *  funeral prayer if possible (some scholars: before the washing; at the
 *  latest before the burial) — never as an "afterwards" item. If the estate
 *  is not immediately available, an heir or another person taking
 *  responsibility for / guaranteeing the debt is the recommended bridge.
 *  Bequests (wasiyyah) and estate distribution come AFTER debts. Do not
 *  move the debts step back to the end when editing this file. */
export interface ChecklistContent {
  heading: string
  intro: string
  note: string
  items: { title: string; detail: string }[]
}

const en: ChecklistContent = {
  heading: 'When a loved one passes',
  intro: 'Take this one step at a time. You do not have to do everything yourself — your mosque, funeral home, family and friends are there to carry much of this with you.',
  note: 'Details such as certificates and permits differ by place; your funeral home will walk you through what applies where you are.',
  items: [
    { title: 'Be with them, and make dua', detail: 'Take a moment. Close their eyes gently if they are open, and make dua for them. There is no rush in the first minutes.' },
    { title: 'Call family and your mosque', detail: 'Tell close family first. Your mosque or a Muslim funeral home can guide every step after this and often handles most arrangements.' },
    { title: 'Contact a Muslim funeral home', detail: 'They arrange transport, the washing (ghusl), the shroud (kafan), and the paperwork. See the Funeral Services directory on this site.' },
    { title: 'Arrange ghusl and kafan', detail: 'The funeral home or mosque usually provides trained washers of the same gender. Family members may take part if they wish.' },
    { title: 'Hasten to settle their debts', detail: 'This comes early, not at the end: from their estate, pay their debts and outstanding obligations — money owed, zakaah that is due, property held in trust, borrowed items, unfulfilled vows or expiations — before the funeral prayer if at all possible (some scholars say even before the washing, and at the latest before the burial). If the money is not available right away, a family member or heir can take responsibility for the debt or guarantee it, so it is not left unsettled.' },
    { title: 'Set the Janazah prayer time', detail: 'Agree a time and mosque with the funeral home — often after a regular prayer — then announce it so the community can attend. You can submit the notice on this site, or send a photo of the notice to an admin.' },
    { title: 'Arrange the burial plot', detail: 'The funeral home coordinates the cemetery and the burial time, usually right after the Janazah.' },
    { title: 'Paperwork the funeral home will ask about', detail: 'Identification for the deceased, and details for the death certificate. They will tell you exactly what is needed — you do not need to research it alone.' },
    { title: 'Azza — receiving condolences', detail: 'Families often receive visitors for a few days after the burial. Share the address and hours on the obituary page so people know when to come.' },
    { title: 'Afterwards', detail: 'Once debts and obligations are settled, carry out the will (wasiyyah) and distribute what remains of the estate — bequests come after debts. You can also arrange a Sadaqah Jariyah in their name. These steps follow the debts step above; they are not the first priority.' },
  ],
}

const ar: ChecklistContent = {
  heading: 'عند وفاة عزيز',
  intro: 'خذ الأمر خطوة بخطوة. لست مضطرًا لفعل كل شيء بنفسك — المسجد ودار الجنائز والعائلة والأصدقاء سيحملون معك الكثير.',
  note: 'تختلف التفاصيل مثل الشهادات والتصاريح حسب المكان؛ سترشدك دار الجنائز لما ينطبق عليك.',
  items: [
    { title: 'كن معهم وادعُ لهم', detail: 'خذ لحظة. أغمض عيونهم بلطف إن كانت مفتوحة، وادعُ لهم. لا عجلة في الدقائق الأولى.' },
    { title: 'اتصل بالعائلة والمسجد', detail: 'أخبر الأقارب أولًا. مسجدك أو دار جنائز مسلمة سترشدك في كل خطوة وغالبًا تتولى معظم الترتيبات.' },
    { title: 'تواصل مع دار جنائز مسلمة', detail: 'هم يرتبون النقل والغُسل والكفن والأوراق. راجع دليل خدمات الجنائز في هذا الموقع.' },
    { title: 'رتب الغُسل والكفن', detail: 'توفر دار الجنائز أو المسجد عادة مغسّلين مدرّبين من نفس الجنس. ويمكن للعائلة المشاركة إن رغبت.' },
    { title: 'سارع إلى قضاء ديونهم', detail: 'هذا يأتي مبكرًا لا في النهاية: من تركته تُقضى ديونه والتزاماته — الأموال المستحقة، والزكاة الواجبة، والأمانات، والأشياء المستعارة، والنذور والكفارات غير المؤداة — قبل صلاة الجنازة إن أمكن (وقال بعض العلماء: حتى قبل الغُسل، وعلى الأقل قبل الدفن). وإن لم تتوفر الأموال فورًا، يمكن لأحد أفراد العائلة أو الورثة تحمّل مسؤولية الدين أو ضمانه حتى لا يبقى معلّقًا.' },
    { title: 'حدد وقت صلاة الجنازة', detail: 'اتفق على الوقت والمسجد مع دار الجنائز — غالبًا بعد صلاة مفروضة — ثم أعلن عنه ليحضر المجتمع. يمكنك نشر النعي هنا أو إرسال صورة الإعلان للإدارة.' },
    { title: 'رتب قطعة القبر', detail: 'تنسق دار الجنائز مع المقبرة ووقت الدفن، عادة مباشرة بعد الجنازة.' },
    { title: 'أوراق ستطلبها دار الجنائز', detail: 'هوية المتوفى وتفاصيل شهادة الوفاة. سيخبرونك بالضبط بما يلزم — لا حاجة للبحث وحدك.' },
    { title: 'العزاء — استقبال المعزّين', detail: 'غالبًا تستقبل العائلات الزوار بضعة أيام بعد الدفن. شارك العنوان والأوقات في صفحة النعي.' },
    { title: 'بعد ذلك', detail: 'بعد قضاء الديون والالتزامات، نفّذ الوصية ووزّع ما بقي من التركة — فالوصايا تكون بعد الديون. ويمكنك أيضًا ترتيب صدقة جارية باسمه. هذه الخطوات تأتي بعد خطوة الديون أعلاه؛ ليست الأولوية الأولى.' },
  ],
}

const ur: ChecklistContent = {
  heading: 'کسی عزیز کے انتقال پر',
  intro: 'ایک وقت میں ایک قدم اٹھائیں۔ سب کچھ خود کرنا ضروری نہیں — آپ کی مسجد، جنازہ گاہ، خاندان اور دوست اس میں آپ کے ساتھ ہیں۔',
  note: 'سرٹیفکیٹ اور اجازت ناموں جیسی تفصیلات جگہ کے لحاظ سے مختلف ہوتی ہیں؛ آپ کی جنازہ گاہ آپ کی رہنمائی کرے گی۔',
  items: [
    { title: 'ان کے پاس رہیں اور دعا کریں', detail: 'ایک لمحہ لیں۔ اگر آنکھیں کھلی ہوں تو نرمی سے بند کر دیں اور ان کے لیے دعا کریں۔ ابتدائی لمحات میں کوئی جلدی نہیں۔' },
    { title: 'خاندان اور مسجد کو اطلاع دیں', detail: 'پہلے قریبی خاندان کو بتائیں۔ آپ کی مسجد یا مسلم جنازہ گاہ ہر اگلے قدم کی رہنمائی کرے گی اور اکثر انتظامات خود سنبھالتی ہے۔' },
    { title: 'مسلم جنازہ گاہ سے رابطہ کریں', detail: 'وہ منتقلی، غسل، کفن اور کاغذی کارروائی کا بندوبست کرتے ہیں۔ اس سائٹ پر جنازہ خدمات کی فہرست دیکھیں۔' },
    { title: 'غسل و کفن کا بندوبست کریں', detail: 'جنازہ گاہ یا مسجد عموماً اسی جنس کے تربیت یافتہ غسال فراہم کرتی ہے۔ خاندان چاہے تو شریک ہو سکتا ہے۔' },
    { title: 'ان کے قرض جلد ادا کریں', detail: 'یہ معاملہ آخر میں نہیں، ابتدا میں آتا ہے: ان کی جائیداد سے ان کے قرض اور باقی ذمہ داریاں — واجب الادا رقم، واجب زکاۃ، امانتیں، مستعار لی گئی چیزیں، ادھوری منتیں یا کفارے — نمازِ جنازہ سے پہلے ادا کریں اگر ممکن ہو (بعض علماء کے نزدیک غسل سے بھی پہلے، اور کم از کم تدفین سے پہلے)۔ اگر رقم فوراً دستیاب نہ ہو تو خاندان کا کوئی فرد یا وارث قرض کی ذمہ داری لے سکتا ہے یا اس کی ضمانت دے سکتا ہے تاکہ معاملہ لٹکا نہ رہے۔' },
    { title: 'نمازِ جنازہ کا وقت مقرر کریں', detail: 'جنازہ گاہ کے ساتھ وقت اور مسجد طے کریں — اکثر کسی فرض نماز کے بعد — پھر اعلان کریں تاکہ لوگ شریک ہو سکیں۔ آپ یہاں اطلاع درج کر سکتے ہیں یا اعلان کی تصویر منتظم کو بھیج سکتے ہیں۔' },
    { title: 'قبر کا بندوبست کریں', detail: 'جنازہ گاہ قبرستان اور تدفین کے وقت کو مربوط کرتی ہے، عموماً جنازے کے فوراً بعد۔' },
    { title: 'کاغذات جو جنازہ گاہ مانگے گی', detail: 'مرحوم کی شناخت اور وفات سرٹیفکیٹ کی تفصیلات۔ وہ آپ کو بالکل بتائیں گے کہ کیا چاہیے — اکیلے تحقیق کی ضرورت نہیں۔' },
    { title: 'تعزیت — مہمانوں کی آمد', detail: 'خاندان عموماً تدفین کے بعد چند دن ملاقات کے لیے وقت رکھتے ہیں۔ پتہ اور اوقات تعزیتی صفحے پر درج کریں۔' },
    { title: 'اس کے بعد', detail: 'قرض اور ذمہ داریاں نمٹ جانے کے بعد وصیت پر عمل کریں اور باقی جائیداد تقسیم کریں — وصیتیں قرض کے بعد آتی ہیں۔ ان کے نام صدقہ جاریہ کا بندوبست بھی کر سکتے ہیں۔ یہ اقدامات اوپر والے قرض کے مرحلے کے بعد آتے ہیں؛ یہ پہلی ترجیح نہیں۔' },
  ],
}

const bn: ChecklistContent = {
  heading: 'প্রিয়জনের মৃত্যুতে',
  intro: 'একটি করে ধাপ এগিয়ে যান। সবকিছু একা করতে হবে না — আপনার মসজিদ, জানাজা সেবা, পরিবার ও বন্ধুরা এর অনেকটাই আপনার সাথে বহন করবে।',
  note: 'সনদ ও অনুমতির মতো বিষয়গুলো জায়গাভেদে আলাদা; আপনার জানাজা সেবা প্রতিষ্ঠান আপনাকে ঠিক পথ দেখাবে।',
  items: [
    { title: 'তাঁর পাশে থাকুন ও দোয়া করুন', detail: 'একটু সময় নিন। চোখ খোলা থাকলে আলতো করে বন্ধ করুন এবং তাঁর জন্য দোয়া করুন। প্রথম মুহূর্তগুলোতে তাড়াহুড়ো নেই।' },
    { title: 'পরিবার ও মসজিদে খবর দিন', detail: 'আগে ঘনিষ্ঠ পরিবারকে জানান। আপনার মসজিদ বা মুসলিম জানাজা সেবা পরের প্রতিটি ধাপে পথ দেখাবে এবং প্রায়ই বেশিরভাগ ব্যবস্থা নিজেরাই করে।' },
    { title: 'মুসলিম জানাজা সেবায় যোগাযোগ করুন', detail: 'তারা পরিবহন, গোসল, কাফন ও কাগজপত্রের ব্যবস্থা করে। এই সাইটের জানাজা সেবার তালিকা দেখুন।' },
    { title: 'গোসল ও কাফনের ব্যবস্থা করুন', detail: 'জানাজা সেবা বা মসজিদ সাধারণত একই লিঙ্গের প্রশিক্ষিত গোসলদাতা দেয়। পরিবার চাইলে অংশ নিতে পারে।' },
    { title: 'তাঁর ঋণ দ্রুত পরিশোধ করুন', detail: 'এটি শেষে নয়, শুরুতেই আসে: তাঁর সম্পত্তি থেকে তাঁর ঋণ ও বকেয়া দায়িত্ব — পাওনা অর্থ, বকেয়া যাকাত, আমানতের সম্পত্তি, ধার নেওয়া জিনিস, অপূর্ণ মানত বা কাফফারা — সম্ভব হলে জানাজার নামাজের আগেই পরিশোধ করুন (কিছু আলেমের মতে গোসলেরও আগে, এবং অন্তত দাফনের আগে)। টাকা তখনই পাওয়া না গেলে পরিবারের কেউ বা উত্তরাধিকারী ঋণের দায়িত্ব নিতে বা জামানত দিতে পারেন, যাতে তা ঝুলে না থাকে।' },
    { title: 'জানাজার সময় ঠিক করুন', detail: 'জানাজা সেবার সাথে সময় ও মসজিদ ঠিক করুন — প্রায়ই কোনো ফরজ নামাজের পর — তারপর ঘোষণা দিন যাতে সবাই আসতে পারে। আপনি এখানে বিজ্ঞপ্তি জমা দিতে পারেন, অথবা বিজ্ঞপ্তির ছবি অ্যাডমিনকে পাঠাতে পারেন।' },
    { title: 'কবরের ব্যবস্থা করুন', detail: 'জানাজা সেবা কবরস্থান ও দাফনের সময় সমন্বয় করে, সাধারণত জানাজার ঠিক পরেই।' },
    { title: 'জানাজা সেবা যেসব কাগজ চাইবে', detail: 'মৃতের পরিচয়পত্র ও মৃত্যুসনদের বিবরণ। ঠিক কী লাগবে তারা বলে দেবে — একা গবেষণা করতে হবে না।' },
    { title: 'আজা — শোক সাক্ষাৎ', detail: 'পরিবার প্রায়ই দাফনের পর কয়েকদিন সাক্ষাৎ গ্রহণ করে। ঠিকানা ও সময় শোকসংবাদের পৃষ্ঠায় দিন।' },
    { title: 'এর পরে', detail: 'ঋণ ও দায়িত্ব মিটে গেলে ওয়াসিয়া (উইল) কার্যকর করুন এবং অবশিষ্ট সম্পত্তি বণ্টন করুন — ওয়াসিয়া ঋণের পরে আসে। তাঁর নামে সদকায়ে জারিয়ার ব্যবস্থাও করতে পারেন। এই ধাপগুলো উপরের ঋণের ধাপের পরে আসে; এগুলো প্রথম অগ্রাধিকার নয়।' },
  ],
}

const es: ChecklistContent = {
  heading: 'Cuando fallece un ser querido',
  intro: 'Ve paso a paso. No tienes que hacerlo todo tú: tu mezquita, la funeraria, tu familia y tus amigos cargarán gran parte de esto contigo.',
  note: 'Detalles como certificados y permisos varían según el lugar; tu funeraria te guiará en lo que aplica en tu caso.',
  items: [
    { title: 'Quédate con él y haz dua', detail: 'Tómate un momento. Cierra sus ojos con suavidad si están abiertos y haz dua por él. No hay prisa en los primeros minutos.' },
    { title: 'Llama a la familia y a tu mezquita', detail: 'Avisa primero a la familia cercana. Tu mezquita o una funeraria musulmana puede guiarte en cada paso y suele encargarse de la mayoría de los preparativos.' },
    { title: 'Contacta una funeraria musulmana', detail: 'Ellos organizan el traslado, el lavado (ghusl), el sudario (kafan) y el papeleo. Consulta el directorio de servicios funerarios de este sitio.' },
    { title: 'Organiza el ghusl y el kafan', detail: 'La funeraria o la mezquita suele proporcionar lavadores formados del mismo sexo. La familia puede participar si lo desea.' },
    { title: 'Apresúrate a saldar sus deudas', detail: 'Esto va al principio, no al final: con su patrimonio se pagan sus deudas y obligaciones pendientes — dinero debido, el zakah pendiente, bienes en custodia, objetos prestados, votos o expiaciones sin cumplir — antes de la oración fúnebre si es posible (algunos eruditos dicen que incluso antes del lavado, y como muy tarde antes del entierro). Si el dinero no está disponible de inmediato, un familiar o heredero puede asumir la responsabilidad de la deuda o garantizarla, para que no quede sin resolver.' },
    { title: 'Fija la hora del Janazah', detail: 'Acuerda la hora y la mezquita con la funeraria — a menudo tras una oración regular — y anúncialo para que la comunidad pueda asistir. Puedes publicar el aviso en este sitio o enviar una foto del aviso a un administrador.' },
    { title: 'Organiza la sepultura', detail: 'La funeraria coordina el cementerio y la hora del entierro, normalmente justo después del Janazah.' },
    { title: 'Papeleo que pedirá la funeraria', detail: 'Identificación del difunto y datos para el certificado de defunción. Te dirán exactamente qué se necesita: no tienes que investigarlo solo.' },
    { title: 'Azza — recibir condolencias', detail: 'Las familias suelen recibir visitas durante unos días después del entierro. Comparte la dirección y los horarios en la página del obituario.' },
    { title: 'Después', detail: 'Una vez saldadas las deudas y obligaciones, ejecuta la wasiyyah (testamento) y distribuye lo que queda del patrimonio: los legados vienen después de las deudas. También puedes organizar una Sadaqah Jariyah en su nombre. Estos pasos siguen al paso de las deudas anterior; no son la primera prioridad.' },
  ],
}

const hi: ChecklistContent = {
  heading: 'किसी प्रियजन के निधन पर',
  intro: 'एक-एक कदम बढ़ाएं। सब कुछ अकेले करना ज़रूरी नहीं — आपकी मस्जिद, जनाज़ा सेवा, परिवार और मित्र इसमें आपका साथ देंगे।',
  note: 'प्रमाणपत्र और अनुमति जैसी बातें स्थान के अनुसार अलग होती हैं; आपकी जनाज़ा सेवा आपको सही मार्ग दिखाएगी।',
  items: [
    { title: 'उनके पास रहें और दुआ करें', detail: 'एक क्षण लें। यदि आंखें खुली हों तो धीरे से बंद कर दें और उनके लिए दुआ करें। पहले क्षणों में कोई जल्दबाज़ी नहीं है।' },
    { title: 'परिवार और मस्जिद को सूचित करें', detail: 'पहले निकट परिवार को बताएं। आपकी मस्जिद या मुस्लिम जनाज़ा सेवा हर अगले कदम का मार्गदर्शन करेगी और अक्सर अधिकांश व्यवस्था स्वयं संभालती है।' },
    { title: 'मुस्लिम जनाज़ा सेवा से संपर्क करें', detail: 'वे परिवहन, ग़ुस्ल, कफ़न और कागज़ी कार्रवाई की व्यवस्था करते हैं। इस साइट पर जनाज़ा सेवाओं की सूची देखें।' },
    { title: 'ग़ुस्ल और कफ़न की व्यवस्था करें', detail: 'जनाज़ा सेवा या मस्जिद आमतौर पर उसी लिंग के प्रशिक्षित ग़ुस्ल देने वाले उपलब्ध कराती है। परिवार चाहे तो भाग ले सकता है।' },
    { title: 'उनके क़र्ज़ जल्द चुकाएं', detail: 'यह मामला अंत में नहीं, शुरुआत में आता है: उनकी संपत्ति से उनके क़र्ज़ और बकाया दायित्व — देय धन, बकाया ज़कात, अमानत की संपत्ति, उधार ली गई वस्तुएं, अधूरे व्रत या कफ़्फ़ारे — यदि संभव हो तो जनाज़ा नमाज़ से पहले चुका दें (कुछ विद्वानों के अनुसार ग़ुस्ल से भी पहले, और कम से कम दफ़न से पहले)। यदि धन तुरंत उपलब्ध न हो, तो परिवार का कोई सदस्य या वारिस क़र्ज़ की ज़िम्मेदारी ले सकता है या उसकी गारंटी दे सकता है, ताकि मामला लटका न रहे।' },
    { title: 'जनाज़ा नमाज़ का समय तय करें', detail: 'जनाज़ा सेवा के साथ समय और मस्जिद तय करें — अक्सर किसी नियमित नमाज़ के बाद — फिर घोषणा करें ताकि समुदाय शामिल हो सके। आप यहां सूचना भेज सकते हैं, या सूचना की तस्वीर एडमिन को भेज सकते हैं।' },
    { title: 'क़ब्र की व्यवस्था करें', detail: 'जनाज़ा सेवा क़ब्रिस्तान और दफ़न के समय का समन्वय करती है, आमतौर पर जनाज़े के तुरंत बाद।' },
    { title: 'कागज़ात जो जनाज़ा सेवा मांगेगी', detail: 'मृतक की पहचान और मृत्यु प्रमाणपत्र का विवरण। वे आपको ठीक-ठीक बताएंगे कि क्या चाहिए — अकेले शोध करने की आवश्यकता नहीं है।' },
    { title: 'अज़ा — शोक मुलाक़ात', detail: 'परिवार अक्सर दफ़न के बाद कुछ दिनों तक मुलाक़ात का समय रखते हैं। पता और समय शोक सूचना पृष्ठ पर साझा करें।' },
    { title: 'इसके बाद', detail: 'क़र्ज़ और दायित्व निपट जाने के बाद वसीयत पर अमल करें और शेष संपत्ति वितरित करें — वसीयतें क़र्ज़ के बाद आती हैं। उनके नाम सदक़ा जारिया की व्यवस्था भी कर सकते हैं। ये कदम ऊपर वाले क़र्ज़ वाले कदम के बाद आते हैं; ये पहली प्राथमिकता नहीं हैं।' },
  ],
}

export const CHECKLIST: Record<Lang, ChecklistContent> = { en, ar, ur, bn, es, hi }
