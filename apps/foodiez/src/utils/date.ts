import { Meal } from "../types/meal";

export const getStartMonthOfEventTracking = () => {
  const now = new Date();

  const lastYear = now.getFullYear() - 1;

  const nextMonth = now.getMonth() + 1;

  const resultYear = nextMonth > 12 ? lastYear + 1 : lastYear;
  const resultMonth = nextMonth > 12 ? 1 : nextMonth;

  const formattedMonth = String(resultMonth).padStart(2, '0');
  return `${formattedMonth}-${resultYear}`;
}

export const getTimestampForFirstDayOfMonth = (monthYear: string) => {
  const [month, year] = monthYear.split('-').map(Number);

  const date = new Date(year, month - 1, 1);

  return Math.floor(date.getTime() / 1000);
}

export const mealCountByDay = (meals: Meal[]): { [key: string]: number } => {
  const daysOfWeek = {
    Sunday: 0,
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0
  };

  meals.forEach(({time}) => {
    const date = new Date(Number(time));
    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' }) as keyof typeof daysOfWeek;
    if (daysOfWeek.hasOwnProperty(dayOfWeek)) {
      daysOfWeek[dayOfWeek]++;
    }
  });

  const filteredDays = Object.entries(daysOfWeek)
    .filter(([, count]) => count > 0)
    .reduce((acc, [day, count]) => {
      acc[day] = count;
      return acc;
    }, {} as { [key: string]: number });

  return filteredDays;
}

export const getCurrentDate = () => {
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear();

  return {month, year};
}
export const groupMealsByMonth = (meals: Meal[]) => {
  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth();
  const lastYear = thisYear - 1;

  const months: string[] = [];
  for (let i = 0; i < 12; i++) {
    const monthIndex = (thisMonth - i + 12) % 12;
    const year = thisMonth - i < 0 ? lastYear : thisYear;
    const month = (monthIndex + 1).toString().padStart(2, '0');
    months.push(`${year}-${month}`);
  }

 
  const result: Record<string, Meal[]> = Object.fromEntries(months.map((month) => [month, []]));

  const oneYearAgo = new Date(thisYear, thisMonth, 1).getTime() - 365 * 24 * 60 * 60 * 1000;
  const lastYearMeals = meals.filter(
    (meal) => Number(meal.time.seconds) * 1000 >= oneYearAgo && Number(meal.time.seconds) * 1000 < now.getTime()
  );

  lastYearMeals.forEach((meal) => {
    const date = new Date(Number(meal.time.seconds));
    const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    if (result[yearMonth]) {
      result[yearMonth].push(meal);
    }
  });

  return result;
};
