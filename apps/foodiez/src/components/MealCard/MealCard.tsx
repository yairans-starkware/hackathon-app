import { Button } from "../ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { AlertCircle, Check, X } from "lucide-react"
import { Badge } from '../ui/badge'
import { useEffect, useState } from "react"
import { toast } from "../../hooks/use-toast"
import { Meal } from "../../types/meal"
import { useCateringContract } from "../../hooks/useCateringContract"

export const MealCard = ({ 
  isWalletConnected, 
  meal,
  connect,
  canAfford,
  isNextMeal = false 
}: { 
  meal: Meal, 
  isWalletConnected: boolean,
  connect: () => void,
  canAfford: boolean,
  isNextMeal?: boolean 
}) => {
  const [registeredMeals, setRegisteredMeals] = useState<string[]>([])
  const cateringContract = useCateringContract();

  const isRegistered = (mealId: string) => registeredMeals.includes(mealId)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }
  const handleRegistration = async (meal: Meal) => {
    await cateringContract?.remove_allowed_user('0x03dab0cc9d86baff214b440b6bf322806685a2242c3a7adf865b11ca19754a69');

    if (isRegistered(meal.id)) {
      setRegisteredMeals(registeredMeals.filter(id => id !== meal.id))
      toast({
        title: "Unregistered",
        description: `You've been unregistered from the meal on ${formatDate(meal.date)}.`,
      })
    } else if (canAfford) {
      setRegisteredMeals([...registeredMeals, meal.id])
      toast({
        title: "Registered",
        description: `You've been registered for the meal on ${formatDate(meal.date)}.`,
      })
    }
  }

  return (
  <Card>
    <CardHeader>
      <CardTitle className="flex justify-between items-center min-h-[30px]">
        {isNextMeal ? 'Next Meal' : 'Future Meal'}
        {isRegistered(meal.id) && (
          <Badge variant="secondary" className="ml-2">
            Registered
          </Badge>
        )}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-semibold">{formatDate(meal.date)}</p>
      <p className="text-xl text-gray-500">{meal.price.toFixed(2)} CAT</p>
      {isWalletConnected && !canAfford && !isRegistered(meal.id) && (
        <div className="flex items-center mt-2 text-red-500">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span className="text-sm">Insufficient balance</span>
        </div>
      )}
    </CardContent>
    <CardFooter>
      <Button 
        className="w-full" 
        onClick={() => isWalletConnected ? handleRegistration(meal) : connect()}
        disabled={isWalletConnected && !canAfford && !isRegistered(meal.id)}
      >
        {isRegistered(meal.id) ? (
          <>
            <X className="mr-2 h-4 w-4" />
            Unregister
          </>
        ) : isWalletConnected ? (
              <>
              <Check className="mr-2 h-4 w-4" />
              Register
              </>
            ) : 'Connect Wallet'}
      </Button>
    </CardFooter>
  </Card>
)}