import React, { useState, useEffect, useMemo } from "react";
import { BiTrendingUp } from "react-icons/bi";
import {
  FaPlus,
  FaEdit,
  FaCheck,
  FaChartLine,
  FaTimes,
  FaDumbbell,
  FaWeightHanging,
  FaArrowRight,
  FaFire,
  FaExchangeAlt,
} from "react-icons/fa";
import { FaPersonRunning, FaXmark } from "react-icons/fa6";
import { GiBiceps } from "react-icons/gi";
import { IoBody } from "react-icons/io5";
import { LiaDumbbellSolid } from "react-icons/lia";
import { RiResetRightFill, RiRestTimeFill } from "react-icons/ri";
import { SiGoogleanalytics } from "react-icons/si";
import { VscSettings } from "react-icons/vsc";

// ---------- Types ----------
interface UserData {
  challengePeriod: number;
  currentWeight: number;
  height: number;
  isFirstTime: boolean;
  targetWeight: number;
}

type SystemName = "ارنو سبلت" | "بروسبلت" | "بوش بون ليج";

interface Exercise {
  name: string;
  weight: number;
}

interface DayData {
  dayName: string;
  exercises: Exercise[];
  completedToday: boolean;
}

// ---------- Systems ----------
const SYSTEMS: Record<SystemName, string[]> = {
  "ارنو سبلت": ["صدر وظهر", "أكتاف وذراعين", "أرجل"],
  "بروسبلت": ["صدر", "ظهر", "أكتاف", "ذراعين", "أرجل"],
  "بوش بون ليج": ["بوش", "بول", "ليجز"],
};

// ---------- localStorage Helpers ----------
const LS_KEYS = {
  userData: "userData",
  system: "SystemOfExercise",
  startDate: "SystemStartDate",
  completedDates: "CompletedDates",
  exercises: (system: string, dayIndex: number) =>
    `exercises_${system}_day${dayIndex}`,
  weightHistory: "weightHistory", // NEW
};

const getStoredUserData = (): UserData => {
  const raw = localStorage.getItem(LS_KEYS.userData);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {}
  }
  return {
    challengePeriod: localStorage.getItem("challengePeriod")
      ? Number(localStorage.getItem("challengePeriod")) * 30
      : 0,
    currentWeight: localStorage.getItem("currentWeight")
      ? Number(localStorage.getItem("currentWeight"))
      : 0,
    height: localStorage.getItem("height")
      ? Number(localStorage.getItem("height"))
      : 0,
    isFirstTime: false,
    targetWeight: localStorage.getItem("targetWeight")
      ? Number(localStorage.getItem("targetWeight"))
      : 0,
  };
};

const getStoredSystem = (): SystemName | null => {
  const val = localStorage.getItem(LS_KEYS.system);
  return val && Object.keys(SYSTEMS).includes(val) ? (val as SystemName) : null;
};

const storeSystem = (system: SystemName) => {
  localStorage.setItem(LS_KEYS.system, system);
  localStorage.setItem(
    LS_KEYS.startDate,
    new Date().toISOString().slice(0, 10)
  );
};

const getStartDate = (): string | null =>
  localStorage.getItem(LS_KEYS.startDate);

const getCompletedDates = (): string[] => {
  const raw = localStorage.getItem(LS_KEYS.completedDates);
  return raw ? JSON.parse(raw) : [];
};

const addCompletedDate = (dateStr: string) => {
  const dates = getCompletedDates();
  if (!dates.includes(dateStr)) {
    dates.push(dateStr);
    localStorage.setItem(LS_KEYS.completedDates, JSON.stringify(dates));
  }
};

const getDayExercises = (system: string, dayIndex: number): Exercise[] => {
  const raw = localStorage.getItem(LS_KEYS.exercises(system, dayIndex));
  return raw ? JSON.parse(raw) : [];
};

const setDayExercises = (
  system: string,
  dayIndex: number,
  exercises: Exercise[]
) => {
  localStorage.setItem(
    LS_KEYS.exercises(system, dayIndex),
    JSON.stringify(exercises)
  );
};

// ----- REAL WEIGHT HISTORY MANAGEMENT -----
const getWeightHistory = (): Record<string, number[]> => {
  const raw = localStorage.getItem(LS_KEYS.weightHistory);
  return raw ? JSON.parse(raw) : {};
};

