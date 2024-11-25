import { useMemo, useState } from "react"
import { MealCard } from "../MealCard/MealCard"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Meal } from "../../types/meal"
import { StatsCard } from "../StatsCard/StatsCard"
import { getCurrentDate, groupMealsByMonth } from "../../utils/date"
import { useMonthlyStats } from "../../hooks/useMonthlyStats"
import { EmptyStatsCard } from "../StatsCard/EmptyStatsCard"

const {month: currentMonth, year: currentYear} = getCurrentDate();

export const StatsTab = ({
  meals,
  setActiveTab,
}: {
  meals: Meal[],
  setActiveTab: React.Dispatch<React.SetStateAction<string>>,
}) => {
  const mealsGroupedByMonth = useMemo(() => groupMealsByMonth(meals), [meals]);
  const monthlyStats = useMonthlyStats({mealsGroupedByMonth});
  const [selectedDate, setSelectedDate] = useState<string>(`${currentYear}-${currentMonth}`);
  
  const [year, month] = selectedDate.split('-');
  const formattedMonth = Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(Number(year), Number(month) - 1))

  const selectedMonthStats = monthlyStats.find(stat => stat.month === selectedDate);
  
  const mealCount = Object.values(selectedMonthStats?.mealsByDay ?? {}).reduce((mealsCount, acc) => mealsCount + acc, 0)

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">History & Stats</h2>
        <Select value={selectedDate} onValueChange={setSelectedDate}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {monthlyStats.map((stat) => (
              <SelectItem key={stat.month} value={stat.month}>
                {new Date(stat.month).toLocaleString('default', { month: 'long', year: 'numeric' })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {mealCount === 0 ? (
        <EmptyStatsCard
          selectedDate={formattedMonth}
          setActiveTab={setActiveTab} 
        />
      ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Past Meals</h3>
              <div className="space-y-4">
                {(mealsGroupedByMonth[selectedDate] ?? []).map((meal) => (
                    <MealCard key={meal.id} meal={meal} isPastMeal  />
                  )
                )}
              </div>
            </div>
            <StatsCard
              selectedMonth={formattedMonth}
              setActiveTab={setActiveTab} 
              stats={selectedMonthStats}
            />
        </div>
      )}
    </>
  )
}
