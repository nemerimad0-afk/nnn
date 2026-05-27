export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  isPopular?: boolean;
}

export interface MenuCategory {
  id: string;
  title: string;
  icon?: string;
  image?: string;
  items: MenuItem[];
}

export interface CateringItem {
  id: string;
  name: string;
  description: string;
  price: string; // Using string to support price per kg or piece
  approxWeight?: string;
  image: string;
  features: string[];
}

export interface WeddingGalleryItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  folderPath: string;
  tag: string;
}

export const cateringData: CateringItem[] = [
  {
    id: "cat_lamb_1",
    name: "خروف بلدي محشي ملكي كامل",
    description: "خروف بلدي طازج كامل (وزن قرابة 12-14 كغم قبل الطهي)، محشو بالأرز الشرقي المبهر بأفخر أنواع المهارات الكنعانية، ومزين بسخاء بالفستق الحلبي، اللوز المقشر، والصنوبر البلدي المحمص. يُطهى ببطء شديد تحت لهب هادئ لعدة ساعات حتى ينضج تماماً ويذوب لحمه. يُقدم مع لبن الزبادي وسوب اللحم الطبيعي.",
    price: "1800",
    approxWeight: "12 - 14 كغم",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600",
    features: ["لحم بلدي نعيمي طازج يومياً", "ثلاثة أنواع من المكسرات الفاخرة", "تكفي لـ 15 - 20 شخصاً", "توصية مسبقة قبل 24 ساعة"]
  },
  {
    id: "cat_lamb_half",
    name: "نصف خروف بلدي محشي فاخر",
    description: "نصف خروف بلدي نعيمي (قرابة 6-7 كغم)، محشو بأرز التواصي الفاخر المميز بالخلطة الشرقية الغنية، مزين باللوز والكاجو والصنوبر الذهبي المحمر. يمثل الخيار الأمثل للعزائم والاجتماعات العائلية المرموقة.",
    price: "950",
    approxWeight: "6 - 7 كغم",
    image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&q=80&w=600",
    features: ["طهي شرقي تقليدي ببطء", "مكسرات محمصة طازجة", "تكفي لـ 8 - 10 أشخاص", "توصية مسبقة قبل 12 ساعة"]
  },
  {
    id: "cat_neck",
    name: "رقاب خروف فخمة محشية بالأرز واللحم",
    description: "رقاب خروف بلدي ريانة، محشوة بعقدة الأرز الممتاز واللحم المفروم المتبل الفاخر، تُطهى بصلصتنا الخاصة وببطء حتى ينفصل اللحم عن العظم بنعومة وسلاسة متناهية، تعلوها المكسرات الذهبية المحمصة ودبس الرمان.",
    price: "240",
    approxWeight: "3 رقاب كبيرة",
    image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=600",
    features: ["لحم رقبة عالي الطراوة", "محشوة باللحم المفروم والبهارات", "تكفي لـ 4 - 5 أشخاص", "توصية مسبقة قبل 6 ساعات"]
  },
  {
    id: "cat_mansaf",
    name: "سدر منسف بلدي بالجميد الكركي الأصيل",
    description: "وليمة المنسف الفلسطيني التقليدي المعد بأجود لحوم الغنم البلدية، اللبن الكركي المكعّب المطبوخ بعناية، يقدم فوق طبقة من خبز الصاج الشراك والأرز البلدي الأصفر الفلفل بالسمن، مزيّن بالصنوبر واللوز البلدي وبقدونس الحديقة الطازج.",
    price: "480",
    approxWeight: "3.5 كغم لحم صافي",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600",
    features: ["جميد كركي أصلي 100%", "سمن بلدي فلسطيني معتق", "تكفي لـ 6 - 8 أشخاص", "توصية مسبقة قبل 8 ساعات"]
  },
  {
    id: "cat_crown",
    name: "فريكة بالدجاج المحمر والمكسرات (سدر فاخر)",
    description: "فريك بلدي منقى ومغسول ومطهو بمرق الدجاج اللذيذ مع المطيبات الشرقية العريقة، يعلوه دجاج بلدي محمر بالفرن الحجري حتى يكتسي باللون الذهبي الخلاب، ومزين بصنوبر ولوز وكاجو عالي الدسم.",
    price: "280",
    approxWeight: "سدر كبير - 4 دجاجات كاملة",
    image: "https://images.unsplash.com/photo-1560614382-3334f747516c?auto=format&fit=crop&q=80&w=600",
    features: ["فريكة بلدية مدخنة ممتازة", "دجاج بلدي محمر بالفرن الحجري", "تكفي لـ 8 أشخاص", "توصية مسبقة قبل 5 ساعات"]
  }
];

