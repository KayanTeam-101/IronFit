function period(num1: number, num2: number): Array<number> {
  let result: Array<number> = [];
  for (let i = num1; i <= num2; i++) {
    result.push(i);
  }
  return result;
}

function TranslateHeight(value: number): string {
  return `translateY(${value}px)`;
}

const Eaten = (dish: string, meal: string) => {
  if (confirm(`هل  أكلت ${dish} من وجبة ${meal}؟`)) {

  console.log("StartEaten");

  const historyRaw = localStorage.getItem("History");
  let parsedHistory: Record<string, any> = {};

  if (historyRaw) {
    try {
      parsedHistory = JSON.parse(historyRaw);
    } catch (e) {
      console.error("Failed to parse history, resetting.", e);
    }
  }
  // If no history existed or parsing failed, we start fresh.

  const currentDate =
    new Date().getFullYear() +
    "/" +
    (new Date().getUTCMonth() + 1) +
    "/" +
    new Date().getDate();

  // Get today's entry, or create a default one with empty meals
  const todayEntry = parsedHistory[currentDate] || { meals: {} };

  // Ensure the meal array exists, then add the dish
   const updatedMeals = {
    ...todayEntry.meals,
    [meal]: (todayEntry.meals[meal] || []).includes(dish)
      ? todayEntry.meals[meal]
      : [...(todayEntry.meals[meal] || []), dish],
  };

  const updatedHistory = {
    ...parsedHistory,
    [currentDate]: {
      ...todayEntry,
      meals: updatedMeals,
    },
  };

  localStorage.setItem("History", JSON.stringify(updatedHistory));
  console.log("Updated History:", updatedHistory);
    
  }else{return;}
};

export { period, TranslateHeight, Eaten };