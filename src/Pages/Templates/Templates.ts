
interface MealEntry {
  foodName: string;
  grams: number;
}

interface DietTemplate {
  id: string;
  name: string;
  description: string;
  type: "bulk" | "cut" | "maintenance" | "keto";
  meals: {
    Breakfast: MealEntry[];
    Lunch: MealEntry[];
    Snacks: MealEntry[];
    Dinner: MealEntry[];
  };
}

interface ExerciseEntry {
  name: string;
  weight: number;
}

interface WorkoutDay {
  dayName: string;
  exercises: ExerciseEntry[];
}

interface ExerciseTemplate {
  id: string;
  name: string;
  description: string;
  daysPerWeek: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  days: WorkoutDay[];
}


// ---------- Enhanced Diet Templates (8) ----------
export const DIET_TEMPLATES: DietTemplate[] = [
  {
    id: "d1",
    name: "ضخامة 3500 سعرة",
    description: "نظام عالي السعرات لبناء العضلات وزيادة الوزن",
    type: "bulk",
    meals: {
      Breakfast: [
        { foodName: "بيض مسلوق", grams: 200 },
        { foodName: "فول مدمس", grams: 200 },
        { foodName: "خبز بلدي", grams: 150 },
        { foodName: "جبنة بيضاء (دمياطي)", grams: 50 },
      ],
      Lunch: [
        { foodName: "أرز أبيض", grams: 300 },
        { foodName: "فراخ مشوية", grams: 250 },
        { foodName: "سلطة بلدي", grams: 150 },
        { foodName: "طحينة", grams: 30 },
      ],
      Snacks: [
        { foodName: "زبادي يوناني", grams: 200 },
        { foodName: "لوز", grams: 50 },
        { foodName: "موز", grams: 150 },
        { foodName: "عسل أسود", grams: 20 },
      ],
      Dinner: [
        { foodName: "بطاطس مقلية", grams: 150 },
        { foodName: "كفتة", grams: 200 },
        { foodName: "خبز بلدي", grams: 100 },
        { foodName: "بابا غنوج", grams: 100 },
      ],
    },
  },
  {
    id: "d2",
    name: "تنشيف 1800 سعرة",
    description: "نظام منخفض السعرات لإنقاص الوزن بشكل صحي",
    type: "cut",
    meals: {
      Breakfast: [
        { foodName: "بيض مسلوق", grams: 100 },
        { foodName: "جبنة بيضاء (دمياطي)", grams: 40 },
        { foodName: "خيار", grams: 100 },
        { foodName: "توست بني", grams: 50 },
      ],
      Lunch: [
        { foodName: "سمك بلطي مشوي", grams: 200 },
        { foodName: "سلطة بلدي", grams: 200 },
        { foodName: "بروكلي", grams: 100 },
      ],
      Snacks: [
        { foodName: "تفاح", grams: 150 },
        { foodName: "جزر", grams: 100 },
      ],
      Dinner: [
        { foodName: "فراخ مشوية", grams: 150 },
        { foodName: "سبانخ", grams: 100 },
        { foodName: "خبز بلدي", grams: 50 },
      ],
    },
  },
  {
    id: "d3",
    name: "ثبات الوزن 2500 سعرة",
    description: "نظام متوازن للمحافظة على الوزن الحالي",
    type: "maintenance",
    meals: {
      Breakfast: [
        { foodName: "بيض مسلوق", grams: 150 },
        { foodName: "خبز بلدي", grams: 100 },
        { foodName: "جبنة رومي", grams: 50 },
        { foodName: "خيار", grams: 100 },
      ],
      Lunch: [
        { foodName: "أرز أبيض", grams: 200 },
        { foodName: "لحم بقري", grams: 150 },
        { foodName: "ملوخية", grams: 150 },
      ],
      Snacks: [
        { foodName: "زبادي", grams: 200 },
        { foodName: "لوز", grams: 20 },
        { foodName: "تفاح", grams: 100 },
      ],
      Dinner: [
        { foodName: "مكرونة مسلوقة", grams: 150 },
        { foodName: "تونة", grams: 100 },
        { foodName: "سلطة بلدي", grams: 100 },
      ],
    },
  },
  {
    id: "d4",
    name: "نباتي 2200 سعرة",
    description: "نظام نباتي غني بالبروتين النباتي والألياف",
    type: "cut",
    meals: {
      Breakfast: [
        { foodName: "فول مدمس", grams: 250 },
        { foodName: "طحينة", grams: 40 },
        { foodName: "خبز بلدي", grams: 100 },
        { foodName: "سلطة بلدي", grams: 100 },
      ],
      Lunch: [
        { foodName: "عدس شوربة", grams: 300 },
        { foodName: "أرز أبيض", grams: 150 },
        { foodName: "بامية", grams: 150 },
      ],
      Snacks: [
        { foodName: "حمص", grams: 100 },
        { foodName: "جزر", grams: 150 },
        { foodName: "تفاح", grams: 150 },
      ],
      Dinner: [
        { foodName: "مكرونة مسلوقة", grams: 150 },
        { foodName: "فاصوليا بيضاء", grams: 100 },
        { foodName: "بروكلي", grams: 100 },
      ],
    },
  },
  {
    id: "d5",
    name: "كيتو 2000 سعرة",
    description: "نظام قليل الكربوهيدرات عالي الدهون",
    type: "keto",
    meals: {
      Breakfast: [
        { foodName: "بيض مسلوق", grams: 200 },
        { foodName: "جبنة شيدر", grams: 100 },
        { foodName: "زيت زيتون", grams: 20 },
      ],
      Lunch: [
        { foodName: "فراخ مشوية", grams: 250 },
        { foodName: "سبانخ", grams: 100 },
        { foodName: "زبدة", grams: 30 },
      ],
      Snacks: [
        { foodName: "لوز", grams: 50 },
        { foodName: "جوز", grams: 50 },
      ],
      Dinner: [
        { foodName: "لحم بقري", grams: 200 },
        { foodName: "بروكلي", grams: 100 },
        { foodName: "زيت زيتون", grams: 15 },
      ],
    },
  },
  {
    id: "d6",
    name: "ضخامة نظيفة 3000 سعرة",
    description: "زيادة عضلية بأقل نسبة دهون",
    type: "bulk",
    meals: {
      Breakfast: [
        { foodName: "شوفان", grams: 100 },
        { foodName: "بيض مسلوق", grams: 150 },
        { foodName: "لبن كامل الدسم", grams: 300 },
        { foodName: "موز", grams: 150 },
      ],
      Lunch: [
        { foodName: "أرز بني", grams: 250 },
        { foodName: "ديك رومي", grams: 200 },
        { foodName: "فاصوليا خضراء", grams: 150 },
      ],
      Snacks: [
        { foodName: "زبادي يوناني", grams: 200 },
        { foodName: "فول سوداني", grams: 30 },
        { foodName: "عسل أسود", grams: 20 },
      ],
      Dinner: [
        { foodName: "بطاطا", grams: 200 },
        { foodName: "سمك بلطي مشوي", grams: 200 },
        { foodName: "بروكلي", grams: 100 },
      ],
    },
  },
  {
    id: "d7",
    name: "تنشيف سريع 1500 سعرة",
    description: "نظام قاسي لفقدان الوزن بسرعة",
    type: "cut",
    meals: {
      Breakfast: [
        { foodName: "بيض مسلوق", grams: 100 },
        { foodName: "توست بني", grams: 50 },
        { foodName: "خيار", grams: 150 },
      ],
      Lunch: [
        { foodName: "صدر دجاج مشوي", grams: 200 },
        { foodName: "سلطة بلدي", grams: 250 },
        { foodName: "ليمون مخلل", grams: 20 },
      ],
      Snacks: [
        { foodName: "جريب فروت", grams: 150 },
        { foodName: "شاي صعيدي (حبر)", grams: 5 },
      ],
      Dinner: [
        { foodName: "سمك بلطي مشوي", grams: 150 },
        { foodName: "سبانخ", grams: 100 },
        { foodName: "بروكلي", grams: 100 },
      ],
    },
  },
  {
    id: "d8",
    name: " تقليدي 2800 سعرة",
    description: "نظام غذائي  متكامل ومتوازن",
    type: "maintenance",
    meals: {
      Breakfast: [
        { foodName: "فول مدمس", grams: 200 },
        { foodName: "طعمية (فلافل مصرية)", grams: 150 },
        { foodName: "خبز بلدي", grams: 150 },
        { foodName: "طحينة", grams: 30 },
      ],
      Lunch: [
        { foodName: "كشري", grams: 400 },
        { foodName: "سلطة بلدي", grams: 150 },
        { foodName: "شاي كشري", grams: 5 },
      ],
      Snacks: [
        { foodName: "ترمس", grams: 100 },
        { foodName: "تمر", grams: 50 },
      ],
      Dinner: [
        { foodName: "محشي ورق عنب", grams: 300 },
        { foodName: "سلطة بلدي", grams: 100 },
        { foodName: "زبادي", grams: 150 },
      ],
    },
  },
  {
  id: "d9",
  name: "الطيبات 1 - 2800 سعرة",
  description: "نظام مستوحى من مسموحات الطيبات",
  type: "maintenance",
  meals: {
    Breakfast: [
      { foodName: "أرز أبيض مطبوخ", grams: 250 },
      { foodName: "لحم بقري مشوي", grams: 150 },
      { foodName: "خيار", grams: 100 },
    ],
    Lunch: [
      { foodName: "أرز أبيض مطبوخ", grams: 350 },
      { foodName: "سمك مشوي", grams: 250 },
      { foodName: "كوسة مطهية", grams: 200 },
      { foodName: "زيت زيتون", grams: 15 },
    ],
    Snacks: [
      { foodName: "تمر", grams: 100 },
      { foodName: "كمثرى", grams: 200 },
    ],
    Dinner: [
      { foodName: "بطاطس مسلوقة", grams: 400 },
      { foodName: "لحم بقري مشوي", grams: 200 },
      { foodName: "خيار", grams: 150 },
    ],
  },
},{
  id: "d10",
  name: "الطيبات 2 - 2800 سعرة",
  description: "نظام متنوع من أطعمة الطيبات",
  type: "maintenance",
  meals: {
    Breakfast: [
      { foodName: "بطاطس مسلوقة", grams: 300 },
      { foodName: "سمك مشوي", grams: 150 },
      { foodName: "خيار", grams: 100 },
    ],
    Lunch: [
      { foodName: "أرز أبيض مطبوخ", grams: 400 },
      { foodName: "لحم ضأن مشوي", grams: 220 },
      { foodName: "بامية مطهية", grams: 200 },
    ],
    Snacks: [
      { foodName: "تمر", grams: 80 },
      { foodName: "تفاح", grams: 250 },
    ],
    Dinner: [
      { foodName: "بطاطس مشوية", grams: 350 },
      { foodName: "سمك مشوي", grams: 250 },
      { foodName: "خس", grams: 150 },
      { foodName: "زيت زيتون", grams: 10 },
    ],
  },
}
];