export const weddingGalleryData: WeddingGalleryItem[] = [
  {
    id: "wed_1",
    title: "ليلة العمر في الهواء الطلق",
    description: "جزء من قاعتنا الخارجية المزدانة بممرات الخضار والأشجار البهية من حولها، تحت أنوار سلسلة الفيريل المضيئة الساحرة، لتجربة تجمع بين رومانسية الحدائق ودفء الطبيعة الخلابة.",
    images: ["https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1000", "https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=80&w=1000"],
    folderPath: "/public/images/weddings/outdoor/",
    tag: "أفراح وسهرات مميزة"
  },
  {
    id: "wed_2",
    title: "حفلات الخطوبة والجاهات الكبرى",
    description: "كوشة وتصميم ممتص للأضواء المبهجة يعكس فخامة العائلات وكرم الاستقبال، مع ترتيب مقاعد عائلي مريح يضمن رؤية ممتعة وخصوصية متناهية لكافة ضيوفكم الكرام.",
    images: ["https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=1000"],
    folderPath: "/public/images/weddings/engagement/",
    tag: "جاهات وخطوبات"
  },
  {
    id: "wed_3",
    title: "أعياد ميلاد ولقاءات دافئة في الطبيعة",
    description: "زوايا مجهزة بديكورات مخصصة ببالونات ملونة وثيمات تبهج قلوب الصغار والكبار، في وضوح النهار النقي وتحت نسمات جبال الخليل المنعشة الحانية.",
    images: ["https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=1000"],
    folderPath: "/public/images/weddings/birthdays/",
    tag: "أعياد ومناسبات عائلية"
  },
  {
    id: "wed_4",
    title: "تجهيز طاولات الخدمة والبوفيه المفتوح",
    description: "تنظيم مذهل بأجهزة السخان النحاسية الفاخرة والطاولات الذهبية اللامعة لتقديم أشهى أصناف الطعام والمقبلات والحلويات الشرقية مباشرة تحت إشراف طاقم طهاة كافيه الزيتونة المرموقين.",
    images: ["https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1000"],
    folderPath: "/public/images/weddings/buffet/",
    tag: "بوفيهات ملكية"
  }
];

