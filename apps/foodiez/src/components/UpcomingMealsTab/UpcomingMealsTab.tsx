import { Meal } from "../../types/meal";
import { MealCard } from "../MealCard/MealCard"
import { MealCardSkeleton } from "../MealCardSkeleton/MealCardSkeleton";

export const UpcomingMealsTab = ({
  isAllowedUser,
  onConnectWallet,
  updateMeal,
  meals,
  loadingAllEvents,
  isSuccessFetchingUserEvents,
  isWalletConnected,
}: {
  address?: string;
  meals: Meal[];
  isAllowedUser?: boolean;
  loadingAllEvents: boolean;
  isSuccessFetchingUserEvents: boolean;
  updateMeal: (mealId: string) => void;
  onConnectWallet: () => void;
  isWalletConnected: boolean;
}) => {
  if (!loadingAllEvents && !meals[0]) {
    return <div>No upcoming meals to display</div>;
  }

  return (
    <>
      {loadingAllEvents ? <MealCardSkeleton /> : <MealCard isSuccessFetchingUserEvents={isSuccessFetchingUserEvents} updateMeal={updateMeal} connect={onConnectWallet} isAllowedUser={isAllowedUser} meal={meals[0]} isWalletConnected={isWalletConnected} isNextMeal />}
      <div>
        <h2 className="text-2xl font-bold mb-6">Future Meals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingAllEvents ? Array(9).fill(null).map((_,index) => <MealCardSkeleton key={index} />) : meals.slice(1, 10).map((meal, index) => (
            <MealCard isSuccessFetchingUserEvents={isSuccessFetchingUserEvents} updateMeal={updateMeal} connect={onConnectWallet} isAllowedUser={isAllowedUser} key={meal.id ?? index} meal={meal} isWalletConnected={isWalletConnected} />
          ))}
        </div>
      </div>
    </>
  );
}
