import React, { useState, useMemo, useEffect } from "react";
import foods from "../../assets/FoodsList.json";
import { FaArrowLeft, FaCaretRight, FaSearch, FaTimes } from "react-icons/fa";
import { IoClose, IoDiamond } from "react-icons/io5";
import { BsSave } from "react-icons/bs";
import { GiFruitBowl } from "react-icons/gi";
import { BiInfoCircle } from "react-icons/bi";

interface UnitOption {
  label: string;
  grams: number | null;
}
interface AdditionPageProps{
  Meal: any;
  onClose: () => void;   // onClose is a function with no arguments, returns void
}
const UNIT_OPTIONS: UnitOption[] = [
  { label: "طبق صغير", grams: 100 },
  { label: "طبق وسط ", grams: 200 },
  { label: "طبق كبير ", grams: 300 },
  { label: "قطعة ", grams: 150 },
  { label: "حبة ", grams: 10 },
  { label: "ثلاث حبات", grams: 30 },
  { label: "سبع حبات", grams: 70 },
  { label: "بيضتان", grams: 100 },
  { label: "خمس بيضات", grams: 250 },
  { label: "سبع بيضات", grams: 350 },
  { label: "كوب ", grams: 200 },
  { label: "ملعقة كبيرة )", grams: 15 },
  { label: "غرام (أدخل كمية معينة)", grams: null },
];