export const menuData: MenuCategory[] = [
  {
    "id": "grills",
    "title": "مشاوي الكوخ الفاخرة",
    "icon": "Flame",
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600",
    "items": [
      {
        "id": "g1",
        "name": "كباب الزيتونة البلدي الفاخر",
        "price": 45,
        "description": "لحم خروف بلدي طازج ومفروم مع البقدونس والبصل والبهارات الخاصة، مشوي على الفحم الملتهب داخل كوخ الشواء الخاص بنا ليحتفظ بعصارته ونكهته الأصلية المميزة.",
        "image": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=300",
        "isPopular": true
      },
      {
        "id": "g2",
        "name": "شيش طاووق الكوخ المحمر",
        "price": 38,
        "description": "مكعبات صدر الدجاج الطازج، منقوعة في مزيج ساحر من الليمون وزيت الزيتون البكر والثوم والخلطة السرية لمطعم الزيتونة، مشوية بعناية فائقة لتذوب في الفم.",
        "image": "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&q=80&w=300"
      },
      {
        "id": "g3",
        "name": "ريش غنم بلدي مدخنة",
        "price": 60,
        "description": "قطع ريش الغنم البلدي الطازج المختارة بعناية لضمان القوام الطري والدهن المتوازن، متبلة بأعشاب الحديقة البرية ومشوية ببطء لمذاق غني لا ينسى.",
        "image": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=300",
        "isPopular": true
      },
      {
        "id": "g4",
        "name": "طبق عرايس لحم بالجبن والزعتر",
        "price": 28,
        "description": "خبز بلدي محشو باللحمة المفرومة المتبلة مع رشة غنية من الجبن البلدي والزعتر الأخضر الطازج، مشوية على الفحم حتى تصبح مقرمشة وذهبية.",
        "image": "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=300"
      },
      {
        "id": "g5",
        "name": "صينية مشاوي مشكلة عائلية",
        "price": 95,
        "description": "وليمة تكفي لشخصين إلى ثلاثة أشخاص؛ تشكيلة فاخرة من الكباب البلدي، الشيش طاووق، الريش الطرية، والعرايس، تُقدم مع الخضار المشوية، البصل بالسماق، والمقبلات البيتية والخبز الساخن.",
        "image": "https://images.unsplash.com/photo-1560614382-3334f747516c?auto=format&fit=crop&q=80&w=300",
        "isPopular": true
      }
    ]
  },
  {
    "id": "stone_oven",
    "title": "فرن الزيتونة والمعجنات والبيتزا",
    "icon": "ChefHat",
    "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600",
    "items": [
      {
        "id": "so1",
        "name": "بيتزا الزيتونة الخاصة",
        "price": 35,
        "description": "عجينتنا الإيطالية الطازجة يُفرد عليها صوص البيتزا السري المطبوخ بأعشاب الزيتونة، مغطاة بجبنة الموزاريلا الفاخرة، واللحم المفروم المتبل، والفلفل الملون، وقطع الزيتون الأسود البلدي والريحان.",
        "image": "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=300",
        "isPopular": true
      },
      {
        "id": "so2",
        "name": "بيتزا مارغريتا بالزعتر والريحان",
        "price": 28,
        "description": "البساطة والأصالة معاً؛ صوص البندورة الكلاسيكي، جبنة موزاريلا من ساحبة دسمة، زيت زيتون زيتوني فخم، وأوراق الريحان الطازجة ورشة خفيفة من الزعتر المعطر.",
        "image": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=300"
      },
      {
        "id": "so3",
        "name": "فطيرة لحم بلدي بدبس الرمان",
        "price": 14,
        "description": "فطيرة مغلقة في الفرن الحجري محشوة بلحمة مفرومة بلدية شهية متبلة ومنقوعة بدبس الرمان الفاخر والحامض، تعلوها المكسرات المحمصة.",
        "image": "https://images.unsplash.com/photo-1601050690597-df056fb49785?auto=format&fit=crop&q=80&w=300"
      },
      {
        "id": "so4",
        "name": "معجنات جبنة نابلسية بالزعتر الأخضر",
        "price": 8,
        "description": "عجينة قطنية خفيفة محشوة بخليط الجبنة النابلسية المملتة والزعتر الأخضر البري، تُخبز فوراً وتُقدم ساخنة ومقرمشة ومحمرة.",
        "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=300"
      },
      {
        "id": "so5",
        "name": "صفيحة لحمة شامية بالفرن الحجري",
        "price": 10,
        "description": "عجينة رقيقة ممتازة يعلوها لحم خروف بلدي مفروم غنمي مع البصل المهروس، دبس الرمان الفخم، الصنوبر والبهارات الشامية النادرة.",
        "image": "https://images.unsplash.com/photo-1589187151053-5ec8818e661b?auto=format&fit=crop&q=80&w=300"
      }
    ]
  },
  {
    "id": "crepes",
    "title": "الكريب الفاخر",
    "icon": "CakeSlice",
    "image": "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&q=80&w=600",
    "items": [
      {
        "id": "cr1",
        "name": "كريب الشوكولاتة البلجيكية الثلاثية",
        "price": 14,
        "description": "كريب فرنسي رقيق للغاية ومطبوخ بعناية، مغطى بمزيج غني من خطوط الشوكولاتة البلجيكية الداكنة، الشوكولاتة بالحليب، والشوكولاتة البيضاء السلسة.",
        "image": "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&q=80&w=300",
        "isPopular": true
      },
      {
        "id": "cr2",
        "name": "كريب لوتس الذهبي بالبسكويت",
        "price": 16,
        "description": "كريبنا اللذيذ محشو بزبدة لوتس كرانشي دافئة، مغطى بفتات بسكويت لوتس البلجيكي المقرمش ليعطي توازناً حلواً رائعاً وقرمشة ممتازة.",
        "image": "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=300"
      },
      {
        "id": "cr3",
        "name": "كريب فستق حلبي ملكي",
        "price": 18,
        "description": "كريب فاخر غارق بصوص زبدة الفستق الحلبي الخاص وحبات الفستق المطحونة ناعماً، يُقدم مع كرة جيلاتو فانيليا فاخرة.",
        "image": "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=300"
      },
      {
        "id": "cr4",
        "name": "فوتشيني كريب مع آيس كريم بوهيمي",
        "price": 18,
        "description": "شرائح كريب فرنسي رقيقة ومقطعة على هداة شرائط المعكرونة، غارقة بخلطتنا الفريدة من الشوكولاتة البلجيكية اللذيذة والآيس كريم الغني.",
        "image": "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=300",
        "isPopular": true
      }
    ]
  },
  {
    "id": "waffles",
    "title": "الوافل البلجيكي الذهبي",
    "icon": "CakeSlice",
    "image": "https://images.unsplash.com/photo-1562376502-0ac40ae8a105?auto=format&fit=crop&q=80&w=600",
    "items": [
      {
        "id": "w1",
        "name": "وافل الزيتونة الكلاسيكي المثالي",
        "price": 14,
        "description": "وافل بلجيكي أصيل مقرمش ومحمر بلونه الذهبي البهي، يعلوه السمن الخفيف، ورذاذ من صوص العسل أو الشوكولاتة الطبيعية الفاخرة.",
        "image": "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&q=80&w=300"
      },
      {
        "id": "w2",
        "name": "وافل الشوكولاتة والفواكه الطازجة",
        "price": 16,
        "description": "الوافل الساخن والمقرمش مغطى بطبقة سخية من الشوكولاتة البلجيكية الفاخرة، ومزين بقطع الموز والفراولة والكيوي الطازجة التي تُقطّع فوراً.",
        "image": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=300",
        "isPopular": true
      },
      {
        "id": "w3",
        "name": "وافل لوتس وتوت البلاك بيري",
        "price": 16,
        "description": "مزيج مدهش ولطيف يجمع زبدة اللوتس الدافئة مع الحموضة المنعشة لقطع التوت البري في تناغم لذيذ فوق الوافل الساخن.",
        "image": "https://images.unsplash.com/photo-1562376502-0ac40ae8a105?auto=format&fit=crop&q=80&w=300"
      },
      {
        "id": "w4",
        "name": "وافل فستق قشدي ملحمي",
        "price": 18,
        "description": "وافل مقرمش ومميز للغاية، مغطى بطبقات مستوحاة من الحلويات الشرقية؛ زبدة الفستق الحلبي، المكسرات المحمصة، وخيط صغير من العسل البلدي المنتقى.",
        "image": "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=300",
        "isPopular": true
      }
    ]
  },
  {
    "id": "pancakes",
    "title": "البان كيك والفشافيش",
    "icon": "CakeSlice",
    "image": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&q=80&w=600",
    "items": [
      {
        "id": "pc1",
        "name": "كاسات فشافيش البان كيك بالصوص",
        "price": 10,
        "description": "تجمع السحر والخفة؛ كرات بان كيك السمن الصغيرة والمقرمشة من الخارج والطرية من الداخل في كأس مليء بصوص الكاكاو الخارجي وصوص الكراميل ورقائق الفستق.",
        "image": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&q=80&w=300",
        "isPopular": true
      },
      {
        "id": "pc2",
        "name": "بان كيك هرمي ثلاثي الطبقات",
        "price": 14,
        "description": "ثلاث طبقات هرمية وسميكة من البان كيك الكلاسيكي المعدّ يدوياً، مع طبقات من الكريمة الطبيعية الطازجة، غارقة بصوص القيقب الكندي أو الشوكولاتة البلجيكية.",
        "image": "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&q=80&w=300"
      },
      {
        "id": "pc3",
        "name": "بان كيك الفستق الوردي الفاخر",
        "price": 16,
        "description": "طبقات البان كيك القطنية والشهية مغطاة بصوص كريمة الفستق الزيتوني الممتاز مع حبوب الرمان الصغيرة والورد المجفف ليعطي فخامة في الشكل والمذاق.",
        "image": "https://images.unsplash.com/photo-1504185912330-c361e6dbf83e?auto=format&fit=crop&q=80&w=300"
      }
    ]
  },
  {
    "id": "milkshakes",
    "title": "ميلك شيك الكريستال",
    "icon": "IceCream",
    "image": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=600",
    "items": [
      {
        "id": "ms1",
        "name": "ملك شيك شوكولاتة الكريستال",
        "price": 14,
        "description": "ميلك شيك غني وكريمي للغاية من جيلاتو الشوكولاتة البلجيكية الداكنة، مخفوق مع الحليب البارد ومغطى بالكريمة المخفوقة وهشيم الكاكاو.",
        "image": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=300",
        "isPopular": true
      },
      {
        "id": "ms2",
        "name": "ملك شيك لوتس كراملي مع المكسرات",
        "price": 15,
        "description": "مزيج كريمي ناعم يجمع بين جيلاتو اللوتس الخاص بنا وزبدة اللوتس الذهبية الذائبة، مع طبقة سخية من الرغوة وبسكويت لوتس المطحون.",
        "image": "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&q=80&w=300"
      },
      {
        "id": "ms3",
        "name": "ملك شيك فستق حلبي وجيلاتو بلدي",
        "price": 16,
        "description": "ابتكار فاخر يأخذك للأصالة عبر دمج جيلاتو الفستق الحلبي الإيطالي مع الحليب الطازج وحبوب الفستق الأخضر المحمص المقرمش.",
        "image": "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=300"
      }
    ]
  },
  {
    "id": "smoothies",
    "title": "سموذي الانتعاش الاستوائي",
    "icon": "CupSoda",
    "image": "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=600",
    "items": [
      {
        "id": "sm1",
        "name": "سموذي غابات التوت البري والأحمر",
        "price": 12,
        "description": "مخفوق مثلج وطبيعي 100% يضم التوت البري الغامق، التوت الأحمر المنعش، والفراولة البرية، مع عصير التفاح الحامض خياراً يفيض بالطاقة والنقاء.",
        "image": "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=300",
        "isPopular": true
      },
      {
        "id": "sm2",
        "name": "سموذي مانجو وخوخ الكوخ المنعش",
        "price": 12,
        "description": "لب المانجو الاستوائي الطري والمثلج مع لمحات من الخوخ الديم القادم من مزارع الشام في قالب بارد ومرطب مريح.",
        "image": "https://images.unsplash.com/photo-1623065422902-30a2143cc999?auto=format&fit=crop&q=80&w=300"
      },
      {
        "id": "sm3",
        "name": "سموذي تروبيكال هاواي هايدن",
        "price": 14,
        "description": "توليفة استوائية فريدة؛ عصير أناناس طازج، مانجو ألفونسو، جوز الهند الناعم ليعيد لك حيوية الطبيعة والحدائق المزهوة.",
        "image": "https://images.unsplash.com/photo-1532454516781-be9ae21efbde?auto=format&fit=crop&q=80&w=300"
      }
    ]
  },
  {
    "id": "mojitos",
    "title": "الموهيتو الصيفي البارد",
    "icon": "CupSoda",
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600",
    "items": [
      {
        "id": "mj1",
        "name": "موهيتو ليمون ونعناع كلاسيكي",
        "price": 10,
        "description": "أوراق النعناع البلدي الطازجة المهروسة مع الليمون الطازج، صودا باردة متلألئة، والثلج المجروش ليعطي انتعاشاً فائضاً للجسد.",
        "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=300"
      },
      {
        "id": "mj2",
        "name": "موهيتو البطيخ الأحمر المنشط",
        "price": 10,
        "description": "انتعاش الصيف المطلق؛ عصير البطيخ الأحمر الحلو مع قطع الليمون، أوراق النعناع المفرومة بلطف والصودا الباردة مع الثلج.",
        "image": "https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&q=80&w=300",
        "isPopular": true
      },
      {
        "id": "mj3",
        "name": "موهيتو الرمان ياقوت الزيتونة",
        "price": 10,
        "description": "مزيج غني يجمع حبوب الرمان الصغيرة الفاخرة مع حموضة قشور الليمون الطبيعي ممزوجة ومحبوبة مع صودا منعشة.",
        "image": "https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?auto=format&fit=crop&q=80&w=300"
      },
      {
        "id": "mj4",
        "name": "موهيتو التوت البري والليمون البهيج",
        "price": 11,
        "description": "أزرق ومتألق بمذاق تير بيري وحمض الليمون الكلاسيكي ليعطيك مظهراً فريداً وطعماً متوازناً وجذاباً.",
        "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=300"
      }
    ]
  },
  {
    "id": "fresh_drinks",
    "title": "العصائر الطازجة والمثلجة",
    "icon": "CupSoda",
    "image": "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80&w=600",
    "items": [
      {
        "id": "fd1",
        "name": "عصير برتقال السهول المعصور طازجاً",
        "price": 12,
        "description": "برتقال طبيعي مصفي ومعصور فورياً عند الطلب، غني بفيتامين سي وبدون أي إضافات صناعية أو سكر مكرر. (كبير: 15)",
        "image": "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80&w=300"
      },
      {
        "id": "fd2",
        "name": "ليموناضة ليمون الكوخ بالنعناع البكر",
        "price": 10,
        "description": "عصير الليمون المنعش الممزوج مع النعناع البكر المثلج والمنعّم ليعطي طاقة فريدة وبرودة مدهشة ومريحة. (كبير: 13)",
        "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=300"
      },
      {
        "id": "fd3",
        "name": "عصير رمان الزيتونة البلدي الطازج",
        "price": 14,
        "description": "عصير الرمان القرمزي المعصور يدوياً، طعم ملكي وحامض يفوح ببرودة حدائق قرانا. (كبير: 17)",
        "image": "https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?auto=format&fit=crop&q=80&w=300"
      },
      {
        "id": "fd4",
        "name": "ايس سبانيش لاتيه الكوخ الخاص",
        "price": 13,
        "description": "اسبريسو مميز وفخم يعانق الحليب الكثيف البارد والحليب المكثف المحلي على طريقتنا ليعطيك نشاطاً صيفياً بارداً. (كبير: 16)",
        "image": "https://images.unsplash.com/photo-1461023717502-44a3698b8f93?auto=format&fit=crop&q=80&w=300"
      }
    ]
  },
  {
    "id": "hot_drinks",
    "title": "المشروبات الساخنة والقهوة",
    "icon": "Coffee",
    "image": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600",
    "items": [
      {
        "id": "hd1",
        "name": "دلة قهوة عربية بالهيل كرم شامل",
        "price": 15,
        "description": "دلة نحاسية ساخنة تفوح منها روائح القهوة العربية الأصيلة الممزوجة بالهيل والزعفران، تُقدم مع حبات التمر البلدي المحشو باللوز الفاخر كرم الضيافة الكنعانية.",
        "image": "https://images.unsplash.com/photo-1599390809312-5bd108a4cfec?auto=format&fit=crop&q=80&w=300",
        "isPopular": true
      },
      {
        "id": "hd2",
        "name": "إسبريسو دبل إيطالي قوي",
        "price": 9,
        "description": "جرعتان غنيتان وقويتان من إسبريسو حبوب البن المحمصة الطازجة بتركيز عال ورغوة ذهبية دسمة لعشاق اليقظة والقهوة النقية.",
        "image": "https://images.unsplash.com/photo-1510972527921-ce0415891ddf?auto=format&fit=crop&q=80&w=300"
      },
      {
        "id": "hd3",
        "name": "كابتشينو برغوة الحرير الذهبي",
        "price": 11,
        "description": "طبقة متناسقة وخفيفة من قهوة الإسبريسو الفاخرة مع الحليب المبخر بسلالة و تعلوه رغوة حريرية و رشة من الكاكاو السويسري الفاخر. (كبير: 14)",
        "image": "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=300"
      },
      {
        "id": "hd4",
        "name": "سحلب مكسرات قشدي بالزعفران",
        "price": 12,
        "description": "سحلب دافئ مستوحى من عبق التقاليد مع الحليب الكثيف الدسم، القرفة والزعفران، يعلوه تشكيلة غنية من الفستق الحلبي المقرمش، جوز الهند والزبيب واللوز. (كبير: 15)",
        "image": "https://images.unsplash.com/photo-1601050690597-df056fb49785?auto=format&fit=crop&q=80&w=300",
        "isPopular": true
      },
      {
        "id": "hd5",
        "name": "شاي كرك هندي أصيل بالفرن",
        "price": 6,
        "description": "شاي مغلي ومطبوخ ببطء شديد مع الحليب الكثيف ومزيج الكرك الخاص من الزنجبيل الطازج والهيل والقرنفل الساحر لدفء لا يضاهى.",
        "image": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=300"
      }
    ]
  },
  {
    "id": "soft_drinks",
    "title": "المشروبات الغازية والمياه",
    "icon": "CupSoda",
    "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=600",
    "items": [
      {
        "id": "sd1",
        "name": "زجاجة غازية باردة (كوكا كولا، سبرايت)",
        "price": 5,
        "description": "مشروبات غازية منعشة تقدم مثلجة لراحة فورية.",
        "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=300"
      },
      {
        "id": "sd2",
        "name": "مشروب الطاقة XL بلوس",
        "price": 7,
        "description": "مشروب الطاقة الشهير لمضاعفة الحيوية واليقظة.",
        "image": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=300"
      },
      {
        "id": "sd3",
        "name": "مياه معدنية كنعانية طبيعية",
        "price": 3,
        "description": "مياه معدنية طبيعية نقية لترطيب عميق.",
        "image": "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=300"
      }
    ]
  }
];

