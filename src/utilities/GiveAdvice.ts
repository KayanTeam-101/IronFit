// قاعدة بيانات الطعام (ضع المصفوفة كاملة هنا)
import FOOD_DB  from "../assets/FoodsList.json";
// ========== أدوات التاريخ ==========
const getToday = () => {
  const d = new Date();
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
};

const getDailySeed = () => {
  const d = new Date();
  const s = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  const x = Math.sin(s) * 10000;
  return x - Math.floor(x);
};

const getRandomBySeed = <T>(arr: T[]): T => arr[Math.floor(getDailySeed() * arr.length)];

// ========== نصائح مختصرة ==========
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

// ========== الدالة الرئيسية ==========
export function giveHealthAdvice(): string {
   const today = getToday();

  // جلب البيانات
  const historyRaw = localStorage.getItem("History");
  const foodInfoRaw = localStorage.getItem("FoodInfo_s");
  const dailyCal = parseFloat(localStorage.getItem("dailyCalories") || "0");

  // الأطعمة الفعلية المأكولة اليوم
  const history = historyRaw ? JSON.parse(historyRaw) : {};
  const todayMeals = history[today]?.meals || {};
  const allFoods = Object.values(todayMeals).flat() as string[];

  if (allFoods.length === 0) {
    return "لم تُسجل أي وجبات اليوم. أضف طعامك لتحصل على نصيحة.";
  }

  // البروتين الفعلي من FoodInfo_s
  let totalProtein = 0;
  const foodSet = new Set(allFoods);
  if (foodInfoRaw) {
    const foodInfo: [string, string, number, number, number][] =
      JSON.parse(foodInfoRaw);
    for (const [, name, , , protein] of foodInfo) {
      if (foodSet.has(name)) totalProtein += protein;
    }
  }

  // الفيتامينات المستهلكة فعلياً من قاعدة البيانات
  const vitamins = new Set<string>();
  for (const name of allFoods) {
    const entry = FOOD_DB.find((f) => f.FoodName === name);
    entry?.MostVitamens.forEach((v : string) => vitamins.add(v));
  }

  // الفيتامينات الأساسية ونواقصها
  const essential = [
    "فيتامين أ",
    "فيتامين ج",
    "فيتامين د",
    "فيتامين ب12",
    "حديد",
    "كالسيوم",
  ];
  const missing = essential.filter((v) => !vitamins.has(v));

  // ========== ترتيب الأولويات ==========
  // 1. السعرات
  if (dailyCal > 3000)
    return "سعراتك اليوم مرتفعة جداً، قلل النشويات والحلويات.";
  if (dailyCal > 2500)
    return "سعراتك أعلى من الطبيعي، خفف الكميات في الوجبة التالية.";
  if (dailyCal < 1500)
    return "سعراتك قليلة، أضف وجبة خفيفة كالمكسرات أو التمر.";

  // 2. البروتين
  if (totalProtein < 30)
    return "تحتاج بروتيناً أكثر، تناول بيضاً أو لحماً أو زبادي.";
  if (totalProtein > 150)
    return "بروتينك عالٍ اليوم، وازنه بالخضروات والسلطة.";

  // 3. نقص الفيتامينات (نختار أهم نقصين)
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

  // 4. كل شيء ممتاز
  const tip = getRandomBySeed(DAILY_TIPS);
  return `تغذيتك اليوم متوازنة، ${tip}.`;
}


const getDailySeed_ = (): number => {
  const d = new Date();
  const s = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  return Math.sin(s) * 10000 - Math.floor(Math.sin(s) * 10000);
};

const getRandomBySeed_ = <T>(arr: T[]): T =>
  arr[Math.floor(getDailySeed_() * arr.length)];

// ========== مكتبة النصائح الرياضية ==========
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

/**
 * يعيد نصيحة رياضية واحدة مختصرة تتغير يومياً
 * @returns جملة نصيحة رياضية
 */
export function giveExerciseAdvice(): string {
  return getRandomBySeed_(EXERCISE_TIPS);
}
