import FOOD_DB from "../assets/FoodsList.json";

// ========== تعريفات الأنواع ==========
interface FoodItem {
  FoodName: string;
  ProtineForOneKilo: string;
  MostVitamens: string[];
  calForOneKilo: string;
}

// ========== أدوات التاريخ (مُصحَّحة) ==========
const getDailySeed = (): number => {
  const d = new Date();
  const s = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  return Math.sin(s) * 10000 - Math.floor(Math.sin(s) * 10000);
};

const getRandomBySeed = <T>(arr: T[]): T =>
  arr[Math.floor(getDailySeed() * arr.length)];

// ✅ تصحيح تنسيق التاريخ ليتطابق مع History (شهر ويوم بصفر بادئة)
const getToday = (): string => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1);
  const day = String(d.getDate());
  return `${y}/${m}/${day}`;
};

// ========== نصائح اليوم ==========
const DAILY_TIPS = [
  "امضغ طعامك ببطء",
  "لوّن طبقك بالخضار",
  "امشِ 10 دقائق بعد الأكل",
  "نم 7 ساعات الليلة",
  "ابتعد عن الشاشات أثناء الطعام",
  "اشرب كوب ماء قبل الوجبة",
  "تناول حفنة مكسرات",
  "استبدل الغازية بشاي أعشاب",
  "ورقيات خضراء = طاقة",
  "سمك مرتين بالأسبوع",
  "تنفس بعمق 5 دقائق",
  "عشاءك قبل النوم بـ3 ساعات",
  "لا تهمل الفطور",
  "قلّل ملح، أكثر من الأعشاب",
];

// ========== الدالة الصحية المُحسَّنة ==========
export function giveHealthAdvice(): string {
  const today = getToday();

  // --- البيانات الأساسية ---
  const historyRaw = localStorage.getItem("History");
  const foodInfoRaw = localStorage.getItem("FoodInfo_s");
  const dailyCal = parseFloat(localStorage.getItem("dailyCalories") || "0") || 0;

  const age = parseInt(localStorage.getItem("age") || "0", 10);
  const currentWeight = parseFloat(localStorage.getItem("currentWeight") || "0");
  const height = parseFloat(localStorage.getItem("height") || "0");
  const gender = localStorage.getItem("SelectedGender");
  const goal = localStorage.getItem("SelectedGoal") || "";

  // --- الأطعمة الفعلية ---
  const history = historyRaw ? JSON.parse(historyRaw) : {};
  const todayMeals = history[today]?.meals || {};
  const allFoods = Object.values(todayMeals).flat() as string[];

  if (allFoods.length === 0) {
    return ` لم تُسجل أي وجبات اليوم.أضف طعاما  لتحصل على نصيحة ! `;
  }

  // البروتين الفعلي – يُجمع لكل طبق (إذا تكرر الطبق يُحسب مرة واحدة بسبب FoodInfo_s)
  let totalProtein = 0;
  const foodSet = new Set(allFoods);
  if (foodInfoRaw) {
    const foodInfo: [string, string, number, number, number][] = JSON.parse(foodInfoRaw);
    for (const [, name, , , protein] of foodInfo) {
      if (foodSet.has(name)) totalProtein += protein;
    }
  }

  // الفيتامينات
  const vitamins = new Set<string>();
  for (const name of allFoods) {
    const entry = (FOOD_DB as FoodItem[]).find((f) => f.FoodName === name);
    entry?.MostVitamens.forEach((v) => vitamins.add(v));
  }

  const essential = ["فيتامين أ", "فيتامين ج", "فيتامين د", "فيتامين ب12", "حديد", "كالسيوم"];
  const missing = essential.filter((v) => !vitamins.has(v));

  // ========== النصيحة الشخصية ==========
  if (age && currentWeight && height && gender && goal) {
    let bmr: number;
    if (gender === "ذكر") {
      bmr = 10 * currentWeight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * currentWeight + 6.25 * height - 5 * age - 161;
    }

    const tdee = bmr * 1.2;

    let targetCal: number;
    let goalText: string;
    if (goal.includes("فقدان") || goal.includes("خسارة")) {
      targetCal = tdee - 500;
      goalText = "خسارة الوزن";
    } else if (goal.includes("بناء عضلات") || goal.includes("عضلي")) {
      targetCal = tdee + 300;
      goalText = "بناء العضلات";
    } else if (goal.includes("زيادة عرض")) {
      targetCal = tdee + 300;
      goalText = "تضخيم عضلي";
    } else {
      targetCal = tdee;
      goalText = "المحافظة على الوزن";
    }

    let proteinPerKg: number;
    if (goal.includes("بناء") || goal.includes("عضلي") || goal.includes("زيادة عرض")) {
      proteinPerKg = 1.8;
    } else if (goal.includes("فقدان") || goal.includes("خسارة")) {
      proteinPerKg = 1.6;
    } else {
      proteinPerKg = 1.2;
    }
    const proteinTarget = proteinPerKg * currentWeight;

    const parts: string[] = [];

    const calDiff = dailyCal - targetCal;
    if (calDiff > 300) {
      parts.push(`لتحقيق ${goalText} تحتاج ~${Math.round(targetCal)} سعرة، تناولت ${dailyCal} (أعلى بـ ${Math.round(calDiff)})، قلل الكميات`);
    } else if (calDiff < -300) {
      parts.push(`لتحقيق ${goalText} تحتاج ~${Math.round(targetCal)} سعرة، تناولت ${dailyCal} (أقل بـ ${Math.abs(Math.round(calDiff))})، زد طعاماً صحياً`);
    } else {
      parts.push(`سعراتك (${dailyCal}) مناسبة لهدف ${goalText}`);
    }

    if (totalProtein < proteinTarget - 10) {
      parts.push(`بروتينك ${Math.round(totalProtein)}غم، تحتاج ~${Math.round(proteinTarget)}غم، أضف مصدراً بروتينياً`);
    } else if (Math.round(totalProtein) > proteinTarget + 30) {
      parts.push(`بروتينك ${Math.round(totalProtein)}غم أعلى من اللازم، ركّز على الكارب المعقد والخضار`);
    } else {
      parts.push("والبروتين كافٍ");
    }

    if (missing.length > 0) {
      const suggestions: Record<string, string> = {
        "فيتامين أ": "جزر/كبدة",
        "فيتامين ج": "برتقال/فلفل",
        "فيتامين د": "سمك/بيض",
        "فيتامين ب12": "لحم/ألبان",
        حديد: "كبدة/عدس",
        كالسيوم: "زبادي/جبن",
      };
      const topMissing = missing.slice(0, 2);
      const fix = topMissing.map((v) => suggestions[v] || v).join(" و");
      parts.push(`عوّض نقص ${topMissing.join(" و")} بـ ${fix}`);
    }

    const tip = getRandomBySeed(DAILY_TIPS);
    parts.push(tip);
    return parts.join(". ") + ".";
  }

  // ========== النصائح العامة (عند عدم توفر بيانات شخصية) ==========
  if (dailyCal > 3000) return "سعراتك اليوم مرتفعة جداً، قلل النشويات والحلويات.";
  if (dailyCal > 2500) return "سعراتك أعلى من الطبيعي، خفف الكميات في الوجبة التالية.";
  if (dailyCal < 1500) return "سعراتك قليلة، أضف وجبة خفيفة كالمكسرات أو التمر.";
  if (totalProtein < 30) return "تحتاج بروتيناً أكثر، تناول بيضاً أو لحماً أو زبادي.";
  if (totalProtein > 150) return "بروتينك عالٍ اليوم، وازنه بالخضروات والسلطة.";

  if (missing.length > 0) {
    const suggestions: Record<string, string> = {
      "فيتامين أ": "جزر أو كبدة",
      "فيتامين ج": "برتقال أو فلفل",
      "فيتامين د": "سمك أو بيض",
      "فيتامين ب12": "لحم أو ألبان",
      حديد: "كبدة أو عدس",
      كالسيوم: "زبادي أو جبن",
    };
    const topMissing = missing.slice(0, 2);
    const fix = topMissing.map((v) => suggestions[v] || v).join(" و");
    return `لديك نقص في ${topMissing.join(" و")}، عوّضه بـ ${fix}.`;
  }

  const tip = getRandomBySeed(DAILY_TIPS);
  return `تغذيتك اليوم متوازنة، ${tip}.`;
}

