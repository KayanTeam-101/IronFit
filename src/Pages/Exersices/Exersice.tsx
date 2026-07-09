import React, { useState, useEffect, useMemo } from "react";
import { BiTrendingUp } from "react-icons/bi";
import {
  FaPlus,
  FaCheck,
  FaTimes,
  FaDumbbell,
  FaWeightHanging,
  FaArrowRight,
  FaFire,
  FaExchangeAlt,
  FaCookieBite,
} from "react-icons/fa";
import { FaPersonRunning, FaXmark } from "react-icons/fa6";
import { RiResetRightFill } from "react-icons/ri";
import { VscSettings } from "react-icons/vsc";
import { GiShoulderArmor } from "react-icons/gi";
import SelectDays from "../Welcome/Components/SelectDays";
import EditWeightForm from "./Components/EditWightForm";  // adjust path
import { giveExerciseAdvice } from "../../utilities/GiveAdvice";

// ---------- Types ----------
type SystemName = "ارنو سبلت" | "بروسبلت" | "بوش بون ليج";

const SYSTEMS: Record<SystemName, string[]> = {
  "ارنو سبلت": ["صدر وظهر", "أكتاف وذراعين", "أرجل"],
  "بروسبلت": ["صدر", "ظهر", "أكتاف", "ذراعين", "أرجل"],
  "بوش بون ليج": ["بوش", "بول", "ليجز"],
};

interface UserData {
  challengePeriod: number;
  currentWeight: number;
  height: number;
  isFirstTime: boolean;
  targetWeight: number;
}

interface Exercise {
  name: string;
  weight: number;
}

interface DayData {
  weekday: string;
  workout: string;
  exercises: Exercise[];
  completedToday: boolean;
}

// ---------- localStorage Helpers ----------
const LS_KEYS = {
  userData: "userData",
  system: "SystemOfExercise",
  startDate: "SystemStartDate",
  completedDates: "CompletedDates",
  selectedDays: "SelectedDays",
  exercises: (workout: string) => `exercises_workout_${workout}`,
  weightHistory: "weightHistory",
};

const getStoredUserData = (): UserData => {
  const raw = localStorage.getItem(LS_KEYS.userData);
  if (raw) {
    try { return JSON.parse(raw); } catch {}
  }
  return {
    challengePeriod: localStorage.getItem("challengePeriod") ? Number(localStorage.getItem("challengePeriod")) * 30 : 0,
    currentWeight: localStorage.getItem("currentWeight") ? Number(localStorage.getItem("currentWeight")) : 0,
    height: localStorage.getItem("height") ? Number(localStorage.getItem("height")) : 0,
    isFirstTime: false,
    targetWeight: localStorage.getItem("targetWeight") ? Number(localStorage.getItem("targetWeight")) : 0,
  };
};

const getStoredSystem = (): SystemName | null => {
  const val = localStorage.getItem(LS_KEYS.system);
  return val && Object.keys(SYSTEMS).includes(val) ? (val as SystemName) : null;
};

const storeSystem = (system: SystemName) => {
  localStorage.setItem(LS_KEYS.system, system);
  localStorage.setItem(LS_KEYS.startDate, new Date().toISOString().slice(0, 10));
};

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

const getWorkoutExercises = (workout: string): Exercise[] => {
  const raw = localStorage.getItem(LS_KEYS.exercises(workout));
  return raw ? JSON.parse(raw) : [];
};

const setWorkoutExercises = (workout: string, exercises: Exercise[]) => {
  localStorage.setItem(LS_KEYS.exercises(workout), JSON.stringify(exercises));
};

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

const getTodayWeekday = (): string => {
  return new Date().toLocaleDateString("ar-EG", { weekday: "long" });
};

const ARABIC_WEEKDAY_TO_INDEX: Record<string, number> = {
  "الأحد": 0,
  "الاثنين": 1,
  "الإثنين": 1,
  "الثلاثاء": 2,
  "الأربعاء": 3,
  "الاربعاء": 3,
  "الخميس": 4,
  "الجمعة": 5,
  "السبت": 6,
};

