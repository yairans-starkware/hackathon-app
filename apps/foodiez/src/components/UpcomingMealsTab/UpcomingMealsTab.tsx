import { Meal } from "../../types/meal";
import { MealCard } from "../MealCard/MealCard"
import { MealCardSkeleton } from "../MealCardSkeleton/MealCardSkeleton";

export const UpcomingMealsTab = ({
  isAllowedUser,
  onConnectWallet,
  updateMeal,
  meals,
  loading,
  isWalletConnected,
}: {
  address?: string;
  meals: Meal[];
  isAllowedUser?: boolean;
  updateMeal: (mealId: string) => void;
  onConnectWallet: () => void;
  loading: boolean;
  isWalletConnected: boolean;
}) => {
  return (
    <>
      {loading ? <MealCardSkeleton /> : <MealCard loading={loading} updateMeal={updateMeal} connect={onConnectWallet} isAllowedUser={isAllowedUser} meal={meals[0]} isWalletConnected={isWalletConnected} isNextMeal />}
      <div>
        <h2 className="text-2xl font-bold mb-6">Future Meals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? Array(9).fill(null).map(() => <MealCardSkeleton />) : meals.slice(1, 10).map((meal, index) => (
            <MealCard loading={loading} updateMeal={updateMeal} connect={onConnectWallet} isAllowedUser={isAllowedUser} key={meal.id ?? index} meal={meal} isWalletConnected={isWalletConnected} />
          ))}
        </div>
      </div>
    </>
  );
}