// ========== نصيحة التمارين ==========
const EXERCISE_TIPS = [
  "ابدأ يومك بتمارين الإطالة 5 دقائق لتنشيط الدورة الدموية.",
  "المشي السريع 30 دقيقة يومياً يحرق الدهون ويحسن المزاج.",
  "جرب تمرين البلانك 3 مجموعات، يقوي عضلات البطن والظهر.",
  "لا تهمل تمارين القوة، فهي ترفع معدل الحرق حتى في الراحة.",
  "صعود الدرج 10 دقائق يعادل 30 دقيقة مشي.",
  "استخدم وزن جسمك: 20 قرفصاء، 10 ضغط، 15 طعنات لكل ساق.",
  "التمارين الهوائية كالسباحة وركوب الدراجة تنشط القلب والرئتين.",
  "خصص يومين أسبوعياً لتمارين المرونة مثل اليوغا أو البيلاتس.",
  "الراحة بين المجموعات 60 ثانية فقط لتحفيز حرق الدهون.",
  "قبل النوم، تمرين تمدد بسيط يزيل توتر العضلات ويحسن النوم.",
  "نط الحبل 10 دقائق يحرق سعرات توازي 30 دقيقة جري.",
  "تمرين القرفصاء يستهدف أكبر عضلات الجسم، اجعله أساسياً.",
  "لا تمارس الرياضة بعد الأكل مباشرة، انتظر ساعتين.",
  "شرب الماء أثناء التمرين ضروري لتعويض السوائل المفقودة.",
  "تمرين الضغط يقوي الصدر والأكتاف والذراعين، زد عدده أسبوعياً.",
  "الاستمرارية أهم من الشدة، تمرن ولو 15 دقيقة يومياً.",
  "جرب التمرين المتقطع: 30 ثانية مجهود، 30 ثانية راحة.",
  "انتبه لوضعية ظهرك أثناء حمل الأوزان، حافظ على استقامته.",
  "استمع لجسمك، إذا شعرت بألم حاد توقف فوراً.",
  "تمارين البطن وحدها لا تزيل الكرش، ادمجها مع الكارديو والتغذية.",
];

export function giveExerciseAdvice(): string {
  return getRandomBySeed(EXERCISE_TIPS);
}