import { MonthlyStats } from "../../types/stats";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { PieChart as RechartsChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { EmptyStatsCard } from "./EmptyStatsCard";

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384'];

export const StatsCard = ({ 
  stats,
  selectedMonth,
  setActiveTab,
}: { 
  stats?: MonthlyStats,
  selectedMonth: string,
  setActiveTab: React.Dispatch<React.SetStateAction<string>>,
}) => {
  const mealCount = Object.values(stats?.mealsByDay ?? {}).reduce((mealsCount, acc) => mealsCount + acc, 0)
  if (mealCount === 0) {
    return (
      <EmptyStatsCard
        selectedMonth={selectedMonth}
        setActiveTab={setActiveTab} 
      />
    );
  }

  const pieData = Object.entries(stats.mealsByDay).map(([name, value]) => ({ name, value }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Monthly Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold mb-4">Tokens Spent: ${stats.tokensSpent.toFixed(2)}</p>
        <div className="p-0">
            <ChartContainer
              config={{
                mealsByDay: {
                  label: "Meals by Day",
                  color: "hsl(var(--chart-1))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <RechartsChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RechartsChart>
              </ResponsiveContainer>
            </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}