function getWeekdayIndex(arabicName: string): number {
  return ARABIC_WEEKDAY_TO_INDEX[arabicName] ?? -1;
}

// ---------- Main Page ----------
const ExercisePage: React.FC = () => {
  const userData = useMemo(() => getStoredUserData(), []);
  const [system, setSystem] = useState<SystemName | null>(getStoredSystem());
  const [IsDisabled, setIsDisabled] = useState<boolean>(false);
  const [showSystemModal, setShowSystemModal] = useState(!system);
  const [days, setDays] = useState<DayData[]>([]);
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(-1);
  const todayDateStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const todayIndex = new Date().getDay();

  // Modals
  const [addExerciseModal, setAddExerciseModal] = useState<{
    open: boolean;
    dayIndex: number;
  }>({ open: false, dayIndex: 0 });

  const [editWeightModal, setEditWeightModal] = useState<{
    open: boolean;
    dayIndex: number;
    exerciseName: string;          // ← using name instead of index
    currentWeight: number;
  } | null>(null);

  const [analysisModal, setAnalysisModal] = useState<{
    open: boolean;
    exerciseName: string;
  } | null>(null);

  const selectedDays: string[] = useMemo(() => {
    const raw = localStorage.getItem(LS_KEYS.selectedDays);
    if (!raw) return [];
    try {
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }, []);

  const schedule = useMemo(() => {
    if (selectedDays.length === 0) return [];

    const storedWorkoutNames = localStorage.getItem("WorkoutNames");
    let workoutNames: string[] = [];
    if (storedWorkoutNames) {
      try {
        const arr = JSON.parse(storedWorkoutNames);
        if (Array.isArray(arr) && arr.length === selectedDays.length) {
          workoutNames = arr;
        }
      } catch {}
    }

    if (workoutNames.length === selectedDays.length) {
      return selectedDays.map((weekday, idx) => {
        const dayIndex = getWeekdayIndex(weekday);
        return { weekday, dayIndex, workout: workoutNames[idx] };
      });
    }

    if (!system) return [];
    const systemWorkouts = SYSTEMS[system];
    return selectedDays.slice(0, systemWorkouts.length).map((weekday, idx) => {
      const dayIndex = getWeekdayIndex(weekday);
      return { weekday, dayIndex, workout: systemWorkouts[idx] || "" };
    });
  }, [system, selectedDays]);

  useEffect(() => {
    if (schedule.length > 0) {
      const foundIndex = schedule.findIndex((s) => s.dayIndex === todayIndex);
      setCurrentDayIndex(foundIndex >= 0 ? foundIndex : -1);
    } else {
      setCurrentDayIndex(-1);
    }
  }, [schedule, todayIndex]);

  useEffect(() => {
    if (schedule.length > 0) {
      const completedDates = getCompletedDates();
      const loadedDays: DayData[] = schedule.map((item) => ({
        weekday: item.weekday,
        workout: item.workout,
        exercises: getWorkoutExercises(item.workout),
        completedToday: completedDates.includes(todayDateStr) && item.dayIndex === todayIndex,
      }));
      setDays(loadedDays);
      setShowSystemModal(false);
    } else {
      setDays([]);
    }
  }, [schedule, todayDateStr, todayIndex]);

  // Handlers
  const handleSystemSelect = (chosen: SystemName) => {
    storeSystem(chosen);
    setSystem(chosen);
  };

  const handleAddExercise = (dayIndex: number) =>
    setAddExerciseModal({ open: true, dayIndex });

  const handleSaveNewExercise = (name: string, weight: number) => {
    if (!system || schedule.length === 0 || !name.trim()) return;
    const dayIdx = addExerciseModal.dayIndex;
    const workoutName = schedule[dayIdx].workout;
    const currentExercises = getWorkoutExercises(workoutName);
    const updated = [...currentExercises, { name: name.trim(), weight }];
    setWorkoutExercises(workoutName, updated);
    addWeightToHistory(name.trim(), weight);
    setDays((prev) =>
      prev.map((d, i) => (i === dayIdx ? { ...d, exercises: updated } : d))
    );
    setAddExerciseModal({ open: false, dayIndex: 0 });
  };

  // ----- FIXED: using exercise name instead of index -----
  const handleEditWeight = (
    dayIndex: number,
    exerciseName: string,
    newWeight: number
  ) => {
    const workoutName = schedule[dayIndex]?.workout;
    if (!workoutName) return;

    const currentExercises = getWorkoutExercises(workoutName);
    const updatedExercises = currentExercises.map((ex) =>
      ex.name === exerciseName ? { ...ex, weight: newWeight } : ex
    );
    setWorkoutExercises(workoutName, updatedExercises);
    addWeightToHistory(exerciseName, newWeight);

    setDays((prev) =>
      prev.map((d, i) =>
        i === dayIndex ? { ...d, exercises: updatedExercises } : d
      )
    );
  };

  const handleMarkTodayCompleted = (dayIndex: number) => {
    addCompletedDate(todayDateStr);
    setDays((prev) =>
      prev.map((d, i) => (i === dayIndex ? { ...d, completedToday: true } : d))
    );
  };

  const handleShowAnalysis = (exerciseName: string) => {
    setAnalysisModal({ open: true, exerciseName });
  };

  // System selection modal
  if (!system && showSystemModal) {
    return (
      <div className="min-h-screen bg-white dark:bg-transparent flex items-center justify-center pb-16">
        <div className="relative bg-white/70 backdrop-blur-lg border dark:bg-transparent border-white/50 dark:border-none shadow-xl rounded-xl p-8 w-11/12 max-w-md space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center">اختر نظام التمرين</h2>
          <div className="space-y-4">
            {(Object.keys(SYSTEMS) as SystemName[]).map((sys) => (
              <button key={sys} onClick={() => handleSystemSelect(sys)}
                className="w-full show-first rounded-3xl flex justify-between items-center flex-col bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 dark:from-black/20 dark:to-slate-800/30 dark:border-2 dark:border-gray-600/20 hover:to-orange-600 text-white font-semibold py-4 px-6 transition-all shadow-md hover:shadow-lg active:scale-[0.98]">
                <div>
                  {sys}
                  {sys === "ارنو سبلت" && <FaDumbbell className="inline mr-2" />}
                  {sys === "بروسبلت" && <FaWeightHanging className="inline mr-2" />}
                  {sys === "بوش بون ليج" && <FaFire className="inline mr-2" />}
                </div>
                <div className="flex w-full flex-row justify-around ">
                  {SYSTEMS[sys].map((w, i) => (
                    <span key={i} className="text-sm rounded-lg bg-white p-1 text-amber-500 dark:bg-slate-600/30 dark:text-white mt-2">
                      {w}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
          <div className="bg-amber-300/60 dark:bg-amber-300/20 border border-amber-400/50 rounded-xl w-11/12 p-2 dark:text-white text-black min-h-10 animate-pulse">
            مكسل تجدول تمارينك؟! <br /> تقدر تجرب القوالب الجاهزة من{" "}
            <span onClick={() => window.location.href = "/templates"} className="text-amber-400 cursor-pointer underline">هنا</span>
          </div>
        </div>
      </div>
    );
  }

  const todayWorkout = currentDayIndex >= 0 ? schedule[currentDayIndex].workout : null;

  return (
    <div className="min-h-screen show-first bg-white dark:bg-black/20 dark:border-2 dark:border-gray-600/20 relative" style={{ paddingBottom: "60px" }}>
      {IsDisabled && <Settings />}
      <style>{`
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.25s ease-out; }
      `}</style>

      {/* Header */}
      <div className="relative w-full min-h-14 flex flex-row p-3 justify-between">
        <div className="text-xl flex flex-row"><FaPersonRunning className="dark:text-white" /></div>
        <div className="flex flex-row gap-2">
          <div onClick={() => setIsDisabled(true)} className="bg-gray-100 text-md flex dark:bg-black/20 dark:border-2 dark:border-gray-600/20 dark:text-white items-center cursor-pointer flex-row gap-2 mb-5 p-2 rounded-4xl">
            الاعدادات <VscSettings />
          </div>
        </div>
      </div>

      {/* Next workout */}
      <div className="px-4 mb-6">
        <div className="w-full rounded-3xl mb-2 p-5 shadow-sm dark:bg-black/20 dark:border-2 dark:border-gray-600/20 bg-white flex flex-row gap-2">
          <FaCookieBite className="text-2xl text-amber-500 dark:text-amber-300" />
          <p className="font-light text-md show-third dark:text-white">{giveExerciseAdvice()}</p>
        </div>

        {todayWorkout ? (
          <>
            <div className="relative top-50">
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-400 rounded-full opacity-20 blur-3xl animate-pulse overflow-hidden" />
              <div className="absolute top-0 left-0 w-48 h-48 bg-indigo-400 rounded-full opacity-20 blur-3xl animate-pulse delay-1000" />
              <div className="absolute bottom-0 right-0 w-56 h-56 bg-teal-400 rounded-full opacity-20 blur-3xl animate-pulse delay-2000" />
            </div>
            <div className="relative z-20 min-h-[250px] overflow-hidden w-full p-5 bg-orange-500 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 rounded-2xl border border-amber-50 flex flex-col gap-4 transition-all hover:shadow-lg">
              <div className="flex flex-row items-center justify-between">
                <span className="text-white/80 text-sm">تمرين اليوم</span>
                <span className="text-white/80 text-sm">{getTodayWeekday()}</span>
              </div>
              <div className="relative w-full h-full ">
                <h1 className="text-4xl sm:text-5xl text-white font-bold mb-2 drop-shadow-lg">{todayWorkout}</h1>
            <GiShoulderArmor className="absolute text-[150px] scale-150 left-0 top-0 opacity-10 text-white" />
              </div>
            </div>
            <div className="relative z-10 -top-4 w-full min-h-1 scale-97 bg-amber-400/20 py-6 dark:text-white dark:bg-transparent p-2 flex items-end rounded-2xl">
              {selectedDays.join(" - ")} (أيام التمرين)
            </div>
          </>
        ) : schedule.length > 0 ? (
          <div className="relative min-h-[250px] w-full p-5 bg-slate-300 dark:bg-slate-800/20 dark:border-2 dark:border-gray-600/20 overflow-hidden rounded-2xl border border-gray-200 flex flex-col gap-4 transition-all hover:shadow-lg">
            <div className="flex flex-row items-center justify-between">
              <h1 className="text-4xl text-white font-bold m-3"> إستراحة محارب !</h1>
            </div>
            <h1 className="text-xl text-white">استرح يا بطل!</h1>
            <GiShoulderArmor className="absolute text-[150px] scale-150 left-0 top-10 opacity-10 text-white" />
          </div>
        ) : (
          <div className="relative min-h-[150px] w-full p-5 bg-slate-300 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 rounded-2xl border border-gray-200 flex flex-col gap-4 transition-all hover:shadow-lg">
            <div className="flex flex-row items-center justify-between">
              <h2 className="text-3xl text-white font-bold">أيام التمرين</h2>
            </div>
            <h1 className="text-xl text-white">لم تقم باختيار أيام التمرين بعد!</h1>
            <button
              onClick={() => { setShowSystemModal(true); setIsDisabled(true); }}
              className="flex items-center gap-2 bg-white dark:bg-black/20 dark:border-2 dark:border-gray-600/20 p-3 shadow-2xl w-fit rounded-xl text-amber-500 font-bold active:scale-95 transition"
            >
              اختر أيام التمرين <FaArrowRight />
            </button>
          </div>
        )}
      </div>

      {/* Day cards */}
      {days.length > 0 && (
        <div className="px-2 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 px-4 mb-3">جدول التمرين</h2>
          <div className="flex overflow-auto snap-x snap-mandatory gap-4 p-4 scrollbar-thin scrollbar-thumb-gray-300">
            {days.map((day, idx) => (
              <div key={idx} className={`snap-center flex dark:bg-black/70 dark:border-2 dark:border-gray-600/20 justify-between flex-col shrink-0 w-full min-h-80 relative bg-white/70 backdrop-blur-lg border border-white/50 shadow-2xl rounded-xl p-5 space-y-4 transition-all hover:shadow-2xl ${idx === currentDayIndex ? "ring-4 ring-amber-400/20" : ""}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">{day.workout}</h3>
                    <p className="text-sm text-gray-500">{day.weekday}</p>
                  </div>
                  {idx === currentDayIndex && (
                    <span className="text-xs bg-amber-500 text-white px-3 py-1 rounded-full font-medium">اليوم</span>
                  )}
                </div>

                {day.exercises.length > 0 ? (
                  <ul className="space-y-2">
                    {day.exercises.map((ex, exIdx) => (
                      <li key={exIdx} className="relative flex items-center justify-between bg-white dark:bg-black/20 border-2 border-gray-600/20 p-3 py-6 rounded-lg shadow-xl transition-all hover:shadow-md">
                        <div className="absolute top-13 text-sm text-gray-500 dark:text-white/70 pl-2">{ex.weight} كغ</div>
                        <span
                          className="font-medium cursor-pointer dark:text-white underline text-gray-700 truncate flex-1"
                          onClick={() => handleShowAnalysis(ex.name)}
                        >
                          {ex.name}
                        </span>
                        <div className="flex items-center gap-2 ml-2">
                          <button
                            onClick={() =>
                              setEditWeightModal({
                                open: true,
                                dayIndex: idx,
                                exerciseName: ex.name,        // ← now passing name
                                currentWeight: ex.weight,
                              })
                            }
                            className="p-1 text-amber-500 hover:text-amber-700 transition flex justify-center items-center rounded-full gap-1"
                          >
                            <FaExchangeAlt />تطوير الوزن
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">لا توجد تمارين بعد</p>
                )}

                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => handleAddExercise(idx)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white py-3.5 rounded-xl font-medium shadow-md hover:shadow-lg active:scale-[0.98] transition"
                  >
                    إضافة تمرين <FaPlus />
                  </button>
                  {idx === currentDayIndex && (
                    <button
                      onClick={() => handleMarkTodayCompleted(idx)}
                      disabled={day.completedToday}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold transition ${
                        day.completedToday ? "bg-green-100 text-teal-700 cursor-not-allowed" : "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md hover:shadow-lg"
                      }`}
                    >
                      <FaCheck />
                      {day.completedToday ? "تم التمرين اليوم " : "أنهيت تمرين اليوم"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {addExerciseModal.open && (
        <Modal onClose={() => setAddExerciseModal({ open: false, dayIndex: 0 })}>
          <AddExerciseForm onSave={handleSaveNewExercise} />
        </Modal>
      )}
      {editWeightModal?.open && (
        <Modal onClose={() => setEditWeightModal(null)}>
          <EditWeightForm
            currentWeight={editWeightModal.currentWeight}
            onSave={(newWeight : any) => {
              handleEditWeight(
                editWeightModal.dayIndex,
                editWeightModal.exerciseName,   // ← using name
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

// ---------- Modal ----------
const Modal: React.FC<{ children: React.ReactNode; onClose: () => void }> = ({ children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-fadeIn">
    <div className="relative bg-white dark:bg-black/5 backdrop-blur-md border border-white/50 dark:border-none shadow-2xl rounded-xl p-6 w-full max-w-sm show-first">
      <button onClick={onClose} className="absolute -top-9 right-3 hover:text-gray-600 transition">
        <FaXmark size={20} className="text-rose-400" />
      </button>
      {children}
    </div>
  </div>
);

// ---------- Add Exercise Form ----------
const AddExerciseForm: React.FC<{ onSave: (name: string, weight: number) => void }> = ({ onSave }) => {
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!name.trim() || !weight) return; onSave(name.trim(), Number(weight)); }} className="space-y-5">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white pr-5">تمرين جديد</h3>
      <input type="text" placeholder="اسم التمرين" autoFocus value={name} onChange={(e) => setName(e.target.value)}
        className="w-full bg-gray-50 border border-gray-200 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 dark:text-white rounded-b-2xl rounded-xl py-3 pr-10 pl-4 outline-none focus:ring-2 focus:ring-orange-400 transition" required />
      <input type="number" placeholder="الوزن (كغ)" value={weight} onChange={(e) => setWeight(e.target.value)}
        className="w-full bg-gray-50 border border-gray-200 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 dark:text-white rounded-b-2xl rounded-xl py-3 pr-10 pl-4 outline-none focus:ring-2 focus:ring-orange-400 transition" required step="0.5" />
      <button type="submit" className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white py-3 rounded-xl font-bold shadow-md hover:shadow-lg active:scale-[0.98] transition">
        حفظ التمرين
      </button>
    </form>
  );
};

// ---------- Analysis View (unchanged) ----------
const ModernAnalysisView: React.FC<{ exerciseName: string; weightsHistory: number[] }> = ({ exerciseName, weightsHistory }) => {
  const maxWeight = Math.max(...weightsHistory, 1);
  const trend = weightsHistory.length > 1
    ? ((weightsHistory[weightsHistory.length - 1] - weightsHistory[0]) / weightsHistory[0] * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-3 show-first">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">تحليل {exerciseName}</h3>
        {weightsHistory.length > 0 && (
          <span className={`text-sm font-semibold px-2 py-1 rounded-full ${Number(trend) >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            <BiTrendingUp className={`inline mr-1 ${Number(trend) >= 0 ? "" : "rotate-180"}`} />
            {Math.abs(Number(trend))}%
          </span>
        )}
      </div>
      <div className="bg-gray-50 dark:bg-black/20 dark:border-2  rounded-lg p-4 shadow-inner overflow-x-scroll">
        {weightsHistory.length > 0 ? (
          <div className="flex items-end justify-between gap-1 h-40">
            {weightsHistory.map((weight, i) => {
              const heightPercent = (weight / maxWeight) * 100;
              const delay = i * 0.08;
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                  <span className="text-xs font-medium text-gray-600 mb-1 dark:text-gray-100">{weight} كغ</span>
                  <div className="w-full  max-w-[10px] rounded-full bg-gradient-to-b from-amber-400 to-orange-500 shadow-sm"
                    style={{ height: `${heightPercent}%`, animation: `slideUp 0.1s ease-in-out ${delay}s both` }} />
                  <span className="text-xs text-gray-400 mt-1.5 dark:text-gray-100">{i + 1}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center text-gray-400">لا توجد بيانات</div>
        )}
      </div>
      {weightsHistory.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-100 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 dark:text-white backdrop-blur-sm rounded-xl p-6 border border-gray-100 transition-all hover:shadow-md">
            <span className="text-xs text-gray-500">أعلى وزن</span>
            <p className="text-lg font-bold text-gray-800 dark:text-white">{maxWeight} كغ</p>
          </div>
          <div className="bg-gray-100 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 dark:text-white backdrop-blur-sm rounded-xl p-3 border border-gray-100/80 transition-all hover:shadow-md">
            <span className="text-xs text-gray-500">عدد الجلسات</span>
            <p className="text-lg font-bold text-gray-800 dark:text-white">{weightsHistory.length}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ---------- Settings ----------
const Settings = () => (
  <div className="fixed min-h-screen show-first top-0 transform-none left-0 z-50 w-screen flex flex-col gap-4 justify-center items-center bg-black/15 backdrop-blur-sm">
    <div className="w-10/12 min-h-32 p-5 bg-white dark:bg-black/20 dark:border-2 dark:border-gray-600/20 rounded-xl">
      <div className="w-full h-full flex flex-col gap-3 justify-around">
        <div className="flex justify-between w-full p-3.5 rounded-lg text-md cursor-pointer dark:text-white activeAnim">
          الاعدادات
          <div onClick={() => window.location.reload()} className="p-1.5 rounded-2xl">
            <FaXmark className="text-rose-600" />
          </div>
        </div>
        <div
          onClick={() => {
            localStorage.removeItem("SystemOfExercise");
            localStorage.removeItem("SelectedDays");
            window.location.reload();
          }}
          className="flex justify-between w-full p-3.5 bg-gray-100 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 dark:text-white rounded-lg text-md active:bg-amber-100 active:text-amber-600 cursor-pointer activeAnim"
        >
          إعادة تعيين نظام التدريب <RiResetRightFill />
        </div>
      </div>
    </div>
    <SelectDays />
  </div>
);

export default ExercisePage;