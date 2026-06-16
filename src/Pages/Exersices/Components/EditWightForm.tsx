import React, { useState } from "react";

interface Props {
  currentWeight: number;
  onSave: (newWeight: number) => void;
}

const EditWeightForm: React.FC<Props> = ({ currentWeight, onSave }) => {
  const [weight, setWeight] = useState(currentWeight.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(weight);
    if (!weight || isNaN(num) || num <= 0) {
      alert("يرجى إدخال وزن صحيح أكبر من 0");
      return;
    }
    onSave(num);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
        تعديل الوزن
      </h3>
      <input
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        autoFocus
        className="w-full bg-gray-50 border border-gray-200 dark:bg-black/20 dark:border-2 dark:border-gray-600/20 dark:text-white rounded-b-2xl rounded-xl py-3 pr-10 pl-4 outline-none focus:ring-2 focus:ring-blue-400 transition"
        step="0.5"
        min="0.5"
      />
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-sky-400 to-blue-500 text-white py-3 rounded-xl font-bold shadow-md hover:shadow-lg active:scale-[0.98] transition"
      >
        حفظ الوزن
      </button>
    </form>
  );
};

export default EditWeightForm;