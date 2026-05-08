import React from "react";
import { period } from "../../../utilities/utilities";
import CounterY from "../../../utilities/CounterY";

const ChanlangePreiod: React.FC = () => {
  const getCurrentWeight = parseFloat(
    localStorage.getItem("currentWeight") || "0",
  );
  const getTargetWeight = parseFloat(
    localStorage.getItem("targetWeight") || "0",
  );
  const weightDiff: number = getCurrentWeight - getTargetWeight;
  function MinMonth(weightDiff: number): number {
    let min_month = Math.floor(Math.abs(weightDiff) / 3.5);
    console.log(min_month);
    console.log(weightDiff);
    console.log(Math.round(weightDiff));

    return min_month;
  }
  let numbers: number[] = period(
    MinMonth(weightDiff),
    MinMonth(weightDiff) + 5,
  );
  const handleChange = (value: number) => {
    console.log("Selected:", value);
    localStorage.setItem("challengePeriod", value.toString());
  };

  return (
    <div className=" h-11/12 show-first flex items-center justify-between flex-col  ">
      <div>
        <h2 className="text-5xl translate-y-10 text-indigo-400 font-extrabold mb-4 text-center ">
          عايز توصل لهدفك بعد كام شهر <span className="text-indigo-500">؟</span>
        </h2>
        {MinMonth(weightDiff) != 0 && (
          <p className="relative top-5 text-center text-gray-400   ">
            أقل فترة بالنسبة لفرق الوزن هي {MinMonth(weightDiff)} شهر
          </p>
        )}
        <p className="relative top-5 text-center text-amber-700 text-sm p-4  ">
          رَسولَ اللهِ صلَّى اللهُ عليه وسلَّم سُئِلَ: أيُّ العَمَلِ أحَبُّ إلى
          اللهِ؟ قال: أدومُه وإن قَلَّ, مش مهم توصل بسرعة المهم توصل!
        </p>
      </div>
      <CounterY
        arr={numbers}
        delValue={0} // ✅ now number
        size="lg"
        onChange={handleChange}
      />
    </div>
  );
};

export default ChanlangePreiod;
