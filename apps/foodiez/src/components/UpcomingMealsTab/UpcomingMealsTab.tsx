import { Meal } from "../../types/meal";
import { MealCard } from "../MealCard/MealCard"

export const UpcomingMealsTab = ({
  balance,
  onConnectWallet,
  updateMeal,
  meals,
  isWalletConnected,
}: {
  address?: string;
  meals: Meal[];
  balance?: number;
  updateMeal: (mealId: string) => void;
  onConnectWallet: () => void;
  isWalletConnected: boolean;
}) => {
  const canAfford = (balance ?? 0) > 0;

  return meals.length ? (
    <>
      <MealCard updateMeal={updateMeal} connect={onConnectWallet} canAfford={canAfford} meal={meals[0]} isWalletConnected={isWalletConnected} isNextMeal />
      <div>
        <h2 className="text-2xl font-bold mb-6">Future Meals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.slice(1).map((meal) => (
            <MealCard updateMeal={updateMeal} connect={onConnectWallet} canAfford={canAfford} key={meal.id} meal={meal} isWalletConnected={isWalletConnected} />
          ))}
        </div>
      </div>
    </>
  ) : null;
}