// ---------- Enhanced Exercise Templates (8) ----------
export const EXERCISE_TEMPLATES: ExerciseTemplate[] = [
  {
    id: "e1",
    name: "Push/Pull/Legs",
    description: "تقسيم كلاسيكي 3 أيام: دفع، سحب، أرجل",
    daysPerWeek: 3,
    difficulty: "intermediate",
    days: [
      {
        dayName: "Push",
        exercises: [
          { name: "بنش برس", weight: 60 },
          { name: "دمبل برس", weight: 25 },
          { name: "كبل ترايسبس", weight: 20 },
          { name: "كتف جانبي", weight: 10 },
        ],
      },
      {
        dayName: "Pull",
        exercises: [
          { name: "عقلة", weight: 0 },
          { name: "سحب أرضي", weight: 80 },
          { name: "سحب كيبل", weight: 50 },
          { name: "بايسبس بار", weight: 20 },
        ],
      },
      {
        dayName: "Legs",
        exercises: [
          { name: "سكوات", weight: 90 },
          { name: "ضغط أرجل", weight: 120 },
          { name: "هاك سكوات", weight: 60 },
          { name: "سمانة", weight: 50 },
        ],
      },
    ],
  },
  {
    id: "e2",
    name: "Upper/Lower 4 أيام",
    description: "جزء علوي وجزء سفلي مرتين أسبوعياً",
    daysPerWeek: 4,
    difficulty: "beginner",
    days: [
      {
        dayName: "Upper 1",
        exercises: [
          { name: "بنش برس", weight: 50 },
          { name: "عقلة", weight: 0 },
          { name: "كتف دمبل", weight: 15 },
          { name: "بايسبس دمبل", weight: 12 },
        ],
      },
      {
        dayName: "Lower 1",
        exercises: [
          { name: "سكوات", weight: 70 },
          { name: "رفعة ميتة", weight: 60 },
          { name: "تمديد أرجل", weight: 40 },
          { name: "سمانة", weight: 40 },
        ],
      },
      {
        dayName: "Upper 2",
        exercises: [
          { name: "دمبل برس", weight: 30 },
          { name: "سحب كيبل", weight: 45 },
          { name: "كتف خلفي", weight: 10 },
          { name: "ترايسبس كيبل", weight: 20 },
        ],
      },
      {
        dayName: "Lower 2",
        exercises: [
          { name: "فرونت سكوات", weight: 50 },
          { name: "ضغط أرجل", weight: 100 },
          { name: "تمديد أرجل", weight: 35 },
          { name: "رفع سمانة", weight: 60 },
        ],
      },
    ],
  },
  {
    id: "e3",
    name: "برو سبلت 4 أيام",
    description: "صدر، ظهر، أكتاف، أرجل – كل يوم مجموعة عضلية",
    daysPerWeek: 4,
    difficulty: "intermediate",
    days: [
      {
        dayName: "صدر",
        exercises: [
          { name: "بنش برس", weight: 70 },
          { name: "دمبل فلاي", weight: 15 },
          { name: "كبل كروس", weight: 20 },
        ],
      },
      {
        dayName: "ظهر",
        exercises: [
          { name: "عقلة", weight: 0 },
          { name: "سحب أرضي", weight: 80 },
          { name: "سحب دمبل", weight: 35 },
          { name: "سحب كيبل أمامي", weight: 50 },
        ],
      },
      {
        dayName: "أكتاف",
        exercises: [
          { name: "ضغط كتف بار", weight: 40 },
          { name: "رفرفة جانبية", weight: 10 },
          { name: "رفرفة خلفية", weight: 8 },
          { name: "شولدر بريس", weight: 30 },
        ],
      },
      {
        dayName: "أرجل",
        exercises: [
          { name: "سكوات", weight: 90 },
          { name: "ضغط أرجل", weight: 120 },
          { name: "هاك سكوات", weight: 60 },
          { name: "تمديد أرجل", weight: 40 },
        ],
      },
    ],
  },
  {
    id: "e4",
    name: "Full Body 3 أيام",
    description: "تمارين جسم كامل للمبتدئين",
    daysPerWeek: 3,
    difficulty: "beginner",
    days: [
      {
        dayName: "يوم ١",
        exercises: [
          { name: "سكوات", weight: 50 },
          { name: "بنش برس", weight: 40 },
          { name: "عقلة", weight: 0 },
          { name: "كتف جانبي", weight: 8 },
          { name: "بايسبس بار", weight: 15 },
        ],
      },
      {
        dayName: "يوم ٢",
        exercises: [
          { name: "رفعة ميتة", weight: 60 },
          { name: "دمبل برس", weight: 20 },
          { name: "سحب كيبل", weight: 40 },
          { name: "تمديد أرجل", weight: 30 },
          { name: "ترايسبس كيبل", weight: 15 },
        ],
      },
      {
        dayName: "يوم ٣",
        exercises: [
          { name: "فرونت سكوات", weight: 40 },
          { name: "ضغط كتف بار", weight: 30 },
          { name: "سحب دمبل", weight: 25 },
          { name: "رفرفة جانبية", weight: 8 },
          { name: "بلانك (وزن الجسم)", weight: 0 },
        ],
      },
    ],
  },
  {
    id: "e5",
    name: "أرنو سبلت 3 أيام",
    description: "صدر وظهر، أكتاف وذراعين، أرجل – نظام كلاسيكي",
    daysPerWeek: 3,
    difficulty: "intermediate",
    days: [
      {
        dayName: "صدر وظهر",
        exercises: [
          { name: "بنش برس", weight: 65 },
          { name: "عقلة", weight: 0 },
          { name: "سحب أرضي", weight: 70 },
          { name: "دمبل فلاي", weight: 15 },
        ],
      },
      {
        dayName: "أكتاف وذراعين",
        exercises: [
          { name: "ضغط كتف بار", weight: 40 },
          { name: "بايسبس بار", weight: 20 },
          { name: "ترايسبس كيبل", weight: 20 },
          { name: "رفرفة جانبية", weight: 10 },
        ],
      },
      {
        dayName: "أرجل",
        exercises: [
          { name: "سكوات", weight: 80 },
          { name: "ضغط أرجل", weight: 100 },
          { name: "هاك سكوات", weight: 50 },
          { name: "سمانة", weight: 45 },
        ],
      },
    ],
  },
  {
    id: "e6",
    name: "قوة 5×5",
    description: "تمارين مركبة 5 مجموعات × 5 تكرارات",
    daysPerWeek: 3,
    difficulty: "intermediate",
    days: [
      {
        dayName: "A",
        exercises: [
          { name: "سكوات", weight: 80 },
          { name: "بنش برس", weight: 60 },
          { name: "سحب أرضي", weight: 90 },
        ],
      },
      {
        dayName: "B",
        exercises: [
          { name: "سكوات", weight: 85 },
          { name: "ضغط كتف بار", weight: 45 },
          { name: "عقلة", weight: 0 },
        ],
      },
      {
        dayName: "A",
        exercises: [
          { name: "سكوات", weight: 90 },
          { name: "بنش برس", weight: 65 },
          { name: "سحب أرضي", weight: 95 },
        ],
      },
    ],
  },
  {
    id: "e7",
    name: "5 أيام متقدم",
    description: "تقسيم متقدم لكل مجموعة عضلية يوم منفصل",
    daysPerWeek: 5,
    difficulty: "advanced",
    days: [
      {
        dayName: "صدر",
        exercises: [
          { name: "بنش برس", weight: 80 },
          { name: "دمبل برس مائل", weight: 35 },
          { name: "كبل كروس", weight: 25 },
          { name: "ضغط دمبل", weight: 30 },
        ],
      },
      {
        dayName: "ظهر",
        exercises: [
          { name: "سحب أرضي", weight: 100 },
          { name: "عقلة", weight: 0 },
          { name: "سحب كيبل", weight: 60 },
          { name: "سحب دمبل", weight: 40 },
        ],
      },
      {
        dayName: "أكتاف",
        exercises: [
          { name: "ضغط كتف بار", weight: 50 },
          { name: "رفرفة جانبية", weight: 12 },
          { name: "رفرفة خلفية", weight: 10 },
          { name: "شولدر بريس", weight: 35 },
        ],
      },
      {
        dayName: "أرجل",
        exercises: [
          { name: "سكوات", weight: 110 },
          { name: "ضغط أرجل", weight: 150 },
          { name: "هاك سكوات", weight: 80 },
          { name: "تمديد أرجل", weight: 50 },
        ],
      },
      {
        dayName: "ذراعين",
        exercises: [
          { name: "بايسبس بار", weight: 25 },
          { name: "ترايسبس كيبل", weight: 30 },
          { name: "دمبل بايسبس", weight: 15 },
          { name: "ترايسبس فرنسي", weight: 20 },
        ],
      },
    ],
  },
  {
    id: "e8",
    name: "تمارين منزلية بدون أدوات",
    description: "تمارين وزن الجسم للمبتدئين في المنزل",
    daysPerWeek: 3,
    difficulty: "beginner",
    days: [
      {
        dayName: "جسم كامل ١",
        exercises: [
          { name: "سكوات هواء", weight: 0 },
          { name: "ضغط", weight: 0 },
          { name: "عقلة (مقبض)", weight: 0 },
          { name: "بلانك", weight: 0 },
          { name: "لانج", weight: 0 },
        ],
      },
      {
        dayName: "جسم كامل ٢",
        exercises: [
          { name: "سكوات قفز", weight: 0 },
          { name: "ضغط مائل", weight: 0 },
          { name: "سحب بالأرض", weight: 0 },
          { name: "رفرفة كتف", weight: 0 },
          { name: "بطن", weight: 0 },
        ],
      },
      {
        dayName: "جسم كامل ٣",
        exercises: [
          { name: "سكوات ساق واحدة", weight: 0 },
          { name: "ضغط الماس", weight: 0 },
          { name: "عقلة سلبية", weight: 0 },
          { name: "متسلق جبال", weight: 0 },
          { name: "جسر أرضي", weight: 0 },
        ],
      },
    ],
  },
];
