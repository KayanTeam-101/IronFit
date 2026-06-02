import React, { useState, useMemo } from "react";
import {
  FaDumbbell,
  FaUtensils,
  FaEye,
  FaCheckCircle,
  FaFire,
  FaArrowRight,
  FaTimes,
  FaLeaf,
  FaRunning,
  FaPlus,
} from "react-icons/fa";
import { GiBiceps, GiMuscleUp, GiWeightLiftingUp } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import foods from "../../assets/FoodsList.json"; // adjust the import path as needed

// ---------- Types ----------
interface FoodItem {
  FoodName: string;
  ProtineForOneKilo: string;
  MostVitamens: string[];
  calForOneKilo: string;
}

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

// ---------- Helpers ----------
const foodList = foods as FoodItem[];

function getFoodData(foodName: string) {
  return foodList.find(f => f.FoodName === foodName);
}

function calcMealNutrition(entries: MealEntry[]) {
  let calories = 0, protein = 0;
  const vitaminsSet = new Set<string>();
  entries.forEach(entry => {
    const food = getFoodData(entry.foodName);
    if (food) {
      const calPerKilo = Number(food.calForOneKilo);
      const protPerKilo = Number(food.ProtineForOneKilo);
      calories += (calPerKilo * entry.grams) / 1000;
      protein += (protPerKilo * entry.grams) / 1000;
      food.MostVitamens.forEach(v => v && vitaminsSet.add(v));
    }
  });
  return { calories, protein, vitamins: Array.from(vitaminsSet) };
}

function calcTotalNutrition(meals: DietTemplate["meals"]) {
  let totalCal = 0, totalProt = 0;
  const allVitamins = new Set<string>();
  Object.values(meals).forEach(entries => {
    const { calories, protein, vitamins } = calcMealNutrition(entries);
    totalCal += calories;
    totalProt += protein;
    vitamins.forEach(v => allVitamins.add(v));
  });
  return { calories: totalCal, protein: totalProt, vitamins: Array.from(allVitamins) };
}