const AdditionPage = ({ Meal, onClose }: AdditionPageProps) => {
  const [text, setText] = useState("");
  const [FoodArray, setFoodArray] = useState<string[]>([]);
  const [FoodInfo, setFoodInfo] = useState<any[]>([]);

  const [IsActive, setIsActive] = useState(false);

  useEffect(() => {
    const encoded = localStorage.getItem("foods____");
    if (encoded) {
      try {
        const decoded = JSON.parse(atob(encoded));
        const period = decoded.SubscriptionPeriod;
        if (period && period > Date.now()) {
          setIsActive(true);
          return;
        }
      } catch (e) {
        console.error("Invalid subscription data");
      }
    }
  }, []);

  const [showUnitModal, setShowUnitModal] = useState(false);
  const [selectedFoodName, setSelectedFoodName] = useState("");
  const [customGrams, setCustomGrams] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  // ✅ Totals now correctly reflect actual fat/carb grams
  const totals = useMemo(() => {
    const mealFoods = FoodInfo.filter(
      (entry: any) => entry[0] === Meal
    );
    const cal = mealFoods.reduce((sum: number, entry: any) => sum + entry[3], 0);
    const prot = mealFoods.reduce((sum: number, entry: any) => sum + entry[4], 0);
    const Fat = mealFoods.reduce((sum: number, entry: any) => sum + entry[5], 0);
    const Carb = mealFoods.reduce((sum: number, entry: any) => sum + entry[6], 0);

    const vitaminsSet = new Set<string>();
    mealFoods.forEach((entry: any) => {
      const food = foods.find((f) => f.FoodName === entry[1]);
      if (food) {
        food.MostVitamens.forEach((vit: string) => {
          if (vit) vitaminsSet.add(vit);
        });
      }
    });
    return { cal, prot, vitamins: Array.from(vitaminsSet), Fat, Carb };
  }, [FoodInfo, Meal]);

  const filteredFoods = useMemo(() => {
    if (!text.trim()) return [];
    return foods
      .map((f) => f.FoodName)
      .filter((name) => name.toLowerCase().includes(text.toLowerCase()));
  }, [text]);

  const handleSelectUnit = (unit: UnitOption) => {
    if (unit.grams !== null) {
      addFoodWithGrams(selectedFoodName, unit.grams);
      setShowUnitModal(false);
    } else {
      return; // wait for custom input
    }
  };

  const handleCustomGramsSubmit = () => {
    const g = parseFloat(customGrams);
    if (isNaN(g) || g <= 0) {
      alert("الرجاء إدخال كمية صحيحة");
      return;
    }
    addFoodWithGrams(selectedFoodName, g);
    setShowUnitModal(false);
    setCustomGrams("");
  };

  // ✅ CORRECTED: store actual fat & carb (not per‑kilo)
  const addFoodWithGrams = (foodName: string, grams: number) => {
    if (FoodArray.includes(foodName)) {
      alert(`${foodName} مضاف بالفعل`);
      return;
    }

    const foodData = foods.find((f) => f.FoodName === foodName);
    if (!foodData) return;

    const calPerKilo = Number(foodData.calForOneKilo);
    const protPerKilo = Number(foodData.ProtineForOneKilo);
    const fatPerKilo = Number(foodData.FatForOneKilo);
    const carbPerKilo = Number(foodData.CarbForOneKilo);

    const cal = (calPerKilo * grams) / 1000;
    const prot = (protPerKilo * grams) / 1000;
    const fat = (fatPerKilo * grams) / 1000;
    const carb = (carbPerKilo * grams) / 1000;

    setFoodArray((prev) => [...prev, foodName]);
    setFoodInfo((prev: any) => [
      ...prev,
      [Meal, foodName, grams, cal, prot, fat, carb],
    ]);
  };

  const handleAddClick = (food: string) => {
    const getData = JSON.parse(localStorage.getItem("Diet") || "{}");
    const mealData = getData[Meal] || [[], []];
    if (FoodArray.includes(food) || mealData[0].includes(food)) {
      alert(`${food} مضاف بالفعل`);
      return;
    }
    setSelectedFoodName(food);
    setCustomGrams("");
    setShowUnitModal(true);
  };

  const confirmDelete = (index: number) => {
    setDeleteIndex(index);
    setShowDeleteConfirm(true);
  };

  const deleteFood = () => {
    if (deleteIndex === null) return;
    const foodName = FoodArray[deleteIndex];
    const newFoodInfo = [...FoodInfo];
    const idxToRemove = newFoodInfo.findIndex(
      (entry: any) => entry[0] === Meal && entry[1] === foodName
    );
    if (idxToRemove !== -1) newFoodInfo.splice(idxToRemove, 1);

    setFoodArray((prev) => prev.filter((_, i) => i !== deleteIndex));
    setFoodInfo(newFoodInfo);
    setShowDeleteConfirm(false);
    setDeleteIndex(null);
  };

  const handleGetInfo = (food: string) => {
    const f = foods.find((item) => item.FoodName === food);
    if (f) {
      alert(
        `${food}:\nالسعرات: ${f.calForOneKilo} كيلو كالوري/كغم\nالبروتين: ${f.ProtineForOneKilo} غ/كغم\nالفيتامينات: ${f.MostVitamens.join(", ")}`
      );
    }
  };

  const handleSave = () => {
    const getData = JSON.parse(localStorage.getItem("Diet") || "{}");
    const mealData = getData[Meal] || [[], []];

    const updatedFoods = [...new Set([...mealData[0], ...FoodArray])];
    const updatedInfo = [
      totals.cal + (mealData[1][0] || 0),
      totals.prot + (mealData[1][1] || 0),
      totals.Fat + (mealData[1][2] || 0),
      totals.Carb + (mealData[1][3] || 0),
      [...new Set([...totals.vitamins, ...(mealData[1][4] || [])])],  // ✅ index 4 for vitamins
    ];

    const newData = {
      ...getData,
      [Meal]: [updatedFoods, updatedInfo],
    };
    localStorage.setItem("Diet", JSON.stringify(newData));

    // ✅ Preserve existing FoodInfo_s instead of overwriting
    const existingFoodInfo = JSON.parse(
      localStorage.getItem("FoodInfo_s") || "[]"
    );
    const mergedFoodInfo = [...existingFoodInfo, ...FoodInfo];
    localStorage.setItem("FoodInfo_s", JSON.stringify(mergedFoodInfo));

    onClose();
  };

  return (
    <div className="fixed show-first top-0 left-0 w-screen h-screen flex flex-col bg-gray-100 dark:bg-[#111111] z-50 overflow-y-scroll">
      {/* Header */}
        <div className="mt-5 flex items-center justify-between dark:text-white ">
          <button
            onClick={onClose}
            className=" hover:bg-white/20 p-2 rounded-full transition"
          >
            <FaCaretRight size={20}/>
          </button>
          <div className="relative  text-xl font-bold flex flex-col items-center -gap-2">
            إضافة أطباق
            <div className="w-5 h-[3px] bg-orange-500 rounded-4xl"></div>
          </div>
          <div className="w-8" />
      </div>

      {/* Search */}
      <div className="px-4 mt-6 z-10">
        <div className="bg-white/70 backdrop-blur-lg border border-white/60 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 shadow-xl rounded-2xl p-4">
          <div className="relative">
            <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoFocus
              placeholder="ابحث عن طبق مثلا: فول سوداني..."
              className="w-full bg-gray-50 border-2 border-gray-200 outline-2 outline-amber-200 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 dark:text-white text-black rounded-b-4xl rounded-xl py-3 pr-10 pl-4 outline-none focus:ring-2 focus:ring-orange-400 transition"
            />
          </div>

          {text.trim() !== "" && (
            <div className="mt-3 max-h-52 overflow-y-auto space-y-1">
              {filteredFoods.length > 0 ? (
                filteredFoods.map((food, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 hover:bg-orange-50 rounded-xl transition cursor-pointer group"
                  >
                    <span
                      className="flex-1 font-medium text-gray-700 dark:text-white group-hover:text-orange-700"
                      onClick={() => handleAddClick(food)}
                    >
                      {food}
                    </span>
                    <button
                      onClick={() => handleGetInfo(food)}
                      className="p-1.5 bg-white rounded-full dark:bg-black/20 dark:border-2 dark:border-gray-600/20 dark:text-white text-black shadow-sm hover:bg-orange-100 transition"
                    >
                      <BiInfoCircle className="text-gray-500 group-hover:text-orange-600" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 py-4">لا توجد نتائج</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Added foods */}
      <div className="px-4 mt-5">
        <div className="bg-white/70 backdrop-blur-lg dark:bg-black/20 shadow-xl rounded-2xl p-4">
          <h2 className="text-lg font-bold text-gray-700 dark:text-white mb-3 flex items-center gap-2">
            <GiFruitBowl className="text-orange-500" />
            الطعام المُضاف
          </h2>

          {FoodArray.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              لم تضف أي طعام بعد
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {FoodArray.map((food, idx) => (
                <div
                  key={idx}
                  className="group relative flex items-center gap-2 bg-white/70 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 border border-orange-100 rounded-xl px-3 py-2 shadow-sm hover:shadow-md transition"
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-white">
                    {food}
                  </span>
                  <button
                    onClick={() => confirmDelete(idx)}
                    className="p-0.5 rounded-full bg-white/80 hover:bg-red-100 text-gray-400 hover:text-red-500 transition"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Nutrition summary */}
      <div className="px-4 mt-5">
        <div className="backdrop-blur-lg shadow-xl rounded-2xl p-4">
          <h2 className="text-lg font-bold dark:text-white text-gray-700 mb-3 flex items-center gap-2">
            <BiInfoCircle className="text-orange-500" />
            المعلومات الغذائية
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3">
              <div className="text-xs text-orange-600 mb-1">السعرات</div>
              <div className="text-xl font-bold text-orange-700">
                {totals.cal.toFixed(0)}
              </div>
            </div>
            <div className="rounded-xl p-3">
              <div className="text-xs text-teal-600 mb-1">بروتين</div>
              <div className="text-xl font-bold text-teal-700">
                {totals.prot.toFixed(1)} غ
              </div>
            </div>
            <div className="rounded-xl p-3">
              <div className="text-xs text-blue-700 mb-1">الدهون</div>
              <div className="text-xl font-bold text-blue-700">
                {totals.Fat.toFixed(1)} غ
              </div>
            </div>
            <div className="rounded-xl p-3">
              <div className="text-xs text-amber-600 mb-1">كاربهايدريت</div>
              <div className="text-xl font-bold text-amber-700">
                {totals.Carb.toFixed(1)} غ
              </div>
            </div>
          </div>

          {totals.vitamins.length > 0 && (
            <div className="mt-3 rounded-xl p-3">
              <div className="text-xs text-purple-600 mb-1">
                الفيتامينات و المعادن
              </div>
              <div className="flex flex-wrap gap-1">
                {IsActive
                  ? totals.vitamins.map((vit, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-white rounded-full text-xs font-medium text-purple-700"
                      >
                        {vit}
                      </span>
                    ))
                  : totals.vitamins.map((i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-white rounded-full text-xs font-medium text-purple-700"
                      >
                        VIP <IoDiamond />
                      </span>
                    ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save button */}
      <div className="px-4 mt-8 pb-8">
        <button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl active:scale-95 transition flex items-center justify-center gap-2"
        >
          <BsSave size={20} />
          حفظ وإضافة للوجبة
        </button>
      </div>

      {/* Unit Selector Modal */}
      {showUnitModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white backdrop-blur-md border border-white/50 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 shadow-2xl rounded-3xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                اختر الكمية لـ {selectedFoodName}
              </h3>
              <button
                onClick={() => setShowUnitModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <IoClose size={24} />
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-scroll">
              {UNIT_OPTIONS.filter((u) => u.grams !== null).map((unit, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectUnit(unit)}
                  className="w-full flex items-center justify-between bg-orange-50 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 border border-orange-100 p-3 rounded-xl hover:shadow-md active:scale-[0.98] transition"
                >
                  <span className="font-medium text-gray-700 dark:text-white">
                    {unit.label}
                  </span>
                  <span className="text-sm text-orange-600">{unit.grams}غ</span>
                </button>
              ))}

              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="الكمية بالغرام"
                    value={customGrams}
                    onChange={(e) => setCustomGrams(e.target.value)}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-400"
                    onKeyDown={(e) => e.key === "Enter" && handleCustomGramsSubmit()}
                  />
                  <button
                    onClick={handleCustomGramsSubmit}
                    className="bg-orange-500 text-white p-3 rounded-xl hover:bg-orange-600 transition"
                  >
                    تم
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white/40 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 backdrop-blur-md border border-white/50 shadow-2xl rounded-3xl p-6 w-full max-w-sm animate-scaleIn text-center">
            <h3 className="text-lg font-bold dark:text-white text-gray-800 mb-2">
              إزالة الطعام
            </h3>
            <p className="text-gray-600 mb-4">
              هل أنت متأكد من إزالة هذا العنصر؟
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
              >
                إلغاء
              </button>
              <button
                onClick={deleteFood}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Inject keyframe animations
const style = document.createElement("style");
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes scaleIn {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
  .animate-scaleIn { animation: scaleIn 0.2s ease-out; }
`;
document.head.appendChild(style);

export default AdditionPage;