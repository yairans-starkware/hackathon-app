'use client'

import { useState } from 'react'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { AlertCircle, Check, X } from "lucide-react"
import { toast } from '../hooks/use-toast'
import { Header } from './Header/Header'
import { Badge } from './ui/badge'

type Meal = {
  id: string;
  date: Date;
  price: number;
}

export const Foodiez = () => {
  const [isConnected, setIsConnected] = useState(false)

  const [balance, setBalance] = useState<number>(0)

  const connectWallet = () => {
    setIsConnected(true);
    setBalance(50);
  }

  const [registeredMeals, setRegisteredMeals] = useState<string[]>([])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }

  const nextMeal: Meal = {
    id: 'next-meal',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    price: 15.99
  }

  const futureMeals: Meal[] = [
    { id: 'meal-1', date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), price: 12.99 },
    { id: 'meal-2', date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), price: 24.99 },
    { id: 'meal-3', date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), price: 18.99 },
  ]

  const canAfford = (price: number) => isConnected && balance >= price

  const isRegistered = (mealId: string) => registeredMeals.includes(mealId)

  const handleRegistration = (meal: Meal) => {
    if (isRegistered(meal.id)) {
      setRegisteredMeals(registeredMeals.filter(id => id !== meal.id))
      setBalance(balance + meal.price)
      toast({
        title: "Unregistered",
        description: `You've been unregistered from the meal on ${formatDate(meal.date)}.`,
      })
    } else if (canAfford(meal.price)) {
      setRegisteredMeals([...registeredMeals, meal.id])
      setBalance(balance - meal.price)
      toast({
        title: "Registered",
        description: `You've been registered for the meal on ${formatDate(meal.date)}.`,
      })
    }
  }

  const MealCard = ({ meal, isNextMeal = false }: { meal: Meal, isNextMeal?: boolean }) => (
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
        {!canAfford(meal.price) && !isRegistered(meal.id) && (
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
          disabled={!isConnected || (!canAfford(meal.price) && !isRegistered(meal.id))}
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
  )

  return (
    <div className="min-h-screen w-screen bg-gray-100">
      <Header isConnected={isConnected} onConnectWallet={connectWallet} balance={balance} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          <MealCard meal={nextMeal} isNextMeal />
          <div>
            <h2 className="text-2xl font-bold mb-6">Future Meals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {futureMeals.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}