// نوع ومصفوفة ألبوم صور مناسبات صالات وقاعات الزيتونة الكبرى
export interface OccasionsAlbumItem {
  id: string;
  src: string; // الرابط الجمالي الاحتياطي
  localPath: string; // المسار المحلي الذي يرتبط بالملفات المرفوعة
  title: string;
  category: string;
}

export const occasionsAlbumData: OccasionsAlbumItem[] = [
  {
    id: "album_1",
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
    localPath: "/src/assets/album/wedding_outdoor.jpg",
    title: "جلسة خارجية ساحرة مع إضاءة خافتة",
    category: "صالات خارجية"
  },
  {
    id: "album_2",
    src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=800",
    localPath: "/src/assets/album/engagement_table.jpg",
    title: "تنسيق طاولات الخطوبة والجاهات الكبرى",
    category: "ديكور وطاولات"
  },
  {
    id: "album_3",
    src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800",
    localPath: "/src/assets/album/birthday_setup.jpg",
    title: "تنسيق زوايا أعياد ميلاد مميزة بالهواء الطلق",
    category: "أعياد ومناسبات"
  },
  {
    id: "album_4",
    src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
    localPath: "/src/assets/album/buffet_lux.jpg",
    title: "بوفيه سخانات الضيافة الملكية",
    category: "بوفيه واستقبال"
  },
  {
    id: "album_5",
    src: "https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=80&w=800",
    localPath: "/src/assets/album/kosha_gold.jpg",
    title: "الكوشة والممشى الملكي المضاء بالورد والإنارة الغنية",
    category: "الكوشة والممر"
  },
  {
    id: "album_6",
    src: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800",
    localPath: "/src/assets/album/catering_feast.jpg",
    title: "ولائم وقرب الضيافة الممرونة الفخمة",
    category: "ضيافة وولائم"
  }
];

