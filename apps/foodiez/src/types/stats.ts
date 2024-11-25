export type MonthlyStats = {
  month: string;
  tokensSpent: number;
  mealsByDay: Record<string, number>;
}
