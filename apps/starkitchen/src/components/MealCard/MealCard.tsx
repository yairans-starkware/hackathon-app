import { Button } from "../ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { AlertCircle, Check, Users, UtensilsCrossed, X } from "lucide-react"
import { Badge } from '../ui/badge'
import { Meal } from "../../types/meal"
import { useCateringContract } from "../../hooks/useCateringContract"
import { openFullscreenLoader } from "../FullscreenLoaderModal/FullscreenLoaderModal"
import { ConnectWalletButton } from "@catering-app/starknet-contract-connect"
import { feltToString } from "../../utils/cairo"

export const MealCard = ({ 
  meal,
  onConnectWallet,
  updateMeal,
  isSuccessFetchingUserEvents = false,
  isPastMeal = false,
  isWalletConnected = false,
  isAllowedUser = false,
  isNextMeal = false 
}: { 
  meal: Meal,
  isPastMeal?: boolean;
  isWalletConnected?: boolean,
  isSuccessFetchingUserEvents?: boolean;
  onConnectWallet?: () => void,
  updateMeal?: (mealId: string) => void,
  isAllowedUser?: boolean,
  isNextMeal?: boolean 
}) => {
  const cateringContract = useCateringContract();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }

  const handleRegistration = async () => {
    let closeFullscreenLoader;
    try {
      if (meal.info.registered) {
        closeFullscreenLoader = openFullscreenLoader('Unregistering you from meal...');
        const {transaction_hash} = await cateringContract?.write?.unregister(meal.id);
        await cateringContract?.write?.providerOrAccount?.waitForTransaction(transaction_hash, { retryInterval: 2e3 });
        updateMeal?.(meal.id);
      } else if (isAllowedUser) {
        closeFullscreenLoader = openFullscreenLoader('Registering you to the selected meal...');
        const {transaction_hash} = await cateringContract?.write?.register(meal.id);
        await cateringContract?.write?.providerOrAccount?.waitForTransaction(transaction_hash, { retryInterval: 2e3 });
        updateMeal?.(meal.id);
      }
    } catch (e) {
      console.error('Error: meal status update failed', e);
    } finally {
      closeFullscreenLoader?.();
    }
  }

  return (
  <Card>
    <CardHeader>
      <CardTitle className="flex justify-between items-center min-h-[30px]">
        {isNextMeal ? 'Next Meal' : isPastMeal ? 'Meal Ended' : 'Future Meal'}
        {meal.info.registered ? (
          <Badge variant="secondary" className="ml-2">
            Registered
          </Badge>
        ) : null}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-semibold">{formatDate(new Date(Number(meal.info.time.seconds) * 1000))}</p>
      {meal?.info?.number_of_participants !== undefined ? (
        <p className="text-sm text-gray-500 mt-2">
        <Users className="inline-block mr-1 h-4 w-4" />
        {Number(meal.info.number_of_participants)} registered
      </p> 
    ) : null}
    <p className="text-sm text-gray-700 mt-2">
      <UtensilsCrossed className="inline-block mr-1 h-4 w-4" />
      Catering: {feltToString(meal.info?.description ?? '') ?? 'Not Set Yet'}
    </p>
      {isWalletConnected && !isAllowedUser && isSuccessFetchingUserEvents && !meal.info.registered ? (
        <div className="flex items-center mt-2 text-red-500">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span className="text-sm">You're not allowed to register to meals, yet!</span>
        </div>
      ) : null}
    </CardContent>
    <CardFooter>
      {isWalletConnected ? (
        <Button
          className={`w-full ${meal.info.registered ? 'text-red-500 border-red-500 bg-red-50 hover:text-red-500 hover:border-red-500 hover:bg-red-100' : ''}`} 
          onClick={handleRegistration}
          disabled={isWalletConnected && !isAllowedUser && !meal.info.registered}
        >
          {meal.info.registered ? (
            <>
              <X className="mr-2 h-4 w-4" />
              Unregister
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Register
            </>
          )}
        </Button>
      ) : (
        <ConnectWalletButton onConnect={onConnectWallet} />
      )}
    </CardFooter>
  </Card>
)}