// ---------- Enhanced Diet Templates (8) ----------
const DIET_TEMPLATES: DietTemplate[] = [
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
const EXERCISE_TEMPLATES: ExerciseTemplate[] = [
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

// ---------- Main Component ----------
const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"diet" | "exercise">("diet");
  const [selectedDiet, setSelectedDiet] = useState<DietTemplate | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseTemplate | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const openDietPreview = (template: DietTemplate) => setSelectedDiet(template);
  const openExercisePreview = (template: ExerciseTemplate) => setSelectedExercise(template);

  // ---------- Systems (same as ExercisePage) ----------
type SystemName = "ارنو سبلت" | "بروسبلت" | "بوش بون ليج";

const SYSTEMS: Record<SystemName, string[]> = {
  "ارنو سبلت": ["صدر وظهر", "أكتاف وذراعين", "أرجل"],
  "بروسبلت": ["صدر", "ظهر", "أكتاف", "ذراعين", "أرجل"],
  "بوش بون ليج": ["بوش", "بول", "ليجز"],
};

  const applyDietTemplate = (template: DietTemplate) => {
    const Confirm = window.confirm("هل أنت متأكد أنك تريد تطبيق هذا القالب الغذائي؟ سيحل محل نظامك الحالي.");
    if (!Confirm) return;
    const dietObj: any = {};
    (Object.keys(template.meals) as Array<keyof typeof template.meals>).forEach(mealKey => {
      const entries = template.meals[mealKey];
      const foodNames = entries.map(e => e.foodName);
      const { calories, protein, vitamins } = calcMealNutrition(entries);
      dietObj[mealKey] = [foodNames, [calories, protein, vitamins]];
    });
    localStorage.setItem("Diet", JSON.stringify(dietObj));

    const foodInfo: any[] = [];
    (Object.entries(template.meals) as [string, MealEntry[]][]).forEach(([mealKey, entries]) => {
      entries.forEach(entry => {
        const food = getFoodData(entry.foodName);
        if (food) {
          const calPerKilo = Number(food.calForOneKilo);
          const protPerKilo = Number(food.ProtineForOneKilo);
          const cal = (calPerKilo * entry.grams) / 1000;
          const prot = (protPerKilo * entry.grams) / 1000;
          foodInfo.push([mealKey, entry.foodName, entry.grams, cal, prot]);
        }
      });
    });
    localStorage.setItem("FoodInfo_s", JSON.stringify(foodInfo));
    setSuccessMessage("تم تطبيق القالب الغذائي بنجاح!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };
// At the top of TemplatesPage, add this constant for default weekdays
const DEFAULT_WEEKDAYS = [
  "السبت",
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
];










const applyExerciseTemplate = (template: ExerciseTemplate) => {
  const Confirm = window.confirm(
    "هل أنت متأكد أنك تريد تطبيق هذا القالب التمريني؟ سيحل محل نظامك الحالي."
  );
  if (!Confirm) return;

  // 1. نظام التمرين اللي هنستخدمه (بروسبلت لأنه بيحتوي على ٥ تمارين)
  const systemName: SystemName = "بروسبلت";
  const systemWorkouts = SYSTEMS[systemName]; // ["صدر", "ظهر", "أكتاف", "ذراعين", "أرجل"]

  // 2. عدد أيام القالب
  const neededDays = template.days.length;

  // 3. اختيار أيام الأسبوع العربية (بترتيبها الطبيعي)
  const DEFAULT_WEEKDAYS = [
    "السبت",
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
  ];
  let existingSelectedDays: string[] = [];
  try {
    const raw = localStorage.getItem("SelectedDays");
    existingSelectedDays = raw ? JSON.parse(raw) : [];
  } catch {
    existingSelectedDays = [];
  }

  let chosenWeekdays: string[];
  if (existingSelectedDays.length >= neededDays) {
    chosenWeekdays = existingSelectedDays.slice(0, neededDays);
  } else {
    chosenWeekdays = DEFAULT_WEEKDAYS.slice(0, neededDays);
  }

  // 4. أسماء التمارين من النظام (نفس عدد أيام القالب)
  const chosenWorkouts = systemWorkouts.slice(0, neededDays); // مثلاً: ["صدر", "ظهر", "أكتاف"]

  // 5. حفظ البيانات في localStorage
  localStorage.setItem("SystemOfExercise", systemName);
  localStorage.setItem("SelectedDays", JSON.stringify(chosenWeekdays));
  localStorage.setItem(
    "SystemStartDate",
    new Date().toISOString().slice(0, 10)
  );

  // 6. تخزين تمارين القالب تحت اسم التمرين العربي الصحيح
  template.days.forEach((templateDay, index) => {
    const workoutName = chosenWorkouts[index]; // "صدر" أو "ظهر" أو "أكتاف" إلخ
    const key = `exercises_workout_${workoutName}`; // نفس مفتاح LS_KEYS في ExercisePage
    const exercises = templateDay.exercises.map((ex) => ({
      name: ex.name,
      weight: ex.weight,
    }));
    localStorage.setItem(key, JSON.stringify(exercises));
  });

  setSuccessMessage("تم تطبيق قالب التمارين بنجاح!");
  setTimeout(() => setSuccessMessage(""), 3000);
};













  const dietNutrition = useMemo(() => {
    if (!selectedDiet) return null;
    return calcTotalNutrition(selectedDiet.meals);
  }, [selectedDiet]);

  const getTypeIcon = (type: DietTemplate["type"]) => {
    switch (type) {
      case "bulk": return <GiMuscleUp className="text-orange-400" />;
      case "cut": return <FaLeaf className="text-green-400" />;
      case "maintenance": return '';
      case "keto": return <GiBiceps className="text-purple-400" />;
    }
  };

  const getDifficultyColor = (level: ExerciseTemplate["difficulty"]) => {
    switch (level) {
      case "beginner": return "text-green-400";
      case "intermediate": return "text-yellow-400";
      case "advanced": return "text-red-400";
    }
  };

  return (
    <div className="min-h-screen  dark:text-white text-black p-4 pb-20 show-first">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>

      {/* Header */}
      <div className="text-center mb-6 pt-4">

        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
          قوالب جاهزة
        </h1>
        <p className="text-gray-400 mt-1">ابدأ بسرعة مع قوالب مصممة لأهدافك</p>
      </div>

      {/* Tabs */}
      <div className="flex z-20 justify-center gap-3 mb-8">
        <button
          onClick={() => setActiveTab("diet")}
          className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
            activeTab === "diet"
              ? "bg-amber-500 text-white "
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          <FaUtensils /> غذائي
        </button>
        <button
          onClick={() => setActiveTab("exercise")}
          className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
            activeTab === "exercise"
              ? "bg-blue-500 text-white "
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          <FaDumbbell /> تمارين

        </button>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-green-500  text-black dark:text-white px-6 py-2 rounded-full shadow-2xl font-bold animate-fadeIn">
          <FaCheckCircle className="inline mr-2" /> {successMessage}
        </div>
      )}

      {/* Template cards */}
      <div className="grid gap-4  max-w-lg mx-auto">

        {activeTab === "diet" &&
          DIET_TEMPLATES.map(template => {
            const nut = calcTotalNutrition(template.meals);
            return (
              <div
              key={template.id}
              className="bg-white dark:bg-black/20 dark:border-2 dark:border-gray-600/20 backdrop-blur-sm border border-gray-700/50 shadow-xl rounded-3xl p-5 hover:shadow-2xl transition-all hover:scale-[1.02] group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getTypeIcon(template.type)}
                      <h3 className="text-lg font-bold">{template.name}</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{template.description}</p>
                    <div className="flex gap-4 text-sm">
                      <span className="flex items-center gap-1 text-orange-400">
                        <FaFire className="text-xs" /> {Math.round(nut.calories)} كال
                      </span>
                      <span className="flex items-center gap-1 text-teal-400">
                        <GiBiceps className="text-xs" /> {Math.round(nut.protein)}غ بروتين
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => openDietPreview(template)}
                      className="p-2.5 px-5 bg-gray-700 rounded-full hover:bg-gray-600 transition"
                      title="معاينة"
                    >
                      <FaEye className="text-gray-300" />
                    </button>
                 
                  </div>
                </div>
              </div>
            );
          })}

        {activeTab === "exercise" &&
          EXERCISE_TEMPLATES.map(template => (
            <div
              key={template.id}
              className=" dark:bg-black/20 dark:border-2 dark:border-gray-600/20  backdrop-blur-sm border border-gray-700/50 shadow-xl rounded-3xl p-5 hover:shadow-2xl transition-all hover:scale-[1.02] group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-black dark:text-white">
                    <FaDumbbell className="text-sky-400" /> {template.name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{template.description}</p>
                  <div className="flex gap-4 mt-3 text-sm">
                    <span className="flex items-center gap-1 text-gray-300">
                      <FaRunning /> {template.daysPerWeek} أيام
                    </span>
                    <span className={`font-medium ${getDifficultyColor(template.difficulty)}`}>
                      {template.difficulty === "beginner" ? "مبتدئ" : template.difficulty === "intermediate" ? "متوسط" : "متقدم"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => openExercisePreview(template)}
                    className="p-2.5 px-5 flex flex-row gap-2 items-center  bg-gray-700 rounded-full hover:bg-gray-600 transition"
                    title="معاينة"
                  >
                    <FaEye className="text-gray-300" /> 
                  </button>
                
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Diet Preview Modal */}
      {selectedDiet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center dark:bg-black/20 dark:border-2 dark:border-gray-600/20 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="dark:bg-black/20 dark:border-2 dark:border-gray-600/20 dark:shadow-2xl rounded-3xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold dark:text-white text-black">{selectedDiet.name}</h3>
              <button onClick={() => setSelectedDiet(null)} className="text-gray-400 hover:text-white">
                <FaTimes size={20} />
              </button>
            </div>
            <p className="dark:text-gray-400 text-black mb-4">{selectedDiet.description}</p>
            {dietNutrition && (
              <div className="flex gap-3 mb-4">
                <span className="bg-orange-900/20 text-orange-400 px-3 py-1 rounded-full text-sm font-medium">
                  {Math.round(dietNutrition.calories)} سعرة
                </span>
                <span className="bg-teal-900/20 text-teal-400 px-3 py-1 rounded-full text-sm font-medium">
                  {Math.round(dietNutrition.protein)}غ بروتين
                </span>
              </div>
            )}
            {(Object.keys(selectedDiet.meals) as Array<keyof typeof selectedDiet.meals>).map(mealKey => {
              const entries = selectedDiet.meals[mealKey];
              if (entries.length === 0) return null;
              return (
                <div key={mealKey} className="mb-3">
                  <h4 className="text-sm font-semibold dark:text-gray-300 text-black mb-1">{mealKey}</h4>
                  <ul className="space-y-1">
                    {entries.map((entry, idx) => (
                      <li key={idx} className="flex justify-between text-md dark:text-gray-300 text-black dark:bg-gray-700/50 rounded-lg px-3 py-1">
                        <span>{entry.foodName}</span>
                        <span className="dark:text-gray-400 text-black">{entry.grams}غ</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            <button
              onClick={() => {
                applyDietTemplate(selectedDiet);
                setSelectedDiet(null);
              }}
              className="w-full mt-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 rounded-xl font-bold transition hover:brightness-110"
            >
              تطبيق القالب
            </button>
          </div>
        </div>
      )}

      {/* Exercise Preview Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center dark:bg-black/20 dark:border-2 dark:border-gray-600/20 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="dark:bg-black/20 dark:border-2 dark:border-gray-600/20 dark:shadow-2xl rounded-3xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold dark:text-white text-black">{selectedExercise.name}</h3>
              <button onClick={() => setSelectedExercise(null)} className="text-gray-400 hover:text-white">
                <FaTimes size={20} />
              </button>
            </div>
            <p className="dark:text-gray-400 text-black mb-4">{selectedExercise.description}</p>
            <div className="flex gap-4 mb-4 text-sm">
              <span className="dark:text-gray-300 text-black"><FaRunning className="inline mr-1" /> {selectedExercise.daysPerWeek} أيام</span>
              <span className={`font-medium ${getDifficultyColor(selectedExercise.difficulty)}`}>
                {selectedExercise.difficulty === "beginner" ? "مبتدئ" : selectedExercise.difficulty === "intermediate" ? "متوسط" : "متقدم"}
              </span>
            </div>
            {selectedExercise.days.map((day, idx) => (
              <div key={idx} className="mb-3">
                <h4 className="text-sm font-semibold text-sky-400 mb-1">{day.dayName}</h4>
                <ul className="space-y-1">
                  {day.exercises.map((ex, i) => (
                    <li key={i} className="flex justify-between text-md dark:text-gray-300 text-black dark:bg-gray-700/50 rounded-lg px-3 py-1">
                      <span>{ex.name}</span>
                      <span className="dark:text-gray-400 text-black">{ex.weight > 0 ? `${ex.weight} كغ` : "وزن الجسم"}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <button
              onClick={() => {
                applyExerciseTemplate(selectedExercise);
                setSelectedExercise(null);
              }}
              className="w-full mt-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 rounded-xl font-bold transition hover:brightness-110"
            >
              تطبيق القالب
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;