const addWeightToHistory = (exerciseName: string, weight: number) => {
  const history = getWeightHistory();
  if (!history[exerciseName]) {
    history[exerciseName] = [];
  }
  history[exerciseName].push(weight);
  if (history[exerciseName].length > 20) {
    history[exerciseName] = history[exerciseName].slice(-20);
  }
  localStorage.setItem(LS_KEYS.weightHistory, JSON.stringify(history));
};

const getHistoryForExercise = (exerciseName: string): number[] => {
  const history = getWeightHistory();
  return history[exerciseName] || [];
};
// -----------------------------------------

// ---------- Main Page ----------
const ExercisePage: React.FC = () => {
  
  const userData = useMemo(() => getStoredUserData(), []);
  const [system, setSystem] = useState<SystemName | null>(getStoredSystem());
  const [IsDisabled, setIsDisabled] = useState<boolean>(false);
  const [showSystemModal, setShowSystemModal] = useState(!system);
  const [days, setDays] = useState<DayData[]>([]);
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(0);
  const todayDateStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Modals
  const [addExerciseModal, setAddExerciseModal] = useState<{
    open: boolean;
    dayIndex: number;
  }>({ open: false, dayIndex: 0 });
  const [editWeightModal, setEditWeightModal] = useState<{
    open: boolean;
    dayIndex: number;
    exerciseIndex: number;
    currentWeight: number;
  } | null>(null);
  const [analysisModal, setAnalysisModal] = useState<{
    open: boolean;
    exerciseName: string;
  } | null>(null);

  // Calculate current day and next workout name
  const nextWorkoutDayName = useMemo(() => {
    if (!system) return null;
    const dayNames = SYSTEMS[system];
    const startDateStr = getStartDate();
    if (!startDateStr) return dayNames[0];
    const start = new Date(startDateStr);
    const diffDays = Math.floor(
      (new Date().getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return dayNames[Math.abs(diffDays) % dayNames.length];
  }, [system]);

  // Build days after system chosen
  useEffect(() => {
    if (system) {
      const dayNames = SYSTEMS[system];
      const startDateStr = getStartDate();
      let dayIndex = 0;
      if (startDateStr) {
        const start = new Date(startDateStr);
        const diffDays = Math.floor(
          (new Date().getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        );
        dayIndex = Math.abs(diffDays) % dayNames.length;
      }

      const completedDates = getCompletedDates();
      const loadedDays: DayData[] = dayNames.map((name, idx) => {
        const exercises = getDayExercises(system, idx);
        return {
          dayName: name,
          exercises,
          completedToday:
            completedDates.includes(todayDateStr) && idx === dayIndex,
        };
      });

      setDays(loadedDays);
      setCurrentDayIndex(dayIndex);
      setShowSystemModal(false);
    }
  }, [system, todayDateStr]);

  // Handlers
  const handleSystemSelect = (chosen: SystemName) => {
    storeSystem(chosen);
    setSystem(chosen);
  };

  const handleAddExercise = (dayIndex: number) =>
    setAddExerciseModal({ open: true, dayIndex });

  const handleSaveNewExercise = (name: string, weight: number) => {
    if (!system || !name.trim()) return;
    const dayIdx = addExerciseModal.dayIndex;
    const updated = [
      ...getDayExercises(system, dayIdx),
      { name: name.trim(), weight },
    ];
    setDayExercises(system, dayIdx, updated);
    // Store initial weight in history
    addWeightToHistory(name.trim(), weight);
    setDays((prev) =>
      prev.map((d, i) => (i === dayIdx ? { ...d, exercises: updated } : d))
    );
    setAddExerciseModal({ open: false, dayIndex: 0 });
  };

  const handleEditWeight = (
    dayIndex: number,
    exerciseIndex: number,
    newWeight: number
  ) => {
    if (!system) return;
    const current = getDayExercises(system, dayIndex);
    const updated = current.map((ex, i) =>
      i === exerciseIndex ? { ...ex, weight: newWeight } : ex
    );
    setDayExercises(system, dayIndex, updated);
    // Record the new weight in history
    addWeightToHistory(current[exerciseIndex].name, newWeight);
    setDays((prev) =>
      prev.map((d, i) => (i === dayIndex ? { ...d, exercises: updated } : d))
    );
  };

  const handleMarkTodayCompleted = (dayIndex: number) => {
    addCompletedDate(todayDateStr);
    setDays((prev) =>
      prev.map((d, i) =>
        i === dayIndex ? { ...d, completedToday: true } : d
      )
    );
  };

  const handleShowAnalysis = (exerciseName: string) => {
    // Open analysis modal – real history will be loaded inside
    setAnalysisModal({ open: true, exerciseName });
  };

  // System selection modal
  if (!system && showSystemModal) {
    return (
      <div className="min-h-screen  bg-gradient-to-br from-sky-100 via-white to-blue-50 flex items-center justify-center pb-16">
        <div className="relative bg-white/70 backdrop-blur-lg border border-white/50 shadow-xl rounded-3xl p-8 w-11/12 max-w-md space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            اختر نظام التمرين
          </h2>
          <div className="space-y-4">
            {(Object.keys(SYSTEMS) as SystemName[]).map((sys) => (
              <button
                key={sys}
                onClick={() => handleSystemSelect(sys)}
                className="w-full show-first rounded-3xl bg-gradient-to-r  from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-semibold py-4 px-6  transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                {sys}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen show-first bg-gradient-to-br from-sky-50 via-white to-blue-50 relative"
      style={{ paddingBottom: "60px" }}
    >
      { IsDisabled && <Settings />}

      {/* CSS animations */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.25s ease-out; }
      `}</style>

      <div className="relative w-full min-h-14 flex flex-row p-3 justify-between ">
 <div className="text-xl flex flex-row">
          <FaPersonRunning />
        </div>
        <div className="flex flex-row gap-2">

          <div
            onClick={() => setIsDisabled(true)}
            className="bg-gray-100 text-md flex items-center cursor-pointer flex-row gap-2 mb-5 p-2 rounded-4xl"
          >
            الاعدادات <VscSettings />
          </div>
        </div>
      </div>

      {/* Next workout or prompt */}
      <div className="px-4 mb-6">
        {nextWorkoutDayName ? (
      <>
          <div className="relative z-20 min-h-[150px] w-full p-5 bg-gradient-to-b from-sky-500 to-sky-700 rounded-2xl border border-sky-50 flex flex-col gap-4 transition-all hover:shadow-lg">
            <div className="flex flex-row items-center justify-between">
              <span className="text-white/80 text-sm">التمرين القادم</span>
            </div>
            <div className="relative w-full h-full">
              <h1 className="text-4xl sm:text-5xl text-white font-bold mb-2 drop-shadow-lg">
                {nextWorkoutDayName}
              </h1>
              <LiaDumbbellSolid className="absolute text-8xl scale-150 left-0 top-0 opacity-20 text-white" />
            </div>
          
          </div>
          <div className="relative z-10 -top-4 w-full min-h-1 scale-97  bg-sky-400/20 py-6 p-2 flex items-end rounded-2xl">
          {JSON.parse(localStorage.getItem('SelectedDays') || '[]').join(' - ')}          
          </div>
      </>
        ) : (
          <div className="relative min-h-[150px] w-full p-5 bg-gradient-to-b from-gray-300 to-gray-500 rounded-2xl border border-gray-200 flex flex-col gap-4 transition-all hover:shadow-lg">
            <div className="flex flex-row items-center justify-between">
              <h2 className="text-3xl text-white font-bold">أيام التمرين</h2>
            </div>
            <h1 className="text-xl text-white">
              لم تقم باختيار أيام التمرين بعد!
            </h1>
            <button
              onClick={() => setShowSystemModal(true)}
              className="flex items-center gap-2 bg-white p-3 shadow-2xl w-fit rounded-xl text-sky-500 font-bold active:scale-95 transition"
            >
              اختر أيام التمرين <FaArrowRight />
            </button>
          </div>
        )}
      </div>

      {/* Day slider */}
      <div className="px-2 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 px-4 mb-3">
          أيام الأسبوع
        </h2>
        <div className="flex overflow-auto  snap-x snap-mandatory gap-4 p-4 scrollbar-thin scrollbar-thumb-gray-300">
          {days.map((day, idx) => (
            <div
              key={idx}
              className={`snap-center flex justify-between flex-col shrink-0 w-full min-h-80 relative bg-white/70 backdrop-blur-lg border border-white/50 shadow-2xl rounded-3xl p-5 space-y-4 transition-all hover:shadow-2xl `}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">
                  {day.dayName}
                </h3>
                {idx === currentDayIndex && (
                  <span className="text-xs bg-sky-500 text-white px-3 py-1 rounded-full font-medium">
                    اليوم
                  </span>
                )}
              </div>

              {/* Exercises list */}
              {day.exercises.length > 0 ? (
                <ul className="space-y-2">
                  {day.exercises.map((ex, exIdx) => (
                    <li
                      key={exIdx}
                      className="flex items-center justify-between bg-gradient-to-r from-green-50 to-sky-50 p-3 py-6 rounded-xl border border-sky-100 transition-all hover:shadow-md"
                    >
                        <span className="text-sm text-gray-500 pl-2">
                          {ex.weight} كغ
                        </span>
                      <span className="font-medium text-gray-700 truncate flex-1">
                        {ex.name}
                        
                      </span>
                      
                      <div className="flex items-center gap-2 ml-2">
                      
                        <button
                          onClick={() =>
                            setEditWeightModal({
                              open: true,
                              dayIndex: idx,
                              exerciseIndex: exIdx,
                              currentWeight: ex.weight,
                            })
                          }
                          className="p-1 text-gray-300 hover:text-sky-700 transition"
                        >
                          <FaExchangeAlt />
                        </button>
                        <button
                          onClick={() => handleShowAnalysis(ex.name)}
                          className="p-1 text-gray-300 hover:text-teal-700 transition"
                        >
                          <SiGoogleanalytics />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">لا توجد تمارين بعد</p>
              )}

              {/* Add & Complete buttons */}
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => handleAddExercise(idx)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-400 to-blue-500 text-white py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg active:scale-[0.98] transition"
                >
                  <FaPlus /> إضافة تمرين
                </button>

                {idx === currentDayIndex && (
                  <button
                    onClick={() => handleMarkTodayCompleted(idx)}
                    disabled={day.completedToday}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold transition ${
                      day.completedToday
                        ? "bg-green-100 text-teal-700 cursor-not-allowed"
                        : "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md hover:shadow-lg"
                    }`}
                  >
                    <FaCheck />
                    {day.completedToday
                      ? "تم التمرين اليوم "
                      : "أنهيت تمرين اليوم"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {addExerciseModal.open && (
        <Modal
          onClose={() => setAddExerciseModal({ open: false, dayIndex: 0 })}
        >
          <AddExerciseForm onSave={handleSaveNewExercise} />
        </Modal>
      )}
      {editWeightModal?.open && (
        <Modal onClose={() => setEditWeightModal(null)}>
          <EditWeightForm
            currentWeight={editWeightModal.currentWeight}
            onSave={(newWeight) => {
              handleEditWeight(
                editWeightModal.dayIndex,
                editWeightModal.exerciseIndex,
                newWeight
              );
              setEditWeightModal(null);
            }}
          />
        </Modal>
      )}
      {analysisModal?.open && (
        <Modal onClose={() => setAnalysisModal(null)}>
          <ModernAnalysisView
            exerciseName={analysisModal.exerciseName}
            weightsHistory={getHistoryForExercise(analysisModal.exerciseName)}
          />
        </Modal>
      )}
    </div>
  );
};

// ---------- Modal (glass) ----------
const Modal: React.FC<{ children: React.ReactNode; onClose: () => void }> = ({
  children,
  onClose,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-fadeIn">
    <div className="relative bg-white backdrop-blur-md border border-white/50 shadow-2xl rounded-3xl p-6 w-full max-w-sm animate-scaleIn">
      <button
        onClick={onClose}
        className="absolute top-1 right-3 text-gray-400 hover:text-gray-600 transition"
      >
        <FaTimes size={20} />
      </button>
      {children}
    </div>
  </div>
);

// ---------- Add Exercise Form ----------
const AddExerciseForm: React.FC<{
  onSave: (name: string, weight: number) => void;
}> = ({ onSave }) => {
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim() || !weight) return;
        onSave(name.trim(), Number(weight));
      }}
      className="space-y-5"
    >
      <h3 className="text-xl font-bold text-gray-800 pr-5">تمرين جديد</h3>
      <input
        type="text"
        placeholder="اسم التمرين"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-sky-400/50 transition"
        required
      />
      <input
        type="number"
        placeholder="الوزن (كغ)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-sky-400/50 transition"
        required
        step="0.5"
      />
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-sky-400 to-blue-500 text-white py-3 rounded-xl font-bold shadow-md hover:shadow-lg active:scale-[0.98] transition"
      >
        حفظ التمرين
      </button>
    </form>
  );
};

// ---------- Edit Weight Form ----------
const EditWeightForm: React.FC<{
  currentWeight: number;
  onSave: (newWeight: number) => void;
}> = ({ currentWeight, onSave }) => {
  const [weight, setWeight] = useState(currentWeight.toString());

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(Number(weight));
      }}
      className="space-y-5"
    >
      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <FaWeightHanging className="text-sky-500" /> تعديل الوزن
      </h3>
      <input
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-sky-400 transition"
        step="0.5"
      />
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white py-3 rounded-xl font-bold shadow-md hover:shadow-lg active:scale-[0.98] transition"
      >
        حفظ الوزن
      </button>
    </form>
  );
};

// ---------- Modern Analysis View (real data) ----------
const ModernAnalysisView: React.FC<{
  exerciseName: string;
  weightsHistory: number[];
}> = ({ exerciseName, weightsHistory }) => {
  const maxWeight = Math.max(...weightsHistory, 1);
  const minWeight = Math.min(...weightsHistory);
  const trend =
    weightsHistory.length > 1
      ? (
          ((weightsHistory[weightsHistory.length - 1] - weightsHistory[0]) /
            weightsHistory[0]) *
          100
        ).toFixed(1)
      : 0;

  return (
    <div className="space-y-3 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          تحليل {exerciseName}
        </h3>
        {weightsHistory.length > 0 && (
          <span
            className={`text-sm font-semibold px-2 py-1 rounded-full ${
              Number(trend) >= 0
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            <BiTrendingUp
              className={`inline mr-1 ${Number(trend) >= 0 ? "" : "rotate-180"}`}
            />
            {Math.abs(Number(trend))}%
          </span>
        )}
      </div>

      {/* Chart area */}
      <div className="bg-gradient-to-br from-gray-50 to-sky-50 rounded-2xl p-4 border border-white/80 shadow-inner">
        {weightsHistory.length > 0 ? (
          <div className="flex items-end justify-between gap-1 h-40">
            {weightsHistory.map((weight, i) => {
              const heightPercent = (weight / maxWeight) * 100;
              const delay = i * 0.08;
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center justify-end h-full"
                >
                  <span className="text-xs font-medium text-gray-600 mb-1">
                    {weight} كغ
                  </span>
                  <div
                    className="w-full max-w-[30px] rounded-t-lg bg-gradient-to-b from-sky-400 to-blue-500 shadow-sm"
                    style={{
                      height: `${heightPercent}%`,
                      animation: `slideUp 0.5s ease-out ${delay}s both`,
                    }}
                  />
                  <span className="text-xs text-gray-400 mt-1.5">
                    {i + 1}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center text-gray-400">
            لا توجد بيانات
          </div>
        )}
      </div>

      {/* Summary stats */}
      {weightsHistory.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white backdrop-blur-sm rounded-xl p-6 border border-white transition-all hover:shadow-md">
            <span className="text-xs text-gray-500">أعلى وزن</span>
            <p className="text-lg font-bold text-gray-800">{maxWeight} كغ</p>
          </div>
          <div className="bg-white backdrop-blur-sm rounded-xl p-3 border border-white/80 transition-all hover:shadow-md">
            <span className="text-xs text-gray-500">عدد الجلسات</span>
            <p className="text-lg font-bold text-gray-800">
              {weightsHistory.length}
            </p>
          </div>
        </div>
      )}

     
    </div>
  );
};

const Settings = () => {
  return (
  <div className="fixed show-first top-0 left-0 z-50 w-screen h-lvh flex justify-center items-center bg-black/5 backdrop-blur-sm ">
        <div className="w-10/12 min-h-62 p-5 bg-white rounded-2xl">
        
          <div className="w-full h-full flex flex-col gap-3 justify-around">
            <div className="flex justify-between w-full p-3.5  rounded-lg  text-md cursor-pointer activeAnim">
              الاعدادات <div onClick={() => window.location.reload()} className="p-1.5 rounded-2xl  bg-gray-50"><FaXmark className="text-blue-600" /></div>
            </div>
           
  
            <div onClick={() => {localStorage.removeItem("SystemOfExercise");window.location.reload()}}  className="flex justify-between w-full p-3.5 bg-gray-100 rounded-lg text-md active:bg-sky-100 active:text-sky-600 cursor-pointer activeAnim">
              
              إعادة تعيين نظام التدريب <RiResetRightFill />
             
            </div>
          </div>
        </div>
      </div>
  )
}

export default ExercisePage;