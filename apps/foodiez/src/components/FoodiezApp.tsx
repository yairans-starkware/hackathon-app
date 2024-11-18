import { useState } from 'react'
import { Header } from './Header/Header'
import { useDynamicContext, useUserWallets } from '@dynamic-labs/sdk-react-core'
import { MealCard } from './MealCard'
import { Meal } from '../types/meal'

export const FoodiezApp = () => {
  const {setShowAuthFlow} = useDynamicContext();
  const [balance, setBalance] = useState<number>(0)
  const wallets = useUserWallets();

  const starknetWallet = wallets.find(wallet => wallet.chain === 'STARK');
  const isWalletConnected = Boolean(starknetWallet);

  const onConnectWallet = () => {
    setShowAuthFlow(true);
    setBalance(50);
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

  const canAfford = (price: number) => isWalletConnected && balance >= price

  return (
    <div className="min-h-screen w-screen bg-gray-100">
      <Header wallet={starknetWallet} isConnected={isWalletConnected} onConnectWallet={onConnectWallet} balance={balance} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          <MealCard canAfford={canAfford(nextMeal.price)} meal={nextMeal} isWalletConnected={isWalletConnected} isNextMeal />
          <div>
            <h2 className="text-2xl font-bold mb-6">Future Meals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {futureMeals.map((meal) => (
                <MealCard canAfford={canAfford(meal.price)} key={meal.id} meal={meal} isWalletConnected={isWalletConnected} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
