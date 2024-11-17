import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { AlertCircle, Check, X } from "lucide-react"
import { Badge } from './ui/badge'
import { useState } from "react"
import { toast } from "../hooks/use-toast"
import { Meal } from "../types/meal"

export const MealCard = ({ 
  isWalletConnected, 
  meal, 
  canAfford,
  isNextMeal = false 
}: { 
  meal: Meal, 
  isWalletConnected: boolean,
  canAfford: boolean,
  isNextMeal?: boolean 
}) => {
  const [registeredMeals, setRegisteredMeals] = useState<string[]>([])

  const isRegistered = (mealId: string) => registeredMeals.includes(mealId)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }
  const handleRegistration = (meal: Meal) => {
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
      <CardTitle className="flex justify-between items-center">
        {isNextMeal ? 'Next Meal' : formatDate(meal.date)}
        {isRegistered(meal.id) && (
          <Badge variant="secondary" className="ml-2">
            Registered
          </Badge>
        )}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-semibold">{formatDate(meal.date)}</p>
      <p className="text-xl text-gray-500">${meal.price.toFixed(2)}</p>
      {!canAfford && !isRegistered(meal.id) && (
        <div className="flex items-center mt-2 text-red-500">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span className="text-sm">Insufficient balance</span>
        </div>
      )}
    </CardContent>
    <CardFooter>
      <Button 
        className="w-full" 
        onClick={() => handleRegistration(meal)}
        disabled={!isWalletConnected || (!canAfford && !isRegistered(meal.id))}
      >
        {isRegistered(meal.id) ? (
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
    </CardFooter>
  </Card>
)}