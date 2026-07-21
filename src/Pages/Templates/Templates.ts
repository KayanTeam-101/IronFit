
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

export const DIET_TEMPLATES: DietTemplate[] = [
{
id: "d1",
name: "ضخامة 3500 سعرة",
description: "نظام عالي السعرات لبناء العضلات وزيادة الوزن",
type: "bulk",
meals: {
Breakfast: [
{ foodName: "بيض مسلوق", grams: 180 },
{ foodName: "فول مدمس", grams: 180 },
{ foodName: "خبز بلدي", grams: 140 },
{ foodName: "جبنة بيضاء (دمياطي)", grams: 40 },
],
Lunch: [
{ foodName: "أرز أبيض", grams: 280 },
{ foodName: "فراخ مشوية", grams: 220 },
{ foodName: "سلطة بلدي", grams: 150 },
{ foodName: "طحينة", grams: 30 },
],
Snacks: [
{ foodName: "زبادي يوناني", grams: 200 },
{ foodName: "لوز", grams: 40 },
{ foodName: "موز", grams: 130 },
{ foodName: "عسل أسود", grams: 15 },
],
Dinner: [
{ foodName: "بطاطا حلوة مشوية", grams: 200 },
{ foodName: "كفتة", grams: 170 },
{ foodName: "خبز بلدي", grams: 80 },
{ foodName: "بابا غنوج", grams: 70 },
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
{ foodName: "بيض مسلوق", grams: 150 },
{ foodName: "جبنة بيضاء (دمياطي)", grams: 50 },
{ foodName: "خيار", grams: 100 },
{ foodName: "توست بني", grams: 80 },
],
Lunch: [
{ foodName: "سمك بلطي مشوي", grams: 250 },
{ foodName: "سلطة بلدي", grams: 200 },
{ foodName: "بروكلي", grams: 150 },
],
Snacks: [
{ foodName: "تفاح", grams: 200 },
{ foodName: "جزر", grams: 150 },
{ foodName: "زبادي", grams: 100 },
{ foodName: "لوز", grams: 10 },
],
Dinner: [
{ foodName: "فراخ مشوية", grams: 250 },
{ foodName: "سبانخ", grams: 150 },
{ foodName: "خبز بلدي", grams: 50 },
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
{ foodName: "أرز أبيض مطبوخ", grams: 300 },
{ foodName: "لحم بقري مشوي", grams: 180 },
{ foodName: "خيار", grams: 100 },
],
Lunch: [
{ foodName: "أرز أبيض مطبوخ", grams: 380 },
{ foodName: "سمك مشوي", grams: 250 },
{ foodName: "كوسة مطهية", grams: 200 },
{ foodName: "زيت زيتون", grams: 15 },
],
Snacks: [
{ foodName: "تمر", grams: 80 },
{ foodName: "كمثرى", grams: 200 },
],
Dinner: [
{ foodName: "بطاطس مسلوقة", grams: 400 },
{ foodName: "لحم بقري مشوي", grams: 220 },
{ foodName: "خيار", grams: 150 },
],
},
},
{
id: "d10",
name: "الطيبات 2 - 2800 سعرة",
description: "نظام متنوع من أطعمة الطيبات",
type: "maintenance",
meals: {
Breakfast: [
{ foodName: "بطاطس مسلوقة", grams: 350 },
{ foodName: "سمك مشوي", grams: 180 },
{ foodName: "خيار", grams: 100 },
],
Lunch: [
{ foodName: "أرز أبيض مطبوخ", grams: 420 },
{ foodName: "لحم ضأن مشوي", grams: 240 },
{ foodName: "بامية مطهية", grams: 200 },
],
Snacks: [
{ foodName: "تمر", grams: 100 },
{ foodName: "تفاح", grams: 300 },
],
Dinner: [
{ foodName: "بطاطس مشوية", grams: 400 },
{ foodName: "سمك مشوي", grams: 250 },
{ foodName: "خس", grams: 150 },
{ foodName: "زيت زيتون", grams: 10 },
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
{ foodName: "بيض مسلوق", grams: 180 },
{ foodName: "خبز بلدي", grams: 120 },
{ foodName: "جبنة رومي", grams: 60 },
{ foodName: "خيار", grams: 100 },
],
Lunch: [
{ foodName: "أرز أبيض", grams: 250 },
{ foodName: "لحم بقري", grams: 180 },
{ foodName: "ملوخية", grams: 150 },
],
Snacks: [
{ foodName: "زبادي", grams: 250 },
{ foodName: "لوز", grams: 30 },
{ foodName: "تفاح", grams: 150 },
],
Dinner: [
{ foodName: "مكرونة مسلوقة", grams: 200 },
{ foodName: "تونة", grams: 120 },
{ foodName: "سلطة بلدي", grams: 150 },
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
{ foodName: "جبنة شيدر", grams: 50 },
{ foodName: "زيت زيتون", grams: 15 },
],
Lunch: [
{ foodName: "فراخ مشوية", grams: 220 },
{ foodName: "سبانخ", grams: 150 },
{ foodName: "زبدة", grams: 20 },
],
Snacks: [
{ foodName: "لوز", grams: 30 },
{ foodName: "جوز", grams: 25 },
],
Dinner: [
{ foodName: "لحم بقري", grams: 170 },
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
{ foodName: "شوفان", grams: 120 },
{ foodName: "بيض مسلوق", grams: 200 },
{ foodName: "لبن كامل الدسم", grams: 400 },
{ foodName: "موز", grams: 180 },
],
Lunch: [
{ foodName: "أرز بني", grams: 300 },
{ foodName: "ديك رومي", grams: 250 },
{ foodName: "فاصوليا خضراء", grams: 150 },
],
Snacks: [
{ foodName: "زبادي يوناني", grams: 250 },
{ foodName: "فول سوداني", grams: 40 },
{ foodName: "عسل أسود", grams: 20 },
],
Dinner: [
{ foodName: "بطاطا حلوة", grams: 300 },
{ foodName: "سمك بلطي مشوي", grams: 250 },
{ foodName: "بروكلي", grams: 150 },
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
{ foodName: "بيض مسلوق", grams: 150 },
{ foodName: "توست بني", grams: 100 },
{ foodName: "خيار", grams: 150 },
],
Lunch: [
{ foodName: "صدر دجاج مشوي", grams: 300 },
{ foodName: "سلطة بلدي", grams: 250 },
{ foodName: "ليمون مخلل", grams: 20 },
],
Snacks: [
{ foodName: "جريب فروت", grams: 200 },
{ foodName: "زبادي", grams: 150 },
],
Dinner: [
{ foodName: "سمك بلطي مشوي", grams: 200 },
{ foodName: "سبانخ", grams: 150 },
{ foodName: "بروكلي", grams: 150 },
{ foodName: "زيت زيتون", grams: 5 },
],
},
},
{
id: "d8",
name: " تقليدي 2800 سعرة",
description: "نظام غذائي متكامل ومتوازن",
type: "maintenance",
meals: {
Breakfast: [
{ foodName: "فول مدمس", grams: 200 },
{ foodName: "طعمية (فلافل مصرية)", grams: 130 },
{ foodName: "خبز بلدي", grams: 140 },
{ foodName: "طحينة", grams: 20 },
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
id: "d11",
name: "ضخامة بدون دهون 3200 سعرة",
description: "زيادة عضلية نظيفة مع دهون متحكم بها",
type: "bulk",
meals: {
Breakfast: [
{ foodName: "شوفان", grams: 100 },
{ foodName: "بيض مسلوق", grams: 200 },
{ foodName: "لبن كامل الدسم", grams: 300 },
{ foodName: "موز", grams: 120 },
],
Lunch: [
{ foodName: "أرز بني", grams: 250 },
{ foodName: "صدر دجاج مشوي", grams: 250 },
{ foodName: "بروكلي", grams: 200 },
{ foodName: "زيت زيتون", grams: 10 },
],
Snacks: [
{ foodName: "زبادي يوناني", grams: 200 },
{ foodName: "لوز", grams: 30 },
{ foodName: "تمر", grams: 40 },
],
Dinner: [
{ foodName: "بطاطا حلوة", grams: 250 },
{ foodName: "سمك بلطي مشوي", grams: 250 },
{ foodName: "سلطة بلدي", grams: 150 },
{ foodName: "طحينة", grams: 20 },
],
},
},
{
id: "d12",
name: "ضخامة قوية 4000 سعرة",
description: "نظام عالي جداً بالسعرات لزيادة الوزن بسرعة",
type: "bulk",
meals: {
Breakfast: [
{ foodName: "بيض مسلوق", grams: 250 },
{ foodName: "فول مدمس", grams: 250 },
{ foodName: "خبز بلدي", grams: 200 },
{ foodName: "جبنة رومي", grams: 60 },
{ foodName: "زيت زيتون", grams: 15 },
],
Lunch: [
{ foodName: "أرز أبيض", grams: 350 },
{ foodName: "فراخ مشوية", grams: 300 },
{ foodName: "سلطة بلدي", grams: 200 },
{ foodName: "طحينة", grams: 30 },
],
Snacks: [
{ foodName: "زبادي يوناني", grams: 250 },
{ foodName: "فول سوداني", grams: 60 },
{ foodName: "موز", grams: 200 },
{ foodName: "عسل أسود", grams: 30 },
],
Dinner: [
{ foodName: "بطاطس مقلية", grams: 200 },
{ foodName: "كفتة", grams: 250 },
{ foodName: "خبز بلدي", grams: 120 },
{ foodName: "بابا غنوج", grams: 100 },
],
},
},
{
id: "d13",
name: "تنشيف عالي البروتين 1800 سعرة",
description: "نظام قطع مع بروتين مرتفع للحفاظ على العضلات",
type: "cut",
meals: {
Breakfast: [
{ foodName: "بيض مسلوق", grams: 200 },
{ foodName: "جبنة قريش", grams: 150 },
{ foodName: "خيار", grams: 150 },
],
Lunch: [
{ foodName: "صدر دجاج مشوي", grams: 280 },
{ foodName: "سلطة بلدي", grams: 250 },
{ foodName: "بروكلي", grams: 150 },
{ foodName: "زيت زيتون", grams: 5 },
],
Snacks: [
{ foodName: "تونة", grams: 120 },
{ foodName: "جزر", grams: 150 },
],
Dinner: [
{ foodName: "سمك بلطي مشوي", grams: 250 },
{ foodName: "سبانخ", grams: 150 },
{ foodName: "خس", grams: 100 },
],
},
},

{
id: "d16",
name: "بحر المتوسط 2200 سعرة",
description: "نظام غني بالخضروات والأسماك وزيت الزيتون",
type: "maintenance",
meals: {
Breakfast: [
{ foodName: "بيض مسلوق", grams: 150 },
{ foodName: "خبز بلدي", grams: 80 },
{ foodName: "زيت زيتون", grams: 10 },
{ foodName: "طماطم", grams: 150 },
],
Lunch: [
{ foodName: "سمك مشوي", grams: 250 },
{ foodName: "سلطة بلدي", grams: 200 },
{ foodName: "حمص", grams: 100 },
{ foodName: "ليمون", grams: 30 },
],
Snacks: [
{ foodName: "زبادي يوناني", grams: 150 },
{ foodName: "جوز", grams: 20 },
],
Dinner: [
{ foodName: "مكرونة مسلوقة", grams: 150 },
{ foodName: "خضار مشوي", grams: 250 },
{ foodName: "جبنة فيتا", grams: 50 },
],
},
},
{
id: "d17",
name: "رياضي عالي الكربوهيدرات 3500 سعرة",
description: "نظام غني بالكربوهيدرات للرياضيين",
type: "bulk",
meals: {
Breakfast: [
{ foodName: "شوفان", grams: 120 },
{ foodName: "موز", grams: 200 },
{ foodName: "لبن كامل الدسم", grams: 400 },
{ foodName: "عسل أسود", grams: 30 },
],
Lunch: [
{ foodName: "أرز أبيض", grams: 400 },
{ foodName: "فراخ مشوية", grams: 250 },
{ foodName: "فاصوليا خضراء", grams: 200 },
],
Snacks: [
{ foodName: "تمر", grams: 100 },
{ foodName: "لوز", grams: 30 },
{ foodName: "عصير برتقال", grams: 300 },
],
Dinner: [
{ foodName: "بطاطس مسلوقة", grams: 400 },
{ foodName: "سمك بلطي مشوي", grams: 250 },
{ foodName: "سلطة بلدي", grams: 150 },
{ foodName: "زيت زيتون", grams: 10 },
],
},
},
{
id: "d18",
name: "منخفض الكربوهيدرات 2000 سعرة",
description: "نظام قليل الكربوهيدرات معتدل البروتين",
type: "cut",
meals: {
Breakfast: [
{ foodName: "بيض مسلوق", grams: 200 },
{ foodName: "جبنة شيدر", grams: 40 },
{ foodName: "سبانخ", grams: 100 },
{ foodName: "زبدة", grams: 10 },
],
Lunch: [
{ foodName: "صدر دجاج مشوي", grams: 250 },
{ foodName: "بروكلي", grams: 200 },
{ foodName: "زيت زيتون", grams: 15 },
],
Snacks: [
{ foodName: "لوز", grams: 25 },
{ foodName: "خيار", grams: 200 },
],
Dinner: [
{ foodName: "سمك مشوي", grams: 250 },
{ foodName: "سلطة بلدي", grams: 200 },
{ foodName: "طحينة", grams: 20 },
],
},
},
{
id: "d19",
name: "رجيم رمضان 2500 سعرة",
description: "نظام مناسب لشهر رمضان موزع بين السحور والإفطار",
type: "maintenance",
meals: {
Breakfast: [
{ foodName: "فول مدمس", grams: 200 },
{ foodName: "زبادي", grams: 200 },
{ foodName: "خبز بلدي", grams: 100 },
{ foodName: "جبنة بيضاء (دمياطي)", grams: 50 },
{ foodName: "خيار", grams: 100 },
],
Lunch: [
{ foodName: "تمر", grams: 60 },
{ foodName: "شوربة عدس", grams: 250 },
{ foodName: "أرز أبيض", grams: 200 },
{ foodName: "فراخ مشوية", grams: 200 },
{ foodName: "سلطة بلدي", grams: 150 },
],
Snacks: [
{ foodName: "قطايف", grams: 100 },
{ foodName: "لوز", grams: 15 },
],
Dinner: [
{ foodName: "محشي ورق عنب", grams: 200 },
{ foodName: "زبادي", grams: 150 },
{ foodName: "سلطة بلدي", grams: 100 },
],
},
},
{
id: "d20",
name: "نظام الطالب الاقتصادي 2200 سعرة",
description: "نظام غذائي متوازن بأطعمة اقتصادية",
type: "maintenance",
meals: {
Breakfast: [
{ foodName: "فول مدمس", grams: 200 },
{ foodName: "خبز بلدي", grams: 150 },
{ foodName: "بيض مسلوق", grams: 100 },
],
Lunch: [
{ foodName: "كشري", grams: 350 },
{ foodName: "سلطة بلدي", grams: 150 },
],
Snacks: [
{ foodName: "ترمس", grams: 100 },
{ foodName: "تفاح", grams: 150 },
],
Dinner: [
{ foodName: "مكرونة مسلوقة", grams: 200 },
{ foodName: "تونة", grams: 100 },
{ foodName: "صلصة طماطم", grams: 50 },
],
},
},
{
id: "d21",
name: "عضلات مبتدئ 2800 سعرة",
description: "نظام لتضخيم بسيط للمبتدئين في بناء العضلات",
type: "bulk",
meals: {
Breakfast: [
{ foodName: "بيض مسلوق", grams: 200 },
{ foodName: "شوفان", grams: 80 },
{ foodName: "لبن كامل الدسم", grams: 300 },
{ foodName: "موز", grams: 150 },
],
Lunch: [
{ foodName: "أرز أبيض", grams: 250 },
{ foodName: "فراخ مشوية", grams: 250 },
{ foodName: "سلطة بلدي", grams: 150 },
],
Snacks: [
{ foodName: "زبادي يوناني", grams: 200 },
{ foodName: "فول سوداني", grams: 30 },
{ foodName: "تفاح", grams: 100 },
],
Dinner: [
{ foodName: "بطاطس مسلوقة", grams: 250 },
{ foodName: "لحم بقري", grams: 150 },
{ foodName: "بروكلي", grams: 150 },
],
},
},
{
id: "d22",
name: "تخسيس مبتدئ 1700 سعرة",
description: "نظام لتخسيس مناسب للمبتدئين",
type: "cut",
meals: {
Breakfast: [
{ foodName: "بيض مسلوق", grams: 150 },
{ foodName: "توست بني", grams: 80 },
{ foodName: "خيار", grams: 150 },
],
Lunch: [
{ foodName: "صدر دجاج مشوي", grams: 220 },
{ foodName: "سلطة بلدي", grams: 250 },
{ foodName: "بروكلي", grams: 150 },
],
Snacks: [
{ foodName: "تفاح", grams: 200 },
{ foodName: "جزر", grams: 150 },
],
Dinner: [
{ foodName: "سمك بلطي مشوي", grams: 200 },
{ foodName: "سبانخ", grams: 150 },
{ foodName: "خبز بلدي", grams: 50 },
{ foodName: "زيت زيتون", grams: 5 },
],
},
},
];

export const EXERCISE_TEMPLATES: ExerciseTemplate[] = [
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
id: "e9",
name: "Push/Pull/Legs 6 أيام",
description: "PPL مزدوج لستة أيام تدريب في الأسبوع",
daysPerWeek: 6,
difficulty: "advanced",
days: [
{
dayName: "Push 1",
exercises: [
{ name: "بنش برس", weight: 85 },
{ name: "دمبل برس مائل", weight: 35 },
{ name: "كبل كروس", weight: 25 },
{ name: "كتف جانبي دمبل", weight: 12 },
],
},
{
dayName: "Pull 1",
exercises: [
{ name: "سحب أرضي", weight: 105 },
{ name: "عقلة", weight: 0 },
{ name: "سحب كيبل", weight: 65 },
{ name: "بايسبس بار", weight: 25 },
],
},
{
dayName: "Legs 1",
exercises: [
{ name: "سكوات", weight: 115 },
{ name: "ضغط أرجل", weight: 160 },
{ name: "تمديد أرجل", weight: 55 },
{ name: "رفع سمانة", weight: 70 },
],
},
{
dayName: "Push 2",
exercises: [
{ name: "ضغط كتف بار", weight: 55 },
{ name: "دمبل برس مستوي", weight: 40 },
{ name: "ترايسبس كيبل", weight: 30 },
{ name: "رفرفة جانبية", weight: 12 },
],
},
{
dayName: "Pull 2",
exercises: [
{ name: "سحب دمبل", weight: 45 },
{ name: "سحب كيبل أمامي", weight: 60 },
{ name: "بايسبس دمبل", weight: 15 },
{ name: "رفرفة خلفية", weight: 10 },
],
},
{
dayName: "Legs 2",
exercises: [
{ name: "فرونت سكوات", weight: 80 },
{ name: "هاك سكوات", weight: 90 },
{ name: "سمانة جالسة", weight: 50 },
{ name: "لانج بالمشي", weight: 20 },
],
},
],
},
{
id: "e10",
name: "برو سبلت 5 أيام",
description: "صدر، ظهر، أكتاف، أرجل، أذرع - كل يوم مجموعة",
daysPerWeek: 5,
difficulty: "intermediate",
days: [
{
dayName: "صدر",
exercises: [
{ name: "بنش برس", weight: 75 },
{ name: "دمبل فلاي", weight: 18 },
{ name: "كبل كروس", weight: 25 },
{ name: "ضغط دمبل مائل", weight: 32 },
],
},
{
dayName: "ظهر",
exercises: [
{ name: "عقلة", weight: 0 },
{ name: "سحب أرضي", weight: 85 },
{ name: "سحب كيبل", weight: 55 },
{ name: "سحب دمبل", weight: 35 },
],
},
{
dayName: "أكتاف",
exercises: [
{ name: "ضغط كتف بار", weight: 45 },
{ name: "رفرفة جانبية", weight: 12 },
{ name: "رفرفة خلفية", weight: 10 },
{ name: "شولدر بريس دمبل", weight: 30 },
],
},
{
dayName: "أرجل",
exercises: [
{ name: "سكوات", weight: 95 },
{ name: "ضغط أرجل", weight: 130 },
{ name: "هاك سكوات", weight: 70 },
{ name: "تمديد أرجل", weight: 45 },
],
},
{
dayName: "أذرع",
exercises: [
{ name: "بايسبس بار", weight: 25 },
{ name: "ترايسبس كيبل", weight: 30 },
{ name: "دمبل بايسبس", weight: 14 },
{ name: "ترايسبس فرنسي", weight: 22 },
],
},
],
},
{
id: "e11",
name: "أرنولد سبلت 6 أيام",
description: "صدر/ظهر، أكتاف/ذراع، أرجل مكرر مرتين أسبوعياً",
daysPerWeek: 6,
difficulty: "advanced",
days: [
{
dayName: "صدر وظهر 1",
exercises: [
{ name: "بنش برس", weight: 80 },
{ name: "عقلة", weight: 0 },
{ name: "دمبل فلاي", weight: 20 },
{ name: "سحب دمبل", weight: 40 },
],
},
{
dayName: "أكتاف وذراع 1",
exercises: [
{ name: "ضغط كتف بار", weight: 50 },
{ name: "بايسبس بار", weight: 25 },
{ name: "ترايسبس كيبل", weight: 35 },
{ name: "رفرفة جانبية", weight: 12 },
],
},
{
dayName: "أرجل 1",
exercises: [
{ name: "سكوات", weight: 110 },
{ name: "ضغط أرجل", weight: 150 },
{ name: "هاك سكوات", weight: 80 },
{ name: "سمانة", weight: 60 },
],
},
{
dayName: "صدر وظهر 2",
exercises: [
{ name: "ضغط دمبل مائل", weight: 35 },
{ name: "سحب كيبل", weight: 60 },
{ name: "كبل كروس", weight: 25 },
{ name: "سحب أرضي", weight: 100 },
],
},
{
dayName: "أكتاف وذراع 2",
exercises: [
{ name: "شولدر بريس", weight: 35 },
{ name: "دمبل بايسبس", weight: 15 },
{ name: "ترايسبس فرنسي", weight: 25 },
{ name: "رفرفة خلفية", weight: 10 },
],
},
{
dayName: "أرجل 2",
exercises: [
{ name: "فرونت سكوات", weight: 80 },
{ name: "تمديد أرجل", weight: 50 },
{ name: "لانج", weight: 40 },
{ name: "رفع سمانة", weight: 70 },
],
},
],
},
{
id: "e12",
name: "Upper/Lower 6 أيام",
description: "جزء علوي وسفلي بالتناوب لستة أيام",
daysPerWeek: 6,
difficulty: "advanced",
days: [
{
dayName: "Upper 1",
exercises: [
{ name: "بنش برس", weight: 85 },
{ name: "عقلة", weight: 0 },
{ name: "ضغط كتف دمبل", weight: 30 },
{ name: "سحب كيبل", weight: 60 },
{ name: "بايسبس دمبل", weight: 14 },
],
},
{
dayName: "Lower 1",
exercises: [
{ name: "سكوات", weight: 110 },
{ name: "رفعة ميتة", weight: 100 },
{ name: "تمديد أرجل", weight: 55 },
{ name: "سمانة", weight: 70 },
],
},
{
dayName: "Upper 2",
exercises: [
{ name: "دمبل برس مائل", weight: 35 },
{ name: "سحب دمبل", weight: 40 },
{ name: "كتف جانبي", weight: 12 },
{ name: "ترايسبس كيبل", weight: 30 },
{ name: "بايسبس بار", weight: 25 },
],
},
{
dayName: "Lower 2",
exercises: [
{ name: "فرونت سكوات", weight: 75 },
{ name: "ضغط أرجل", weight: 140 },
{ name: "هاك سكوات", weight: 70 },
{ name: "رفع سمانة جالسة", weight: 50 },
],
},
{
dayName: "Upper 3",
exercises: [
{ name: "بنش برس", weight: 80 },
{ name: "عقلة", weight: 0 },
{ name: "رفرفة خلفية", weight: 10 },
{ name: "كبل كروس", weight: 25 },
{ name: "دمبل بايسبس", weight: 15 },
],
},
{
dayName: "Lower 3",
exercises: [
{ name: "سكوات", weight: 100 },
{ name: "رفعة ميتة رومانية", weight: 90 },
{ name: "لانج", weight: 40 },
{ name: "سمانة واقفة", weight: 60 },
],
},
],
},
{
id: "e13",
name: "جسم كامل يومين",
description: "تمارين جسم كامل مرتين في الأسبوع للأشغال المحدودة",
daysPerWeek: 2,
difficulty: "beginner",
days: [
{
dayName: "يوم ١",
exercises: [
{ name: "سكوات", weight: 50 },
{ name: "بنش برس", weight: 40 },
{ name: "سحب أرضي", weight: 60 },
{ name: "ضغط كتف بار", weight: 30 },
{ name: "عقلة", weight: 0 },
{ name: "بطن", weight: 0 },
],
},
{
dayName: "يوم ٢",
exercises: [
{ name: "سكوات أمامي", weight: 40 },
{ name: "دمبل برس", weight: 25 },
{ name: "سحب كيبل", weight: 45 },
{ name: "تمديد أرجل", weight: 35 },
{ name: "بايسبس بار", weight: 20 },
{ name: "بلانك", weight: 0 },
],
},
],
},
{
id: "e14",
name: "تمارين منزلية بالأثقال",
description: "برنامج بالدمبلز فقط يمكن تنفيذه في المنزل",
daysPerWeek: 4,
difficulty: "beginner",
days: [
{
dayName: "علوي 1",
exercises: [
{ name: "دمبل برس", weight: 20 },
{ name: "سحب دمبل", weight: 20 },
{ name: "كتف جانبي", weight: 8 },
{ name: "بايسبس دمبل", weight: 10 },
],
},
{
dayName: "سفلي 1",
exercises: [
{ name: "سكوات بدمبل", weight: 30 },
{ name: "رفعة ميتة بدمبل", weight: 30 },
{ name: "لانج", weight: 16 },
{ name: "سمانة بدمبل", weight: 20 },
],
},
{
dayName: "علوي 2",
exercises: [
{ name: "ضغط كتف دمبل", weight: 16 },
{ name: "تجديف دمبل", weight: 22 },
{ name: "ترايسبس خلف الرأس", weight: 12 },
{ name: "رفرفة أمامية", weight: 8 },
],
},
{
dayName: "سفلي 2",
exercises: [
{ name: "جوبلت سكوات", weight: 24 },
{ name: "ضغط أرجل بدمبل", weight: 30 },
{ name: "لانج جانبي", weight: 14 },
{ name: "جسر أرضي بدمبل", weight: 30 },
],
},
],
},
{
id: "e15",
name: "تمارين مقاومة بالأشرطة",
description: "برنامج باستخدام أشرطة المقاومة فقط",
daysPerWeek: 3,
difficulty: "beginner",
days: [
{
dayName: "كامل 1",
exercises: [
{ name: "سكوات بشريط", weight: 0 },
{ name: "ضغط صدر بشريط", weight: 0 },
{ name: "سحب شريط أفقي", weight: 0 },
{ name: "بايسبس بشريط", weight: 0 },
],
},
{
dayName: "كامل 2",
exercises: [
{ name: "رفعة ميتة بشريط", weight: 0 },
{ name: "كتف جانبي بشريط", weight: 0 },
{ name: "ترايسبس بشريط", weight: 0 },
{ name: "سحب شريط عالي", weight: 0 },
],
},
{
dayName: "كامل 3",
exercises: [
{ name: "لانج بشريط", weight: 0 },
{ name: "رفرفة خلفية بشريط", weight: 0 },
{ name: "ضغط أرجل بشريط", weight: 0 },
{ name: "بطن بشريط", weight: 0 },
],
},
],
},
{
id: "e16",
name: "تمارين وزن الجسم المتقدمة",
description: "تمارين كاليستينكس متوسطة إلى متقدمة",
daysPerWeek: 4,
difficulty: "intermediate",
days: [
{
dayName: "دفع",
exercises: [
{ name: "ضغط مائل", weight: 0 },
{ name: "متوازي", weight: 0 },
{ name: "ضغط الماس", weight: 0 },
{ name: "بلانك ديناميكي", weight: 0 },
],
},
{
dayName: "سحب",
exercises: [
{ name: "عقلة", weight: 0 },
{ name: "سحب أسترالي", weight: 0 },
{ name: "عقلة سلبية", weight: 0 },
{ name: "سحب بالأرض", weight: 0 },
],
},
{
dayName: "أرجل",
exercises: [
{ name: "سكوات هواء", weight: 0 },
{ name: "لانج", weight: 0 },
{ name: "جسر أرضي", weight: 0 },
{ name: "سمانة واقفة", weight: 0 },
],
},
{
dayName: "كامل",
exercises: [
{ name: "متسلق جبال", weight: 0 },
{ name: "قفز سكوات", weight: 0 },
{ name: "ضغط بايك", weight: 0 },
{ name: "بطن رفع رجلين", weight: 0 },
],
},
],
},
{
id: "e17",
name: "برنامج قوة متقدم",
description: "تركيز على القوة القصوى بالتمارين المركبة",
daysPerWeek: 4,
difficulty: "advanced",
days: [
{
dayName: "سكوات وملحقات",
exercises: [
{ name: "سكوات", weight: 120 },
{ name: "رفعة ميتة رومانية", weight: 100 },
{ name: "ضغط أرجل", weight: 180 },
{ name: "سمانة", weight: 80 },
],
},
{
dayName: "بنش وملحقات",
exercises: [
{ name: "بنش برس", weight: 90 },
{ name: "ضغط كتف بار", weight: 60 },
{ name: "دمبل برس مائل", weight: 40 },
{ name: "ترايسبس كيبل", weight: 35 },
],
},
{
dayName: "سحب أرضي وملحقات",
exercises: [
{ name: "سحب أرضي", weight: 130 },
{ name: "عقلة بأوزان", weight: 10 },
{ name: "سحب كيبل", weight: 70 },
{ name: "بايسبس بار", weight: 30 },
],
},
{
dayName: "يوم مساعد",
exercises: [
{ name: "فرونت سكوات", weight: 85 },
{ name: "هايبر إكستنشن", weight: 20 },
{ name: "رفرفة جانبية", weight: 14 },
{ name: "قبضة قوية", weight: 0 },
],
},
],
},
{
id: "e18",
name: "باوربيلدنج",
description: "دمج القوة والتضخيم: تمارين مركبة ثقيلة + حجم",
daysPerWeek: 5,
difficulty: "advanced",
days: [
{
dayName: "صدر وترايسبس قوة",
exercises: [
{ name: "بنش برس", weight: 95 },
{ name: "ترايسبس كيبل", weight: 35 },
{ name: "دمبل برس مائل", weight: 45 },
{ name: "ضغط قريب", weight: 60 },
],
},
{
dayName: "ظهر وبايسبس قوة",
exercises: [
{ name: "سحب أرضي", weight: 140 },
{ name: "بايسبس بار", weight: 30 },
{ name: "سحب دمبل", weight: 45 },
{ name: "عقلة", weight: 0 },
],
},
{
dayName: "أرجل قوة",
exercises: [
{ name: "سكوات", weight: 130 },
{ name: "ضغط أرجل", weight: 200 },
{ name: "هاك سكوات", weight: 90 },
{ name: "سمانة", weight: 80 },
],
},
{
dayName: "تضخيم علوي",
exercises: [
{ name: "دمبل فلاي", weight: 22 },
{ name: "سحب كيبل", weight: 65 },
{ name: "كتف جانبي", weight: 14 },
{ name: "دمبل بايسبس", weight: 16 },
],
},
{
dayName: "تضخيم أرجل وكتف",
exercises: [
{ name: "تمديد أرجل", weight: 55 },
{ name: "لانج", weight: 45 },
{ name: "ضغط كتف بار", weight: 55 },
{ name: "رفرفة خلفية", weight: 12 },
],
},
],
},
{
id: "e19",
name: "لياقة نسائية شاملة",
description: "برنامج متوازن لتحسين اللياقة والقوام",
daysPerWeek: 4,
difficulty: "beginner",
days: [
{
dayName: "جسم كامل 1",
exercises: [
{ name: "سكوات بدمبل", weight: 20 },
{ name: "بنش برس بدمبل", weight: 14 },
{ name: "سحب كيبل", weight: 30 },
{ name: "كتف جانبي", weight: 6 },
{ name: "بطن", weight: 0 },
],
},
{
dayName: "جسم كامل 2",
exercises: [
{ name: "رفعة ميتة بدمبل", weight: 24 },
{ name: "ضغط كتف بدمبل", weight: 12 },
{ name: "تجديف دمبل", weight: 16 },
{ name: "لانج", weight: 12 },
{ name: "جسر أرضي", weight: 0 },
],
},
{
dayName: "جسم كامل 3",
exercises: [
{ name: "جوبلت سكوات", weight: 18 },
{ name: "ترايسبس كيبل", weight: 15 },
{ name: "بايسبس بار", weight: 12 },
{ name: "رفرفة خلفية", weight: 6 },
{ name: "بلانك", weight: 0 },
],
},
{
dayName: "كارديو ومقاومة",
exercises: [
{ name: "سكوات قفز", weight: 0 },
{ name: "ضغط مائل", weight: 0 },
{ name: "متسلق جبال", weight: 0 },
{ name: "سوينج كيتلبل", weight: 16 },
],
},
],
},
{
id: "e20",
name: "دائرة حرق دهون",
description: "دائرة عالية الكثافة للحرق ورفع اللياقة",
daysPerWeek: 3,
difficulty: "intermediate",
days: [
{
dayName: "دائرة 1",
exercises: [
{ name: "سكوات قفز", weight: 0 },
{ name: "ضغط", weight: 0 },
{ name: "لانج قفز", weight: 0 },
{ name: "بطن دراجة", weight: 0 },
{ name: "قفز حبل", weight: 0 },
],
},
{
dayName: "دائرة 2",
exercises: [
{ name: "سوينج كيتلبل", weight: 20 },
{ name: "دمبل برس", weight: 16 },
{ name: "متسلق جبال", weight: 0 },
{ name: "بربي", weight: 0 },
{ name: "بلانك ديناميكي", weight: 0 },
],
},
{
dayName: "دائرة 3",
exercises: [
{ name: "قفز على صندوق", weight: 0 },
{ name: "رفعة ميتة بدمبل", weight: 24 },
{ name: "سحب دمبل", weight: 18 },
{ name: "اندفاع جانبي", weight: 0 },
{ name: "جسر أرضي", weight: 0 },
],
},
],
},
{
id: "e21",
name: "تمارين كبار السن",
description: "تمارين منخفضة التأثير للحفاظ على القوة والتوازن",
daysPerWeek: 2,
difficulty: "beginner",
days: [
{
dayName: "جلوس ووقوف",
exercises: [
{ name: "سكوات على كرسي", weight: 0 },
{ name: "ضغط جدار", weight: 0 },
{ name: "سحب شريط منخفض", weight: 0 },
{ name: "رفع ساق جانبي", weight: 0 },
],
},
{
dayName: "مرونة وقوة",
exercises: [
{ name: "تمديد أرجل خفيف", weight: 10 },
{ name: "دمبل كتف جانبي", weight: 4 },
{ name: "ثني بايسبس بدمبل", weight: 6 },
{ name: "توازن ساق واحدة", weight: 0 },
],
},
],
},
{
id: "e22",
name: "أداء رياضي",
description: "برنامج لتطوير القوة الانفجارية والسرعة والرشاقة",
daysPerWeek: 4,
difficulty: "advanced",
days: [
{
dayName: "قوة انفجارية",
exercises: [
{ name: "كلين", weight: 60 },
{ name: "سكوات قفز", weight: 0 },
{ name: "ضغط دفع", weight: 40 },
{ name: "قفز صندوق", weight: 0 },
],
},
{
dayName: "قوة علوية",
exercises: [
{ name: "بنش برس", weight: 90 },
{ name: "عقلة", weight: 0 },
{ name: "ضغط كتف بار", weight: 55 },
{ name: "سحب أرضي", weight: 110 },
],
},
{
dayName: "سرعة ورشاقة",
exercises: [
{ name: "سبرينت 30م", weight: 0 },
{ name: "سلالم رشاقة", weight: 0 },
{ name: "قفز جانبي", weight: 0 },
{ name: "جري مكوكي", weight: 0 },
],
},
{
dayName: "قوة سفلى",
exercises: [
{ name: "سكوات أمامي", weight: 90 },
{ name: "رفعة ميتة رومانية", weight: 95 },
{ name: "لانج مع دمبل", weight: 40 },
{ name: "سمانة واقفة", weight: 70 },
],
},
],
},
];

